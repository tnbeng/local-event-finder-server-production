
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];
      // Verify the token  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);


      // Find the user by ID from the decoded token
      req.user = await User.findById(decoded.id);

      // If the user is not found, send a 401 error
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.log("Error occurred while verifying token:", error.message);
      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  } else {
    // If no token is present, send a 401 error
    res.status(401).json({ message: 'Token not present' });
  }
};


