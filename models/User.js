const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, default: '' }, 
    imagePublicId: { type: String, default: '' }, 
});

module.exports = mongoose.model('User', userSchema);
