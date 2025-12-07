const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  try {
    const { model = 'gemini-1.5-flash', contents, config = {} } = req.body;
    const generativeModel = genAI.getGenerativeModel({ model });
    const result = await generativeModel.generateContent({ contents, ...config });
    res.json({ ...result.response, text: result.response.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});