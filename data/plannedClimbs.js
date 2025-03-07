export let plannedClimbs;

loadFromStorage();

export function loadFromStorage() {
  plannedClimbs = JSON.parse(localStorage.getItem('plannedClimbs'));

  if (!plannedClimbs) {
    plannedClimbs = [{
      mountainId: 'snow',
      date: "2025-08-04"
    },
    {
      mountainId: 'benn',
      date: "2025-06-12"
    }];
  }
}

function saveToStorage() {
  localStorage.setItem('plannedClimbs', JSON.stringify(plannedClimbs));
}

export function addPlannedClimb(mountainId, date) {
  // in time, I'll add to the array in a position according to the date.

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based i.e. jan = 0, feb =1
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`

  plannedClimbs.unshift({
    mountainId,
    date: formattedDate
  });

  saveToStorage();
}

