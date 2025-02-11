const rateLimit = require('express-rate-limit');

const waitlistLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: 'Too many requests from this IP, please try again after 30 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  // No custom keyGenerator: reading x-forwarded-for / true-client-ip straight
  // from the headers let any client forge an IP and skip the limit entirely.
  // The default keys on req.ip, which Express derives using the app's
  // 'trust proxy' setting and cannot be spoofed past the trusted hop.
});

module.exports = { waitlistLimiter };