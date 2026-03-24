const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const session = require('express-session');
const bcrypt = require('bcrypt');
dotenv.config();

const app = express();
const PORT = 3000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,     // prevents JS access (XSS protection)
    secure: false,      // set true in HTTPS production
    sameSite: "lax"     // CSRF protection
  }
}));

// Middleware to parse JSON requests
app.use(express.json({ limit: '10kb' }));

// middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

function requireAuth(req, res, next) {
  if (!req.session.number) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

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

async function createCompletedClimb(userId, mountain_id, date, duration, weather, companions) {
  await pool.query(`
    INSERT INTO completedclimbs (user_id, mountain_id, date, duration, weather, companions)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [userId, mountain_id, date, duration, weather, companions])
  // const id = result.insertId
  // return getCompletedClimb(mountain_id); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

async function createPlannedClimb(userId, mountain_id, date) {
  await pool.query(`
    INSERT INTO plannedclimbs (user_id, mountain_id, date)
    VALUES (?, ?, ?)
  `, [userId, mountain_id, date])
  // const id = result.insertId
  // return getPlannedClimb(mountain_id); // gets the first instance of the one with that mountain id, not the that was just created, you can alternatively just return all the arguments given to createCompletedClimb.
}

async function updateProfile(userId, age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude) {
  await pool.query(`
    UPDATE users
    SET age = ?, transport = ?, gear = ?, fitness = ?, lookingFor = ?, totalDistance = ?, totalAltitude = ?
    WHERE id = ?
  `, [age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude, userId]);
  // const id = result.insertId
  // return getProfile(userId);
}

// LOGIN and REGISTER

async function login(username, password) {
  const [result] = await pool.query(`
    SELECT id, password_hash
    FROM users
    WHERE name = ?
  `, [username]);

  if (result.length === 0) return null;

  const user = result[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  return { id: user.id };
}

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await login(username, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.number = user.id;

    req.session.save(() => {
      res.redirect("/main");
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid input types" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (password_hash, age, name, transport, gear, fitness, lookingFor, totalDistance, totalAltitude)
       VALUES (?, 18, ?, '[]', '[]', 'intermediate', '[]', 0, 0)`,
      [hashedPassword, username]
    );

    req.session.number = result.insertId;

    req.session.save(() => {
      res.redirect("/main");
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// app.get("/session-number", (req, res) => {
//   res.json({ number: req.session.number || 0});
// });

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/loggedout");
  });
});

app.get("/loggedout", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// API routes
app.get('/api/completedClimbs', requireAuth, async (req, res) => {
  const completedClimbsResult = await getCompletedClimbs(req.session.number);
  res.send(completedClimbsResult);
});

app.get('/api/mountains', requireAuth, async (req, res) => {
  const mountainsResult = await getMountains();
  res.send(mountainsResult);
});

app.get('/api/plannedClimbs', requireAuth, async (req, res) => {
  const plannedClimbsResult = await getPlannedClimbs(req.session.number);
  res.send(plannedClimbsResult);
});

app.get('/api/profile', requireAuth, async (req, res) => {
  try {
    const profileResult = await getProfile(req.session.number);
    res.json(profileResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put('/api/profile', requireAuth, async (req, res) => {
  try {
    const { age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude } = req.body;

    if (typeof age !== "number" || typeof fitness !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    const gearJson = Array.isArray(gear) ? JSON.stringify(gear) : gear;
    const transportJson = Array.isArray(transport) ? JSON.stringify(transport) : transport;
    const lookingForJson = Array.isArray(lookingFor) ? JSON.stringify(lookingFor) : lookingFor;

    const updatedProfile = await updateProfile(
      req.session.number,
      age,
      transportJson,
      gearJson,
      fitness,
      lookingForJson,
      totalDistance,
      totalAltitude
    );

    res.json(updatedProfile);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/api/completedClimb', requireAuth, async (req, res) => {
  try {
    const { mountain_id, date, duration, weather, companions } = req.body;

    if (!mountain_id || !date) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await createCompletedClimb(
      req.session.number,
      mountain_id,
      date,
      duration,
      weather,
      companions
    );

    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}); 

app.post('/api/plannedClimb', requireAuth, async (req, res) => {
  try {
    const { mountain_id, date } = req.body;

    if (!mountain_id || !date) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await createPlannedClimb(req.session.number, mountain_id, date);

    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete('/api/completedClimb', requireAuth, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || typeof id !== "number") {
      return res.status(400).json({ error: "Invalid id" });
    }

    await pool.query(
      `DELETE FROM completedclimbs WHERE id = ? AND user_id = ?`,
      [id, req.session.number]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete('/api/plannedClimb', requireAuth, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || typeof id !== "number") {
      return res.status(400).json({ error: "Invalid id" });
    }

    await pool.query(
      `DELETE FROM plannedclimbs WHERE id = ? AND user_id = ?`,
      [id, req.session.number]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// For any other route, serve index.html (supports SPA routing)
// // app.get(/.*/, (req, res) => {
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
