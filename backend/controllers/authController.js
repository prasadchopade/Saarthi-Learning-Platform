const UserModel = require('../models/userModel');
const WaitlistModel = require('../models/waitlistModel');
const { oauth2Client } = require('../utils/googleConfig');

const axios = require('axios');
const jwt = require('jsonwebtoken');

function parseJwtTimeout(timeout) {
  const match = timeout.match(/(\d+)([dhms])/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
    default: return 0;
  }
}

const isAuthenticated = async (req, res) => {
  try {
    let token = req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(" ")[1];
      }
    }
    
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({ isAuthenticated: false });
    }
    
    res.status(200).json({ isAuthenticated: true });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ isAuthenticated: false });
  }
}

const googleLogin = async (req, res) => {
  try {
    const code = req.query.code;
    let signup = false;
    const googleRes = await oauth2Client.getToken(code);


    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    let user = await UserModel.findOne({ email });

    if (!user) {
      // The waitlist gate is how the beta was run: an address had to be
      // approved before it could sign in. Set REQUIRE_WAITLIST=false to let
      // anyone sign in with Google, which is what a public demo needs.
      const requireWaitlist = process.env.REQUIRE_WAITLIST !== 'false';
      const waitlist = requireWaitlist ? await WaitlistModel.findOne({ email }) : null;

      if (requireWaitlist && !waitlist) {
        return res.status(400).json({ message: 'Please join the waitlist to login', action: 'waitlist' });
      }

      if (requireWaitlist && !waitlist.approved) {
        return res.status(400).json({ message: 'Your email is not approved yet. Please wait for approval' });
      }

      user = await UserModel.create({ name, email, image: picture });
      signup = true;
    }

    const { id } = user;
    const jwtTimeout = process.env.JWT_TIMEOUT || '1d';
    const token = jwt.sign(
      { _id: id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: jwtTimeout
      }
    );
    const maxAgeMs = parseJwtTimeout(jwtTimeout);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAgeMs
    });

    res.status(200).json({
      message: 'Success',
      user,
      signup

    });
    
    return res;

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
}



const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.status(200).json({ 
      message: 'Logged out successfully',
      isAuthenticated: false 
    });
  } catch (err) {
    console.error('Logout failed:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      isAuthenticated: false 
    });
  }
}

module.exports = { googleLogin, isAuthenticated, logout }