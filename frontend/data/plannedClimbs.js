export async function addPlannedClimb(mountain, date) {
  const response = await fetch('http://localhost:3000/api/plannedClimb', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      mountain_id: mountain,
      date, 
    })
  });
}

export async function deleteplannedClimb(plannedClimb) {
  const response = await fetch('http://localhost:3000/api/plannedClimb', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(plannedClimb)
  });
}

export let plannedClimbs = [];

export async function loadPlannedClimbsFetch() {
  const response = await fetch('http://localhost:3000/api/plannedClimbs', {credentials: 'include'});
  const data = await response.json();
  // mutate the existing array
  plannedClimbs.splice(0, plannedClimbs.length, ...data);
  console.log(plannedClimbs);
  return plannedClimbs;
}

