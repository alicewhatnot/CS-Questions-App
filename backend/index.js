const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

// Connect to your .db file
const db = new sqlite3.Database('./questions.db', (err) => {
  if (err) console.error('Database opening error: ', err);
});

app.use(cors());
app.use(express.json());

app.get('/questions', (req, res) => {
    db.all("SELECT * FROM longform_questions", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/questions/filter', (req, res) => {
  const { topic, subtopic} = req.query;
  let query = "SELECT * FROM longform_questions WHERE 1=1";
  const params = [];

  if (topic) {
    query += " AND topic = ?";
    params.push(topic);
  }
  if (subtopic) {
    query += " AND subtopic = ?";
    params.push(subtopic);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
