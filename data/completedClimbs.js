import { formatDate } from "../utils/formatDate.js";
import { getMountain } from "./mountains.js";

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

  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based i.e. jan = 0, feb =1
  // const day = String(date.getDate()).padStart(2, '0');
  // const formattedDate = `${year}-${month}-${day}`

  completedClimbs.unshift({
    mountainId: mountain,
    date,
    duration: `${durationHours} hours ${durationMins} minutes`,
    weather: weather,
    companions: companions
  });

  saveToStorage();
}