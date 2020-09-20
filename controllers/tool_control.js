const express = require('express')
const router = express.Router();
module.exports = router;

const db = require('../models');

//index route
router.get('/', (req, res) => {
    //res.send('tools index page');
    db.Tool.find({}, (err, toolsArray) => {
        if(err) return res.send("index route error: "+err);
        context = {allTools: toolsArray};
        res.render('tool/index.ejs', context);
    })
})

//new route
router.get('/newTool', (req, res) => {
    db.Category.find({}, (err1, catsArray) => {
        if(err1) return res.send("create route categories error: "+err1);
        context = {allCats: catsArray};
        res.render('tool/new.ejs', context);
    })
})

//old Create methods:
// db.Tool.create(req.body, (err, createdTool) => {
//     if(err) return res.send("update route error: "+err);
//     res.redirect('/tools');
// })


//create route
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
        //const foundCategory = await db.Category.findById(req.body.category);
        //foundCategory.tools.push(createdTool);
        //foundCategory.save();
        res.redirect('/tools');
    }
    catch (err) {
        res.send("update route error: "+err);
    }

})
//show route
router.get('/:toolId', (req, res) => {
    db.Tool.findById(req.params.toolId)
    .populate('category')
    .populate('categories')
    .exec( (err, foundTool) => {
        if(err) return res.send("show route error: "+err);
        //console.log('req.params.toolId:', req.params.toolId);
        //console.log('foundTool:', foundTool);
        context = {oneTool: foundTool};
        res.render('tool/show.ejs', context);
    })
})
//edit route
router.get('/:toolId/edit', (req, res) => {
    db.Category.find({}, (err1, catsArray) => {
        if(err1) return res.send("edit route categories error: "+err1)
        db.Tool.findById(req.params.toolId, (err, foundTool) => {
            if(err) return res.send("edit route error: "+err);
            context = {
                oneTool: foundTool,
                allCats: catsArray,
                catId: foundTool.category._id,
            };
            res.render('tool/edit.ejs', context);
        })

    })
    
})

//old update methods
// db.Tool.findByIdAndUpdate(req.params.toolId, req.body, {new: true}, (err, updatedTool) => {
//     if(err) return res.send("update route error: "+err);
//     res.redirect('/tools/'+req.params.toolId);
// })


//update route
router.put('/:toolId', async (req, res) => {
    try{
        const oldTool = await db.Tool.findById(req.params.toolId);
        const isCategoryChange = (oldTool.category != req.params.category);
        if(isCategoryChange) {
            const oldCategory = await db.Category.findById(oldTool.category);
            oldCategory.tools.remove(oldTool);
            oldCategory.save();
        }
        const updatedTool = await db.Tool.findByIdAndUpdate(req.params.toolId, req.body, {new: true});
        if(isCategoryChange){
            const newCategory = await db.Category.findById(updatedTool.category);
            newCategory.tools.push(updatedTool);
            newCategory.save();
        }
        res.redirect('/tools/'+req.params.toolId);
    }
    catch(err){
        res.send("update route error: "+err);
    }

})




//delete route
router.delete('/:toolId', (req, res) => {
    db.Tool.findByIdAndDelete(req.params.toolId, (err, goneTool) => {
        if(err) return res.send("delete route error: "+err);
        res.redirect('/tools');
    })
})
