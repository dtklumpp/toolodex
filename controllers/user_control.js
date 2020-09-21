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
    //console.log('got here');
    db.User.create(req.body, (err, createdUser) => {
        if(err) return res.send('create route error: '+err);
        res.redirect('/users');
    })
})


//show route
router.get('/:userId', async (req, res) => {
    try{
        const foundUser = await db.User.findById(req.params.userId).populate('categories').exec();
        const context = {oneUser: foundUser};
        res.render('user/show.ejs', context);
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
    //console.log('got hereabouts');
    try{
        const updatedUser = await db.User.findByIdAndUpdate(req.params.userId, req.body, {new: true});
        res.redirect('/users/'+req.params.userId);
    }
    catch(error){
        res.send('update route error: '+error)
    }
})



//delete route
router.delete('/:userId', async (req, res) => {
    //console.log('got here now');
    console.log('got to delete route')
    try{
        const doomedUser = await db.User.findById(req.params.userId).populate('categories').exec();

        //deletes each category owned by the doomed User
        const childCats = doomedUser.categories;
        console.log('childCats:', childCats);
        for(eachCat of childCats){
            //eachCat.user.remove(doomedUser);
            //eachCat.save();

            //eachCat.deleteOne(); // doesn't delete the tools!
            //const childTools = eachCat.populate('tools').exec();

            //const fullCat = await eachCat.populate('tools').exec();
            const fullCat2 = await eachCat.populate('tools');




            //console.log('fullCat:', fullCat);
            console.log('fullCat2:', fullCat2);


        }
        
        //doomedUser.deleteOne();
        res.redirect('/users');
    }
    catch(error){
        res.send('delete route error: '+error)
    }
})
