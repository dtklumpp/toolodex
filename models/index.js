const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/toolodex';

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

mongoose.connection.on('disconnected', (event) => {
    console.log("MongoDB is disconnected.", event);
});

module.exports = {
    Tool: require('./Tool.js'),
    Category: require('./Category.js'),
}
