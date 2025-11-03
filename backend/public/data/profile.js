//GIT.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ADD ROUGH USER LOCATION FOR PROFILE TO DETERMINE RECOMMENDED MODES OF TRANSPORT
// MAKE A LOGIN

export let profile = {};

export async function loadProfileFetch() {
  const response = await fetch('http://localhost:3000/api/profile');
  const data = await response.json();
  Object.assign(profile, Array.isArray(data) ? data[0] : data);
  return profile;
}

export async function updateProfile(profile) {
  console.log(profile);
  const response = await fetch('http://localhost:3000/api/profile', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(profile)
  });
}

// loadFromStorage();

// export function loadFromStorage() {
//   profile = JSON.parse(localStorage.getItem('profile'));

//   if (!profile) {
//     profile = {
//       age: 21,
//       transport: [
//         'Car',
//         'Bike'
//       ],
//       gear: [
//         "Waterproof-coat",
//         "Walking-boots",
//         "GPS"
//       ],
//       fitness: 'intermediate',
//       lookingFor: [
//         "Exercise",
//         "Views"
//       ],
//       totalDistance: 34,
//       totalAltitude: 21
//     };
//   }
// }

// export function saveToStorage() {
//   localStorage.setItem('profile', JSON.stringify(profile));
// }