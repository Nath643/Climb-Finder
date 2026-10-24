export let profile = {};

export async function loadProfileFetch() {
  const response = await fetch('http://localhost:3000/api/profile', {credentials: 'include'});
  const data = await response.json();
  Object.assign(profile, Array.isArray(data) ? data[0] : data);
  return profile;
}

export async function updateProfile(profile) {
  console.log(profile);
  const response = await fetch('http://localhost:3000/api/profile', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(profile)
  });
}