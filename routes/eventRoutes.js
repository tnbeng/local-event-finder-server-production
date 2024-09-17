const express = require('express');
const { getEvents, getEvent, createEvent, searchEvents, deleteEvent, updateEvent } = require('../controllers/eventController');
const  protect = require('../middleware/authMiddleware');
const upload=require('../config/cloudinary')

const router = express.Router();

router.get('/search', searchEvents);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, upload.single('image'), createEvent);
router.delete('/:id',protect,deleteEvent);
router.put('/:id', protect, updateEvent);  // Add this line for updating events




module.exports = router;
