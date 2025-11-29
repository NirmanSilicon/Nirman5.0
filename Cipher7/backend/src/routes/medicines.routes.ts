/**
 * Medicines Routes
 * Handles medicine search, alternatives, and pricing
 */

import express from "express";
import { db } from "../db/index.js";
import { medicines, medicinePrices, medicineAlternatives, janaushadhiStores } from "../db/schema/medicines.js";
import { eq, ilike, or, and, desc, sql, inArray } from "drizzle-orm";
import { authenticate } from "../middleware/auth.middleware.js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper to get postgres client for raw queries
const getPostgresClient = () => {
  if (process.env.DATABASE_URL) {
    return postgres(process.env.DATABASE_URL, { prepare: false });
  }
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = parseInt(process.env.DB_PORT || "5432");
  const dbName = process.env.DB_NAME || "pathogen";
  const dbUser = process.env.DB_USER || "postgres";
  const dbPassword = process.env.DB_PASSWORD || "";
  const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
  return postgres(connectionString, { prepare: false });
};

/**
 * GET /api/medicines/search
 * Search medicines by name (brand or generic), symptom, or disease
 */
router.get("/search", async (req, res) => {
  let pgClient: any = null;
  try {
    const { q, limit = 20, form, category, symptom, disease } = req.query;

    // Validate that only one search type is used at a time
    const searchTypes = [q, symptom, disease].filter(Boolean);
    if (searchTypes.length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Query parameter 'q' (medicine name), 'symptom', or 'disease' is required",
      });
    }
    
    // If multiple search types provided, prioritize: symptom > disease > name
    // But log a warning
    if (searchTypes.length > 1) {
      console.warn(`[Medicine Search] Multiple search types provided. Using: ${symptom ? 'symptom' : disease ? 'disease' : 'name'}`);
    }

    const searchLimit = Math.min(parseInt(limit as string) || 20, 50);
    let medicineIds: string[] = [];

    // Use a single postgres client for all queries
    pgClient = getPostgresClient();

    // Search by symptom
    if (symptom && typeof symptom === "string") {
      const symptomTrimmed = symptom.trim();
      // Try exact match first, then partial match
      const exactTerm = symptomTrimmed.toLowerCase();
      const partialTerm = `%${symptomTrimmed}%`;
      console.log(`[Medicine Search] Searching for symptom: "${symptomTrimmed}"`);
      try {
        // First try exact match for better relevance
        let symptomResults = await pgClient`
          SELECT medicine_id, COALESCE(relevance_score, 0) as relevance_score
          FROM medicine_symptom_mappings 
          WHERE LOWER(symptom_name) = ${exactTerm}
          ORDER BY COALESCE(relevance_score, 0) DESC, medicine_id
          LIMIT ${searchLimit * 2}
        `;
        
        // If no exact match, try partial match
        if (symptomResults.length === 0) {
          symptomResults = await pgClient`
            SELECT medicine_id, COALESCE(relevance_score, 0) as relevance_score
            FROM medicine_symptom_mappings 
            WHERE LOWER(symptom_name) LIKE LOWER(${partialTerm})
            ORDER BY COALESCE(relevance_score, 0) DESC, medicine_id
            LIMIT ${searchLimit * 2}
          `;
        }
        
        console.log(`[Medicine Search] Found ${symptomResults.length} mappings for symptom: "${symptomTrimmed}"`);
        // Get unique medicine_ids while maintaining relevance order
        const seen = new Set<string>();
        medicineIds = [];
        for (const row of symptomResults) {
          if (!seen.has(row.medicine_id)) {
            seen.add(row.medicine_id);
            medicineIds.push(row.medicine_id);
            if (medicineIds.length >= searchLimit) break;
          }
        }
      } catch (symptomError: any) {
        console.error(`[Medicine Search] Error searching symptoms:`, symptomError);
        await pgClient.end();
        pgClient = null;
        throw symptomError;
      }
    }

    // Search by disease
    if (disease && typeof disease === "string") {
      const diseaseTrimmed = disease.trim();
      // Try exact match first, then partial match
      const exactTerm = diseaseTrimmed.toLowerCase();
      const partialTerm = `%${diseaseTrimmed}%`;
      console.log(`[Medicine Search] Searching for disease: "${diseaseTrimmed}"`);
      try {
        // First try exact match for better relevance
        let diseaseResults = await pgClient`
          SELECT medicine_id, COALESCE(relevance_score, 0) as relevance_score
          FROM medicine_disease_mappings 
          WHERE LOWER(disease_name) = ${exactTerm}
          ORDER BY COALESCE(relevance_score, 0) DESC, medicine_id
          LIMIT ${searchLimit * 2}
        `;
        
        // If no exact match, try partial match
        if (diseaseResults.length === 0) {
          diseaseResults = await pgClient`
            SELECT medicine_id, COALESCE(relevance_score, 0) as relevance_score
            FROM medicine_disease_mappings 
            WHERE LOWER(disease_name) LIKE LOWER(${partialTerm})
            ORDER BY COALESCE(relevance_score, 0) DESC, medicine_id
            LIMIT ${searchLimit * 2}
          `;
        }
        
        console.log(`[Medicine Search] Found ${diseaseResults.length} mappings for disease: "${diseaseTrimmed}"`);
        // Get unique medicine_ids while maintaining relevance order
        const seenDisease = new Set<string>();
        const diseaseMedicineIds: string[] = [];
        for (const row of diseaseResults) {
          if (!seenDisease.has(row.medicine_id)) {
            seenDisease.add(row.medicine_id);
            diseaseMedicineIds.push(row.medicine_id);
            if (diseaseMedicineIds.length >= searchLimit) break;
          }
        }
        // If both symptom and disease are provided, intersect the results (medicines that match both)
        // Otherwise, use disease results directly
        medicineIds = medicineIds.length > 0 
          ? medicineIds.filter(id => diseaseMedicineIds.includes(id))
          : diseaseMedicineIds;
      } catch (diseaseError: any) {
        console.error(`[Medicine Search] Error searching diseases:`, diseaseError);
        await pgClient.end();
        pgClient = null;
        throw diseaseError;
      }
    }

    // Build query
    let results: any[] = [];
    if (medicineIds.length > 0) {
      // Search by symptom/disease mapping - use raw SQL for UUID array
      // IMPORTANT: Only return medicines that match the symptom/disease search
      console.log(`[Medicine Search] Fetching ${medicineIds.length} medicines by ID from symptom/disease mappings`);
      try {
        if (!pgClient) {
          pgClient = getPostgresClient();
        }
        // Fetch medicines and preserve relevance order - STRICT FILTERING
        // Only return medicines that are in the medicineIds array (from symptom/disease mappings)
        results = await pgClient`
          SELECT * FROM medicines 
          WHERE id = ANY(${medicineIds}::uuid[]) 
          AND is_active = true
          AND source = 'Janaushadhi'
          LIMIT ${searchLimit}
        `;
        
        // Sort results to match the order in medicineIds (preserve relevance)
        const medicineMap = new Map(results.map((m: any) => [m.id, m]));
        results = medicineIds
          .map(id => medicineMap.get(id))
          .filter((m): m is any => m !== undefined)
          .slice(0, searchLimit);
        
        console.log(`[Medicine Search] Returning ${results.length} filtered medicines (strict filtering applied)`);
        console.log(`[Medicine Search] Retrieved ${results.length} medicines from database (filtered by symptom/disease)`);
      } catch (fetchError: any) {
        console.error(`[Medicine Search] Error fetching medicines:`, fetchError);
        if (pgClient) {
          await pgClient.end();
          pgClient = null;
        }
        throw fetchError;
      }
    } else if (q && typeof q === "string" && !symptom && !disease) {
      // Search by name ONLY - STRICT FILTERING
      // Close pgClient first as we'll use Drizzle
      if (pgClient) {
        await pgClient.end();
        pgClient = null;
      }
      
      const searchTerm = `%${q.trim()}%`;
      console.log(`[Medicine Search] Searching by medicine name: "${q}" (strict filtering: Janaushadhi only)`);
      results = await db
        .select()
        .from(medicines)
        .where(
          and(
            or(
              ilike(medicines.brandName, searchTerm),
              ilike(medicines.genericName, searchTerm)
            ),
            eq(medicines.isActive, true),
            eq(medicines.source, 'Janaushadhi')
          )
        )
        .limit(searchLimit);
      console.log(`[Medicine Search] Found ${results.length} medicines matching name "${q}" (Janaushadhi only)`);
    } else {
      // Close postgres client if it was opened
      if (pgClient) {
        await pgClient.end();
      }
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid search parameters",
      });
    }

    // Close postgres client if it was opened
    if (pgClient) {
      await pgClient.end();
      pgClient = null;
    }

    // Apply additional filters if needed (for name search)
    if (q && form) {
      results = results.filter((m: any) => m.form === form);
    }
    if (q && category) {
      results = results.filter((m: any) => m.category === category);
    }

    // Get prices for each medicine
    const medicinesWithPrices = await Promise.all(
      results.map(async (medicine: any) => {
        try {
          const prices = await db
            .select()
            .from(medicinePrices)
            .where(
              and(
                eq(medicinePrices.medicineId, medicine.id),
                eq(medicinePrices.availability, "available")
              )
            )
            .orderBy(desc(medicinePrices.lastUpdated))
            .limit(5);

          const cheapestPrice = prices.length > 0
            ? prices.reduce((min, p) => {
                const minPrice = typeof min.price === 'string' ? parseFloat(min.price) : Number(min.price);
                const pPrice = typeof p.price === 'string' ? parseFloat(p.price) : Number(p.price);
                return pPrice < minPrice ? p : min;
              })
            : null;

          // Normalize medicine data structure (handle both snake_case from raw SQL and camelCase from Drizzle)
          const normalizedMedicine = {
            id: medicine.id,
            brandName: medicine.brand_name || medicine.brandName,
            genericName: medicine.generic_name || medicine.genericName,
            manufacturer: medicine.manufacturer,
            form: medicine.form,
            strength: medicine.strength,
            packaging: medicine.packaging,
            indications: medicine.indications,
            category: medicine.category,
            source: medicine.source,
            isPrescriptionRequired: medicine.is_prescription_required !== undefined 
              ? medicine.is_prescription_required 
              : medicine.isPrescriptionRequired,
            createdAt: medicine.created_at || medicine.createdAt,
            updatedAt: medicine.updated_at || medicine.updatedAt,
            prices: {
              all: prices,
              cheapest: cheapestPrice,
              count: prices.length,
            },
          };

          return normalizedMedicine;
        } catch (priceError) {
          console.error(`Error fetching prices for medicine ${medicine.id}:`, priceError);
          // Normalize medicine data structure even on error
          const normalizedMedicine = {
            id: medicine.id,
            brandName: medicine.brand_name || medicine.brandName,
            genericName: medicine.generic_name || medicine.genericName,
            manufacturer: medicine.manufacturer,
            form: medicine.form,
            strength: medicine.strength,
            packaging: medicine.packaging,
            indications: medicine.indications,
            category: medicine.category,
            source: medicine.source,
            isPrescriptionRequired: medicine.is_prescription_required !== undefined 
              ? medicine.is_prescription_required 
              : medicine.isPrescriptionRequired,
            createdAt: medicine.created_at || medicine.createdAt,
            updatedAt: medicine.updated_at || medicine.updatedAt,
            prices: {
              all: [],
              cheapest: null,
              count: 0,
            },
          };
          return normalizedMedicine;
        }
      })
    );

    res.json({
      success: true,
      count: medicinesWithPrices.length,
      medicines: medicinesWithPrices,
    });
  } catch (error: any) {
    if (pgClient) {
      try {
        await pgClient.end();
      } catch (e) {
        // Ignore close errors
      }
    }
    
    console.error("[Medicine Search] Full error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Check if it's a table doesn't exist error
    if (error.message?.includes("does not exist") || error.message?.includes("relation")) {
      return res.status(500).json({
        error: "Database Error",
        message: "Medicines or mapping tables not found. Please run the database migration script.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
    
    // Check for connection errors
    if (error.message?.includes("connection") || error.message?.includes("ECONNREFUSED")) {
      return res.status(500).json({
        error: "Database Connection Error",
        message: "Failed to connect to database. Please check your database configuration.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
    
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Failed to search medicines",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/medicines/:id
 * Get medicine details with pricing and alternatives
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get medicine details
    const [medicine] = await db
      .select()
      .from(medicines)
      .where(eq(medicines.id, id))
      .limit(1);

    if (!medicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    // Get pricing from all sources
    const prices = await db
      .select()
      .from(medicinePrices)
      .where(and(eq(medicinePrices.medicineId, id), eq(medicinePrices.availability, "available")))
      .orderBy(desc(medicinePrices.lastUpdated));

    // Get alternatives
    const alternatives = await db
      .select({
        id: medicines.id,
        brandName: medicines.brandName,
        genericName: medicines.genericName,
        manufacturer: medicines.manufacturer,
        form: medicines.form,
        strength: medicines.strength,
        similarity: medicineAlternatives.similarity,
        reason: medicineAlternatives.reason,
        isVerified: medicineAlternatives.isVerified,
      })
      .from(medicineAlternatives)
      .innerJoin(medicines, eq(medicineAlternatives.alternativeId, medicines.id))
      .where(eq(medicineAlternatives.medicineId, id))
      .orderBy(desc(medicineAlternatives.similarity))
      .limit(10);

    // Get cheapest price
    const cheapestPrice = prices.length > 0
      ? prices.reduce((min, p) => 
          parseFloat(p.price) < parseFloat(min.price) ? p : min
        )
      : null;

    res.json({
      success: true,
      medicine,
      prices: {
        all: prices,
        cheapest: cheapestPrice,
        count: prices.length,
      },
      alternatives: {
        count: alternatives.length,
        medicines: alternatives,
      },
    });
  } catch (error: any) {
    console.error("Error fetching medicine details:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch medicine details",
      details: error.message,
    });
  }
});

/**
 * GET /api/medicines/:id/alternatives
 * Get affordable alternatives for a medicine
 */
router.get("/:id/alternatives", async (req, res) => {
  try {
    const { id } = req.params;
    const { maxPrice, minSimilarity = 70 } = req.query;

    // Get base medicine price
    const [baseMedicine] = await db
      .select()
      .from(medicines)
      .where(eq(medicines.id, id))
      .limit(1);

    if (!baseMedicine) {
      return res.status(404).json({
        error: "Not Found",
        message: "Medicine not found",
      });
    }

    // Get alternatives with prices
    const alternatives = await db
      .select({
        medicine: medicines,
        similarity: medicineAlternatives.similarity,
        reason: medicineAlternatives.reason,
        price: sql<number>`MIN(${medicinePrices.price})`.as("min_price"),
      })
      .from(medicineAlternatives)
      .innerJoin(medicines, eq(medicineAlternatives.alternativeId, medicines.id))
      .leftJoin(medicinePrices, eq(medicinePrices.medicineId, medicines.id))
      .where(
        and(
          eq(medicineAlternatives.medicineId, id),
          sql`${medicineAlternatives.similarity} >= ${minSimilarity}`
        )
      )
      .groupBy(medicines.id, medicineAlternatives.similarity, medicineAlternatives.reason)
      .orderBy(desc(medicineAlternatives.similarity))
      .limit(20);

    // Filter by max price if provided
    let filteredAlternatives = alternatives;
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice as string);
      filteredAlternatives = alternatives.filter((alt) => 
        alt.price && parseFloat(alt.price.toString()) <= maxPriceNum
      );
    }

    // Calculate savings percentage if base price available
    const basePriceResult = await db
      .select({
        price: sql<number>`MIN(${medicinePrices.price})`.as("min_price"),
      })
      .from(medicinePrices)
      .where(eq(medicinePrices.medicineId, id))
      .limit(1);

    const basePrice = basePriceResult[0]?.price 
      ? parseFloat(basePriceResult[0].price.toString())
      : null;

    const alternativesWithSavings = filteredAlternatives.map((alt) => {
      const altPrice = alt.price ? parseFloat(alt.price.toString()) : null;
      let savings = null;
      if (basePrice && altPrice && altPrice < basePrice) {
        savings = {
          amount: basePrice - altPrice,
          percentage: ((basePrice - altPrice) / basePrice * 100).toFixed(1),
        };
      }

      return {
        ...alt,
        savings,
      };
    });

    res.json({
      success: true,
      baseMedicine: {
        id: baseMedicine.id,
        brandName: baseMedicine.brandName,
        genericName: baseMedicine.genericName,
        basePrice,
      },
      alternatives: alternativesWithSavings,
      count: alternativesWithSavings.length,
    });
  } catch (error: any) {
    console.error("Error fetching alternatives:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch alternatives",
      details: error.message,
    });
  }
});

/**
 * GET /api/medicines/pharmacies/nearby
 * Find nearby pharmacies (including Janaushadhi stores)
 */
router.get("/pharmacies/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 10, state, city } = req.query;

    // If coordinates provided, use them (future: calculate distance)
    // For now, filter by state/city
    let query = db.select().from(janaushadhiStores).where(eq(janaushadhiStores.isActive, true));

    if (state) {
      query = query.where(and(eq(janaushadhiStores.state, state as string))) as typeof query;
    }
    if (city) {
      query = query.where(and(eq(janaushadhiStores.city, city as string))) as typeof query;
    }

    const stores = await query.limit(50);

    res.json({
      success: true,
      count: stores.length,
      pharmacies: stores.map((store) => ({
        id: store.id,
        name: store.storeName,
        type: "Janaushadhi",
        address: store.address,
        city: store.city,
        state: store.state,
        pincode: store.pincode,
        phone: store.phone,
        email: store.email,
        operatingHours: store.operatingHours,
        coordinates: store.latitude && store.longitude
          ? {
              lat: parseFloat(store.latitude.toString()),
              lng: parseFloat(store.longitude.toString()),
            }
          : null,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching nearby pharmacies:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch nearby pharmacies",
      details: error.message,
    });
  }
});

export default router;

