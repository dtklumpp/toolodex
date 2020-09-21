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

/* Routes */
// TODO Homepage (Category index)
app.get('/', async (req,res) => {
    try {
        const allCategories = await db.Category.find({});
        const context = {
            categories: allCategories,
        };
        res.render('index.ejs', context);
    } catch (error) {
        console.log(error);
        res.send('Internal Server Error');
    }
});

//Test Route
app.get('/testing', (req, res) => {
    res.render('testing/testview.ejs');
})

// Category routes
app.use('/categories', controllers.category);

// Tool routes
app.use('/tools', controllers.tool);

// User routes
app.use('/users', controllers.user);

/* Server Listener */
app.listen(PORT, () => {
    console.log(`Server is live and listening on http://localhost:${PORT}`);
});
