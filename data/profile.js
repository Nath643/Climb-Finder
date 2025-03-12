export let profile;

loadFromStorage();

export function loadFromStorage() {
  profile = JSON.parse(localStorage.getItem('profile'));

  if (!profile) {
    profile = {
      age: 21,
      transport: [
        'car',
        'bike'
      ],
      gear: [
        "Waterproof coat",
        "Walking boots",
        "GPS"
      ],
      fitness: 'intermediate',
      lookingFor: [
        "exercise",
        "views"
      ],
      totalDistance: 34,
      totalAltitude: 21
    };
  }
}

export function saveToStorage() {
  localStorage.setItem('profile', JSON.stringify(profile));
}