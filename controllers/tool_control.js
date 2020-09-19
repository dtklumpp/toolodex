const express = require('express')
const router = express.Router();
module.exports = router;

const db = require('../models');

//index route
router.get('/', (req, res) => {
    res.send('tools index page');
})

//new route
router.get('/newTool', (req, res) => {
    res.render('tool/new.ejs');
})


//update route
//show route
//edit route
//create route
//delete route
