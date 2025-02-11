const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Discipline = require('../models/topicModel');

// Load environment variables
dotenv.config();

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error('❌ DB_URL environment variable is not set');
  process.exit(1);
}

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
];

async function resetDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(DB_URL);
    console.log('✅ Connected to MongoDB');

    // Get the database name from the connection string
    const dbName = mongoose.connection.db.databaseName;
    console.log(`🗑️  Dropping database: ${dbName}`);

    // Drop the entire database
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database dropped successfully');

    console.log('🔄 Initializing topics...');
    
    // Insert the disciplines
    const result = await Discipline.insertMany(disciplines);
    
    console.log(`✅ Successfully initialized ${result.length} disciplines with topics`);
    
    // Log summary
    const totalTopics = result.reduce((sum, discipline) => sum + discipline.topics.length, 0);
    console.log(`📊 Summary:`);
    console.log(`   - Disciplines: ${result.length}`);
    console.log(`   - Total Topics: ${totalTopics}`);
    
    console.log('🎉 Database reset and initialization completed successfully!');

  } catch (error) {
    console.error('❌ Error during database reset:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Process interrupted. Closing database connection...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Process terminated. Closing database connection...');
  await mongoose.connection.close();
  process.exit(0);
});

// Run the script
resetDatabase();
