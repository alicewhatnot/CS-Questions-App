import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const db = new sqlite3.Database('./questions.db');

app.use(cors());
app.use(express.json());

app.get('/questions', (req, res) => {
    //Setup query initally for all data
    const { type } = req.query;
    let query = 'SELECT * FROM questions';
    const params = [];

    //Appends the question type where given, e.g. longform
    if (type) {
        query = query + ' WHERE question_type = ?'
        params.push(type);
    }

    //Where the actual db query occurs
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
