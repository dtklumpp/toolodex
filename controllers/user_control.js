const express = require('express');
const router = express.Router();
module.exports = router;

const db = require('../models');


//index route
router.get('/', async (req, res) => {
    //res.send('tools index page');
    try{
        const usersArray = await db.User.find({});
        context = {allUsers: usersArray};
        res.render('user/index.ejs', context);
    }
    catch(error){
        res.send("index route error: "+error);
    }
})


//new route
router.get('/newUser', (req, res) => {
    res.render('user/new.ejs');
})


//create route
router.post('/', (req, res) => {
    db.User.create(req.body, (err, createdUser) => {
        if(err) return res.send(err);
        res.redirected('/users');
    })
})


//show route
router.get('/:userId', async (req, res) => {
    try{
        const foundUser = await db.User.findById(req.params.userId).populate('categories').exec();
        const context = {oneUser: foundUser};
        res.render('users/show.ejs', context);
    }
    catch(error){
        res.send('show route error: '+error);
    }
})


//edit route
router.get('/:userId/edit', async (req, res) => {
    try{
        const foundUser = await db.User.findById(req.params.userId);
        const context = {oneUser: foundUser};
        res.render('user/edit.ejs', context);
    }
    catch(error){
        res.send('edit route error: '+error)
    }
})





//update route
router.put('/:userId', async (req, res) => {
    try{
        const updatedUser = db.User.findByIdAndUpdate(req.params.userId, req.body, {new: true});
        res.redirect('/users/'+req.params.userId);
    }
    catch(error){
        res.send('update route error: '+error)
    }
})



//delete route
router.delete('/:userId', async (req, res) => {
    try{
        const deletedUser = await db.User.findByIdAndDelete(req.params.id);
        res.redirect('/users');
    }
    catch(error){
        res.send('delete route error: '+error)
    }
})
