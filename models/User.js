const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {type: String, required: true, unique: true},
        location: {type: String, required: true},
        politicalAffiliation: {type: String},
        email: {type: String},
        password: {type: String, required: true},
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }],
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    {timestamps: true},
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
