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

async function getCompletedClimb(mountain_id) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM completedclimbs
    WHERE mountain_id = ?
    `, [mountain_id]);
  return rows[0];
}

async function getPlannedClimb(mountain_id) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM plannedclimbs
    WHERE mountain_id = ?
    `, [mountain_id]);
  return rows[0];
}

// CREATE a completed climb
async function createCompletedClimb(userId, mountain_id, date, duration, weather, companions) {
  const [result] = await pool.query(`
    INSERT INTO completedclimbs (user_id, mountain_id, date, duration, weather, companions)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [userId, mountain_id, date, duration, weather, companions])
  const id = result.insertId
  return getCompletedClimb(mountain_id); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

// CREATE a planned climb
async function createPlannedClimb(userId, mountain_id, date) {
  const [result] = await pool.query(`
    INSERT INTO plannedclimbs (user_id, mountain_id, date)
    VALUES (?, ?, ?)
  `, [userId, mountain_id, date])
  const id = result.insertId
  return getPlannedClimb(mountain_id); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

async function updateProfile(userId, age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude) {
  const [result] = await pool.query(`
    UPDATE users
    SET age = ?, transport = ?, gear = ?, fitness = ?, lookingFor = ?, totalDistance = ?, totalAltitude = ?
    WHERE id = ?
  `, [age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude, userId]);
  // const id = result.insertId
  return getProfile(userId);
}

// LOGIN / OUT API routes

async function login(username, password) {
  const [result] = await pool.query(`
    SELECT id
    FROM users
    WHERE name = ? AND password_hash = ?
  `, [username, password]);

  if (result.length === 0) {
    return res.send("Invalid username or password");
  } 

  return result[0];
}

app.post("/login", async (req, res) => {
  const user = await login(req.body.username, req.body.password);

  if (!user) {
    return res.send("invalid username or password");
  }

  req.session.number = user.id;

  await new Promise((resolve, reject) => {
    req.session.save(err => {
      if (err) reject(err);
      else resolve();
    });
  });

  res.redirect("/main");
});

app.post("/register", async (req, res) => {
  const [result] = await pool.query(`
    INSERT INTO users (password_hash, age, name, transport, gear, fitness, lookingFor, totalDistance, totalAltitude)
    VALUES (?, 18, ?, '[]', '[]', 'intermediate', '[]', 0, 0)
  `, [req.body.password, req.body.username])

  req.session.number = result.insertId;

  await new Promise((resolve, reject) => {
    req.session.save(err => {
      if (err) reject(err);
      else resolve();
    });
  });

  res.redirect("/main");
});

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/session-number", (req, res) => {
  res.json({ number: req.session.number || 0});
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/loggedout");
  });
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
  const {mountain_id, date, duration, weather, companions} = req.body;

  const createdCompletedClimb = await createCompletedClimb(req.session.number, mountain_id, date, duration, weather, companions);
  res.status(201).send(createdCompletedClimb);
}); 

app.post('/api/plannedClimb', async (req, res) => {
  const {mountain_id, date} = req.body;

  const createdPlannedClimb = await createPlannedClimb(req.session.number, mountain_id, date);
  res.status(201).send(createdPlannedClimb);
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
