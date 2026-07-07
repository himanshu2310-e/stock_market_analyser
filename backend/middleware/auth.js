const jwt = require('jsonwebtoken');
const store = require('../utils/jsonStore');

const USERS_FILE = 'users.json';

/**
 * Protect routes — verifies Bearer JWT and attaches req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized — no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await store.findById(USERS_FILE, decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });
    }

    /* Attach user without password */
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ success: false, message: 'Token expired' });
    }
    return res
      .status(500)
      .json({ success: false, message: 'Authentication error' });
  }
};

module.exports = { protect };
