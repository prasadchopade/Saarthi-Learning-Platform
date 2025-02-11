const { getGeminiModel } = require('../utils/geminiConfig');

// Base prompt template for code analysis
const getAnalysisPrompt = (code) => `
You are an expert code analyzer and mentor. Analyze the following code with a focus on best practices, performance, and readability.

CODE TO ANALYZE:
\`\`\`
${code}
\`\`\`

INSTRUCTIONS:
1. First, check for any syntax errors or potential runtime issues.
2. Analyze the code quality, including:
   - Code structure and organization
   - Variable naming and conventions
   - Function design and responsibilities
   - Error handling
   - Performance considerations
4. Provide specific, actionable suggestions for improvement.

FORMAT YOUR RESPONSE IN MARKDOWN:
### Code Analysis 🔍
[Provide a brief overview of the code and its main purpose]

### Potential Issues ⚠️
[List any syntax errors, bugs, or potential runtime issues]

### Code Quality Review 📊
[Analyze code structure, naming, and organization]

### Performance Analysis 🚀
[Discuss time/space complexity and performance considerations]

### Suggested Improvements ✨
[Provide specific, actionable improvements with code examples where relevant]

### Best Practices 📚
[Highlight relevant language-specific best practices]

Keep the tone professional but friendly, and focus on constructive feedback.
`;

// Controller function for code analysis
const analyzeCode = async (req, res) => {
  const { source_code, language } = req.body;
  const userId = req.user._id;

  if (!source_code || !language) {
    res.status(400);
    throw new Error('Please provide both source code and language');
  }

  try {
    // Get the Gemini model instance with user's API key
    const model = await getGeminiModel(userId);

    // Generate the analysis prompt
    const prompt = getAnalysisPrompt(source_code);

    // Get the response from Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });

    const response = result.response;
    const text = response.text();

    // Send the formatted response
    res.json({
      success: true,
      analysis: text,
    });

  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500);
    throw new Error('Failed to analyze code: ' + (error.message || 'Unknown error'));
  }
};

module.exports = { analyzeCode };