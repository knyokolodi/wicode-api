const mongoose = require('mongoose');

const postSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    message: {type: String, required: true},
    postImage: {type: String, required: true},
    creationDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Post', postSchema);