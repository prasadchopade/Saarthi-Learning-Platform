const Roadmap = require('../models/RoadmapSchema');
const UserRoadmapProgress = require('../models/userRoadmapProgressModel');
const { getGeminiModel } = require('../utils/geminiConfig');
const { generatePdfFromMarkdown } = require('../utils/pdfGenerator');

// Get all roadmaps (grouped by domain and subdomain)
const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({
      domain: { $exists: true, $ne: null },
      subdomain: { $exists: true, $ne: null }
    }).select('title domain subdomain');

    const groupedRoadmaps = roadmaps.reduce((acc, roadmap) => {
      const domain = roadmap.domain;
      const subdomain = roadmap.subdomain;

      // Find or create domain group
      let domainGroup = acc.find(group => group.domain === domain);
      if (!domainGroup) {
        domainGroup = { domain, subdomains: [] };
        acc.push(domainGroup);
      }

      // Find or create subdomain group
      let subdomainGroup = domainGroup.subdomains.find(group => group.subdomain === subdomain);
      if (!subdomainGroup) {
        subdomainGroup = { subdomain, roadmaps: [] };
        domainGroup.subdomains.push(subdomainGroup);
      }

      // Add roadmap to subdomain
      subdomainGroup.roadmaps.push({
        id: roadmap._id,
        title: roadmap.title,
        name: roadmap.name
      });

      return acc;
    }, []);

    res.status(200).json(groupedRoadmaps);
  } catch (error) {
    console.error('Error getting roadmaps:', error);
    res.status(500).json({ message: 'Failed to get roadmaps', error: error.message });
  }
};

// Get user's roadmaps
const getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ owner: req.user._id })
      .select('title description learningType skillLevel deadline createdAt')
      .sort({ createdAt: -1 });

    const formattedRoadmaps = roadmaps.map(roadmap => ({
      id: roadmap._id,
      title: roadmap.title,
      description: roadmap.description,
      learningType: roadmap.learningType,
      skillLevel: roadmap.skillLevel,
      deadline: roadmap.deadline,
      createdAt: roadmap.createdAt
    }));

    res.status(200).json(formattedRoadmaps);
  } catch (error) {
    console.error('Error getting user roadmaps:', error);
    res.status(500).json({ message: 'Failed to get your roadmaps', error: error.message });
  }
};

// Create a new roadmap
const createRoadmap = async (req, res) => {
  try {
    const { title, description, learningType, skillLevel, deadline, dailyHours, goalCareer, hobby, certification, project, learnForFun } = req.body;
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const duration = daysDiff * dailyHours;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Get Gemini model for the user
    const model = await getGeminiModel(req.user._id);

    // Prepare prompt for Gemini
    const prompt = `
    Create a detailed personalised learning roadmap for "${title}" with the following details:
    ${description ? `Description: ${description}` : ''}
    ${learningType ? `Learning Type: ${learningType}` : ''}
    ${skillLevel ? `Skill Level: ${skillLevel}` : ''}
    ${dailyHours ? `Daily Hours Available: ${dailyHours} hours per day` : ''}
    ${deadline ? `Deadline (in hours): ${duration}` : ''}
    
    ${goalCareer ? `Career Goal: ${goalCareer}` : ''}
    ${hobby ? `Hobby Details: ${hobby}` : ''}
    ${certification ? `Certification: ${certification}` : ''}
    ${project ? `Project Description: ${project}` : ''}
    ${learnForFun ? `Learning Interest: ${learnForFun}` : ''}
    
    Based on this info, the roadmap should follow this structure and should be able to be completed within the deadline:
    1. Include sequential topics that are personalised to the user's specific goals and available time
    2. Each topic should have adequate subtopics as per the user's skill level, learning type, and daily time commitment
    3. Each subtopic should have a name, description, and estimated duration (e.g., "2-3 hours")
    4. The total duration of the roadmap should be less than or equal to the deadline
    5. Consider the daily hours available when structuring the learning pace
    6. Personalize content based on the specific learning purpose (career goal, hobby, certification, project, or fun learning)
    
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
      console.error('Error parsing Gemini response:', error);
      return res.status(500).json({ message: 'Failed to parse AI response', error: error.message });
    }

    const newRoadmap = new Roadmap({
      title,
      name: roadmapData.name || title,
      description,
      learningType,
      skillLevel,
      deadline: deadline ? new Date(deadline) : null,
      owner: req.user._id,
      topics: roadmapData.topics || []
    });

    const savedRoadmap = await newRoadmap.save();

    res.status(201).json({
      id: savedRoadmap._id,
      title: savedRoadmap.title,
      name: savedRoadmap.name,
      description: savedRoadmap.description,
      learningType: savedRoadmap.learningType,
      skillLevel: savedRoadmap.skillLevel,
      deadline: savedRoadmap.deadline,
      topics: savedRoadmap.topics
    });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ message: 'Failed to generate roadmap', error: error.message });
  }
};

// Get roadmap by ID
const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { domain: { $exists: true, $ne: null } },
        { subdomain: { $exists: true, $ne: null } }
      ]
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    let isOwner = false;
    if (req.user) {
      isOwner = roadmap.owner?.toString() === req.user._id.toString();
    }
    const isPublic = roadmap.domain && roadmap.subdomain;

    if (!isOwner && !isPublic) {
      return res.status(403).json({ message: 'You do not have permission to view this roadmap' });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    console.error('Error getting roadmap:', error);
    res.status(500).json({ message: 'Failed to get roadmap', error: error.message });
  }
};

// Delete roadmap
const deleteRoadmap = async (req, res) => {
  try {
    const roadmapId = req.params.id;

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Check if user is the owner
    if (roadmap.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to delete this roadmap' });
    }

    await Roadmap.findByIdAndDelete(roadmapId);

    res.status(200).json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    res.status(500).json({ message: 'Failed to delete roadmap', error: error.message });
  }
};

// Get roadmap progress
const getRoadmapProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user._id;

    // Get the roadmap
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      $or: [
        { owner: userId },
        { domain: { $exists: true, $ne: null } },
        { subdomain: { $exists: true, $ne: null } }
      ]
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Find or create user progress for this roadmap
    let userProgress = await UserRoadmapProgress.findOne({
      user: userId,
      roadmapId: roadmapId
    });

    if (!userProgress) {
      userProgress = new UserRoadmapProgress({
        user: userId,
        roadmapId: roadmapId,
        completedSubtopics: [],
        lastAccessed: new Date()
      });
      await userProgress.save();
    } else {
      userProgress.lastAccessed = new Date();
      await userProgress.save();
    }

    const progress = {
      roadmapId: roadmap._id,
      completedSubtopics: userProgress.completedSubtopics.map(item => ({
        subtopicId: item.subtopicId,
        completedAt: item.completedAt
      })),
      totalSubtopics: 0,
      percentComplete: 0
    };

    // Count total subtopics and calculate percentage
    if (roadmap.topics && roadmap.topics.length > 0) {
      let totalSubtopicsCount = 0;

      roadmap.topics.forEach(topic => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          totalSubtopicsCount += topic.subtopics.length;
        }
      });

      progress.totalSubtopics = totalSubtopicsCount;

      if (totalSubtopicsCount > 0) {
        progress.percentComplete = Math.round(
          (userProgress.completedSubtopics.length / totalSubtopicsCount) * 100
        );
      }
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error getting roadmap progress:', error);
    res.status(500).json({ message: 'Failed to get roadmap progress', error: error.message });
  }
};

// Update subtopic progress
const updateSubtopicProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { completed, topicSequence, subtopicId } = req.body;
    const userId = req.user._id;

    // Get the roadmap to verify subtopic exists
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      $or: [
        { owner: userId },
        { domain: { $exists: true, $ne: null } },
        { subdomain: { $exists: true, $ne: null } }
      ]
    }).select('topics');

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Find the topic by sequence number
    const topic = roadmap.topics[topicSequence - 1];
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found with the given sequence' });
    }

    // Find the subtopic by id
    const subtopic = topic.subtopics.find(subtopic => subtopic._id.toString() === subtopicId);
    if (!subtopic) {
      return res.status(404).json({ message: 'Subtopic not found with the given ID' });
    }
    let userProgress = await UserRoadmapProgress.findOne({
      user: userId,
      roadmapId: roadmapId
    });
    if (!userProgress) {
      userProgress = new UserRoadmapProgress({
        user: userId,
        roadmapId: roadmapId,
        completedSubtopics: [],
        lastAccessed: new Date()
      });
    }

    // Update progress based on completed status
    if (completed) {
      const alreadyCompleted = userProgress.completedSubtopics.some(
        item => item.subtopicId.toString() === subtopicId
      );

      if (!alreadyCompleted) {
        userProgress.completedSubtopics.push({
          subtopicId,
          completedAt: new Date()
        });
      }
    } else {
      userProgress.completedSubtopics = userProgress.completedSubtopics.filter(
        item => item.subtopicId.toString() !== subtopicId
      );
    }

    userProgress.lastAccessed = new Date();
    await userProgress.save();

    // Calculate percentage complete
    let totalSubtopics = 0;
    let percentComplete = 0;

    if (roadmap.topics && roadmap.topics.length > 0) {
      roadmap.topics.forEach(topic => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          totalSubtopics += topic.subtopics.length;
        }
      });

      if (totalSubtopics > 0) {
        percentComplete = Math.round(
          (userProgress.completedSubtopics.length / totalSubtopics) * 100
        );
      }
    }
    res.status(200).json({
      message: 'Progress updated successfully',
      subtopicId,
      completed,
      totalSubtopics,
      percentComplete,
      success: true
    });
  } catch (error) {
    console.error('Error updating subtopic progress:', error);
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
};

// Get roadmap content for a subtopic
const getRoadmapContent = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { topicSequence, subtopicId } = req.body;
    // Get the roadmap
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      $or: [
        { owner: req.user._id },
        { domain: { $exists: true, $ne: null } },
        { subdomain: { $exists: true, $ne: null } }
      ]
    }).select('topics skillLevel learningType');

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (!topicSequence) {
      return res.status(400).json({ message: 'Topic sequence is required' });
    }

    if (!subtopicId) {
      return res.status(400).json({ message: 'Subtopic ID is required' });
    }

    // Find the topic by sequence number
    const topic = roadmap.topics[topicSequence - 1];
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found with the given sequence' });
    }

    // Find the subtopic by id
    const subtopic = topic.subtopics.find(subtopic => subtopic._id.toString() === subtopicId);
    if (!subtopic) {
      return res.status(404).json({ message: 'Subtopic not found with the given ID' });
    }

    let content = subtopic.content;

    if (!content) {
      try {
        content = await generateContent(topic.name, subtopic.name, subtopic.description, roadmap.skillLevel, roadmap.learningType, req.user._id);
      } catch (error) {
        console.error('Error generating content:', error);
        return res.status(500).json({ message: 'Failed to generate content, please try again later', error: error.message });
      }
    }

    subtopic.content = content;
    subtopic.contentGenerated = true;
    subtopic.contentGeneratedAt = new Date();
    await roadmap.save();

    res.status(200).json({
      content: content,
      success: true
    });
  } catch (error) {
    console.error('Error getting roadmap content:', error);
    res.status(500).json({ message: 'Failed to get content', error: error.message });
  }
};

// Generate content for a subtopic
const generateContent = async (topic, subtopic, description, skillLevel, learningType, userId) => {
  try {
    let generatedContent;
    const model = await getGeminiModel(userId);

    const prompt = `
You are an expert personalized educational content creator with excellent communication skills and perfect writing style as a human tutor. Create comprehensive learning content for the following topic:

Topic: ${topic}
Subtopic: ${subtopic}
Description: ${description || ''}
Skill Level: ${skillLevel || 'Beginner'}
Learning Type: ${learningType || 'Self-Paced'}

Please structure your response in markdown format with proper formatting for headings, paragraphs and other text elements with the following sections(not necessary to include all of them) and make sure to leave lines between each section:
1. Introduction - Brief overview of the subtopic and its importance
2. Key Concepts - Main ideas and principles to understand
3. Detailed Explanation - In-depth coverage of the subject matter
4. Examples - Practical examples with code snippets if applicable
5. Practice Exercises - Exercises for the learner to practice
6. Further Reading - Recommended resources for additional learning with properly embedded markdown links (use [text](url) format, not separate text and URLs)

Make the content educational, engaging, and appropriate for the specified skill level.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    generatedContent = response.text();
    return generatedContent;
  } catch (aiError) {
    console.error('AI content generation failed:', aiError);
    return null;
  }
};

// Generate notes for a subtopic
const generateNotes = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { topicSequence, subtopicId } = req.body;
    const userId = req.user._id;

    // Get the roadmap
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      $or: [
        { owner: userId },
        { domain: { $exists: true, $ne: null } },
        { subdomain: { $exists: true, $ne: null } }
      ]
    }).select('topics skillLevel learningType');

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (!topicSequence) {
      return res.status(400).json({ message: 'Topic sequence is required' });
    }

    if (!subtopicId) {
      return res.status(400).json({ message: 'Subtopic ID is required' });
    }

    // Find the topic by sequence number
    const topic = roadmap.topics[topicSequence - 1];
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found with the given sequence' });
    }

    // Find the subtopic by id
    const subtopic = topic.subtopics.find(subtopic => subtopic._id.toString() === subtopicId);
    if (!subtopic) {
      return res.status(404).json({ message: 'Subtopic not found with the given ID' });
    }

    // Generate notes using Gemini AI
    let notes = subtopic.notes;
    if (!notes) {

    try {
      const model = await getGeminiModel(userId);
      const content = subtopic.content;
      // If content exists, use it to generate better notes
      const contentPrompt = content
        ? `Based on the following content about "${subtopic.name}", create concise study notes:\n\n${content}\n\n`
        : '';

      const prompt = `${contentPrompt}
You are creating concise study notes with excellent communication skills and perfect writing style for a student learning about "${subtopic.name}" which is part of "${topic.name}".
The student's skill level is ${roadmap.skillLevel || 'Beginner'}.
The learning type is ${roadmap.learningType || 'Self-Paced'}.

Please create study notes in markdown format with the following sections and make sure to leave lines between each section:
1. Summary - A brief, clear overview of the key points
2. Important Concepts - Numbered list of the most critical concepts to understand
3. Key Examples - Short, practical examples with code snippets if applicable
4. Remember - Bullet points of crucial things to remember
5. Quick Reference - A simple reference guide or cheat sheet for quick review

Make the notes concise, focused on the most important information, and easy to review. Strictly dont include any other text or markdown formatting, just the notes.
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      notes = response.text();
      subtopic.notes = notes;
      subtopic.notesGenerated = true;
      subtopic.notesGeneratedAt = new Date();
      await roadmap.save();

    } catch (aiError) {
      console.error('AI notes generation failed:', aiError);
      return res.status(500).json({ message: 'Failed to generate notes, please try again later', error: aiError.message });
    }
  }
    res.status(200).json({
      notes,
      success: true
    });
  } catch (error) {
    console.error('Error generating notes:', error);
    res.status(500).json({ message: 'Failed to generate notes', error: error.message });
  }
};

// Generate a general roadmap with domain and subdomain (no owner)
const generateGeneralRoadmap = async (req, res) => {
  try {
    const { title, description, domain, subdomain } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!domain) {
      return res.status(400).json({ message: 'Domain is required' });
    }

    if (!subdomain) {
      return res.status(400).json({ message: 'Subdomain is required' });
    }

    // Check if a general roadmap already exists for this domain/subdomain combination
    const existingRoadmap = await Roadmap.findOne({
      domain: domain,
      subdomain: subdomain,
      owner: { $exists: false }
    });

    if (existingRoadmap) {
      return res.status(200).json({
        id: existingRoadmap._id,
        title: existingRoadmap.title,
        name: existingRoadmap.name,
        description: existingRoadmap.description,
        domain: existingRoadmap.domain,
        subdomain: existingRoadmap.subdomain,
        topics: existingRoadmap.topics
      });
    }

    // Get Gemini model for content generation (using system API key)
    const model = await getGeminiModel('system');

    // Prepare prompt for Gemini
    const prompt = `
    Create a comprehensive learning roadmap for "${title}" in the domain of "${domain}" and subdomain "${subdomain}" with the following details:
    ${description ? `Description: ${description}` : ''}
    
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
      roadmapData = JSON.parse(jsonString)
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return res.status(500).json({ message: 'Failed to parse AI response', error: error.message });
    }

    const newRoadmap = new Roadmap({
      title,
      name: roadmapData.name || title,
      description,
      domain,
      subdomain,
      topics: roadmapData.topics || []
    });

    const savedRoadmap = await newRoadmap.save();

    res.status(201).json({
      id: savedRoadmap._id,
      title: savedRoadmap.title,
      name: savedRoadmap.name,
      description: savedRoadmap.description,
      domain: savedRoadmap.domain,
      subdomain: savedRoadmap.subdomain,
      topics: savedRoadmap.topics
    });
  } catch (error) {
    console.error('Error generating general roadmap:', error);
    res.status(500).json({ message: 'Failed to generate general roadmap', error: error.message });
  }
};

// Generate PDF notes for a subtopic
const generatePdfNotes = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { topicSequence, subtopicId } = req.body;
    const userId = req.user._id;

    // Get the roadmap
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      $or: [
        { owner: userId },
        { domain: { $exists: true, $ne: null } },
        { subdomain: { $exists: true, $ne: null } }
      ]
    }).select('topics skillLevel learningType name');

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (!topicSequence) {
      return res.status(400).json({ message: 'Topic sequence is required' });
    }

    if (!subtopicId) {
      return res.status(400).json({ message: 'Subtopic ID is required' });
    }

    // Find the topic by sequence number
    const topic = roadmap.topics[topicSequence - 1];
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found with the given sequence' });
    }

    // Find the subtopic by id
    const subtopic = topic.subtopics.find(subtopic => subtopic._id.toString() === subtopicId);
    if (!subtopic) {
      return res.status(404).json({ message: 'Subtopic not found with the given ID' });
    }

    // Generate notes if they don't exist
    let notes = subtopic.notes;
    if (!notes) {
      try {
        const model = await getGeminiModel(userId);
        const content = subtopic.content;
        // If content exists, use it to generate better notes
        const contentPrompt = content
          ? `Based on the following content about "${subtopic.name}", create concise study notes:\n\n${content}\n\n`
          : '';

        const prompt = `${contentPrompt}
You are creating concise study notes with excellent communication skills and perfect writing style for a student learning about "${subtopic.name}" which is part of "${topic.name}".
The student's skill level is ${roadmap.skillLevel || 'Beginner'}.
The learning type is ${roadmap.learningType || 'Self-Paced'}.

Please create study notes in markdown format with the following sections and make sure to leave lines between each section:
1. Summary - A brief, clear overview of the key points
2. Important Concepts - Numbered list of the most critical concepts to understand
3. Key Examples - Short, practical examples with code snippets if applicable
4. Remember - Bullet points of crucial things to remember
5. Quick Reference - A simple reference guide or cheat sheet for quick review

Make the notes concise, focused on the most important information, and easy to review. Strictly dont include any other text or markdown formatting, just the notes.
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        notes = response.text();
        subtopic.notes = notes;
        subtopic.notesGenerated = true;
        subtopic.notesGeneratedAt = new Date();
        await roadmap.save();

      } catch (aiError) {
        console.error('AI notes generation failed:', aiError);
        return res.status(500).json({ message: 'Failed to generate notes, please try again later', error: aiError.message });
      }
    }

    // Generate PDF using puppeteer
    try {
      const pdfBuffer = await generatePdfFromMarkdown({
        title: `${subtopic.name} - Notes`,
        subtitle: `Roadmap: ${roadmap.name}`,
        date: new Date().toLocaleDateString(),
        content: notes
      });

      // Set headers for PDF download
      const fileName = `${subtopic.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Send the PDF buffer
      return res.end(pdfBuffer);
    } catch (pdfError) {
      if (pdfError.message === 'PDF_BROWSER_UNAVAILABLE') {
        console.error('PDF generation unavailable: headless Chrome could not start');
        return res.status(503).json({
          message: 'PDF export is not available on this server. The notes above are still yours to copy.',
        });
      }
      console.error('PDF generation failed:', pdfError);
      return res.status(500).json({ message: 'Failed to generate PDF', error: pdfError.message });
    }
  } catch (error) {
    console.error('Error generating PDF notes:', error);
    res.status(500).json({ message: 'Failed to generate PDF notes', error: error.message });
  }
};

module.exports = {
  getRoadmaps,
  getMyRoadmaps,
  createRoadmap,
  getRoadmapById,
  deleteRoadmap,
  getRoadmapProgress,
  updateSubtopicProgress,
  getRoadmapContent,
  generateNotes,
  generateGeneralRoadmap,
  generatePdfNotes
};