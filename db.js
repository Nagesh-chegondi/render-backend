const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Todo Schema
const Todo = new Schema({
    titles: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false, // Set a default value for 'status'
    },
    userId: {
        type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId for better readability
        required: true,
        ref: 'users', // Add a reference to the 'users' collection
    },
});

const userModel = mongoose.model('users', User);
const todoModel = mongoose.model('todos', Todo);

module.exports = {
    userModel: userModel,
    todoModel: todoModel,
};

