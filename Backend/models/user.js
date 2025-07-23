const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        //unique: true,
        trim: true // Remove whitespace from both ends of a string
    },
     lastName: {
        type: String,
        //required: true,
       // unique: true,
        trim: true // Remove whitespace from both ends of a string
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Store emails in lowercase
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'], 
        default: 'student'
    },

    isGoogleAuth: { 
    type: Boolean,
    default: false
  },


    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Mongoose will automatically manage createdAt and updatedAt fields
});



module.exports = mongoose.model('User', userSchema);