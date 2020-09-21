const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema(
    {
        name: {type: String, required: [true, "You must give your category a name."], unique: [true, "This category already exists."]},
        description: String,
        tools: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tool',
            },
        ],
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    },
    {timestamps: true},
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
