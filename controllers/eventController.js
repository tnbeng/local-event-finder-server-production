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
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      user: req.user._id, // Associate the event with the logged-in user
    });
    res.status(201).json(event);
  } catch (error) {
    console.log("Error occured while creating an event: ",error)
    res.status(400).json({ message: error.message });
  }
};

//Search Events
exports.searchEvents = async (req, res) => {
  const { keyword, category, date, location } = req.query;
  let query = {};

  if (keyword) {
      query.title = { $regex: keyword, $options: 'i' }; // Case-insensitive search
  }
  if (category) {
      query.category = category;
  }
  if (date) {
      query.date = { $gte: new Date(date) }; // Find events on or after the date
  }
  if (location) {
      query.location = location;
  }

  try {
      const events = await Event.find(query);
      res.json(events);
  } catch (error) {
      res.status(500).json({ message: 'Server Error' });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);

      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      if (event.user.toString() !== req.user.id) {
          return res.status(401).json({ message: 'Not authorized to delete this event' });
      }

      await event.deleteOne({_id:req.params.id});

      res.status(200).json({ message: 'Event removed successfully' });
  } catch (error) {
      console.log("Error occured while deleting event ",error)
      res.status(500).json({ message: 'Server Error' });
  }
};

