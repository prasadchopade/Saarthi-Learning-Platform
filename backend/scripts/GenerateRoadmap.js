const mongoose = require('mongoose');
const Roadmap = require('../models/RoadmapSchema');
const { getGeminiModel } = require('../utils/geminiConfig');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error('DB_URL is not set. Copy backend/.env.example to backend/.env first.');
    }
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Roadmap configurations for different domains
const roadmapConfigs = [
  // Technology Domain
  {
    title: "Complete Web Development Roadmap",
    description: "A comprehensive guide covering frontend, backend, and full-stack web development",
    domain: "Technology",
    subdomain: "Web Development"
  },
  {
    title: "Data Science Mastery Path",
    description: "Learn data analysis, machine learning, and AI from scratch",
    domain: "Technology",
    subdomain: "Data Science"
  },
  {
    title: "Mobile App Development Guide",
    description: "Complete roadmap for iOS and Android app development",
    domain: "Technology",
    subdomain: "Mobile Development"
  },
  {
    title: "Cybersecurity Fundamentals",
    description: "Learn ethical hacking, network security, and digital forensics",
    domain: "Technology",
    subdomain: "Cybersecurity"
  },
  {
    title: "Cloud Computing & DevOps",
    description: "Master cloud platforms, containerization, and deployment strategies",
    domain: "Technology",
    subdomain: "Cloud Computing"
  },
  {
    title: "Blockchain & Cryptocurrency",
    description: "Learn blockchain technology, smart contracts, and DeFi",
    domain: "Technology",
    subdomain: "Blockchain"
  },
  
  // Business Domain
  {
    title: "Digital Marketing Strategy",
    description: "Learn SEO, social media marketing, and digital advertising",
    domain: "Business",
    subdomain: "Digital Marketing"
  },
  {
    title: "Project Management Fundamentals",
    description: "Master agile methodologies and project leadership",
    domain: "Business",
    subdomain: "Project Management"
  },
  {
    title: "Entrepreneurship & Startups",
    description: "Learn to build and scale successful businesses",
    domain: "Business",
    subdomain: "Entrepreneurship"
  },
  {
    title: "Financial Analysis & Investment",
    description: "Master financial modeling, analysis, and investment strategies",
    domain: "Business",
    subdomain: "Finance"
  },
  
  // Design Domain
  {
    title: "UI/UX Design Mastery",
    description: "Learn user interface and user experience design principles",
    domain: "Design",
    subdomain: "UI/UX Design"
  },
  {
    title: "Graphic Design Essentials",
    description: "Master visual communication and design software",
    domain: "Design",
    subdomain: "Graphic Design"
  },
  {
    title: "Product Design & Innovation",
    description: "Learn product design thinking and innovation methodologies",
    domain: "Design",
    subdomain: "Product Design"
  },
  
  // Science Domain
  {
    title: "Machine Learning Fundamentals",
    description: "Learn algorithms, neural networks, and AI applications",
    domain: "Science",
    subdomain: "Machine Learning"
  },
  {
    title: "Artificial Intelligence Deep Dive",
    description: "Advanced AI concepts, deep learning, and neural networks",
    domain: "Science",
    subdomain: "Artificial Intelligence"
  },
  {
    title: "Data Analysis & Statistics",
    description: "Master statistical analysis and data interpretation",
    domain: "Science",
    subdomain: "Data Analysis"
  },
  
  // Arts Domain
  {
    title: "Photography Mastery",
    description: "Learn composition, lighting, and post-processing techniques",
    domain: "Arts",
    subdomain: "Photography"
  },
  {
    title: "Digital Art & Illustration",
    description: "Master digital painting, illustration, and creative software",
    domain: "Arts",
    subdomain: "Digital Art"
  },
  {
    title: "Music Production & Audio Engineering",
    description: "Learn music theory, production, and audio engineering",
    domain: "Arts",
    subdomain: "Music Production"
  },
  
  // Language Domain
  {
    title: "English Language Proficiency",
    description: "Complete English learning path from beginner to advanced",
    domain: "Language",
    subdomain: "English Learning"
  },
  {
    title: "Spanish Language Mastery",
    description: "Learn Spanish from basics to fluency",
    domain: "Language",
    subdomain: "Spanish Learning"
  },
  {
    title: "Programming Languages",
    description: "Master multiple programming languages and paradigms",
    domain: "Language",
    subdomain: "Programming Languages"
  },
  
  // Health Domain
  {
    title: "Fitness & Nutrition Science",
    description: "Learn exercise science, nutrition, and wellness",
    domain: "Health",
    subdomain: "Fitness & Nutrition"
  },
  {
    title: "Mental Health & Wellness",
    description: "Understand psychology, mindfulness, and mental wellness",
    domain: "Health",
    subdomain: "Mental Health"
  },
  
  // Education Domain
  {
    title: "Teaching & Pedagogy",
    description: "Learn effective teaching methods and educational psychology",
    domain: "Education",
    subdomain: "Teaching Methods"
  },
  {
    title: "Online Learning & E-Learning",
    description: "Master digital education and online course creation",
    domain: "Education",
    subdomain: "E-Learning"
  }
];

// Generate roadmap using AI
const generateRoadmap = async (config) => {
  try {
    console.log(`\n🔄 Generating roadmap: ${config.title}`);
    
    // Check if roadmap already exists
    const existingRoadmap = await Roadmap.findOne({
      domain: config.domain,
      subdomain: config.subdomain,
      owner: { $exists: false }
    });

    if (existingRoadmap) {
      console.log(`✅ Roadmap already exists: ${existingRoadmap.title}`);
      return existingRoadmap;
    }

    // Get Gemini model
    const model = await getGeminiModel('system');
    
    // Prepare prompt for Gemini
    const prompt = `
    Create a comprehensive learning roadmap for "${config.title}" in the domain of "${config.domain}" and subdomain "${config.subdomain}" with the following details:
    ${config.description ? `Description: ${config.description}` : ''}
    
    This is a general roadmap that should be suitable for learners at the general skill level in this domain.
    The roadmap should follow this structure:
    1. Include sequential topics that cover the essential concepts in this domain/subdomain
    2. Each topic should have adequate subtopics appropriate for the general skill level
    3. Each subtopic should have a name, description, and estimated duration (e.g., "2-3 hours")
    4. Structure the content to be comprehensive yet accessible for the target skill level
    5. Focus on practical, industry-relevant content for this domain
    
    Format the response as a JSON object with this structure:
    {
      "name": "A concise name for the roadmap",
      "topics": [
        {
          "sequence": 1,
          "name": "Topic Name",
          "description": "Brief description of this topic",
          "subtopics": [
            {
              "name": "Subtopic Name",
              "description": "Detailed description of what will be learned",
              "duration": "Estimated time to complete (e.g., '2-3 hours')"
            }
          ]
        }
      ]
    }
    
    Do not include any explanations or markdown, just the JSON object.
    `;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let roadmapData;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/```\n([\s\S]*)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      roadmapData = JSON.parse(jsonString);
    } catch (error) {
      console.error(`❌ Error parsing AI response for ${config.title}:`, error);
      return null;
    }
    
    // Create new roadmap
    const newRoadmap = new Roadmap({
      title: config.title,
      name: roadmapData.name || config.title,
      description: config.description,
      domain: config.domain,
      subdomain: config.subdomain,
      topics: roadmapData.topics || []
    });

    const savedRoadmap = await newRoadmap.save();
    console.log(`✅ Successfully created roadmap: ${savedRoadmap.title}`);
    return savedRoadmap;

  } catch (error) {
    console.error(`❌ Error generating roadmap for ${config.title}:`, error.message);
    return null;
  }
};

// Main function to generate all roadmaps
const generateAllRoadmaps = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting roadmap generation process...');
    console.log(`📋 Total roadmaps to generate: ${roadmapConfigs.length}`);
    
    const results = [];
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < roadmapConfigs.length; i++) {
      const config = roadmapConfigs[i];
      console.log(`\n📊 Progress: ${i + 1}/${roadmapConfigs.length}`);
      
      const result = await generateRoadmap(config);
      
      if (result) {
        if (result.isNew) {
          successCount++;
        } else {
          skipCount++;
        }
        results.push({ config, result, status: 'success' });
      } else {
        errorCount++;
        results.push({ config, result: null, status: 'error' });
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Summary
    console.log('\n🎉 Roadmap generation completed!');
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ⏭️  Already existed: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📈 Total processed: ${roadmapConfigs.length}`);

    // Show domain distribution
    const domainStats = {};
    results.forEach(({ config, status }) => {
      if (status === 'success' || status === 'skip') {
        domainStats[config.domain] = (domainStats[config.domain] || 0) + 1;
      }
    });

    console.log('\n📊 Domain Distribution:');
    Object.entries(domainStats).forEach(([domain, count]) => {
      console.log(`   ${domain}: ${count} roadmaps`);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Function to generate specific domain roadmaps
const generateDomainRoadmaps = async (domain) => {
  try {
    await connectDB();
    
    const domainConfigs = roadmapConfigs.filter(config => 
      config.domain.toLowerCase() === domain.toLowerCase()
    );
    
    if (domainConfigs.length === 0) {
      console.log(`❌ No roadmaps found for domain: ${domain}`);
      console.log('Available domains:', [...new Set(roadmapConfigs.map(c => c.domain))]);
      return;
    }
    
    console.log(`🚀 Generating roadmaps for domain: ${domain}`);
    console.log(`📋 Roadmaps to generate: ${domainConfigs.length}`);
    
    for (const config of domainConfigs) {
      await generateRoadmap(config);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Command line interface
const main = () => {
  const args = process.argv.slice(2);
  const command = args[0];
  const domain = args[1];

  console.log('🎯 Roadmap Generation Script');
  console.log('============================');

  if (command === 'domain' && domain) {
    generateDomainRoadmaps(domain);
  } else if (command === 'all' || !command) {
    generateAllRoadmaps();
  } else {
    console.log('Usage:');
    console.log('  node GenerateRoadmap.js [all]           - Generate all roadmaps');
    console.log('  node GenerateRoadmap.js domain <name>   - Generate roadmaps for specific domain');
    console.log('');
    console.log('Available domains:');
    const domains = [...new Set(roadmapConfigs.map(c => c.domain))];
    domains.forEach(d => console.log(`  - ${d}`));
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  generateAllRoadmaps,
  generateDomainRoadmaps,
  roadmapConfigs
};
