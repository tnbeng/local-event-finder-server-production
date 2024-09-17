const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const router = express.Router();
const  protect = require('../middleware/authMiddleware');
const { deleteEvent } = require('../controllers/eventController');
const { admin } = require('../middleware/admin');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/profile/event/:eventId').delete(protect, deleteEvent);

router.get('/all',protect,admin,getAllUsers);
router.delete('/:id',protect,admin,deleteUser);

module.exports = router;
