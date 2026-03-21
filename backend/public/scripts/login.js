// unnecessary code, can be done in html form. 

// document.querySelector('.js-login-button').addEventListener('click', async () => {
//   let idInputValue = document.querySelector('.js-id-input').value;
//   console.log(idInputValue);

//   // const response = await fetch('http://localhost:3000/login', {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json'
//   //   },
//   //   body: JSON.stringify({number: Number(idInputValue)})
//   // });  

//   const response = await fetch('http://localhost:3000/login', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json'  
//     },
//     body: JSON.stringify({ number: Number(idInputValue) })  
//   });

//   console.log('Response status:', response.status);  
// })



// patch profile page to make it updatable, like did with all mountain pages
// then, 2 inputs on login page, one for username, one for password.
// send username and password to database and return a user id, load pages as already doing.

// then, registraion section: type a username and password, that will be added to the database. 