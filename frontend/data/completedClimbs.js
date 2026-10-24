export async function addCompletedClimb(mountain, date, durationHours, durationMins, weather, companions) {
  const response = await fetch('http://localhost:3000/api/completedClimb',  {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      mountain_id: mountain,
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
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(completedClimb)
  });
}

export let completedClimbs = [];

export async function loadCompletedClimbsFetch() {
  const response = await fetch('http://localhost:3000/api/completedClimbs', {credentials: 'include'});
  const data = await response.json();
  // mutate the existing array
  completedClimbs.splice(0, completedClimbs.length, ...data);      // MAYBE PROBLEM CAUSE HERE
  console.log(completedClimbs);    
  return completedClimbs;
}