const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 5000;

// Database connection
require('./models/dbConnection');

// Middleware
// FRONTEND_URL takes a comma-separated list so the deployed site, Vercel
// preview builds and local development can all talk to the same API.
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
   .split(',')
   .map((origin) => origin.trim())
   .filter(Boolean);

app.use(cors({
   origin: (origin, callback) => {
      // Same-origin and server-to-server calls arrive with no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Any Vercel preview deployment of this project.
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
   },
   credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set('trust proxy', 1)
app.use(morgan('dev'));

// Routes
const notebookRoutes = require('./routes/notebookRoutes');
const authRoutes = require('./routes/authRoutes');
const waitlistRoutes = require('./routes/waitlistRoutes');
const compilerRoutes = require('./routes/codeCompilerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const videoRoutes = require('./routes/videoRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const presentationRoutes = require('./routes/presentationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const ttsRoutes = require('./routes/ttsRoutes');

app.use('/api/notebook', notebookRoutes);
app.use('/api/googleauth', authRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/presentations', presentationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tts', ttsRoutes);
app.get('/', (req, res) => {
   res.send("I'm live!!");
});

// Used by the host's health check and by the keep-alive ping.
app.get('/health', (req, res) => {
   res.json({ status: 'ok', uptime: process.uptime() });
});

// Start the server
// Express 4 does not catch a rejection thrown out of an async handler, and an
// unhandled rejection terminates the process - taking the API down for every
// user because of one bad request. Log it and keep serving.
process.on('unhandledRejection', (reason) => {
   console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
   console.error('Uncaught exception:', error);
});

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
