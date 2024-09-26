const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event:{ type: mongoose.Schema.Types.ObjectId, ref:'Event', required: true},
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }, // To track if notification has been read
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
