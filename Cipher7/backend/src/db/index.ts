import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import * as schema from "./schema/index.js";

dotenv.config();

// Support both connection string and individual parameters for local database
let connectionString: string;

if (process.env.DATABASE_URL) {
  // Use connection string if provided (for remote databases)
  connectionString = process.env.DATABASE_URL;
} else {
  // Build connection string from individual parameters (for local database)
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5432";
  const dbName = process.env.DB_NAME || "pathogen";
  const dbUser = process.env.DB_USER || "postgres";
  const dbPassword = process.env.DB_PASSWORD || "";

  if (!dbPassword) {
    throw new Error(
      "DB_PASSWORD environment variable is required for local database connection"
    );
  }

  connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
