const express = require('express');
const router = express.Router();
const db = require('../models');

/* Base route is /categories */

// new route
router.get('/new', (req, res) => {
    res.render('category/new');
});

// create route

// show route (view contents of one category)

// edit route

// update route

// delete route

module.exports = router;