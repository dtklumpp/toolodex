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
        // TODO store the value of search input to use for getting search results
        // let searchQuery = ;
        // console.log("searchQuery", searchQuery);

        // finds current user
        const userId = req.session.currentUser.id;

        // find user's categories, populate their tools
        const allUserCategories = await db.Category.find({user: userId}).populate('tools').exec();
        //const allUserCats = allUserResources.categories;
        
        console.log("All user categories: ", allUserCategories);
        
        // create an empty tools array
        const allUserTools = [];

        // loop trough all categories and push tools into the above array
        allUserCategories.forEach(category => {
                category.tools.forEach(tool => {
                    allUserTools.push(tool);
                });
        });

        console.log("All user tools: ", allUserTools);

        // const categoryMatches = [];

        // https://stackoverflow.com/questions/35948669/how-to-check-if-a-value-exists-in-an-object-using-javascript/35948779#35948779
        // loop through the categories and check for matches
/*         allUserCategories.forEach(category => {
            if(Object.values(category).indexOf(searchQuery))
        }) */
        
        /* allUserTools.forEach(tool => {
            console.log("Tool names:", tool.name);
        });

        const context = {}; */

        res.send("searching...");
        /* res.render('search.ejs'); */

    } catch (error) {
        /* console.log("Error: ", error); */
        return res.send({message: error});
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
