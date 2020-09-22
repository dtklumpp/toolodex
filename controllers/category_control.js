const express = require('express');
const router = express.Router();
const db = require('../models');
module.exports = router;


/* Base route is /categories */

// new route
router.get('/new', (req, res) => {
    res.render('category/new');
});

// create route
router.post('/', async (req, res) => {
    try {
        // find the current user (to whom the new category will be associated)
        const currentUser = await db.User.findById(req.session.currentUser.id);

        // use the req.body to create a category
        const createdCategory = await db.Category.create(req.body);

        // save the current user into the category's 'user' prop
        createdCategory.user = currentUser;
        createdCategory.save();

        // push the new category into the user's 'categories' array, save the user
        currentUser.categories.push(createdCategory);
        currentUser.save();

        // redirect to the new category's show page
        res.redirect(`/categories/${createdCategory._id}`)
        
    } catch (error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
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
        const doomedCategory= await db.Category.findById(req.params.id).populate('tools').populate('user').exec();
        
        //removes the reference to the category from each associated tool
        const childTools = doomedCategory.tools;
        for(eachTool of childTools){
            eachTool.categories.remove(doomedCategory);
            await eachTool.save();
        }

        //removes the reference to the category from its associated User
        const parentUser = doomedCategory.user;
        parentUser.categories.remove(doomedCategory);
        parentUser.save();

        doomedCategory.deleteOne();
        console.log('Deleted category: ', doomedCategory);

        //DK-note: just commented out this now that MTM is running
        //const deletedTools = await db.Tool.deleteMany({ category: deletedCategory._id });

        // redirect to the homepage (aka categories index)
        res.redirect('/');
    } catch (error) {
        return res.send("category deletion route error: "+error);
    }
});

