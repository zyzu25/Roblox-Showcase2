import { Router } from "express";
import { pool } from "@workspace/db";

const router = Router();
const SEED = 568;

async function initTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS view_counter (
      id    INTEGER PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT ${SEED}
    );
    INSERT INTO view_counter (id, count)
    VALUES (1, ${SEED})
    ON CONFLICT (id) DO NOTHING;
  `);
}
initTable().catch(console.error);

router.get("/views", async (_req, res) => {
  try {
    const result = await pool.query("SELECT count FROM view_counter WHERE id = 1");
    res.json({ count: result.rows[0]?.count ?? SEED });
  } catch {
    res.json({ count: SEED });
  }
});

router.post("/views", async (_req, res) => {
  try {
    const result = await pool.query(
      "UPDATE view_counter SET count = count + 1 WHERE id = 1 RETURNING count"
    );
    res.json({ count: result.rows[0]?.count ?? SEED });
  } catch {
    res.json({ count: SEED });
  }
});

export default router;
