// Backend/src/controllers/issueController.ts
import { Request, Response, NextFunction } from "express";
import pool from "../db/pool";

export const createIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, category, description, lat, lng } = req.body;

    // If you store user in req.user from auth middleware:
    const citizenEmail =
      (req as any).user?.email || req.body.citizenEmail || "anonymous@user";

    const result = await pool.query(
      `
      INSERT INTO issues (citizen_email, title, category, description, lat, lng)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [citizenEmail, title, category, description, lat, lng]
    );

    res.status(201).json({ success: true, issue: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const getIssuesForCitizen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const citizenEmail =
      (req as any).user?.email || req.query.citizenEmail || "";

    const result = await pool.query(
      `
      SELECT * FROM issues
      WHERE citizen_email = $1
      ORDER BY created_at DESC
    `,
      [citizenEmail]
    );

    res.json({ success: true, issues: result.rows });
  } catch (err) {
    next(err);
  }
};

export const getAllIssuesForGov = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM issues ORDER BY created_at DESC`
    );
    res.json({ success: true, issues: result.rows });
  } catch (err) {
    next(err);
  }
};

export const updateIssueStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE issues
      SET status = $1
      WHERE id = $2
      RETURNING *
    `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, issue: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
