// models/Event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' }, // URL of the uploaded image
    imagePublicId: { type: String, default: '' }, // Cloudinary public_id
    user: { // Reference to the User who created the event
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);
