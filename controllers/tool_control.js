const express = require('express')
const router = express.Router();
module.exports = router;

const db = require('../models');

// index route
router.get('/', (req, res) => {
    db.Tool.find({}).sort('name').exec((error, toolsArray) => {
        if(error) {
            console.log('Error: ', error);
            return res.send('Internal server error.');
        }
        context = {allTools: toolsArray};
        res.render('tool/index.ejs', context);
    });
});


// new route
//DUPED with NEW PRE-POPULATED
router.get('/newTool', (req, res) => {
    db.User.findById(req.session.currentUser.id)
    .populate('categories')
    .exec( (error, foundUser) => {
        if(error) {
            console.log('Error: ', error);
            return res.send('Internal server error.');
        }
        context = {
            allCats: foundUser.categories,
            catId: null,
        };
        res.render('tool/new.ejs', context);
    });
});


// new route (Category pre-populated)
// note: COPIED FROM NEW ROUTE -- VERY WET.  COMBINE THESE LATER.
router.get('/newTool/:catId', (req, res) => {
    db.User.findById(req.session.currentUser.id)
    .populate('categories')
    .exec( (error, foundUser) => {
        if(error) {
            console.log('Error: ', error);
            return res.send('Internal server error.');
        }
        context = {
            allCats: foundUser.categories,
            catId: req.params.catId,
        };
        res.render('tool/new.ejs', context);
    });
});


// create route
//DUPED with CREATE PRE-POPULATED
router.post('/', async (req, res) => {
    try {
        const createdTool = await db.Tool.create(req.body);
        const allCats = await db.Category.find({});
        for(eachCat of allCats){
            catId = eachCat._id;
            if(req.body['category_'+catId] === 'on'){
                await createdTool.categories.push(eachCat);
                eachCat.tools.push(createdTool);
                eachCat.save();
            }
        }
        createdTool.save();
        res.redirect('/');
    }
    catch (error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});


// create route pre-populated
// note: COPIED FROM CREATE ROUTE: VERY WET.  COMBINE THESE LATER
router.post('/:catId', async (req, res) => {
    try {
        const createdTool = await db.Tool.create(req.body);
        const allCats = await db.Category.find({});
        for(eachCat of allCats){
            catId = eachCat._id;
            if(req.body['category_'+catId] === 'on'){
                await createdTool.categories.push(eachCat);
                eachCat.tools.push(createdTool);
                eachCat.save();
            }
        }
        createdTool.save();
        res.redirect('/categories/'+req.params.catId);
    }
    catch (error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});


// show route
router.get('/:toolId', (req, res) => {
    db.Tool.findById(req.params.toolId)
    .populate('categories')
    .exec( (error, foundTool) => {
        if(error) {
            console.log('Error: ', error);
            return res.send('Internal server error.');
        }
        context = {oneTool: foundTool};
        res.render('tool/show.ejs', context);
    });
});


// edit route
router.get('/:toolId/edit', (req, res) => {

    // find current user and populate their categories
    db.User.findById(req.session.currentUser.id)
    .populate('categories')
    .exec( (error, foundUser) => {
        if(error) {
            console.log('Error: ', error);
            return res.send('Internal server error.');
        }

        // isolate the tool to be edited
        db.Tool.findById(req.params.toolId, (error, foundTool) => {
            if(error) {
                console.log('Error: ', error);
                return res.send('Internal server error.');
            }
            context = {
                oneTool: foundTool,
                allCats: foundUser.categories,
            };
            res.render('tool/edit.ejs', context);
        });
    }); 
});


// update route
router.put('/:toolId', async (req, res) => {
    try{
        const allCats = await db.Category.find({});
        const oldTool = await db.Tool.findById(req.params.toolId);
        
        // if user adds a tool to another new category, push tool into that category
        for(eachCat of allCats){
            catId = eachCat._id;
            const checkedCategory = req.body['category_'+catId] === 'on';
            const alreadyInCategory = oldTool.categories.includes(String(catId));

            const isCategoryAdded = checkedCategory && !(alreadyInCategory);
            const isCategoryRemoved = alreadyInCategory && !(checkedCategory);

            if(isCategoryAdded){
                await oldTool.categories.push(eachCat);
                eachCat.tools.push(oldTool);
                eachCat.save();
            } else
            if(isCategoryRemoved){
                await oldTool.categories.remove(eachCat);
                eachCat.tools.remove(oldTool);
                eachCat.save();
            }
        }
        await oldTool.save();
        
        const updatedTool = await db.Tool.findByIdAndUpdate(req.params.toolId, req.body, {new: true});

        res.redirect('/tools/');
    }
    catch(error){
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});


// delete route
router.delete('/:toolId', async (req, res) => {
    try {
        // find all categories in which this tool is stored, delete tool from all of them
        const doomedTool = await db.Tool.findById(req.params.toolId).populate('categories').exec();
        const parentCats = doomedTool.categories;
        for(eachCat of parentCats){
            eachCat.tools.remove(doomedTool);
            eachCat.save();
        }
        doomedTool.deleteOne();
    }
    catch (error) {
        console.log('Tool deletion route error: '+error)
        return res.send('Internal server error.');
    }
    res.redirect('/tools');
});


//remove-from-category route
router.post('/:toolId/:catId', async (req, res) => {
    try{
        // find specific tool in current category and remove only from this category (don't delete elsewhere)
        const errantTool = await db.Tool.findById(req.params.toolId);
        const scornedCategory = await db.Category.findById(req.params.catId);
        scornedCategory.tools.remove(errantTool);
        errantTool.categories.remove(scornedCategory);
        errantTool.save();
        scornedCategory.save();
        res.redirect('/categories/'+req.params.catId+'/edit');
    }
    catch(error){
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});

//steal tool route
router.get('/steal/:toolId/:userId', async (req, res) => {
    try{
        // allows current user to 'steal' another user's tools and add them to their own Toolodex
        if(req.session.currentUser.id != req.params.userId){
            const thief = await db.User.findById(req.session.currentUser.id)
                .populate('categories');
            const booty = await db.Tool.findById(req.params.toolId);
            const stash = thief.categories[0];
            stash.tools.push(booty);
            booty.categories.push(stash);
            stash.save();
            booty.save();
            res.redirect('/users/'+req.params.userId);
        }
    }
    catch(error){
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});
