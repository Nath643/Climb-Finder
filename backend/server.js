const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const fs = require('fs');
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5500', // front-end URL
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json({ limit: '10kb' }));

// middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


console.log("DB HOST:", process.env.MYSQL_HOST);

// Connect to database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: {
    ca: fs.readFileSync('./certs/ca.pem')
  }
}).promise();

pool.query('SELECT 1')
  .then(() => console.log('Connected to Aiven MySQL!'))
  .catch(err => console.error('Connection failed:', err));

// Create store
const sessionStore = new MySQLStore({}, pool);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,     // prevents JS access (XSS protection)
    secure: false,      // set true in HTTPS production
    sameSite: "lax"     // CSRF protection
  }
}));

function requireAuth(req, res, next) {
  if (!req.session?.number) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

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
}

async function createPlannedClimb(userId, mountain_id, date) {
  await pool.query(`
    INSERT INTO plannedclimbs (user_id, mountain_id, date)
    VALUES (?, ?, ?)
  `, [userId, mountain_id, date])
}

async function updateProfile(userId, age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude) {
  await pool.query(`
    UPDATE users
    SET age = ?, transport = ?, gear = ?, fitness = ?, lookingFor = ?, totalDistance = ?, totalAltitude = ?
    WHERE id = ?
  `, [age, transport, gear, fitness, lookingFor, totalDistance, totalAltitude, userId]);
}

app.use('/climb-route-maps', express.static(path.join(__dirname, 'public', 'climb-route-maps')));
app.use('/mountain-images', express.static(path.join(__dirname, 'public', 'mountain-images')));

// const publicPath = path.join(__dirname, 'public');

// // root  serves login page
// app.get('/', (req, res) => {
//   res.sendFile(path.join(publicPath, 'login.html'));
// });

// // protected main page
// app.get('/main', requireAuth, (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });

// static files after routes
// app.use(express.static(publicPath));

// LOGIN and REGISTER
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const [result] = await pool.query(
      `SELECT id, password_hash FROM users WHERE name = ?`,
      [username]
    );

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.number = user.id;

    req.session.save(() => {
      // res.redirect("/main");
      res.json({ success: true });
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
      // res.redirect("/main");
      res.json({ success: true });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    // res.redirect("/loggedout");
    res.json({ success: true });
  });
});

// app.get("/loggedout", (req, res) => {
//   res.sendFile(path.join(publicPath, 'login.html'));
// });

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

    if (!id || isNaN(Number(id))) {
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

    if (!id || isNaN(Number(id))) {
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

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
