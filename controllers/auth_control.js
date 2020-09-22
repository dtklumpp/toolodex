const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');

module.exports = router;

const statesUSA = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY', 'United Arab Emirates' ];

// base path: /

//register form
router.get('/register', (req, res) => {
    res.render('auth/register', {statesArray: statesUSA});
});

// register post => creates user
router.post('/register', async (req, res) => {
    try {
        const foundUser = await db.User.findOne({ email: req.body.email });
        if(foundUser) {
            return res.send({message: 'A user with this email address already exists.'});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;

        //adding this stuff to auto-login when make user
        //db.User.create(req.body);
        const newUser = await db.User.create(req.body);
        req.session.currentUser = {
            username: newUser.username,
            id: newUser._id,
        };
        res.redirect('/');
        //res.redirect('/login');

    } catch (error) {
        console.log(error);
        res.send({message: 'Internal server error.'});
    }
});

// login form
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// login post (authentication)
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

