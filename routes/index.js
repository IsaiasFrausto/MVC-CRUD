const express = require('express');
const router = express.Router();

const moviesRoutes = require('./movies');
const authRoutes = require('./auth');

router.use('/', moviesRoutes);
router.use('/', authRoutes);

module.exports = router;
