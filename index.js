import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { Preferences } from '@capacitor/preferences';

const app = express();
const db = new sqlite3.Database('./questions.db');

app.use(cors({
      origin: ['http://localhost:5173', 'http://192.168.0.40:5173'],
}));
app.use(express.json());

app.post('/questions', async (req, res) => {
    const { type } = req.query;
    const { excludeIds } = req.body;

    let query = `SELECT * FROM questions`;
    let whereClauses = [];
    let params = [];

    if (type) {
        whereClauses.push(`question_type = ?`);
        params.push(type);
    }
    if (excludeIds && excludeIds.length > 0) {
        const placeholders = excludeIds.map(() => '?').join(',');
        whereClauses.push(`id NOT IN (${placeholders})`);
        params.push(...excludeIds);
    }
    if (whereClauses.length) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }
    query += ` ORDER BY RANDOM() LIMIT 1`;

    console.log(query)
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!rows.length) return res.status(404).json({ error: "No questions found" });
        res.json(rows[0]);
    });
});
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
