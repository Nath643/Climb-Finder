export let profile;

loadFromStorage();

export function loadFromStorage() {
  profile = JSON.parse(localStorage.getItem('profile'));

  if (!profile) {
    profile = {
      age: 21,
      transport: [
        'Car',
        'Bike'
      ],
      gear: [
        "Waterproof-coat",
        "Walking-boots",
        "GPS"
      ],
      fitness: 'intermediate',
      lookingFor: [
        "Exercise",
        "Views"
      ],
      totalDistance: 34,
      totalAltitude: 21
    };
  }
}

export function saveToStorage() {
  localStorage.setItem('profile', JSON.stringify(profile));
}