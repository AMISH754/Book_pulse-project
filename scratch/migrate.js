import pg from "pg";
import env from "dotenv";
import path from "path";

env.config({ path: path.resolve(".env") });

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function run() {
  try {
    await db.connect();
    console.log("Connected to PostgreSQL database successfully.");
    
    // Add column if it doesn't exist
    await db.query("ALTER TABLE books ADD COLUMN IF NOT EXISTS rating INT DEFAULT 5;");
    console.log("Migration successful: 'rating' column checked/added to books table.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await db.end();
  }
}

run();
