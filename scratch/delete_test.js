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
    console.log("Connected to DB.");
    
    const result = await db.query("DELETE FROM books WHERE id = $1 RETURNING *", [12]);
    console.log("Deleted rows:", result.rows);
  } catch (error) {
    console.error("Error running delete:", error);
  } finally {
    await db.end();
  }
}

run();
