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
router.get('/:toolID', (req, res) => {
    db.Tool.findById(req.params.toolID, (err, foundTool) => {
        if(err) return res.send("show route error: "+err);
        //console.log('req.params.toolID:', req.params.toolID);
        //console.log('foundTool:', foundTool);
        context = {oneTool: foundTool};
        res.render('tool/show.ejs', context);
    })
})


//edit route
//update route
//delete route
