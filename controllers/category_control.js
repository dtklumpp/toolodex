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
router.get('/:id/edit', async (req, res) => {
    try{
        const userArray = await db.User.find({});
        db.Category.findById(req.params.id)
        .populate('tools')
        .exec( (error, foundCategory) => {
            if(error) return res.send(error);
            const context = {
                category: foundCategory,
                allUsers: userArray,
            };
            res.render('category/edit', context);
        });

    }
    catch(error){
        res.send("category edit route error: "+error);
    }
});

// update route
router.put('/:id', async (req, res) => {
    //console.log('req.body:', req.body);
    // db.Category.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, updatedCategory) => {
    //     if(error) return res.send(error);
    //     res.redirect(`/categories/${updatedCategory._id}`);
    // });

    try {
        const oldCategory = await db.Category.findById(req.params.id);
        const isUserChange = (oldCategory.user != req.params.user);
        if(isUserChange) {
            const oldUser = await db.User.findById(oldCategory.user);
            oldUser.categories.remove(oldCategory);
            oldUser.save();
        }
        const updatedCategory = await db.Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(isUserChange){
            const newUser = await db.User.findById(updatedCategory.user);
            newUser.categories.push(updatedCategory);
            newUser.save();
        }
        res.redirect('/categories/'+req.params.id);

    }

    catch(err){
        res.send("update route error: "+err);
    }
});

// delete route
router.delete('/:id', async (req, res) => {
    try {
        // find and delete the category
        //DK note: this was the old method pre-MTM
        //const deletedCategory = await db.Category.findByIdAndDelete(req.params.id);

        //new method:
        const doomedCategory= await db.Category.findById(req.params.id).populate('tools').exec();
        //console.log('childTools:', childTools);
        
        //removes the reference to the category from each associated tool
        const childTools = doomedCategory.tools;
        for(eachTool of childTools){
            eachTool.categories.remove(doomedCategory);
            eachTool.save();
        }

        //removes the reference to the category from its associated User
        const parentUser = doomedCategory.user;
        parentUser.categories.remove(doomedCategory);
        parentUser.save();



        doomedCategory.deleteOne();
        console.log('Deleted category: ', doomedCategory);


        // find and delete any tools that belonged to that category
        // TODO might need to refactor and remove this part when we add many-to-many connections
        //DK-note: just commented out this now that MTM is running
        //const deletedTools = await db.Tool.deleteMany({ category: deletedCategory._id });
        //console.log('deletedTools: ', deletedTools);

        // redirect to the homepage (aka categories index)
        res.redirect('/');
    } catch (error) {
        return res.send("category deletion route error: "+error);
    }
});

module.exports = router;
