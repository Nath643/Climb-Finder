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

export async function deleteCompletedClimb(completedClimb) {
  const response = await fetch('http://localhost:3000/api/completedClimb', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(completedClimb)
  });
}

export let completedClimbs = [];

export async function loadCompletedClimbsFetch() {
  const response = await fetch('http://localhost:3000/api/completedClimbs');
  const data = await response.json();
  // mutate the existing array
  completedClimbs.splice(0, completedClimbs.length, ...data);
  return completedClimbs;
}