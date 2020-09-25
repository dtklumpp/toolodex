const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');

module.exports = router;

const statesUSA = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'United Arab Emirates', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'XX' ];

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








//
//
//
//
//
//DANGER: HERE THERE BE MAPS
//
//array of states and their lattitude, longitude in pixels
const objStates = [
    ['AL',390,640],
    ['AK',520,120],
    ['AZ',320,200],
    ['AR',360,520],
    ['CA',250,40],
    ['CO',260,290],
    ['CT',165,840],
    ['DE',215,820],
    ['DC',235,800],
    ['FL',530,790],
    ['GA',370,680],
    ['HI',540,320],
    ['ID',130,180],
    ['IL',195,610],
    ['IN',220,640],
    ['IA',200,510],
    ['KS',280,420],
    ['KY',275,690],
    ['LA',470,560],
    ['ME',60,890],
    ['MD',230,805],
    ['MA',140,880],
    ['MI',140,650],
    ['MN',90,510],
    ['MS',400,570],
    ['MO',310,590],
    ['MT',90,220],
    ['NE',210,400],
    ['NV',290,140],
    ['NH',100,860],
    ['NJ',215,835],
    ['NM',340,300],
    ['NY',175,840],
    ['NC',315,790],
    ['ND',80,450],
    ['OH',200,680],
    ['OK',340,480],
    ['OR',75,80],
    ['PA',205,820],
    ['RI',155,875],
    ['SC',385,765],
    ['SD',140,380],
    ['TN',320,660],
    ['TX',480,480],
    ['United Arab Emirates',440,840],
    ['UT',240,200],
    ['VT',110,840],
    ['VA',275,790],
    ['WA',25,100],
    ['WV',260,720],
    ['WI',135,600],
    ['WY',150,260],
    ['XX', 10000, 400],
]

//for reference, these are not used
const omitted = ["AS, FM, GU, MH, MP, PW, PR, VI"];
const againStates = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'United Arab Emirates', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];





//map route

router.get('/map', async (req, res) => {
    try{
        const foundUser = await db.User.findById(req.session.currentUser.id)
        .populate('friends')
        .exec();

        
        const friendList = foundUser.friends;
        const geoFriends = [];
        for(eachFriend of friendList){
            const newRow = [];
            newRow.push(eachFriend._id);
            newRow.push(eachFriend.username);
            for(eachState of objStates){
                if(eachState[0] === eachFriend.location){
                    newRow.push(eachState[1]);
                    newRow.push(eachState[2]);
                    break;
                }
            }
            geoFriends.push(newRow);
        }

        //console.log('geoFriends:', geoFriends);
        

        
        const context = {
            allFriends: geoFriends,
        }
        res.render('testing/map.ejs', context);
    }

    catch(error){
        console.log('map route error: '+error);
    }
})


router.get('/math', async (req, res) => {
    try{
        const nums = [1, 2, 3, 4]
        const checkThree = function(num){
            return num === 3;
        }
        const foundIt = nums.findIndex(checkThree);
        console.log('foundIt:', foundIt);


        var jsObjects = [
            {a: 1, b: 2}, 
            {a: 3, b: 4}, 
            {a: 5, b: 6}, 
            {a: 7, b: 8}
        ];
        
        var result = jsObjects.filter(obj => {
            return obj.b === 6
        })


    }
    catch(error){
        console.log('math error: '+error);
    }
})



// var result = jsObjects.filter(obj => {
//     return obj.b === 6
//   })
