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

// Category index
router.get('/', (req, res) => {
    //finds current user
    const userId = req.session.currentUser.id;

    // populate the current user's categories
    db.User.findById(userId).populate('categories').exec(function (error, foundUser) {
        if(error) {
            console.log('Error: ', error);
            return res.send('Internal server error.');
        } 
        
        const context = {
            user: foundUser,
        };

        res.render('category/index', context);
    });
});

// show route (view contents of one category)
router.get('/:id', (req, res) => {
    db.Category.findById(req.params.id)
    .populate('tools')
    .exec( (error, foundCategory) => {
        if(error) {
            console.log('Error: ', error);
            return res.send('Internal server error.');
        }
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
            if(error) {
                console.log('Error: ', error);
                return res.send('Internal server error.');
            }
            const context = {
                category: foundCategory,
                allUsers: userArray,
            };
            res.render('category/edit', context);
        });
    }
    catch(error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
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
    catch(error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});

// delete route
router.delete('/:id', async (req, res) => {
    console.log('got cat delete')
    try {
        const doomedCategory= await db.Category.findById(req.params.id).populate('tools').populate('user').exec();
        
        //removes the reference to the category from each associated tool
        const childTools = doomedCategory.tools;
        for(eachTool of childTools){
            console.log('eachTool:', eachTool);
            eachTool.categories.remove(doomedCategory);
            await eachTool.save();
        }

        //removes the reference to the category from its associated User
        const parentUser = doomedCategory.user;
        console.log('parentUser:', parentUser);
        parentUser.categories.remove(doomedCategory);
        parentUser.save();

        console.log('Deleted category: ', doomedCategory);
        doomedCategory.deleteOne();

        // redirect to the homepage (aka categories index)
        res.redirect('/');
    } catch (error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});

