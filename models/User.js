const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {type: String, required: true, unique: true},
        location: {type: String, required: true},
        politicalAffiliation: {type: String},
        email: {type: String, required: true, unique: true},
        pw: {type: String, required: true},
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }],
    },
    {timestamps: true},
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
