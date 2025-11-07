require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const db = require('./database');
const authenticationToken = require('./middleware/authMiddleware');
const PORT = process.env.port || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat datang di Rest API!');
});

// AUTH ROUTE
app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
        return res.status(400).json({error: 'Username dan password harus diisi'});
    }

    bcrypt.hash(password, 10, (err, hasedPassword) => {
        if (err) {
            console.error("Error hasing: ", err);
            return res.status(500).json({error: "Gagal memproses pendaftaran"});
        }

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        const params = [username.toLowerCase(), hasedPassword];

        db.run(sql, params, function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint')) {
                    return res.status(409).json({ error: 'Username sudah digunakan' });
                }
                console.error("Error isnerting user: ", err);
                return res.status(500).json({ error: "Gagal menyimpan pengguna" });
            }
            res.status(201).json({error: "Registrasi berhasil", userId: this.lastID});
        });
    });
});

// LOGIN ROUTE
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username dan password harus diisi"});
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.get(sql, [username.toLowerCase()], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Kredensial tidak valid" });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ error: "Kredensial tidak valid" });
            }
            const payload = {user: {id: user.id, username: user.username}};
            jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
                if (err) {
                    console.error("Error signing token: ", err);
                    return res.status(500).json({error: "Gagal membuat token"});
                }
                res.json({message: 'Login berhasil', token: token});
            })
        })
    });
})

// GET MOVIES
app.get('/movies', authenticationToken, (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

// GET MOVIE BY ID
app.get('/movies/:id', authenticationToken, (req,res) => {
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
app.post('/movies', authenticationToken, (req, res) => {
    const {title, director, year} = req.body;

    if (!title || !director || !year) {
        return res.status(400).json({ error: "title, director, year is required" })
    }
    const sql = 'INSERT INTO movies(title, director, year) VALUES (?,?,?)';
    db.run(sql, [title, director, year], function(err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.status(201).json({ id: this.lastID, title, director, year});
    });
});


// UPDATE
app.put('/movies/:id', authenticationToken, (req, res) => {
    const { title, director, year } = req.body;
    const sql = 'UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?';
    db.run(sql, [title, director, year, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.chances === 0) return res.status(404).json({ error: "Movie not found" });
        res.json({ message: "Movie updated successfully" });
    });
});

// DELETE
app.delete('/movies/:id', authenticationToken, (req, res) => {
    const sql = 'DELETE FROM movies WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.chance === 0) return res.status(404).json({ error: "Movie not fond" });
        res.json({ message: "Movie deleted successfully" });
    });
});

// GET DIRECTORS
app.get('/directors', authenticationToken, (req, res) => {
    db.all("SELECT * FROM directors", [], (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

// GET DIRECTORS BASED BY ID
app.get('/directors/:id', authenticationToken, (req,res) => {
    db.get("SELECT * FROM directors WHERE id = ?", [req.params.id], (err, rows) => {
        if (err) {
            return res.status(400).json({error: "error"});
        }
        res.json(rows);
    });
});

// POST DIRECTORS
app.post('/directors', authenticationToken, (req, res) => {
    const {name, birthYear} = req.body;

    if (!name || !birthYear) {
        return res.status(400).json({ error: "name, birthyear is required" })
    }
    const sql = 'INSERT INTO directors(name, birthYear) VALUES (?,?)';
    db.run(sql, [name, birthYear], function(err) {
        if (err) {
            return res.status(500).json({error: err.message});  
        }
        res.status(201).json({ id: this.lastID, name, birthYear});
    });
});

// UPDATE DIRECTORS
app.put('/directors/:id', authenticationToken, (req, res) => {
    const {name, birthYear} = req.body;
    const sql = 'UPDATE directors SET name = ?, birthYear = ? WHERE id = ?';
    db.run(sql, [name, birthYear, req.params.id], function (err) {
        if (err) return res.status(500).json({error: err.message});
        if (this.chance === 0) return res.status(404).json({error: "Directors not found"});
        res.json({ message: "Directors updated successfully" });
    });
});

// DELETE
app.delete('/directors/:id', authenticationToken, (req, res) => {
    const sql = 'DELETE FROM directors WHERE id = ?';
    db.run(sql, req.params.id, function (err) {
        if (err) return res.status(500).json({error: err.message});
        if (this.chance === 0) return res.status(404).json({error: "Directors not found"});
        res.json({ message: "Directors deleted successfully" });
    });
});

app.use((err, req, res, _next) => {
    console.error(`[ERROR]`, err);
    res.status(500).json({ error: `Terjadi kesalahan pada server` });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});