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
//TODO I think I'll need to turn this into an async function but not sure exactly how
router.get('/:id', (req, res) => {
    db.Category.findById(req.params.id) // Throws an error saying cannot read prop of undefined. Is it because David doesn't have the categories linked in his Tool model?
    .populate('tools')
    .exec( (error, foundCategory) => {
        if(error) return res.send(error);
        const context = {
            category: foundCategory,
        };
        res.render('category/show', context);
    });
});

// edit (form) route
//TODO I think I'll need to turn this into an async function but not sure exactly how
router.get('/:id/edit', (req, res) => {
    db.Category.findById(req.params.id) // Throws an error saying cannot read prop of undefined. Is it because David doesn't have the categories linked in his Tool model?
    .populate('tools')
    .exec( (error, foundCategory) => {
        if(error) return res.send(error);
        const context = {
            category: foundCategory,
        };
        res.render('category/edit', context);
    });
});

// update route

// delete route

module.exports = router;