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
app.post('/search', async (req, res) => {
    try {
        // store search query
        let searchInput = req.body.search;

        // finds current user
        const userId = req.session.currentUser.id;

        const query = {
            $and:
                [
                    { user: userId },
                    {
                        $or: [
                            { name: { $regex: searchInput, $options: 'i' } }, { description: { $regex: searchInput, $options: 'i' } }
                        ]
                    }
                ]
        }

        // find user's categories, populate their tools
        const categoryMatches = await db.Category.find(query).populate('tools').exec();

        //look for matching tools as well
        //checks name, description, keywords
        const toolMatches = [];
        const allCats = await db.Category.find({}).populate('tools').exec();
        //console.log('categoryMatches avast:', categoryMatches);
        allCats.forEach(category => {
            category.tools.forEach(tool => {
                //console.log('tool.name:', tool.name);
                //console.log('tool.keywords:', tool.keywords);
                let toolContents = "" + tool.name + tool.description + tool.keywords;
                //console.log('toolContents:', toolContents);
                if(toolContents.includes(searchInput)){
                    toolMatches.push(tool);
                }
            })
        })
        console.log('toolMatches:', toolMatches);


        const context = {
            categoryMatches: categoryMatches,
            toolMatchesZOMG: toolMatches,
        };

        res.render('search.ejs', context);

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
