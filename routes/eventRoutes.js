
const express = require('express');
const {
    getEvents,
    getEvent,
    createEvent,
    searchEvents,
    deleteEvent,
    updateEvent,
    getEventNotifications,
    marksNotificationsAsRead
} = require('../controllers/eventController');

const protect = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

const router = express.Router();

// Search Events
router.get('/search', searchEvents);

// Get All Events
router.get('/', getEvents);

// Get Single Event
router.get('/:id', getEvent);

// Create Event - Emit notification via Socket.IO
router.post('/', protect, upload.single('image'), createEvent); 

// Delete Event
router.delete('/:id', protect, deleteEvent);

// Update Event
router.put('/:id',upload.single('image'), protect, updateEvent); 

// Get Notifications for User
router.get('/notifications/:userId', getEventNotifications);

// Mark Notifications as Read
router.put('/notifications/:userId/mark-as-read', marksNotificationsAsRead);

module.exports = router;
