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
app.use(cors({
   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
app.get('/', (req,res)=> {
   res.send("I'm live!!");
})

// Start the server
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
