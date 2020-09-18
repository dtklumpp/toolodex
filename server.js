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

/* Routes */
// index view
app.get('/', (req,res) => {
    res.render('index.ejs');
});

//Test Route
app.get('/testing', (req, res) => {
    res.render('testing/testview.ejs');
})

// Category routes
app.use('/categories', controllers.category);

// Tool routes
app.use('/tools', controllers.tool);

/* Server Listener */
app.listen(PORT, () => {
    console.log(`Server is live and listening on http://localhost:${PORT}`);
});