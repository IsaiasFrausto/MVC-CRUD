const Movie = require('../model/movie')/*Import the movie model to the controller to use the database functions in the model to interact with the database 
and send the response to the client side as a JSON object or redirect to the client side as a response in JSON format or redirect to the client side as a response in JSON format */

// Retrieve all movies
exports.getMovies = async (req, res) => {
    await Movie.getAll(function(err, data) {
        if (err) //If there is an error in the request, send the error message to the client side
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving movies."
            });
        else res.render('index', {movies: data});//If the request is successful, send the data to the client side as a response in JSON format
    });
}

// Retrieve a single movie with movieId
exports.addMovies = async (req, res) =>{
    res.render('add');
}

// Create and Save a new movie
exports.createMovies = function(req, res) {
    var new_movie = new Movie(req.body);//Create a new movie object with the request data in the request body and save it in the new_movie variable
    //if the request body is empty, send an error message to the client side with a status code of 400 (Bad Request)
    if (!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });        
    }
    else{
        //If there is no error in the request, save the movie object in the database
        Movie.create(new_movie, function(err, data) {
            //If there is an error in the request, send the error message to the client side with a status code of 500 (Internal Server Error)
            if (err)
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the movie."
                });
            else res.redirect('/');//If the request is successful, redirect to the home page
        });
    }
}

// Retrieve a single movie with movieId
exports.editMovie = async (req, res) =>{
    res.render('edit');//Render the edit page to the client side to edit the movie
}

// Retrieve a single movie with movieId
exports.findOne = function(req, res) {
    //Find a movie with the movieId in the request
    Movie.findById(req.params.movieId, function(err, data) {
        if (err) {
            //If there is an error in the request, send the error message to the client side with a status code of 404 (Not Found)
            if (err.kind === "not found") {
                res.status(404).send({
                    message: `Not found movie with id ${req.params.movieId}.`
                });
            } else {
                //If there is an error in the request, send the error message to the client side with a status code of 500 (Internal Server Error)
                res.status(500).send({
                    message: `Error retrieving movie with id ${req.params.movieId}.`
                });
            }
        } else res.render('edit', {movie: data});//If the request is successful, send the data to the client side as a response in JSON format
    });
}

// Update a movie identified by the movieId in the request
exports.Update = function(req, res) {
    //If the request body is empty, send an error message to the client side with a status code of 400 (Bad Request)
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    //Update the movie with the movieId in the request
    Movie.updateById(req.params.movieId, new Movie(req.body), 
    function(err, data) {
        if (err) {
            //If there is an error in the request, send the error message to the client side with a status code of 404 (Not Found)
            if (err.kind === "not found") {
                res.status(404).send({
                    message: `Not found movie with id ${req.params.movieId}.`
                });
            } else {
                //If there is an error in the request, send the error message to the client side with a status code of 500 (Internal Server Error)
                res.status(500).send({
                    message: `Error updating movie with id ${req.params.movieId}`
                });
            }
        } else res.redirect('/');//If the request is successful, redirect to the home page
    });
}

// Delete a movie with the specified movieId in the request
exports.Delete = (req,res) => {
    Movie.remove(req.params.movieId, //Delete the movie with the movieId in the request
    function (err, data){
        if (err) {
            //If there is an error in the request, send the error message to the client side with a status code of 404 (Not Found)
            if (err.kind === "not found") {
                res.status(404).send({
                    message: `Not found movie with id ${req.params.movieId}.`
                });
                //If there is an error in the request, send the error message to the client side with a status code of 500 (Internal Server Error)
            } else {
                res.status(500).send({
                    message: `Could not delete movie with id ${req.params.movieId}`
                });
            }
        } else res.redirect('/');//If the request is successful, redirect to the home page
    });
}