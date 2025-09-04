const express = require('express');
const app = express();
const port = 3000;

let movie = [
    { id: 1, title: "JAV", director: "Salam", year: "1999"},
    { id: 2, title: "Anime", director: "Salam", year: "1999"}
];

let directors = [
    { id: 1, name: "Salam Rizqi Mulia", birthYear: "2005"},
    { id: 2, name: "Andi Frimawan", birthYear: "2001"}
];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat datang di Rest API pertamamu!');
});

// Mengembalikan daftar semua sutradara
app.get('/directors', (req, res) => {
    res.json(directors);
});

// Mengembalikan detail satu sutradata
app.get('/directors/:id', (req, res) => {
    const getDirectories = directors.find(d => d.id === parseInt(req.params.id));
    if (getDirectories) {
        res.json(getDirectories);
    } else {
        res.status(404).json({ message: 'Directories not found'});
    }
});

// Membuat seorang sutradara baru. Lakukan validasi untuk memastikan name dan birthYear disertakan.
app.post('/directors', (req, res) => {
    const { name, birthYear} = req.body || {};
    if (!name || !birthYear) {
        return res.status(400).json({ error: `name, birthYear (wajib diisi)`});
    }
    const newDirectors = { id: movie.length + 1, name, birthYear };
    movie.push(newDirectors);
    res.status(201).json(newDirectors);
});

// Memperbarui data sutradata
app.put('/directors/:id', (req, res) => {
    const id = Number(req.params.id);
    const directorIndex = directors.findIndex(m => m.id === id);
    if (directorIndex === -1) {
        return res.status(404).json({  error: `Sutradara tidak ditemukan`});
    }
    const { name, birthYear } = req.body || {};
    const updateDirector = { name, birthYear };
    directors[directorIndex] = updateDirector;
    res.json(updateDirector);
});

// Mengapus data sutradara
app.delete('/directors/:id', (req, res) => {
    const id = Number(req.params.id);
    const directorIndex = directors.findIndex(m => m.id === id);
    if (directorIndex === -1) {
        return res.status(404).json({ error: `Diretor tidak ditemukan` });
    }
    directors.splice(directorIndex, 1);
    res.status(204).send();
});

app.get('/movie', (req, res) => {
    res.json(movie);
});

app.get('/movie/:id', (req, res) => {
    const getMovie = movie.find(m => m.id === parseInt(req.params.id));
    if (getMovie) {
        res.json(getMovie);
    } else {
        res.status(404).json({ message: 'User not found'});
    }
});

// POST - Membuat film baru
app.post('/movie', (req, res) => {
    const { title, director, year } = req.body || {};
    if (!title || !director || !year) {
        return res.status(400).json({ error: `title, author, year (wajib diisi)`});
    }
    const newMovie = { id: movie.length + 1, title, director, year };
    movie.push(newMovie);
    res.status(201).json(newMovie);
});

// PUT - Memperbarui data film
app.put('/movie/:id', (req, res) => {
    const id = Number(req.params.id);
    const movieIndex = movie.findIndex(m => m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({  error: `Movie tidak ditemukan`});
    }
    const { title, director, year } = req.body || {};
    const updateMovie = { id, title, director, year };
    movie[movieIndex] = updateMovie;
    res.json(updateMovie);
});

// DELETE - Mengapus film
app.delete('/movie/:id', (req, res) => {
    const id = Number(req.params.id);
    const movieIndex = movie.findIndex(m => m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: `Movie tidak ditemukan` });
    }
    movie.splice(movieIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});