const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');

module.exports = router;

// base path: /

//register form
router.get('/register', (req, res) => {
    res.render('auth/register');
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
        db.User.create(req.body);
        res.redirect('/login');
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
    res.redirect('/');
});

