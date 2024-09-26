const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, default: '' }, 
    imagePublicId: { type: String, default: '' }, 
    role:{type:String,enum:['user','admin'],default:'user'},
    interestedCategories: { type: [String], default: ['Music'] }
});

module.exports = mongoose.model('User', userSchema);
