const express = require('express');
const app = express();
const PORT = 4000;

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.static('public'));
//const path = require('path');
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));

const db = require('./models');
const controllers = require('./controllers');

app.listen(PORT, () => {
    console.log('greetings your port is '+PORT);
})

app.get('/', (req,res) => {
    res.send('you have reached the home folder');
})

app.get('/swordfish', (req, res) => {
    res.send('poke poke');
})
