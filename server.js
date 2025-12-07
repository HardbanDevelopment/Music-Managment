import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Endpoint to create tables (admin only)
app.post('/api/create-tables', async (req, res) => {
  const pool = new Pool({
    connectionString: process.env.SUPABASE_URL.replace('https', 'postgresql') + '?pgbouncer=true',
    user: 'postgres',
    password: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        type text NOT NULL,  -- 'music' or 'book'
        title text NOT NULL,
        artist_author text NOT NULL,
        content text,  -- Generated content like lyrics or narration
        status text DEFAULT 'draft',
        created_at timestamp WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS releases (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        asset_id uuid REFERENCES assets(id),
        platform text NOT NULL,  -- e.g., Spotify, Apple Music
        release_date date,
        status text DEFAULT 'pending'
      );
      CREATE TABLE IF NOT EXISTS books (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        asset_id uuid REFERENCES assets(id),
        isbn text,
        publisher text,
        publish_date date
      );
      ALTER TABLE IF EXISTS books ADD COLUMN IF NOT EXISTS blurb text;
      ALTER TABLE IF EXISTS books ADD COLUMN IF NOT EXISTS status text DEFAULT 'preparing';
    `);
    res.json({ message: 'Tables created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
});

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

// Prometheus Genesis endpoint for generating lyrics (Muzyczna Kreacja Słów)
app.post('/api/prometheus/generate-lyrics', async (req, res) => {
  try {
    const { prompt, model = 'gemini-1.5-flash' } = req.body;
    const generativeModel = genAI.getGenerativeModel({ model });
    const contents = [{ role: 'user', parts: [{ text: `Generate song lyrics based on: ${prompt}` }] }];
    const result = await generativeModel.generateContent({ contents });
    const lyrics = result.response.candidates[0].content.parts[0].text;

    // Save to Supabase assets table
    const { data, error } = await supabase.from('assets').insert({
      type: 'music',
      title: `Generated Lyrics: ${prompt.substring(0, 50)}`,
      artist_author: 'AI Prometheus',
      content: lyrics,
      status: 'generated'
    });
    if (error) throw error;

    res.json({ lyrics, asset: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Prometheus Genesis endpoint for strategic advice (Strategiczne Wskazówki AI)
app.post('/api/prometheus/strategic-advice', async (req, res) => {
  try {
    const { prompt, model = 'gemini-1.5-flash' } = req.body;
    const generativeModel = genAI.getGenerativeModel({ model });
    const contents = [{ role: 'user', parts: [{ text: `Provide strategic marketing advice and audience segmentation for: ${prompt}` }] }];
    const result = await generativeModel.generateContent({ contents });
    const advice = result.response.candidates[0].content.parts[0].text;

    // Save to Supabase assets table
    const { data, error } = await supabase.from('assets').insert({
      type: 'advice',
      title: `Strategic Advice: ${prompt.substring(0, 50)}`,
      artist_author: 'AI Prometheus',
      content: advice,
      status: 'generated'
    });
    if (error) throw error;

    res.json({ advice, asset: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Prometheus Genesis endpoint for generating narration (Generator Narracji Immersyjnej)
app.post('/api/prometheus/generate-narration', async (req, res) => {
  try {
    const { prompt, model = 'gemini-1.5-flash' } = req.body;
    const generativeModel = genAI.getGenerativeModel({ model });
    const contents = [{ role: 'user', parts: [{ text: `Generate an immersive narration based on: ${prompt}` }] }];
    const result = await generativeModel.generateContent({ contents });
    const narration = result.response.candidates[0].content.parts[0].text;

    // Save to Supabase assets table
    const { data, error } = await supabase.from('assets').insert({
      type: 'narration',
      title: `Generated Narration: ${prompt.substring(0, 50)}`,
      artist_author: 'AI Prometheus',
      content: narration,
      status: 'generated'
    });
    if (error) throw error;

    res.json({ narration, asset: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Digital Publishing endpoints
app.post('/api/prepare-publishing', async (req, res) => {
  try {
    const { asset_id, isbn, publisher } = req.body;
    // Optimize with Prometheus AI (e.g., generate marketing blurb)
    const generativeModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const asset = await supabase.from('assets').select('content').eq('id', asset_id).single();
    const contents = [{ role: 'user', parts: [{ text: `Generate marketing blurb for book: ${asset.data.content.substring(0, 200)}` }] }];
    const result = await generativeModel.generateContent({ contents });
    const blurb = result.response.candidates[0].content.parts[0].text;

    const { data, error } = await supabase.from('books').insert({
      asset_id,
      isbn,
      publisher,
      publish_date: new Date(),
      blurb // Additional field for AI-generated blurb
    });
    if (error) throw error;

    res.json({ message: 'Book prepared for publishing', book: data[0], blurb });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update-book-status', async (req, res) => {
  try {
    const { id, status } = req.body;
    const { data, error } = await supabase.from('books').update({ status }).eq('id', id);
    if (error) throw error;
    res.json({ message: 'Book status updated', book: data[0] });
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
