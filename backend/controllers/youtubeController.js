const Discipline = require('../models/topicModel');
const youtubeService = require('../services/youtubeService');

exports.initializeTopics = async (req, res) => {
  try {
    const disciplines = [
      {
        name: "Computer Science & IT",
        topics: [
          { name: "Artificial Intelligence" },
          { name: "Machine Learning & Deep Learning" },
          { name: "Quantum Computing" },
          { name: "Cybersecurity & Ethical Hacking" },
          { name: "Blockchain Technology" },
          { name: "Internet of Things (IoT)" },
          { name: "Cloud Computing & DevOps" },
          { name: "Augmented Reality & Virtual Reality" },
          { name: "Software Engineering & Agile Development" },
          { name: "Data Structures & Algorithms" }
        ]
      },
      {
        name: "Mathematics",
        topics: [
          { name: "Abstract Algebra" },
          { name: "Topology & Geometry" },
          { name: "Number Theory" },
          { name: "Statistics & Probability" },
          { name: "Discrete Mathematics" },
          { name: "Mathematical Modeling" },
          { name: "Cryptography" },
          { name: "Computational Mathematics" },
          { name: "Fractals & Chaos Theory" }
        ]
      },
      {
        name: "Natural Sciences",
        topics: [
          { name: "Quantum Physics" },
          { name: "Astrophysics & Cosmology" },
          { name: "Molecular Biology" },
          { name: "Genetics & Genomics" },
          { name: "Environmental Science" },
          { name: "Geology & Earth Sciences" },
          { name: "Marine Biology" },
          { name: "Meteorology & Climate Science" },
          { name: "Biochemistry" },
          { name: "Nanotechnology" }
        ]
      },
      {
        name: "Social Sciences",
        topics: [
          { name: "Sociology & Social Dynamics" },
          { name: "Cultural Anthropology" },
          { name: "Political Science & International Relations" },
          { name: "Psychology & Behavioral Studies" },
          { name: "Behavioral Economics" },
          { name: "Criminology & Forensic Science" },
          { name: "Urban Studies & Planning" },
          { name: "Educational Sociology" }
        ]
      },
      {
        name: "Humanities & Arts",
        topics: [
          { name: "Philosophy & Ethics" },
          { name: "Literature & Comparative Studies" },
          { name: "Art History & Visual Culture" },
          { name: "Music Theory & Composition" },
          { name: "Creative Writing & Storytelling" },
          { name: "Film Studies & Media Criticism" },
          { name: "Theatre & Performance Arts" },
          { name: "Linguistics & Language Evolution" },
          { name: "Cultural Criticism & Critique" }
        ]
      },
      {
        name: "Business & Economics",
        topics: [
          { name: "Entrepreneurship & Startup Management" },
          { name: "Financial Markets & Investment Strategies" },
          { name: "Digital Marketing & SEO" },
          { name: "Behavioral Finance" },
          { name: "Supply Chain & Operations Management" },
          { name: "International Business & Trade" },
          { name: "Economic Policy & Global Economics" },
          { name: "Sustainable Business Practices" },
          { name: "Project Management" }
        ]
      },
      {
        name: "Interdisciplinary & Emerging Fields",
        topics: [
          { name: "Data Science & Big Data Analytics" },
          { name: "Bioinformatics & Computational Biology" },
          { name: "Cognitive Robotics" },
          { name: "Ethics in Technology" },
          { name: "Digital Humanities" },
          { name: "Smart Cities & Urban Tech" },
          { name: "Virtual Reality in Education" },
          { name: "Augmented Analytics" },
          { name: "Social Media & Digital Culture" }
        ]
      }
      // Additional disciplines can be added here
    ];

    await Discipline.insertMany(disciplines);

    res.status(200).json({
      success: true,
      message: "Topics initialized successfully",
      count: disciplines.length
    });
  } catch (error) {
    console.error('Error initializing topics:', error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize topics",
      error: error.message
    });
  }
};

// Get all disciplines with topics
exports.getDisciplines = async (req, res) => {
  try {
    const disciplines = await Discipline.find().select('-__v');
    
    res.status(200).json({
      success: true,
      disciplines
    });
  } catch (error) {
    console.error('Error fetching disciplines:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch disciplines",
      error: error.message
    });
  }
};

// Get videos for a specific topic
exports.getTopicVideos = async (req, res) => {
  try {
    const { discipline, topic } = req.params;
    
const videos = await youtubeService.getTopicVideos(topic);
    
    res.status(200).json({
      success: true,
      videos,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching topic videos:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch topic videos",
      error: error.message
    });
  }
};

exports.searchVideos = async (req, res) => {
  const searchQuery = req.query.q;
  try {
      const videos = await youtubeService.searchVideos(searchQuery);
      res.json({ videos });
  } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).send('Error fetching videos');
  }
};