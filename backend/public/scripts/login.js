// make it so that when you click the login button, it logs in user 1.
  // on the main and completed climbs pages, there is a session which stores the number 1 which is the id of the 1st user. 
  // redo the queries to the database for the dynamic loading (ref to examples of this already in server!), make it work for user 1 - get all of user 1s data and load that.

  // (server code) - that is my server code, I set the session.number in the post login route, but I want to access it in the get completed climbs function, because instead of hard coding where users = 1 in that function, I want to put the session.number! 

// The log out button should then do something like kill the session and redirect to the login page, which it already does. 




// very short answer: I just want to practice with sessions, how do I store simple info in a session and just display it on the page (very quickly): like when the login button is clicked, the number 1 is stored in a session, then displayed on the main page that the user is redirected to?


//I want to build a very basic first log in system (that doesn't have to be secure yet - just very basic) into my web app made with javascript, and express js, and mysql, I understand that I need to use sessions/cookies for this, so in very simple terms, and fairly short, teach me how to use sessions / cookies in a general sense, to start I want to just make my app such that you click a button on the log in page, and you are redirected to the main page of the app, with some data being carried in a session/cookie, like a simulated log in system

document.querySelector('.js-login-button').addEventListener('click', async () => {
  // const html = await (await fetch('http://localhost:3000/index.html')).text();
  // document.open();
  // document.write(html);
  // document.close();

  // const response = await fetch('http://localhost:3000/index.html');
  // const html = await response.text();  // Store the resulting file content
  // window.location.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

  // window.location.href = 'http://localhost:3000/index.html';  // Server handles redirect

  let idInputValue = document.querySelector('.js-id-input').value;
  console.log(idInputValue);

  
})


// ref to notebook and crate users table , ai example for below code:
// CREATE TABLE users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   hash VARCHAR(255) NOT NULL,          -- bcrypt hashed password
//   name VARCHAR(255),
//   favorite VARCHAR(255),               -- whatever "favorite" thing you want to store
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// server.js – understand, dont just input

// // Regular mysql connection (callback style)
// const connection = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'mydb'
// });


// // Helper to promisify queries (so we can still use async/await)
// const query = (sql, params) => {
//   return new Promise((resolve, reject) => {
//     connection.query(sql, params, (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });
// };

// // Middleware
// app.use(cookieParser());
// app.use(session({
//   secret: 'super-random-secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 24*60*60*1000 }
// }));
// app.use(express.json());
// app.use(express.static('public'));

// // 1. Get current user
// app.get('/api/me', (req, res) => {
//   res.json(req.session.user || null);
// });

// // 2. Register
// app.post('/api/register', async (req, res) => {
//   const { email, password, name, favorite } = req.body;
//   const hash = await bcrypt.hash(password, 10);

//   try {
//     await query('INSERT INTO users (email, hash, name, favorite) VALUES (?, ?, ?, ?)', 
//                 [email, hash, name, favorite]);
//     res.json({ success: true });
//   } catch (e) {
//     if (e.code === 'ER_DUP_ENTRY') {
//       res.status(400).json({ error: 'Email already exists' });
//     } else {
//       res.status(500).json({ error: 'Database error' });
//     }
//   }
// });

// // 3. Login
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const results = await query('SELECT * FROM users WHERE email = ?', [email]);
//     const user = results[0];

//     if (user && await bcrypt.compare(password, user.hash)) {
//       req.session.user = { email, name: user.name, favorite: user.favorite };
//       res.json({ success: true, user: req.session.user });
//     } else {
//       res.status(401).json({ error: 'Wrong credentials' });
//     }
//   } catch (e) {
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // 4. Logout
// app.get('/api/logout', (req, res) => {
//   req.session.destroy(() => res.json({ success: true }));
// });

// app.listen(3000, () => console.log('http://localhost:3000'));
