
const mongoose = require('mongoose');
const { tool } = require('../controllers');
const Schema = mongoose.Schema;

const toolSchema = new Schema({
    name: {type: String, required: true},
    link: {type: String, required: true},
    description: String,
    notes: String,
    //keywords: [{type: String}],  STRETCH FEATURE
    //category: String,  STRETCH FEATURE
}, {
    timestamps: true,
})

const toolModel = mongoose.model('Tool', toolSchema);
module.exports = {
    Tool: toolModel
}
