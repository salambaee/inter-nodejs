require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./database');
const PORT = process.env.port || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat datang di Rest API!');
});

// GET MOVIES
app.get('/movies', (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

// GET MOVIE BY ID
app.get('/movies/:id', (req,res) => {
    db.get("SELECT * FROM movies WHERE id = ?", [req.params.id], (err, rows) => {
        if (err) {
            return res.status(500).json({error: "error"});
        }
        if (!rows) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.json(rows);
    });
});

// ADD MOVIE
app.post('/movies', (req, res) => {
    const {title, director, year} = req.body;

    if (!title || !director || !year) {
        return res.status(400).json({ error: "title, director, year is required" })
    }
    const sql = 'INSERT INTO movies(title, director, year) VALUES (?,?,?)';
    db.run(sql, [title, director, year], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, director, year});
    });
});


// UPDATE
app.put('/movies/:id', (req, res) => {
    const { title, director, year } = req.body;
    const sql = 'UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?';
    db.run(sql, [title, director, year, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.chances === 0) return res.status(404).json({ error: "Movie not found" });
        //res.json({ message: "Movie updated successfully" });
        res.status(204).send();
    });
});

// DELETE
app.delete('/movies/:id', (req, res) => {
    const sql = 'DELETE FROM movies WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.chance === 0) return res.status(404).json({ error: "Movie not fond" });
        //res.json({ message: "Movie deleted successfully" });
        res.status(204).send();
    });
});

app.get('/directors', (req, res) => {
    db.all("SELECT * FROM directors", [], (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

app.get('/directors/:id', (req,res) => {
    db.get("SELECT * FROM directors WHERE id = ?", [req.params.id], (err, rows) => {
        if (err) {
            return res.status(400).json({error: "error"});
        }
        res.json(rows);
    });
});

app.use((err, req, res, _next) => {
    console.error(`[ERROR]`, err);
    res.status(500).json({ error: `Terjadi kesalahan pada server` });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});