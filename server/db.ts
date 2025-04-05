import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { log } from "./vite";
import pg from "pg";

const { Pool } = pg;

// Create connection string from environment variables
const connectionString = process.env.DATABASE_URL!;

// Check if connection string exists
if (!connectionString) {
  log("No DATABASE_URL environment variable found", "database");
  process.exit(1);
}

// Create postgres client for drizzle
const client = postgres(connectionString);

// Create pg Pool for connect-pg-simple
export const pool = new Pool({
  connectionString
});

// Create drizzle instance
export const db = drizzle(client);

// Log successful connection
log("Connected to PostgreSQL database", "database");