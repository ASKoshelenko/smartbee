const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token has expired
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: 'Token has expired, please login again' });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = auth;