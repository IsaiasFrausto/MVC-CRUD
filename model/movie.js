// movie.js
const connectToDatabase = require('../db');

var Movie = function(movie){
    this.title = movie.title;
    this.description = movie.description;
};

Movie.getAll = async function (result) {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.query("Select * from movies");
        console.log('movies : ', rows);
        result(null, rows);
        connection.end(); // Cierra la conexión después de usarla
    } catch (err) {
        console.error("error: ", err);
        result(err, null);
    }
};

Movie.create = async function (newMovie, result) {
    try {
        const connection = await connectToDatabase();
        const [res] = await connection.query("INSERT INTO movies SET ?", newMovie);
        console.log("Create movie", { id: res.insertId, ...newMovie });
        result(null, { id: res.insertId, ...newMovie });
        connection.end(); // Cierra la conexión después de usarla
    } catch (err) {
        console.error("error: ", err);
        result(err, null);
    }
};

Movie.findById = async function (movieId, result) {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.query("SELECT * FROM movies WHERE id = ?", [movieId]);
        if (rows.length) {
            console.log("Found movie: ", rows[0]);
            result(null, rows[0]);
        } else {
            result({ movie: "not_found" }, null);
        }
        connection.end(); // Cierra la conexión después de usarla
    } catch (err) {
        console.error("error: ", err);
        result(err, null);
    }
};

Movie.updateById = async function (id, movie, result) {
    try {
        const connection = await connectToDatabase();
        const [res] = await connection.query("UPDATE movies SET title = ?, description = ? WHERE id = ?", [movie.title, movie.description, id]);
        if (res.affectedRows == 0) {
            result({ movie: "not_found" }, null);
            return;
        }
        console.log("Updated movie: ", { id: id, ...movie });
        result(null, { id: id, ...movie });
        connection.end(); // Cierra la conexión después de usarla
    } catch (err) {
        console.error("error: ", err);
        result(err, null);
    }
};

Movie.remove = async function (id, result) {
    try {
        const connection = await connectToDatabase();
        const [res] = await connection.query("DELETE FROM movies WHERE id = ?", id);
        if (res.affectedRows == 0) {
            result({ movie: "not_found" }, null);
            return;
        }
        console.log("Deleted movie with id: ", id);
        result(null, res);
        connection.end(); // Cierra la conexión después de usarla
    } catch (err) {
        console.error("error: ", err);
        result(err, null);
    }
};

module.exports = Movie;