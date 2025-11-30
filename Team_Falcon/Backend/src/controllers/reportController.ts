import { Request, Response, NextFunction } from "express";
import { pool } from "../db/pool.js";

// ✅ NO TOKEN REQUIRED: uses a default citizen_email
export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, category, description, lat, lng, imageUrl } = req.body;

    // No auth for now – just store anonymous email
    const citizenEmail = "anonymous@citizen.local";

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, category, and description are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO reports (citizen_email, title, category, description, lat, lng, image_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Submitted')
      RETURNING *
    `,
      [citizenEmail, title, category, description, lat, lng, imageUrl]
    );

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM reports
      ORDER BY created_at DESC
    `
    );

    res.json({
      success: true,
      reports: result.rows,
    });
  } catch (error) {
    next(error);
  }
};
