export function getMountain(mountain_id) {
  let matchingMountain;

  mountains.forEach((mountain) => {
    if (mountain.mountain_id === mountain_id) {
      matchingMountain = mountain;
    }
  });

  return matchingMountain;
}

export let mountains = [];

export async function loadMountainsFetch() {
  const response = await fetch('http://localhost:3000/api/mountains', {credentials: 'include'});

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();
  
  mountains.splice(0, mountains.length, ...data);     
  return mountains;
}