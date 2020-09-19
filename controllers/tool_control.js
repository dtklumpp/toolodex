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
        if(err1) return res.send("create route authors erro: "+err1);
        context = {allCats: catsArray};
        res.render('tool/new.ejs', context);
    })
})

//create route
router.post('/', async (req, res) => {
    try {
        const createdTool = await db.Tool.create(req.body);
        const foundCategory = await db.Category.findById(req.body.category);
        foundCategory.tools.push(createdTool);
        foundCategory.save();
        res.redirect('/tools');
    }
    catch (err) {
        res.send("update route error: "+err);
    }

    //old way:
    // db.Tool.create(req.body, (err, createdTool) => {
    //     if(err) return res.send("update route error: "+err);
    //     res.redirect('/tools');
    // })
})

//show route
router.get('/:toolId', (req, res) => {
    db.Tool.findById(req.params.toolId, (err, foundTool) => {
        if(err) return res.send("show route error: "+err);
        //console.log('req.params.toolId:', req.params.toolId);
        //console.log('foundTool:', foundTool);
        context = {oneTool: foundTool};
        res.render('tool/show.ejs', context);
    })
})


//edit route
router.get('/:toolId/edit', (req, res) => {
    db.Tool.findById(req.params.toolId, (err, foundTool) => {
        if(err) return res.send("edit route error: "+err);
        context = {oneTool: foundTool};
        res.render('tool/edit.ejs', context);
    })
})

//update route
router.put('/:toolId', (req, res) => {
    db.Tool.findByIdAndUpdate(req.params.toolId, req.body, {new: true}, (err, updatedTool) => {
        if(err) return res.send("update route error: "+err);
        res.redirect('/tools/'+req.params.toolId);
    })
})




//delete route
router.delete('/:toolId', (req, res) => {
    db.Tool.findByIdAndDelete(req.params.toolId, (err, goneTool) => {
        if(err) return res.send("delete route error: "+err);
        res.redirect('/tools');
    })
})
