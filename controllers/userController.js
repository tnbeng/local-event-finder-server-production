const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const cloudinary=require('cloudinary');
const transporter=require('../config/emailTransporter');
const { error } = require('console');

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user= await User.findOne({email:email});
  if(user)
  {
    res.status(400).json({message:'Email is already registered.Please login or use another email.'})
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role:user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' }),
    });
  } catch (error) {
    console.log("Error occured while saving received data",error.message)
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
      role:user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' }),
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
//Update user
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;

    // If a new profile image is provided
    if (req.file) {
      // Check if there's an existing profile picture and delete it from Cloudinary
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId); // Delete old image
      }

      // Save new image details (URL and public_id from Cloudinary)
      user.imageUrl = req.file.path;
      user.imagePublicId = req.file.filename;
    }

    const savedUser= await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error("Server error while updating user profile:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


//admin anly

//delete one user 
exports.deleteUser = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has an image, delete it from Cloudinary
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId); // Deletes the image from Cloudinary
    }

    // Delete the user from the database
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and associated profile image deleted successfully' });
  } catch (error) {
    console.error('Error occurred while deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};


//Get all users 
exports.getAllUsers= async (req,res)=>{
  try {
    const users= await User.find().select('-password');
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message: 'Error occured while finding all users from database'})
  }
}

//password-reset request
exports.passwordResetRequest=async (req,res)=>{
    try {
      const {email}=req.body;
      const user=await User.findOne({email});
      if(!user)
      {
        return res.json({message:'User not found'});
      }
      const token=jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const mailOption={
        from:process.env.EMAIL_USER,
        to:user.email,
        subject:'Password Reset',
        text:`You requested a password reset. Click the link to reset your password: 
           ${process.env.FRONTEND_URL}/reset-password/${token}`
      }
      transporter.sendMail(mailOption)
      return res.json({message:'Password reset link sent to your email successfully'})
    } catch (error) {
      console.log("Error occured sending password reset link email ");
      return res.json({message:'Internal server error'})
    }
}

//password reset
exports.passwordReset=async(req,res)=>{
  try {
    const {token, newPassword}=req.body;
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user= await User.findById(decoded.id);
    if(!user)
    {
      return res.json({message:"Invalid or expired token"});
    }
    user.password=await bcrypt.hash(newPassword,10);
    await user.save();
    return res.json({message:'Password has been reset successfully'})
  } catch (error) {
    console.log("Error occured changing password",error.message);
    return res.json({message:"Internal server error"});
  }
}


