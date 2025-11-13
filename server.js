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

// Load data from JSON file
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      rows = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch {
      rows = [];
    }
  }
}

// Save data to JSON file
function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2));
}

loadData();

// Get all rows
app.get("/api/data", (req, res) => res.json(rows));

// Add new row
app.post("/api/add", (req, res) => {
  const row = req.body;
  if (!row.tarih || !row.macSayisi || !row.macSaatleri) {
    return res.status(400).json({ error: "TARİH, MAÇ SAYISI and MAÇ SAATLERİ are required" });
  }
  rows.push(row);
  saveData();
  res.json({ ok: true });
});

// Update row by index
app.post("/api/update-row", (req, res) => {
  const { index, row } = req.body;
  if (index === undefined || !row) return res.status(400).json({ error: "Missing index or row" });
  rows[index] = row;
  saveData();
  res.json({ ok: true });
});

// Delete row by index
app.post("/api/delete-row", (req, res) => {
  const { index } = req.body;
  if (index === undefined) return res.status(400).json({ error: "Missing index" });
  rows.splice(index, 1);
  saveData();
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
