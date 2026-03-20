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
  const response = await fetch('http://localhost:3000/api/mountains');
  const data = await response.json();
  // mutate the existing array
  mountains.splice(0, mountains.length, ...data);
  return mountains;
}