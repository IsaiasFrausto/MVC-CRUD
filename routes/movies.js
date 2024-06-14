const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');

// Routes for movies
router.get('/', movieController.getMovies);
router.get('/add', movieController.addMovies);
router.get('/movies/edit/:movieId', movieController.findOne);
router.put('/movies/:movieId', movieController.Update);
router.delete('/movies/delete/:movieId', movieController.Delete);
router.post('/movies', movieController.createMovies);

module.exports = router;
