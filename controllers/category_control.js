const express = require('express');
const router = express.Router();
const db = require('../models');

/* Base route is /categories */

// new route
router.get('/new', (req, res) => {
    res.render('category/new');
});

// create route
router.post('/', (req, res) => {
    db.Category.create(req.body, (error, createdCategory) => {
        if(error) return res.send(error);
        console.log('Created category: ', createdCategory);
        res.redirect('/');
    });
});

// show route (view contents of one category)

// edit route

// update route

// delete route

module.exports = router;