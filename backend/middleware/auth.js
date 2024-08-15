const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
      if (error.name === 'TokenExpiredError') {
        // Token has expired, try to refresh it
        const refreshToken = req.header('Refresh-Token');
        if (!refreshToken) {
          return res.status(401).json({ message: 'Token expired, please log in again' });
        }

        try {
          const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
          const user = await User.findById(decoded.id).select('-password');

          if (!user) {
            return res.status(401).json({ message: 'User not found' });
          }

          const newToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.setHeader('New-Token', newToken);

          req.user = user;
          req.token = newToken;
          next();
        } catch (refreshError) {
          return res.status(401).json({ message: 'Invalid refresh token, please log in again' });
        }
      } else {
        return res.status(401).json({ message: 'Token is not valid' });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = auth;