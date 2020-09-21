const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {type: String, required: true, unique: true},
        politicalAffiliation: {type: String},
        location: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        pw: {type: String, required: false},
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }],
    },
    {timestamps: true},
)

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
