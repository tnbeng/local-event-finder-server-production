const Event = require('../models/Event');

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Single Event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create Event
exports.createEvent = async (req, res) => {
  const { title, description, date, location, category } = req.body;
  try {
    const event = await Event.create({ title, description, date, location, category });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  res.json({m:"test success"})
};
