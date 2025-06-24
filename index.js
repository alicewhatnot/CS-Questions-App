import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const db = new sqlite3.Database('./questions.db');

app.use(cors());
app.use(express.json());

app.get('/questions', (req, res) => {
    const { type } = req.query;

    let servedIds = req.query.servedIds;
    if (!servedIds) {
        servedIds = [];
    } else if (!Array.isArray(servedIds)) {
        servedIds = [servedIds];
    }
    servedIds = servedIds.map(Number);

    let query = `SELECT * FROM questions`;
    let whereClauses = [];
    let params = [];

    if (servedIds.length > 0) {
    whereClauses.push(`id NOT IN (${servedIds.map(() => '?').join(',')})`);
    params.push(...servedIds);
    }
    if (type) {
    whereClauses.push(`question_type = ?`);
    params.push(type);
    }
    if (whereClauses.length) {
    query += ' WHERE ' + whereClauses.join(' AND ');
    }
    query += ` ORDER BY RANDOM() LIMIT 1`;

    //Where the actual db query occurs
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!rows.length) return res.status(404).json({ error: "No questions found" });
        res.json(rows[0]);
    });
});

app.get('/question-count', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ count: row.count });
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
