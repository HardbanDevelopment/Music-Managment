const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Mock data
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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});