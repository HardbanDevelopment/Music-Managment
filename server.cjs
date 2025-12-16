const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Existing Gemini endpoint
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

// Basic CRUD endpoints for 'assets' table (example for music catalogue assets)
app.get('/api/assets', async (req, res) => {
  try {
    const { data, error } = await supabase.from('assets').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/assets', async (req, res) => {
  try {
    const { data, error } = await supabase.from('assets').insert(req.body);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/assets/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('assets').update(req.body).eq('id', req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('assets').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});