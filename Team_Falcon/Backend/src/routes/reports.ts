import { Router } from "express";
import {
  createReport,
  getAllReports,
} from "../controllers/reportController.js";

const router = Router();

// Citizen: create a report (NO TOKEN)
router.post("/", createReport);

// Simple: get all reports (NO TOKEN, for now)
router.get("/all", getAllReports);

export default router;
