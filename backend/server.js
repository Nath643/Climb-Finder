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
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

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

// Connect to database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

async function getCompletedClimbs() {
  const [rows] = await pool.query('SELECT * FROM `completedclimbs`');
  return rows;
}

(async () => {
  const completedClimbs = await getCompletedClimbs();
  // console.log(completedClimbs);
})();

//MAYBE USEFUL AT SOME POINT: GET A SINGLE COMPLETED CLIMB:
// Don't input mountainid directly with ${} as it is coming directly from a http request from a user - we can't trust it. The syntax used below is a prepared statement
async function getCompletedClimb(mountainId) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM completedclimbs
    WHERE mountainId = ?
    `, [mountainId]);
  return rows[0];
}

(async () => {
  const completedClimb = await getCompletedClimb('helv');
  // console.log(completedClimb);
})();

// CREATE a completed climb
async function createCompletedClimb(mountainId, date, duration, weather, companions) {
  const [result] = await pool.query(`
    INSERT INTO completedclimbs (mountainId, date, duration, weather, companions)
    VALUES (?, ?, ?, ?, ?)
  `, [mountainId, date, duration, weather, companions])
  const id = result.insertId
  return getCompletedClimb(mountainId); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

// (async () => {
//   const createdCompletedClimb = await createCompletedClimb('scaf', '2019-06-21', '3 hours 15 minutes', 'overcast', 'Cindy');
//   console.log(createdCompletedClimb);
// })();

// API routes
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.get('/api/completedClimbs', async (req, res) => {
  // const data = JSON.parse(fs.readFileSync('completed-climbs.json'));
  // res.json(data);
  const completedClimbsResult = await getCompletedClimbs();
  res.send(completedClimbsResult);
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

app.post('/api/completedClimb', async (req, res) => {
  const {mountainId, date, duration, weather, companions} = req.body;

  (async () => {
    const createdCompletedClimb = await createCompletedClimb(mountainId, date, duration, weather, companions);
    res.status(201).send(createdCompletedClimb);
  })();
});

// For any other route, serve index.html (supports SPA routing)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
