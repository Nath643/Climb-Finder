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
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
const PORT = 3000;

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to parse JSON requests
app.use(express.json());
console.log(__dirname);

// middleware
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile((path.join(__dirname, 'public', 'login.html')));
});

// Serve frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.redirect('/index.html');  // ← Server redirect: forces URL to /index.html
// });

// app.get('/index.html', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/index.html', (req, res) => {
  res.sendFile((path.join(__dirname, 'public', 'index.html')));
});

// // Path to JSON file for storing data
// const DATA_FILE = path.join(__dirname, 'data.json');

// // Load or initialize data
// let data = [];
// if (fs.existsSync(DATA_FILE)) {
//   data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
// }

// Connect to database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

// Get data
async function getCompletedClimbs(userId) {
  const [rows] = await pool.query('SELECT * FROM `completedclimbs` WHERE user_id = ?', [userId]);
  return rows;
}

async function getMountains() {
  const [rows] = await pool.query('SELECT * FROM `mountains`');
  return rows;
}

async function getPlannedClimbs(userId) {
  const [rows] = await pool.query('SELECT * FROM `plannedclimbs` WHERE user_id = ?', [userId]);
  return rows;
}

async function getProfile(userId) {
  const [rows] = await pool.query('SELECT * FROM `users` WHERE id = ?', [userId]);

  if (rows.length === 0) {
    return {
      transport: [],
      gear: [],
      lookingFor: []
    };
  }

  const profile = rows[0];

  // Parse all array fields safely
  if (profile.gear && typeof profile.gear === 'string') profile.gear = JSON.parse(profile.gear);
  if (profile.transport && typeof profile.transport === 'string') profile.transport = JSON.parse(profile.transport);
  if (profile.lookingFor && typeof profile.lookingFor === 'string') profile.lookingFor = JSON.parse(profile.lookingFor);

  profile.transport = profile.transport || [];
  profile.gear = profile.gear || [];
  profile.lookingFor = profile.lookingFor || [];

  return profile;
}

// Don't input mountainid directly with ${} as it is coming directly from a http request from a user - we can't trust it. The syntax used below is a prepared statement

async function getCompletedClimb(mountainId) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM completedclimbs
    WHERE mountain_id = ?
    `, [mountainId]);
  return rows[0];
}

async function getPlannedClimb(mountainId) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM plannedclimbs
    WHERE mountain_id = ?
    `, [mountainId]);
  return rows[0];
}

// CREATE a completed climb
async function createCompletedClimb(mountainId, date, duration, weather, companions) {
  const [result] = await pool.query(`
    INSERT INTO completedclimbs (mountain_id, date, duration, weather, companions)
    VALUES (?, ?, ?, ?, ?)
  `, [mountainId, date, duration, weather, companions])
  const id = result.insertId
  return getCompletedClimb(mountainId); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

// CREATE a planned climb
async function createPlannedClimb(mountainId, date) {
  const [result] = await pool.query(`
    INSERT INTO plannedclimbs (mountain_id, date)
    VALUES (?, ?)
  `, [mountainId, date])
  const id = result.insertId
  return getPlannedClimb(mountainId); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

async function updateProfile(userId, age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude) {
  const [result] = await pool.query(`
    UPDATE users
    SET age = ?, transport = ?, gear = ?, fitness = ?, lookingFor = ?, totalDistance = ?, totalAltitude = ?
    WHERE id = 1
  `, [age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude]);
  // const id = result.insertId
  return getProfile(userId);
}

// LOGIN / OUT API routes
// app.get("/login", (req, res) => {
//   res.sendFile(__dirname + "/login.html");
// });

app.post("/login", (req, res) => {
  req.session.number = 1;
  res.redirect("/main");
});

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/session-number", (req, res) => {
  res.json({ number: req.session.number || 0});
});

app.post("/logout", (req, res) => {
  res.redirect("/loggedout");
});

app.get("/loggedout", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// API routes
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.get('/api/completedClimbs', async (req, res) => {
  const completedClimbsResult = await getCompletedClimbs(req.session.number);
  res.send(completedClimbsResult);
});

app.get('/api/mountains', async (req, res) => {
  const mountainsResult = await getMountains();
  res.send(mountainsResult);
});

app.get('/api/plannedClimbs', async (req, res) => {
  const plannedClimbsResult = await getPlannedClimbs(req.session.number);
  res.send(plannedClimbsResult);
});

app.get('/api/profile', async (req, res) => {
  try {
    const profileResult = await getProfile(req.session.number);
    res.json(profileResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put('/api/profile', async (req, res) => {
  console.log(req.body);
  const {age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude} = req.body;

  const gearJson = Array.isArray(gear) ? JSON.stringify(gear) : gear;
  const transportJson = Array.isArray(transport) ? JSON.stringify(transport) : transport;
  const lookingForJson = Array.isArray(lookingFor) ? JSON.stringify(lookingFor) : lookingFor;

  const updatedProfile = await updateProfile(req.session.number, age, transportJson, gearJson, fitness, lookingForJson, totalDistance, totalAltitude);
  res.json(updatedProfile);
});

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

app.delete('/api/completedClimb', async (req, res) => {
  const {id} = req.body; 

  await pool.query(`DELETE FROM completedclimbs WHERE id = ?`, [id]);

  res.json({ success: true });
});

app.delete('/api/plannedClimb', async (req, res) => {
  const {id} = req.body; 

  await pool.query(`DELETE FROM plannedclimbs WHERE id = ?`, [id]);

  res.json({ success: true });
});

// For any other route, serve index.html (supports SPA routing)
// // app.get(/.*/, (req, res) => {
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
