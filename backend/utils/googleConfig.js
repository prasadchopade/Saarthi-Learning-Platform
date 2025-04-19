// Only the OAuth2 client is needed here. The full `googleapis` package pulls in
// every Google API surface and costs about 89MB of RSS on startup, which was
// enough to push the server past the memory limit of a small instance.
// `google-auth-library` is the package googleapis itself uses for this, at
// roughly a fifth of the footprint.
const { OAuth2Client } = require('google-auth-library');

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

module.exports = { oauth2Client };
