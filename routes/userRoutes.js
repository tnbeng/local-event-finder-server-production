const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const router = express.Router();
const  protect = require('../middleware/authMiddleware');
const { deleteEvent } = require('../controllers/eventController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/profile/event/:eventId').delete(protect, deleteEvent);

module.exports = router;
