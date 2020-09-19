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
    res.render('tool/new.ejs');
})

//create route
router.post('/', (req, res) => {
    db.Tool.create(req.body, (err, createdTool) => {
        if(err) return res.send("update route error: "+err);
        res.redirect('/tools');
    })
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
        if(err) return res.send("edit route error:"+err);
        context = {oneTool: foundTool};
        res.render('tool/edit.ejs', context);
    })
})

//update route

//delete route
router.delete('/:toolId', (req, res) => {
    db.Tool.findByIdAndDelete(req.params.toolId, (err, goneTool) => {
        if(err) return res.send("delete route error: "+err);
        res.redirect('/tools');
    })
})
