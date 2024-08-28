const express = require('express');
const { getEvents, getEvent, createEvent, searchEvents, deleteEvent } = require('../controllers/eventController');
const  protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/search', searchEvents);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, createEvent);
router.delete('/:id',protect,deleteEvent);



module.exports = router;
