import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import cron from "node-cron";
import { initSentry } from "./utils/sentry.js";
import { sendDailyDiseaseAlertsToAllUsers } from "./services/daily-email-notification.service.js";

// Load environment variables
dotenv.config();

// Initialize Sentry before anything else
initSentry();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to PathoGen API Server",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      api: "/api",
      documentation: "Visit /api for full API documentation",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "PathoGen API Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminMedicinesRoutes from "./routes/admin-medicines.routes.js";
import adminSymptomsRoutes from "./routes/admin-symptoms.routes.js";
import symptomsRoutes from "./routes/symptoms.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import dataRoutes from "./routes/data.routes.js";
import medicinesRoutes from "./routes/medicines.routes.js";
import medicineImagesRoutes from "./routes/medicine-images.routes.js";
import userCartRoutes from "./routes/userCart.routes.js";
import rewardsRoutes from "./routes/rewards.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import locationStoresRoutes from "./routes/location-stores.routes.js";

app.get("/api", (req, res) => {
  res.json({
    message: "PathoGen API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        sendOTP: "POST /api/auth/send-otp",
        verifyOTP: "POST /api/auth/verify-otp",
        resendOTP: "POST /api/auth/resend-otp",
        me: "GET /api/auth/me",
      },
      admin: {
        login: "POST /api/admin/login (Email + Password only)",
        medicines: {
          list: "GET /api/admin/medicines",
          create: "POST /api/admin/medicines",
          update: "PUT /api/admin/medicines/:id",
          delete: "DELETE /api/admin/medicines/:id",
          addPrice: "POST /api/admin/medicines/:id/prices",
        },
        symptoms: {
          list: "GET /api/admin/symptoms",
          create: "POST /api/admin/symptoms",
          update: "PUT /api/admin/symptoms/:id",
          delete: "DELETE /api/admin/symptoms/:id",
        },
      },
      symptoms: {
        report: "POST /api/symptoms/report",
        reports: "GET /api/symptoms/reports",
        verify: "PUT /api/symptoms/reports/:id/verify",
      },
      dashboard: {
        stats: "GET /api/dashboard/stats",
        trendingDiseases: "GET /api/dashboard/trending-diseases",
        infectionIndex: "GET /api/dashboard/infection-index",
        healthRiskScore: "GET /api/dashboard/health-risk-score",
        heatmapData: "GET /api/dashboard/heatmap-data",
      },
      data: {
        importICMR: "POST /api/data/import/icmr (Admin)",
        importMoHFW: "POST /api/data/import/mohfw (Admin)",
        importVRDL: "POST /api/data/import/vrdl (Admin)",
        googleTrends: "POST /api/data/pipeline/google-trends (Admin)",
        reddit: "POST /api/data/pipeline/reddit (Admin)",
        twitter: "POST /api/data/pipeline/twitter (Admin)",
        processSymptoms: "POST /api/data/ai/process-symptoms (Admin)",
        detectAnomalies: "POST /api/data/ai/detect-anomalies (Admin)",
        forecastOutbreaks: "POST /api/data/ai/forecast-outbreaks (Admin)",
      },
      medicines: {
        search: "GET /api/medicines/search?q=query",
        getDetails: "GET /api/medicines/:id",
        alternatives: "GET /api/medicines/:id/alternatives",
        nearbyPharmacies: "GET /api/medicines/pharmacies/nearby?lat=&lng=",
      },
      rewards: {
        myRewards: "GET /api/rewards/me (Protected)",
      },
    },
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/medicines", adminMedicinesRoutes);
app.use("/api/admin/symptoms", adminSymptomsRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/medicines", medicinesRoutes);
app.use("/api/medicine-images", medicineImagesRoutes);
app.use("/api/cart", userCartRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/location-stores", locationStoresRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// Setup daily email notification cron job (4:56 PM IST)
// Cron format: minute hour day month day-of-week
// Run at 4:56 PM IST every day
// Using Asia/Kolkata timezone
cron.schedule("59 19 * * *", async () => {
  console.log("⏰ Daily email notification job triggered at 4:56 PM IST");
  try {
    await sendDailyDiseaseAlertsToAllUsers();
  } catch (error) {
    console.error("❌ Error in daily email notification job:", error);
  }
}, {
  timezone: "Asia/Kolkata" // IST timezone
});

console.log("✅ Daily email notification cron job scheduled (4:56 PM IST)");

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 PathoGen API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API documentation: http://localhost:${PORT}/api`);
});

// Handle server errors
server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`\n💡 Solutions:`);
    console.error(`   1. Stop the other process using port ${PORT}`);
    console.error(`   2. Use a different port by setting PORT environment variable`);
    console.error(`   3. Find and kill the process:`);
    console.error(`      Windows: netstat -ano | findstr :${PORT}`);
    console.error(`      Then: taskkill /F /PID <PID>`);
    console.error(`      Linux/Mac: lsof -ti:${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", err);
    process.exit(1);
  }
});

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("✅ Server closed successfully");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("❌ Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

// Handle process termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions (but not EADDRINUSE - that's handled above)
process.on("uncaughtException", (err: Error) => {
  // Don't handle EADDRINUSE here as it's already handled by server.on("error")
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    return;
  }
  console.error("❌ Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});

