import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(__dirname));

let rows = [];

if (fs.existsSync(DATA_FILE)) {
  try {
    rows = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    console.error("Error reading data.json:", err);
    rows = [];
  }
}

app.get("/api/data", (req, res) => {
  res.json(rows);
});

app.post("/api/add", (req, res) => {
  const row = req.body;
  if (!row.field1 || !row.field2) {
    return res.status(400).json({ error: "Name and Email required" });
  }
  rows.push(row);
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2));
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
