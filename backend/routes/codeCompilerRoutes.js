const express = require("express");
const axios = require("axios");
const { authMiddleware } = require("../middleware/authMiddleware");
require("dotenv").config();
const codeController = require("../controllers/codeController");
const router = express.Router();

// Judge0 runs the submitted code. With a RapidAPI key it goes through the
// hosted plan; without one it falls back to Judge0's public Community Edition
// instance, which needs no key and no account. The public instance is rate
// limited and best-effort, so a key is worth adding if this gets real traffic,
// but the compiler works out of the box either way.
const JUDGE0_BASE_URL = process.env.RAPIDAPI_KEY
  ? "https://judge0-ce.p.rapidapi.com"
  : (process.env.JUDGE0_URL || "https://ce.judge0.com");

const judge0Headers = () => {
  const headers = { "Content-Type": "application/json" };
  if (process.env.RAPIDAPI_KEY) {
    headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
    headers["X-RapidAPI-Key"] = process.env.RAPIDAPI_KEY;
  }
  return headers;
};

router.post("/execute-code", authMiddleware, async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  if (!source_code || !language_id) {
    return res.status(400).json({ error: "source_code and language_id are required" });
  }

  try {
    const response = await axios.post(
      `${JUDGE0_BASE_URL}/submissions?base64_encoded=false`,
      { source_code, language_id, stdin },
      { headers: judge0Headers(), timeout: 20000 }
    );
    res.json({ compilerToken: response.data.token });
  } catch (error) {
    const detail = error.response?.data?.error || error.message;
    console.error("Judge0 submit failed:", detail);
    res.status(502).json({ error: "Could not reach the code execution service", detail });
  }
});

router.get("/get-result/:compilerToken", authMiddleware, async (req, res) => {
  const { compilerToken } = req.params;
  try {
    const response = await axios.get(
      `${JUDGE0_BASE_URL}/submissions/${compilerToken}?base64_encoded=false`,
      { headers: judge0Headers(), timeout: 20000 }
    );
    res.json(response.data);
  } catch (error) {
    const detail = error.response?.data?.error || error.message;
    console.error("Judge0 result fetch failed:", detail);
    res.status(502).json({ error: "Could not fetch the execution result", detail });
  }
});

router.post("/analyze-code",authMiddleware, codeController.analyzeCode);
module.exports = router;
