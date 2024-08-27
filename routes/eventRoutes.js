const express = require('express');
const { getEvents, getEvent, createEvent } = require('../controllers/eventController');
const  protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, createEvent);

module.exports = router;
