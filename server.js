/* External Modules */
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* Internal Modules */
const db = require('./models');
const controllers = require('./controllers');

/* Instantiated Modules */
const app = express();

/* Configuration */
const PORT = 4000;
app.set('view engine', 'ejs');

/* Middleware */
app.use(methodOverride('_method'));

app.use(express.static('public'));
//const path = require('path');
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));

// user auth
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'Open sesame',
    store: new MongoStore({
        url: 'mongodb://localhost:27017/toolodex-sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // one day
    },
}));

// Gatekeeper Authorization
const authRequired = function (req, res, next) {
    if(!req.session.currentUser) {
        return res.redirect('/login');
    };
    next();
};

/* Routes */

// Auth routes
app.use('/', controllers.auth);

//Test Route
app.get('/testing', (req, res) => {
    res.render('testing/testview.ejs');
});

// Search route
app.get('/search', async (req, res) => {
    try {
        // store search query
        const searchQuery = req.body;

        // finds current user
        const userId = req.session.currentUser.id;

        // populate user's categories and tools in an array
        const allUserCategories = await db.User.findById(userId).populate('categories');
        console.log("All user categories: ", allUserCategories.categories);

        
        
        const allUserTools = allUserCategories.categories.tools;
        console.log("All user tools: ", allUserTools);

        const context = {};

        res.send("searching...");
        /* res.render('search.ejs'); */

    } catch (error) {
        console.log("Error: ", error);
        return res.send("Internal server error.");
    }

});

// Category routes
app.use('/categories', authRequired, controllers.category);

// Tool routes
app.use('/tools', authRequired, controllers.tool);

// User routes
app.use('/users', authRequired, controllers.user);

/* Server Listener */
app.listen(PORT, () => {
    console.log(`Server is live and listening on http://localhost:${PORT}`);
});
