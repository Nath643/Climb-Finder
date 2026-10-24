document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    username: form.username.value,
    password: form.password.value
  };

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", 
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    window.location.href = "/frontend/index.html";
  } else {
    alert(result.error || "Login failed");
  }
});



// CHECK CORS AND FILE PATH STUFF ^ ABSOLUTE PATH - GET IT WORKING - LOG THE SESSION NUMBER TO SEE IF WORKING. 

// this should really be in a data file. ^

// fix all the credentials include stuff in the frontend. 
// fix that mountains spread thing - its because the backend request is unauthroiese so doesnt' return array: add error handling and make backend request work (test for session number)

// do I only need to use credentials include on things where I've set something on the server endpoint?

//  Ensure cookie is actually set:

// After login, check DevTools → Application → Cookies → localhost:3000

// You should see something like:

// connect.sid

// If NOT:

// make sure backend has:
// app.use(cors({
//   origin: ["http://localhost:5500"],
//   credentials: true
// }));


// add the error handling in planned and completed climbs data files like done in mountains data file.


// same site lax or none?????


// ive got a basic portfolio project, a fullstack web app bulit with javascript vanilla front end, and nodejs and express backend, connects to a hosted mysql database hosted on aiven, I'm using localhost currently for the front and back end, and the front and back end are separate. I want to deploy it now, give me a simple and clear and practical guide