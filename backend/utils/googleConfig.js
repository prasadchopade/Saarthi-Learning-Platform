const { google } = require('googleapis');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const Redirect_URL = process.env.GOOGLE_REDIRECT_URL;

oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  Redirect_URL,
);

module.exports = {oauth2Client}