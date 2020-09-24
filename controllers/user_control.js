const express = require('express');
const router = express.Router();
module.exports = router;

const db = require('../models');

const statesUSA = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'United Arab Emirates', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];


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



//REPLACED BY REGISTER FORM
//new route
// router.get('/newUser', (req, res) => {
//     res.render('user/new.ejs', {statesArray: statesUSA});
// })

//REPLACED BY REGISTER POST
//create route
// router.post('/', (req, res) => {
//     //console.log('got here');
//     db.User.create(req.body, (err, createdUser) => {
//         if(err) return res.send('create route error: '+err);
//         res.redirect('/users');
//     })
// })



//show route
router.get('/:userId', async (req, res) => {
    try{
        const foundUser = await db.User.findById(req.params.userId)
        .populate({
            path: 'categories',
            populate: {
                path: 'tools',
            }
        }).exec();
        const context = {
            oneUser: foundUser,
            userCats: foundUser.categories,
        };
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
        const context = {
                oneUser: foundUser,
                statesArray: statesUSA,
            };
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
    try{
        const doomedUser = await db.User.findById(req.params.userId)
        .populate({
            path: 'categories',
            populate: {
                path: 'tools',
            }
        })
        const childCats = doomedUser.categories;
        for(eachCat of childCats){
            eachCat.user = null;
            eachCat.save();
        }
        doomedUser.deleteOne();
        res.redirect('/users');
    }
    catch(error){
        res.send('delete route error: '+error)
    }
})

//IMPORTANT:
// RESTORE THIS AT PRODUCTION TIME
// into the eachCat of childCats loop in delete user
// deletes each Category and Tool owned by the doomed user
// const childTools = eachCat.tools;
// for(eachTool of childTools){
//     eachTool.deleteOne();
// }
// eachCat.deleteOne();
//
//for now just removing references to the soon-to-be-deleted User
//rather than deleting the actual categories themselves
//for development purposes
