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
    
    // Check columns
    const cols = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'books'
    `);
    console.log("Schema Columns:");
    console.log(cols.rows);

    // Check rows
    const rows = await db.query("SELECT id, book_name, author FROM books");
    console.log("Database Rows:");
    console.log(rows.rows);
  } catch (error) {
    console.error("Error inspecting database:", error);
  } finally {
    await db.end();
  }
}

run();
