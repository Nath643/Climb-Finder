export let completedClimbs;

loadFromStorage();

export function loadFromStorage() {
  completedClimbs = JSON.parse(localStorage.getItem('completedClimbs'));

  if (!completedClimbs) {
    completedClimbs = [{
      mountainId: 'helv',
      date: '2015-05-12',
      duration: '2 hours 30 minutes',
      weather: 'clear',
      companions: [
        'Luke', 
        'Mike', 
        'Jill' 
      ]
    },
    {
      mountainId: 'blen',
      date: '2016-06-08',
      duration: '3 hours 55 minutes',
      weather: 'cloudy',
      companions: [
        'Bill',
        'Cindy', 
        'John'
      ]
    }];
  }
}

function saveToStorage() {
  localStorage.setItem('completedClimbs', JSON.stringify(completedClimbs));
}

export function addCompletedClimb(mountain, date, durationHours, durationMins, weather, companions) {
  // in time, I'll add to the array in a position according to the date.

  completedClimbs.unshift({
    mountainId: mountain,
    date,
    duration: `${durationHours} hours ${durationMins} minutes`,
    weather: weather,
    companions: companions
  });

  saveToStorage();
}