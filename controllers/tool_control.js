const express = require('express')
const router = express.Router();
module.exports = router;

const db = require('../models');

//index route
router.get('/', (req, res) => {
    //res.send('tools index page');
    db.Tool.find({}, (err, foundTools) => {
        if(err) return res.send("index route error: "+err);
        context = {allTools: foundTools};
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


//edit route
//update route
//delete route
