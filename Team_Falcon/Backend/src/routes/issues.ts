// Backend/src/routes/issues.ts
import { Router } from "express";
import {
  createIssue,
  getIssuesForCitizen,
  getAllIssuesForGov,
  updateIssueStatus,
} from "../controllers/issueController";
import { authMiddleware } from "../middleware/auth"; // if you have it

const router = Router();

// Citizen: create issue
router.post("/", authMiddleware, createIssue);

// Citizen: get own issues
router.get("/my", authMiddleware, getIssuesForCitizen);

// Government: get all issues
router.get("/all", authMiddleware, getAllIssuesForGov);

// Government: update status
router.patch("/:id/status", authMiddleware, updateIssueStatus);

export default router;
