const express = require('express');
const app = express();
const port = 3000;

let movie = [
    { id: 1, title: "JAV", director: "Salam", year: "1999"},
    { id: 2, title: "Anime", director: "Salam", year: "1999"}
];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat datang di Rest API pertamamu!');
});

app.get('/movie', (req, res) => {
    res.json(movie);
});

// Get data by ID
app.get('/movie/:id', (req, res) => {
    const getMovie = movie.find(m => m.id === parseInt(req.params.id));
    if (getMovie) {
        res.json(getMovie);
    } else {
        res.status(404).json({ message: 'User not found'});
    }
});

// Add data
app.post('/movie', (req, res) => {
    const { title, director, year } = req.body || {};
    if (!title || !director || !year) {
        return res.status(400).json({ error: `title, author, year (wajib diisi)`});
    }
    const newMovie = { id: movie.length + 1, title, director, year };
    movie.push(newMovie);
    res.status(201).json(newMovie);
});

// Hapus data
app.delete('/movies/:id', (req, res) => {
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
    //console.log(movie)
});