const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Data received ",name)
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
    });
  } catch (error) {
    console.log("Error occured while saving received data")
    res.status(400).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }),
    });
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(400).json({ message: error.message });
  }
};


// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      const events = await Event.find({ user: req.user.id });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user,events });
  } catch (error) {
      console.error("Server error while retrieving user profile:", error);
      res.status(500).json({ message: 'Server Error while finding specific user ' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
      const { name, email } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.name = name || user.name;
      user.email = email || user.email;

      await user.save();

      res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
      console.error("Server error while updating user profile:", error);
      res.status(500).json({ message: 'Server Error' });
  }
};



