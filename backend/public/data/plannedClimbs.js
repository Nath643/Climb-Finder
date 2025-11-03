// loadFromStorage();

// export function loadFromStorage() {
//   plannedClimbs = JSON.parse(localStorage.getItem('plannedClimbs'));

//   if (!plannedClimbs) {
//     plannedClimbs = [{
//       mountainId: 'snow',
//       date: "2025-08-04"
//     },
//     {
//       mountainId: 'benn',
//       date: "2025-06-12"
//     }];
//   }
// }

// function saveToStorage() {
//   localStorage.setItem('plannedClimbs', JSON.stringify(plannedClimbs));
// }

// export function addPlannedClimb(mountainId, date) {
//   // in time, I'll add to the array in a position according to the date.

//   plannedClimbs.unshift({
//     mountainId,
//     date
//   });

//   // saveToStorage();
// }

export async function addPlannedClimb(mountain, date) {
  const response = await fetch('http://localhost:3000/api/plannedClimb', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      mountainId: mountain,
      date, 
    })
  });
}

export async function deleteplannedClimb(plannedClimb) {
  const response = await fetch('http://localhost:3000/api/plannedClimb', {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(plannedClimb)
  });
}

export let plannedClimbs = [];

export async function loadPlannedClimbsFetch() {
  const response = await fetch('http://localhost:3000/api/plannedClimbs');
  const data = await response.json();
  // mutate the existing array
  plannedClimbs.splice(0, plannedClimbs.length, ...data);
  return plannedClimbs;
}

