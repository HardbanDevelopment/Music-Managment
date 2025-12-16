const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const app = express();

app.use(cors());
app.use(express.json());

// Initialize clients (handle missing keys gracefully for build/CI)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

// Helper to check for services
const checkService = (service, name, res) => {
  if (!service) {
    res.status(503).json({ error: `${name} service not configured` });
    return false;
  }
  return true;
};

// Existing Gemini endpoint
app.post('/api/generate', async (req, res) => {
  if (!checkService(genAI, 'Gemini AI', res)) return;
  try {
    const { model = 'gemini-1.5-flash', contents, config = {} } = req.body;
    const generativeModel = genAI.getGenerativeModel({ model });
    const result = await generativeModel.generateContent({ contents, ...config });
    res.json({ ...result.response, text: result.response.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Basic CRUD endpoints for 'assets' table
app.get('/api/assets', async (req, res) => {
  if (!checkService(supabase, 'Supabase', res)) return;
  try {
    const { data, error } = await supabase.from('assets').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/assets', async (req, res) => {
  if (!checkService(supabase, 'Supabase', res)) return;
  try {
    const { data, error } = await supabase.from('assets').insert(req.body);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/assets/:id', async (req, res) => {
  if (!checkService(supabase, 'Supabase', res)) return;
  try {
    const { data, error } = await supabase.from('assets').update(req.body).eq('id', req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  if (!checkService(supabase, 'Supabase', res)) return;
  try {
    const { data, error } = await supabase.from('assets').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
