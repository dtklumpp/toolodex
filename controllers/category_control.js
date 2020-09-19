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
router.get('/:id', (req, res) => {
    db.Category.findById(req.params.id)
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
router.get('/:id/edit', (req, res) => {
    db.Category.findById(req.params.id)
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
router.put('/:id', (req, res) => {
    db.Category.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedCategory) => {
        if(error) return res.send(error);
        res.redirect(`/categories/${updatedCategory._id}`);
    });
});

// delete route
router.delete('/:id', async (req, res) => {
    try {
        // find and delete the category
        const deletedCategory = await db.Category.findByIdAndDelete(req.params.id);
        console.log('Deleted category: ', deletedCategory);
        // find and delete any tools that belonged to that category
        // TODO might need to refactor and remove this part when we add many-to-many connections
        const deletedTools = await db.Tool.deleteMany({ category: deletedCategory._id });
        console.log('deletedTools: ', deletedTools);
        // redirect to the homepage (aka categories index)
        res.redirect('/');
    } catch (error) {
        return res.send(error);
    }
});

module.exports = router;