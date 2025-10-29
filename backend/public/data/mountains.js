export function getMountain(mountainId) {
  let matchingMountain;

  mountains.forEach((mountain) => {
    if (mountain.id === mountainId) {
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