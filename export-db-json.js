import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname,'public', 'assets', 'databases', 'questions.db');
const outputPath = path.join(__dirname, 'public', 'assets', 'databases', 'questions.json');

const db = new Database(dbPath, { readonly: true });

// Query all tables except sqlite internal ones
const tables = db.prepare(`
  SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
`).all();

const exportObj = {};

tables.forEach(({ name }) => {
  const rows = db.prepare(`SELECT * FROM ${name}`).all();
  exportObj[name] = rows;
});

fs.writeFileSync(outputPath, JSON.stringify(exportObj, null, 2));

console.log(`Exported DB as JSON to ${outputPath}`);
