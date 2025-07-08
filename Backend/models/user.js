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
        enum: ['student', 'admin'], // Restrict values to 'student' or 'admin'
        default: 'student'
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

// Pre-save hook to hash password before saving to database
/*  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);-->
*/

module.exports = mongoose.model('User', userSchema);