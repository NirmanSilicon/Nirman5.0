import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

// Support both connection string and individual parameters for local database
function getConnectionString(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Build from individual parameters for local database
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5432";
  const dbName = process.env.DB_NAME || "pathogen";
  const dbUser = process.env.DB_USER || "postgres";
  const dbPassword = process.env.DB_PASSWORD || "";

  if (!dbPassword) {
    throw new Error(
      "Either DATABASE_URL or DB_PASSWORD must be set in environment variables"
    );
  }

  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

const dbCredentials: { url: string } = {
  url: getConnectionString(),
};

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials,
  verbose: true,
  strict: true,
} as any);

