const Event = require('../models/Event');

// Get All Events   //this is not required since we are working with searchEvents functionality for finding all events ( by empty objects)
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

// Update Event
exports.updateEvent = async (req, res) => {
  const { title, description, date, location, category } = req.body;

  try {
    // Find the event by ID
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is authorized to update this event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this event' });
    }

    // Update event fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;

    // Save the updated event
    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error occurred while updating event:", error);
    res.status(400).json({ message: 'Error updating event' });
  }
};

