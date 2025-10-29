//  const express = require('express');
//  const app = express();
//  const port = 8383;

//  app.use(express.static('public'));

//  app.get('/info', (req, res) => {
//   res.status(200).json({info: 'preset text'});
//  });

//  app.listen(port, () => console.log(`server has started on port: ${port}`));


const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Path to JSON file for storing data
const DATA_FILE = path.join(__dirname, 'data.json');

// Load or initialize data
let data = [];
if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// API routes
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.get('/api/completedClimbs', (req, res) => {
  const data = JSON.parse(fs.readFileSync('completed-climbs.json'));
  res.json(data);
});

app.get('/api/mountains', (req, res) => {
  const data = JSON.parse(fs.readFileSync('mountains.json'));
  res.json(data);
});

app.get('/api/plannedClimbs', (req, res) => {
  const data = JSON.parse(fs.readFileSync('planned-climbs.json'));
  res.json(data);
});

app.get('/api/profile', (req, res) => {
  const data = JSON.parse(fs.readFileSync('profile.json'));
  res.json(data);
});

app.post('/api/data', (req, res) => {
  const item = req.body;
  data.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(item);
});

// For any other route, serve index.html (supports SPA routing)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
