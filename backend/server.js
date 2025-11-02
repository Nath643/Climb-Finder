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

// Get data
async function getCompletedClimbs() {
  const [rows] = await pool.query('SELECT * FROM `completedclimbs`');
  return rows;
}

async function getMountains() {
  const [rows] = await pool.query('SELECT * FROM `mountains`');
  return rows;
}

async function getPlannedClimbs() {
  const [rows] = await pool.query('SELECT * FROM `plannedclimbs`');
  return rows;
}

async function getProfile() {
  const [rows] = await pool.query('SELECT * FROM `profile` WHERE id = 1');
  const profile = rows[0];

  // Parse all array fields safely
  if (profile.gear && typeof profile.gear === 'string') profile.gear = JSON.parse(profile.gear);
  if (profile.transport && typeof profile.transport === 'string') profile.transport = JSON.parse(profile.transport);
  if (profile.lookingFor && typeof profile.lookingFor === 'string') profile.lookingFor = JSON.parse(profile.lookingFor);

  return profile;
}

// Don't input mountainid directly with ${} as it is coming directly from a http request from a user - we can't trust it. The syntax used below is a prepared statement

async function getCompletedClimb(mountainId) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM completedclimbs
    WHERE mountainId = ?
    `, [mountainId]);
  return rows[0];
}

async function getPlannedClimb(mountainId) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM plannedclimbs
    WHERE mountainId = ?
    `, [mountainId]);
  return rows[0];
}

// CREATE a completed climb
async function createCompletedClimb(mountainId, date, duration, weather, companions) {
  const [result] = await pool.query(`
    INSERT INTO completedclimbs (mountainId, date, duration, weather, companions)
    VALUES (?, ?, ?, ?, ?)
  `, [mountainId, date, duration, weather, companions])
  const id = result.insertId
  return getCompletedClimb(mountainId); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

// CREATE a planned climb
async function createPlannedClimb(mountainId, date) {
  const [result] = await pool.query(`
    INSERT INTO plannedclimbs (mountainId, date)
    VALUES (?, ?)
  `, [mountainId, date])
  const id = result.insertId
  return getPlannedClimb(mountainId); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

async function updateProfile(age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude) {
  const [result] = await pool.query(`
    UPDATE profile
    SET age = ?, transport = ?, gear = ?, fitness = ?, lookingFor = ?, totalDistance = ?, totalAltitude = ?
    WHERE id = 1
  `, [age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude]);
  // const id = result.insertId
  return getProfile();
}

// API routes
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.get('/api/completedClimbs', async (req, res) => {
  const completedClimbsResult = await getCompletedClimbs();
  res.send(completedClimbsResult);
});

app.get('/api/mountains', async (req, res) => {
  const mountainsResult = await getMountains();
  res.send(mountainsResult);
});

app.get('/api/plannedClimbs', async (req, res) => {
  const plannedClimbsResult = await getPlannedClimbs();
  res.send(plannedClimbsResult);
});

app.get('/api/profile', async (req, res) => {
  const profileResult = await getProfile();
  res.send(profileResult);
});

app.put('/api/profile', async (req, res) => {
  console.log(req.body);
  const {age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude} = req.body;

  const gearJson = Array.isArray(gear) ? JSON.stringify(gear) : gear;
  const transportJson = Array.isArray(transport) ? JSON.stringify(transport) : transport;
  const lookingForJson = Array.isArray(lookingFor) ? JSON.stringify(lookingFor) : lookingFor;

  const updatedProfile = await updateProfile(age, transportJson, gearJson, fitness, lookingForJson, totalDistance, totalAltitude);
  res.json(updatedProfile);
});

// (async () => {
//   const profileResult = await getProfile();
//   console.log(profileResult[0].transport);
// })();

// app.post('/api/data', (req, res) => {
//   const item = req.body;
//   data.push(item);
//   fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
//   res.status(201).json(item);
// });

app.post('/api/completedClimb', async (req, res) => {
  const {mountainId, date, duration, weather, companions} = req.body;
  // ASYNC MAYBE NOT NECESSARY
  (async () => {
    const createdCompletedClimb = await createCompletedClimb(mountainId, date, duration, weather, companions);
    res.status(201).send(createdCompletedClimb);
  })();
});

app.post('/api/plannedClimb', async (req, res) => {
  const {mountainId, date} = req.body;

  (async () => {
    const createdPlannedClimb = await createPlannedClimb(mountainId, date);
    res.status(201).send(createdPlannedClimb);
  })();
});

// For any other route, serve index.html (supports SPA routing)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
