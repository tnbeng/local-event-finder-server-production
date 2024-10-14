const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers, deleteUser, passwordResetRequest, passwordReset } = require('../controllers/userController');
const router = express.Router();
const  protect = require('../middleware/authMiddleware');
const { deleteEvent } = require('../controllers/eventController');
const { admin } = require('../middleware/admin');
const upload = require('../config/cloudinary');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, upload.single('image'), updateUserProfile);
router.route('/profile/event/:eventId').delete(protect, deleteEvent);

router.get('/all',protect,admin,getAllUsers);
router.delete('/:id',protect,admin,deleteUser);

router.post('/password-reset-request',passwordResetRequest);
router.post('/password-reset',passwordReset);

module.exports = router;

