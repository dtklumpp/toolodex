const mongoose = require('mongoose');
require('dotenv').config();


const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then( () => {
    console.log('MongoDB is connected.');
}).catch( (error) => {
    console.log('MongoDB connection error: ', error);
});

mongoose.connection.on('disconnected', () => {
    console.log("MongoDB is disconnected.");
});

module.exports = {
    Tool: require('./Tool.js'),
    Category: require('./Category.js'),
    User: require('./User.js'),
}
