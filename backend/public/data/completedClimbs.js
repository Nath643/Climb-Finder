// function saveToStorage() {
//   localStorage.setItem('completedClimbs', JSON.stringify(completedClimbs));
// }

// export function addCompletedClimb(mountain, date, durationHours, durationMins, weather, companions) {
//   // in time, I'll add to the array in a position according to the date.

//   completedClimbs.unshift({
//     mountainId: mountain,
//     date,
//     duration: `${durationHours} hours ${durationMins} minutes`,
//     weather: weather,
//     companions: companions
//   });

//   // saveToStorage();    // UPDATE THE WAY IT IS SAVED TO STORAGE
// }

export async function addCompletedClimb(mountain, date, durationHours, durationMins, weather, companions) {
  const response = await fetch('http://localhost:3000/api/completedClimb', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      mountainId: mountain,
      date, 
      duration: `${durationHours} hours ${durationMins} minutes`, 
      weather, 
      companions
    })
  });
}

// get the data from our backend:

export let completedClimbs = [];

export async function loadCompletedClimbsFetch() {
  const response = await fetch('http://localhost:3000/api/completedClimbs');
  const data = await response.json();
  // mutate the existing array
  completedClimbs.splice(0, completedClimbs.length, ...data);
  return completedClimbs;
}