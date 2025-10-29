//GIT.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export let profile = {};

export async function loadProfileFetch() {
  const response = await fetch('http://localhost:3000/api/profile');
  const data = await response.json();
  // mutate the existing object
  Object.assign(profile, data);
  return profile;
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