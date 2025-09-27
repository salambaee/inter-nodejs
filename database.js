require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const dbSource = process.env.DB_SOURCE || "db.sqlite";

const db = new sqlite3.Database(dbSource, (err) => {
    if (err) {
        console.error("Error", err.message);
    } else {
        console.log(`Connected to database : ${dbSource}`);
        // Modifikasi skema basis data, dengan menambahkan tabel jika belum ada
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS movies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    director TEXT NOT NULL,
                    year TEXT
                );`
            );
            db.run(`
                CREATE TABLE IF NOT EXISTS directors (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    birthYear TEXT
                );`
            );
            const insertMovies = "INSERT INTO movies (title, director, year) VALUES (?,?,?)";
            db.run(insertMovies, ["Anime", "Salam", "1999"]);
            db.run(insertMovies, ["Anime", "Rizqi", "2000"]);
            db.run(insertMovies, ["Anime", "Mulia", "1999"]);   
            console.log("Movies inserted");
            const insertDirectors = "INSERT INTO directors (name, birthYear) VALUES (?,?)";
            db.run(insertDirectors, ["Maulana Malik", "2000"]);
            db.run(insertDirectors, ["Salam Rizqi Mulia", "2000"]);
            db.run(insertDirectors, ["Rivers Cuomo", "1999"]);
            console.log("Directors inserted");
        });
    }
});

module.exports = db;