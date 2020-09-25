const express = require('express')
const router = express.Router();
module.exports = router;

const db = require('../models');

//index route
router.get('/', (req, res) => {
    //res.send('tools index page');
    db.Tool.find({}).sort('name').exec((error, toolsArray) => {
        if(error) return res.send("index route error: "+error);
        context = {allTools: toolsArray};
        res.render('tool/index.ejs', context);
    });
});

// new route
router.get('/newTool', (req, res) => {

    db.User.findById(req.session.currentUser.id)
    .populate('categories')
    .exec( (error, foundUser) => {
        if(error) return res.send("create route categories error: "+error);
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
        if(error) return res.send("create route categories error: "+error);
        context = {
            allCats: foundUser.categories,
            catId: req.params.catId,
        };
        res.render('tool/new.ejs', context);
    });

});


// create route
router.post('/', async (req, res) => {
    try {
        const createdTool = await db.Tool.create(req.body);
        const allCats = await db.Category.find({});
        for(eachCat of allCats){
            catId = eachCat._id;
            if(req.body["category_"+catId] === 'on'){
                await createdTool.categories.push(eachCat);
                eachCat.tools.push(createdTool);
                eachCat.save();
            }
        }
        createdTool.save();
        res.redirect('/');
    }
    catch (error) {
        return res.send("update route error: "+error);
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
            if(req.body["category_"+catId] === 'on'){
                await createdTool.categories.push(eachCat);
                eachCat.tools.push(createdTool);
                eachCat.save();
            }
        }
        createdTool.save();
        res.redirect('/categories/'+req.params.catId);
    }
    catch (error) {
        console.log("Create route error: "+ error);
        return res.send('Internal server error.');
    }
});


// show route
router.get('/:toolId', (req, res) => {
    db.Tool.findById(req.params.toolId)
    .populate('categories')
    .exec( (error, foundTool) => {
        if(error) return res.send("show route error: "+error);
        context = {oneTool: foundTool};
        res.render('tool/show.ejs', context);
    });
});


// edit route
router.get('/:toolId/edit', (req, res) => {

    db.User.findById(req.session.currentUser.id)
    .populate('categories')
    .exec( (error, foundUser) => {
        if(error) return res.send("edit route categories error: "+error)
        db.Tool.findById(req.params.toolId, (error, foundTool) => {
            if(error) return res.send("edit route error: "+error);
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
        
        for(eachCat of allCats){
            catId = eachCat._id;
            const checkedCategory = req.body["category_"+catId] === 'on';
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
        console.log("update route error: "+error);
        return res.send("Internal server error.");
    }
});


// delete route
router.delete('/:toolId', async (req, res) => {
    try {
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
        const errantTool = await db.Tool.findById(req.params.toolId);
        const scornedCategory = await db.Category.findById(req.params.catId);
        scornedCategory.tools.remove(errantTool);
        errantTool.categories.remove(scornedCategory);
        errantTool.save();
        scornedCategory.save();
        res.redirect('/categories/'+req.params.catId+"/edit");
    }
    catch(error){
        console.log('Remove tool from category route error: '+error);
        return res.send('Internal server error.');
    }
})

//steal tool route
router.get('/steal/:toolId/:userId', async (req, res) => {
    try{
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
        console.log('Steal tool route error: '+error);
        return res.send('Internal server error.');
    }
})
