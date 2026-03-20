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