const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');

module.exports = router;

const statesUSA = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'United Arab Emirates', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

// base path: /

// Login/Register form
router.get('/login', (req, res) => {
    res.render('auth/login', {statesArray: statesUSA});
});

// Register post => creates user
router.post('/register', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ email: req.body.email });
        if(foundUser) {
            return res.send({message: 'A user with this email address already exists.'});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;

        const allUsers = await db.User.find({});

        //adding this stuff to auto-login when make user
        //db.User.create(req.body);
        const newUser = await db.User.create(req.body);
        req.session.currentUser = {
            username: newUser.username,
            id: newUser._id,
        };

        const catName = "Favorites"+Math.floor(Math.random()*10000);
        const favoritesCategory = await db.Category.create({name: catName, user: newUser, description: 'Your favorite, go-to tools.'});
        newUser.categories.push(favoritesCategory);


        allUsers.forEach(user => {
            newUser.friends.push(user);
            user.friends.push(newUser);
            user.save();
        })

        await newUser.save();

        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.send({message: 'Internal server error.'});
    }
});

// Login post (authentication)
router.post('/login', async (req,res) => {
    try {
        const foundUser = await db.User.findOne({ username: req.body.username});
        if(!foundUser) {
            return res.send({message: 'The username or password is incorrect.'});
        }
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if(!match) {
            return res.send({message: 'The username or password is incorrect.'});
        }
        req.session.currentUser = {
            username: foundUser.username,
            id: foundUser._id,
        };
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send({message: 'Internal server error.'});
    }
});

// logout (delete the session)
router.delete('/logout', async (req, res) => {
    await req.session.destroy();
    res.redirect('/login');
});

// Redirects to categories index if user is signed in
router.get('/', (req,res) => {
    res.redirect('/categories');
});









//
//
//
//
//
//demo site
//note: COPIED FROM REGISTER ROUTE -- VERY WET!!
//DO THIS PROPERLY LATER
router.post('/demo', async (req, res) => {
    try {
        
        const defaultPass = "admin"
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(defaultPass, salt);
        newPW = hash;
        console.log("Your demo pw is admin");

        const allUsers = await db.User.find({});

        //adding this stuff to auto-login when make user
        //db.User.create(req.body);
        newUsername = "Demo"+Math.floor(10000*Math.random());
        newEmail = "Demo@"+Math.floor(10000*Math.random())+"EvergreenTerrace.com";
        newLocation = "PA";
        const newUser = await db.User.create({
            username: newUsername,
            password: newPW,
            location: newLocation,
            email: newEmail,
        });
        req.session.currentUser = {
            username: newUser.username,
            id: newUser._id,
        };

        const catName = "Favorites"+Math.floor(Math.random()*10000);
        const favoritesCategory = await db.Category.create({name: catName, user: newUser, description: 'Your favorite, go-to tools.'});
        newUser.categories.push(favoritesCategory);


        allUsers.forEach(user => {
            newUser.friends.push(user);
            user.friends.push(newUser);
            user.save();
        })

        await newUser.save();

        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.send({message: 'Internal server error.'});
    }
});










//map route

router.get('/map', async (req, res) => {
    try{
        const foundUser = await db.User.findById(req.session.currentUser.id)
        .populate('friends')
        .exec();

        const friendList = foundUser.friends;

        function stateIndex(state) {
            return state === "NY";
        } 

        const x = statesUSA.findIndex(stateIndex);
        console.log('x:', x);




        
        const context = {
            allFriends: foundUser.friends,
        }
        res.render('testing/map.ejs', context);
    }

    catch(error){
        console.log('map route error: '+error);
    }
})






// var result = jsObjects.filter(obj => {
//     return obj.b === 6
//   })
  