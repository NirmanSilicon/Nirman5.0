/**
 * Dataset Integration Service
 * Handles integration with ICMR, MoHFW, VRDL datasets
 */

import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { diseases, diseaseOutbreaks } from "../db/schema/diseases.js";
import type { NewDisease, NewDiseaseOutbreak } from "../db/schema/diseases.js";
import { mockDiseases, generateMockOutbreaks } from "../data/mock-diseases.js";

/**
 * Import disease data from ICMR format
 * If no data provided, uses large-scale mock data
 */
export async function importICMRData(data?: any[]) {
  // Use mock data if none provided
  const dataToImport = data && data.length > 0 ? data : mockDiseases.filter(d => d.source === "ICMR");
  
  console.log(`📥 Importing ${dataToImport.length} ICMR disease records...`);
  
  const imported: NewDisease[] = [];
  const skipped: string[] = [];
  
  for (const record of dataToImport) {
    try {
      // Check if disease already exists
      const [existing] = await db
        .select()
        .from(diseases)
        .where(eq(diseases.name, record.name))
        .limit(1);
      
      if (existing) {
        skipped.push(record.name);
        continue;
      }
      
      const [disease] = await db
        .insert(diseases)
        .values({
          name: record.name,
          scientificName: record.scientificName || null,
          category: record.category || null,
          description: record.description || null,
          symptoms: record.symptoms || [],
          severity: record.severity || null,
          source: "ICMR",
          sourceUrl: record.sourceUrl || null,
          isActive: true,
        })
        .returning();
      
      imported.push(disease);
    } catch (error: any) {
      console.error(`Error importing disease ${record.name}:`, error.message);
    }
  }
  
  return {
    imported: imported.length,
    skipped: skipped.length,
    total: dataToImport.length,
    diseases: imported.map(d => d.name),
  };
}

/**
 * Import outbreak data from MoHFW format
 * If no data provided, generates large-scale mock outbreaks
 */
export async function importMoHFWData(data?: any[]) {
  let dataToImport: any[] = [];
  
  if (data && data.length > 0) {
    dataToImport = data;
  } else {
    // Generate mock outbreaks for all diseases
    const allDiseases = mockDiseases.filter(d => d.source === "MoHFW" || d.source === "ICMR");
    for (const disease of allDiseases) {
      const outbreaks = generateMockOutbreaks(disease.name, 5); // 5 outbreaks per disease
      dataToImport.push(...outbreaks);
    }
  }
  
  console.log(`📥 Importing ${dataToImport.length} MoHFW outbreak records...`);
  
  // Requires disease to exist first
  const imported: NewDiseaseOutbreak[] = [];
  const skipped: number = 0;
  
  for (const record of dataToImport) {
    try {
      // Find or create disease
      const [existingDisease] = await db
        .select()
        .from(diseases)
        .where(eq(diseases.name, record.diseaseName))
        .limit(1);
      
      let diseaseId;
      if (!existingDisease) {
        // Find matching disease from mock data
        const mockDisease = mockDiseases.find(d => d.name === record.diseaseName);
        const [newDisease] = await db
          .insert(diseases)
          .values({
            name: record.diseaseName,
            scientificName: mockDisease?.scientificName || null,
            category: mockDisease?.category || null,
            description: mockDisease?.description || null,
            symptoms: mockDisease?.symptoms || record.symptoms || [],
            severity: mockDisease?.severity || null,
            source: "MoHFW",
            isActive: true,
          })
          .returning();
        diseaseId = newDisease.id;
      } else {
        diseaseId = existingDisease.id;
      }
      
      const [outbreak] = await db
        .insert(diseaseOutbreaks)
        .values({
          diseaseId,
          state: record.state,
          district: record.district || null,
          city: record.city || null,
          caseCount: record.caseCount || 0,
          activeCases: record.activeCases || 0,
          recovered: record.recovered || 0,
          deaths: record.deaths || 0,
          riskLevel: record.riskLevel || "medium",
          trend: record.trend || null,
          trendPercentage: record.trendPercentage?.toString() || null,
          reportedDate: new Date(record.reportedDate || Date.now()),
          source: "MoHFW",
          metadata: record.metadata || null,
        })
        .returning();
      
      imported.push(outbreak);
    } catch (error: any) {
      console.error(`Error importing outbreak for ${record.diseaseName} in ${record.state}:`, error.message);
    }
  }
  
  return {
    imported: imported.length,
    skipped,
    total: dataToImport.length,
  };
}

/**
 * Import VRDL network data
 * VRDL (Virus Research and Diagnostic Laboratories) network data
 * If no data provided, uses mock data similar to ICMR
 */
export async function importVRDLData(data?: any[]) {
  // Use mock data if none provided (VRDL typically focuses on viral diseases)
  const vrdlDiseases = mockDiseases.filter(d => 
    d.category === "Infectious" && 
    (d.scientificName?.includes("virus") || d.name === "COVID-19" || d.name === "Dengue" || d.name === "Chikungunya")
  );
  
  const dataToImport = data && data.length > 0 ? data : vrdlDiseases;
  
  console.log(`📥 Importing ${dataToImport.length} VRDL records...`);
  
  const imported: NewDisease[] = [];
  
  for (const record of dataToImport) {
    try {
      // Check if disease already exists
      const [existing] = await db
        .select()
        .from(diseases)
        .where(eq(diseases.name, record.name))
        .limit(1);
      
      if (existing) {
        // Update source to include VRDL
        await db
          .update(diseases)
          .set({ source: existing.source?.includes("VRDL") ? existing.source : `${existing.source}, VRDL` })
          .where(eq(diseases.id, existing.id));
        continue;
      }
      
      const [disease] = await db
        .insert(diseases)
        .values({
          name: record.name,
          scientificName: record.scientificName || null,
          category: record.category || null,
          description: record.description || null,
          symptoms: record.symptoms || [],
          severity: record.severity || null,
          source: "VRDL",
          sourceUrl: record.sourceUrl || null,
          isActive: true,
        })
        .returning();
      
      imported.push(disease);
    } catch (error: any) {
      console.error(`Error importing VRDL disease ${record.name}:`, error.message);
    }
  }
  
  return {
    imported: imported.length,
    total: dataToImport.length,
  };
}

/**
 * Validate dataset format
 */
export function validateDatasetFormat(data: any, source: "ICMR" | "MoHFW" | "VRDL"): boolean {
  // TODO: Implement validation logic
  return Array.isArray(data) && data.length > 0;
}

