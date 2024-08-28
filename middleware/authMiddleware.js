// ./middleware/authMiddleware.js
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const User = require('../models/User');

module.exports=async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id)
     
     next();
    } catch (error) {
      res.status(401).json({message:'Not authorized, token varify failed'});
      console.log("Error occured while token varifing token",error);
      return;
    }
  }
 
  if (!token) {
    res.status(401).json({message:'Token not present'});
    return;
  }

};
