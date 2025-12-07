import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Mock data for dashboard
const adminDashboardData = {
  stats: {
    totalRevenue: 10000,
    totalStreams: 1000000,
    activeArtists: 50,
    activeAuthors: 30
  },
  activities: [
    { id: '1', description: 'New release published', date: '2025-12-07' }
  ]
};

const analyticsData = {
  streamsTrend: [
    { name: 'Jan', streams: 120000 },
    { name: 'Feb', streams: 150000 },
    { name: 'Mar', streams: 130000 },
    { name: 'Apr', streams: 180000 },
    { name: 'May', streams: 250000 },
    { name: 'Jun', streams: 320000 }
  ],
  revenueBreakdown: [
    { name: 'Spotify', value: 4500 },
    { name: 'Apple Music', value: 3200 },
    { name: 'Amazon', value: 1800 },
    { name: 'YouTube', value: 1200 }
  ],
  platformRevenue: [
    { name: 'Spotify', value: 4500 },
    { name: 'Apple Music', value: 3200 },
    { name: 'Amazon', value: 1800 },
    { name: 'YouTube', value: 1200 }
  ]
};

// Endpoints
app.get('/api/admin/dashboard', (req, res) => {
  res.json(adminDashboardData);
});

app.get('/api/analytics', (req, res) => {
  res.json(analyticsData);
});

// AI Helper
const generate = async (prompt, schema = null, tools = null) => {
    if (!ai) {
        // Mock fallback if AI is not configured
        console.log("AI not configured, returning mock data");
        if (schema && schema.type === Type.ARRAY) {
             return JSON.stringify([]);
        }
        if (schema && schema.type === Type.OBJECT) {
             return JSON.stringify({}); // Very basic mock, ideally should be structured
        }
        return "This is a mock AI response from the backend because GEMINI_API_KEY is not configured.";
    }
    const config = {
        responseMimeType: schema ? 'application/json' : 'text/plain',
    };
    if (schema) config.responseSchema = schema;
    if (tools) config.tools = tools;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config
    });
    return response.text;
};

// AI Endpoints
app.post('/api/ai/text', async (req, res) => {
    try {
        const text = await generate(req.body.prompt);
        res.json(text);
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/ai/insight', async (req, res) => {
    try {
        const prompt = `Based on this JSON data for a user dashboard, provide a short, actionable strategic insight (2-3 sentences max). Data: ${req.body.contextData}`;
        const text = await generate(prompt);
        res.json(text);
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/ai/segments', async (req, res) => {
    try {
        const prompt = `Based on the following JSON data about a creator's audience, generate 3 distinct audience segments or personas. For each segment, provide a creative name, a brief description, its size as a percentage of the total audience, 2-3 key characteristics, and a short, actionable marketing insight. Audience data: ${JSON.stringify(req.body.data)}`;
        const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, sizePercentage: { type: Type.NUMBER }, keyCharacteristics: { type: Type.ARRAY, items: { type: Type.STRING } }, marketingInsight: { type: Type.STRING } } } };
        const text = await generate(prompt, schema);
        res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/ai/goals-suggestions', async (req, res) => {
    try {
        const { userRole, userData } = req.body;
        const prompt = `You are a strategic advisor for a ${userRole}. Based on their current data, suggest 3 actionable and specific goals. For each goal, provide a title, a short description, a targetMetric, and a due date within the next 3 months. User Data: ${JSON.stringify(userData)}`;
        const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, targetMetric: { type: Type.STRING }, dueDate: { type: Type.STRING, description: "Date in YYYY-MM-DD format" } }, required: ["title", "description", "targetMetric", "dueDate"] } };
        const text = await generate(prompt, schema);
        res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/ai/analyze-idea', async (req, res) => {
    try {
        const { idea, audienceData } = req.body;
        const prompt = `You are an expert A&R and literary agent. Analyze this creative idea: "${idea}". Base your analysis on this audience data: ${JSON.stringify(audienceData.fanDemographics)}. Provide a commercial potential score (0-100). Identify the top 3 key emotional triggers. Give 3 concrete, actionable creative suggestions.`;
        const schema = { type: Type.OBJECT, properties: { ideaSnippet: { type: Type.STRING }, commercialPotential: { type: Type.NUMBER }, keyEmotions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { emotion: { type: Type.STRING }, score: { type: Type.NUMBER } } } }, creativeSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } };
        const text = await generate(prompt, schema);
        res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.get('/api/media/mentions', async (req, res) => {
    try {
        if (!ai) throw new Error("AI not configured");
        const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: "Find recent web mentions for the artist 'Casey Creator' and their single 'Cosmic Dream'. Return only the most relevant articles, blogs, or social media posts from the last month.",
             config: { tools: [{ googleSearch: {} }] }
        });
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (!groundingChunks || groundingChunks.length === 0) return res.json([]);
        
        const mentions = groundingChunks.map((chunk, index) => ({
             id: `mention-${index}-${Date.now()}`,
             source: new URL(chunk.web.uri).hostname.replace('www.', ''),
             url: chunk.web.uri,
             title: chunk.web.title || "Untitled Mention",
             snippet: response.text.substring(0, 150) + '...',
             sentiment: 'Positive',
             publishedAt: new Date().toISOString()
        }));
        res.json(mentions);
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/catalogue/audit', async (req, res) => {
    try {
        const { catalogue } = req.body;
        const prompt = `Analyze this creator's back-catalogue and identify up to 3-4 assets with the highest untapped potential. Catalogue data: ${JSON.stringify(catalogue)}`;
        const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { assetId: { type: Type.STRING }, assetTitle: { type: Type.STRING }, assetType: { type: Type.STRING }, potentialScore: { type: Type.NUMBER }, insight: { type: Type.STRING }, suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["assetId", "assetTitle", "assetType", "potentialScore", "insight", "suggestedActions"] } };
        const text = await generate(prompt, schema);
        res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/forecast/sales', async (req, res) => {
    try {
        const { asset, period } = req.body;
        const unit = asset.type === 'Music' ? 'streams' : 'sales';
        const prompt = `Analyze this creative asset: ${JSON.stringify(asset)}. Generate a realistic sales/stream forecast for the next ${period} months. Provide month-by-month breakdown, total projectedUnits, projectedRevenue, confidence, and insight. Assume a revenue of $0.0035 per stream for music, and $4.50 per sale for books.`;
        const schema = { type: Type.OBJECT, properties: { projectedUnits: { type: Type.NUMBER }, projectedRevenue: { type: Type.NUMBER }, confidence: { type: Type.STRING }, insight: { type: Type.STRING }, data: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, projected: { type: Type.NUMBER }, optimistic: { type: Type.NUMBER }, pessimistic: { type: Type.NUMBER } } } } }, required: ["projectedUnits", "projectedRevenue", "confidence", "insight", "data"] };
        const text = await generate(prompt, schema);
        res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/campaign/strategy', async (req, res) => {
    try {
        const { asset, platform } = req.body;
        const prompt = `Create a comprehensive 4-week marketing strategy for "${asset.title}" by ${asset.authorOrArtist} on ${platform}. Include campaignTitle, targetAudience, keyMessaging, contentPillars, timeline, and postExamples.`;
        const schema = { type: Type.OBJECT, properties: { campaignTitle: { type: Type.STRING }, targetAudience: { type: Type.STRING }, keyMessaging: { type: Type.STRING }, contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } }, timeline: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { week: { type: Type.STRING }, activities: { type: Type.ARRAY, items: { type: Type.STRING } } } } }, postExamples: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, content: { type: Type.STRING }, imagePrompt: { type: Type.STRING } } } } }, required: ["campaignTitle", "targetAudience", "keyMessaging", "contentPillars", "timeline", "postExamples"] };
        const text = await generate(prompt, schema);
        res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/market/opportunities', async (req, res) => {
    try {
        const { catalogue, role } = req.body;
        const creatorType = role === 'MUSIC_CREATOR' ? 'music creator' : 'book author'; 
        const prompt = `Analyze current market trends for a ${creatorType}. Identify 3 top trending topics/genres. Also suggest 3 creative opportunities for this specific creator based on their catalogue: ${JSON.stringify(catalogue)}.`;
        const schema = { type: Type.OBJECT, properties: { trends: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: { type: Type.STRING }, description: { type: Type.STRING }, source: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, uri: { type: Type.STRING } } } } } }, opportunities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, relatedTrendId: { type: Type.STRING }, assetSuggestion: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, format: { type: Type.STRING } } }, aiSnippet: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, content: { type: Type.STRING } } }, rationale: { type: Type.STRING } } } } } };
        const text = await generate(prompt, schema);
        res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/community/analytics', async (req, res) => {
    try {
        const { fanInteractions } = req.body;
         const prompt = `You are an expert community manager. Analyze this raw data of recent fan interactions: ${JSON.stringify(fanInteractions)}. Generate a community analytics report with communityPulseSummary, topFans (list of 2), and engagementOpportunities (list of 2).`;
         const schema = { type: Type.OBJECT, properties: { communityPulseSummary: { type: Type.STRING }, topFans: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { fanId: { type: Type.STRING }, fanName: { type: Type.STRING }, fanAvatar: { type: Type.STRING }, reason: { type: Type.STRING }, suggestedAction: { type: Type.STRING } } } }, engagementOpportunities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { interactionId: { type: Type.STRING }, fanName: { type: Type.STRING }, fanAvatar: { type: Type.STRING }, comment: { type: Type.STRING }, aiReplySuggestion: { type: Type.STRING } } } } } };
         const text = await generate(prompt, schema);
         res.json(JSON.parse(text));
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.post('/api/brand/report', async (req, res) => {
    try {
        const { keywords } = req.body;
        const activeKeywords = keywords.filter(k => k.isActive).map(k => k.text).join(', ');
        if (!activeKeywords) return res.status(400).json({message: "No active keywords"});
        const prompt = `You are a professional brand strategist. Analyze public perception for keywords: "${activeKeywords}". Provide a sentiment object, an archetype object, and a swot object.`;
        const schema = { type: Type.OBJECT, properties: { sentiment: { type: Type.OBJECT, properties: { positiveScore: { type: Type.NUMBER }, neutralScore: { type: Type.NUMBER }, negativeScore: { type: Type.NUMBER }, keyPositiveTopics: { type: Type.ARRAY, items: { type: Type.STRING } }, keyNegativeTopics: { type: Type.ARRAY, items: { type: Type.STRING } } } }, archetype: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } } } }, swot: { type: Type.OBJECT, properties: { strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }, threats: { type: Type.ARRAY, items: { type: Type.STRING } } } } } };
        const text = await generate(prompt, schema);
        res.json({ ...JSON.parse(text), generatedAt: new Date().toISOString() });
    } catch (e) { res.status(500).json({ message: e.message || "Error" }); }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
