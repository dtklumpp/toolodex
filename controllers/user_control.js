const express = require('express');
const router = express.Router();
module.exports = router;

const db = require('../models');

const statesUSA = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'United Arab Emirates', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'XX' ];


// index route
router.get('/', async (req, res) => {
    try{
        const usersArray = await db.User.find({});
        context = {allUsers: usersArray};
        res.render('user/index.ejs', context);
    }
    catch(error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});


// show route
router.get('/:userId', async (req, res) => {
    try{
        const foundUser = await db.User.findById(req.params.userId)
        .populate({
            path: 'categories',
            populate: {
                path: 'tools',
            }
        })
        .populate('friends')
        .exec();

        const context = {
            oneUser: foundUser,
            userCats: foundUser.categories,
            allFriends: foundUser.friends,
            activeUser: req.session.currentUser,
        };
        res.render('user/show.ejs', context);
    }
    catch(error) {
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});


// edit route
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
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});


// update route
router.put('/:userId', async (req, res) => {
    try{
        const updatedUser = await db.User.findByIdAndUpdate(req.params.userId, req.body, {new: true});
        res.redirect('/users/'+req.params.userId);
    }
    catch(error){
        res.send('update route error: '+error)
    }
})


// delete route
router.delete('/:userId', async (req, res) => {
    try{
        // find user to be deleted, populate their categories and tools
        const doomedUser = await db.User.findById(req.params.userId)
        .populate({
            path: 'categories',
            populate: {
                path: 'tools',
            }
        })
        .populate('friends')
        .exec();

        // remove categories from user (and from DB)
        const childCats = doomedUser.categories;
        for(eachCat of childCats){
            eachCat.user = null;
            eachCat.save();
        }

        // remove user's friends
        const lostFriends = doomedUser.friends;
        for(eachFriend of lostFriends){
            eachFriend.friends.remove(doomedUser);
            eachFriend.save();
        }

        // delete user
        doomedUser.deleteOne();

        //redirect to homepage
        res.redirect('/');
    }
    catch(error){
        console.log('Error: ', error);
        return res.send('Internal server error.');
    }
});

//IMPORTANT:
// THIS ISNT TESTED SO MAYBE LEAVE OFF TIL AFTER DEMO DAY?
// [RESTORE THIS AT PRODUCTION TIME]
// into the 'for(eachCat of childCats)' loop in delete user
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