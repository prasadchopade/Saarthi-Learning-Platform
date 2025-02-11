const express = require("express");
const axios = require("axios");
const { authMiddleware } = require("../middleware/authMiddleware");
require("dotenv").config();
const codeController = require("../controllers/codeController");
const router = express.Router();

router.post("/execute-code",authMiddleware, async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      { source_code, language_id, stdin },
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "Content-Type": "application/json"
        },
      }
    );
    res.json({ compilerToken: response.data.token });
  } catch (error) {
    res.status(500).json({ error: "Error executing code" });
  }
});

router.get("/get-result/:compilerToken",authMiddleware, async (req, res) => {
  const { compilerToken } = req.params;
  try {
    const response = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${compilerToken}`,
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching result" });
  }
});

router.post("/analyze-code",authMiddleware, codeController.analyzeCode);
module.exports = router;
