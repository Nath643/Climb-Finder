import { addCompletedClimb, deleteCompletedClimb, loadCompletedClimbsFetch, completedClimbs } from "../data/completedClimbs.js";
import { formatDate } from "../utils/formatDate.js";
import { getMountain, mountains, loadMountainsFetch } from "../data/mountains.js";
import { updateProfile, profile, loadProfileFetch } from "../data/profile.js";

document.querySelector('.hamburger-menu-button').addEventListener('click', () => {
  showItems('.pages');
});

document.querySelector('.country-button').addEventListener('click', () => {
  showItems('.countries');
});

function showItems(menuName) {
  let menu = document.querySelector(menuName);

  if (menu.classList.contains('show-items')) {
    menu.classList.remove('show-items');
  } 
  else {
    menu.classList.add('show-items');
  }
}

await renderCompletedClimbs();

// async function loadSessionNumber() {
//   try {
//     const res = await fetch('/session-number', {
//       credentials: 'same-origin'
//     });        // wait for fetch
//     const data = await res.json();                     // wait for JSON parsing
//     console.log("Number from session:", data.number);  // log in console
//     // document.getElementById('output').textContent = "Number: " + data.number;
//   } catch (err) {
//     console.error("Error fetching session number:", err);
//   }
// }

// loadSessionNumber();

const url = new URL(window.location.href);
const formOpen = url.searchParams.get('formOpen');
const mountain_id = url.searchParams.get('mountainId');

if (formOpen === 'true') {
  document.querySelector('.js-add-completed-climb-button').click();
  document.querySelector('.js-mountain-dropdown').value = `${mountain_id}`;
}

// const urlWithoutParams = window.location.origin + window.location.pathname;
// window.history.replaceState({}, document.title, urlWithoutParams);

async function calculateDistanceAndAltitude() {
  await loadCompletedClimbsFetch();
  await loadMountainsFetch();
  await loadProfileFetch();
  console.log(completedClimbs);
  console.log(profile);

  //loop through the array, and get the 2 numbers
  let completedClimbsDistance = 0;
  let completedClimbsAltitude = 0;

  completedClimbs.forEach((completedClimb) => {
    const mountain = getMountain(completedClimb.mountain_id);
    completedClimbsDistance += mountain.distance;
    console.log(completedClimbsDistance);
  });

  completedClimbs.forEach((completedClimb) => {
    const mountain = getMountain(completedClimb.mountain_id);
    completedClimbsAltitude += mountain.height;
    console.log(completedClimbsAltitude);
  });

  // change those in profile
  profile.totalDistance = completedClimbsDistance;
  profile.totalAltitude = completedClimbsAltitude;
  console.log(profile);

  // update profile
  updateProfile(profile);
}

async function renderCompletedClimbs() {
  console.log(completedClimbs);
  await loadCompletedClimbsFetch();
  console.log(completedClimbs);

  //console.log(mountains);
  await loadMountainsFetch();
  console.log(mountains);

  console.log(completedClimbs);

  let completedClimbsHTML = `
    <div class="add-completed-mountain-section">
      <div class="plus-container">
        <img src="icons/plus.png" alt="a plus sign icon" class="plus-icon">
      </div>

      <div class="add-new-climb-button-container">
        <button class="add-new-climb-button js-add-completed-climb-button">Add new climb</button>
      </div>

      <div class="select-mountain js-select-mountain">
        <p>Mountain climbed:</p>
        <select class="js-mountain-dropdown" name="dropdown">
          ${renderMountainsList(mountains)}
        </select>
      </div>

      <div class="select-date js-select-date">
        <p>Date of climb:</p>
        <input type="date" class="js-climb-date" name="date" max="${new Date()}" required />
      </div>

      <div class="select-duration js-select-duration">
        <p>Duration of climb (hours, minutes):</p>
        <input type="number" class="js-duration-hours" name="duration-hours" />
        <input type="number" class="js-duration-mins" name="duration-mins" />
      </div>

      <div class="select-weather-conditions js-select-weather-conditions">
        <p>Weather conditions:</p>
        <select class="js-weather-dropdown" name="dropdown">
          <option value="" disabled selected>Select an option</option>
          <option value="clear">Clear</option>
          <option value="overcast">Overcast</option>
          <option value="raining">Raining</option>
          <option value="snow">Snow</option>
          <option value="storm">Storm</option>
        </select>
      </div>

      <div class="select-companions js-select-companions">
        <p>Companions:</p>
        <input type="text" class="js-companions-input" name="companions-input" />
      </div>

      <div class="buttons-container js-buttons-container">
        <button type="submit" class="js-submit-button">Submit</button>
        <button class="js-cancel-button">Cancel</button>
      </div>
    </div>
  `;

  function renderMountainsList(mountains) {
    let html = '<option value="" disabled selected>Select an option</option>';

    mountains.forEach((mountain) => {
      html += `<option value="${mountain.mountain_id}">${mountain.name}</option>`;
    });

    return html;
  }
  
  completedClimbs.forEach((climb) => {
    console.log(climb);
    //console.log(getMountain());
    console.log(climb.mountain_id);
    const mountain = getMountain(climb.mountain_id);
    console.log(mountain);

    completedClimbsHTML += `
      <div class="completed-mountain-section">
        <div class="delete-completed-climb-button-container">
          <button class="delete-completed-climb-button js-delete-completed-climb-button js-delete-completed-climb-button-${climb.id}">x</button>
        </div>

        <div class="mountain-image-container">
          <img src="${mountain.image}" alt="photo of ${mountain.name} mountain." class="mountain-image">
        </div>

        <div class="mountain-info">
          <div class="mountain-name">
            <h3>${mountain.name}</h3>
          </div>

          <div class="mountain-description">
            <p>Height: ${mountain.height} metres</p>
            <p>Difficulty: ${mountain.difficulty}</p>
            <p>Total distance of the climb: ${mountain.distance} miles</p>
          </div>
        </div>

        <div class="climb-info">
          <p>Date: ${formatDate(climb.date)}</p>
          <p>Duration: ${climb.duration}</p>
          <p>Weather conditions: ${climb.weather}</p>
          <p>Companions: ${climb.companions}</p>
        </div>

        <div class="more-info-button-container">
          <a href="a-mountain-page.html?mountainId=${mountain.mountain_id}">
            <button class="more-info-button">More Info About This Mountain</button>
          </a>
        </div>
      </div>
    `;
  });

  document.querySelector('.completed-mountains-grid').innerHTML = completedClimbsHTML;

  document.querySelector('.js-add-completed-climb-button').addEventListener('click', () => {
    document.querySelector('.js-add-completed-climb-button').classList.add('climb-button-clicked');
    document.querySelector('.js-select-mountain').classList.remove('select-mountain');
    document.querySelector('.js-select-date').classList.remove('select-date');
    document.querySelector('.js-select-companions').classList.remove('select-companions');
    document.querySelector('.js-select-duration').classList.remove('select-duration');
    document.querySelector('.js-select-weather-conditions').classList.remove('select-weather-conditions');
    document.querySelector('.js-buttons-container').classList.remove('buttons-container');
  });

  document.querySelector('.js-submit-button').addEventListener('click', async () => {
    const mountainInput = document.querySelector('.js-mountain-dropdown').value;
    console.log(mountainInput);
    const date = document.querySelector('.js-climb-date').value;
    const durationHours = document.querySelector('.js-duration-hours').value;
    const durationMins = document.querySelector('.js-duration-mins').value;
    const weather = document.querySelector('.js-weather-dropdown').value;
    const companions = document.querySelector('.js-companions-input').value;

    if (!mountainInput || !date || !durationHours || !durationMins || !weather || !companions) {
      alert("Please fill out fields");
    }
    else {
      await addCompletedClimb(mountainInput, date, durationHours, durationMins, weather, companions);
      await calculateDistanceAndAltitude();

      document.querySelector('.js-add-completed-climb-button').classList.remove('climb-button-clicked');
      document.querySelector('.js-select-mountain').classList.add('select-mountain');
      document.querySelector('.js-select-date').classList.add('select-date');
      document.querySelector('.js-select-companions').classList.add('select-companions');
      document.querySelector('.js-select-duration').classList.add('select-duration');
      document.querySelector('.js-select-weather-conditions').classList.add('select-weather-conditions');
      document.querySelector('.js-buttons-container').classList.add('buttons-container');
      
      await renderCompletedClimbs();
    }
  });

  document.querySelector('.js-cancel-button').addEventListener('click', () => {
    // document.querySelector('.js-mountain-dropdown').value = '';
    
    document.querySelector('.js-add-completed-climb-button').classList.remove('climb-button-clicked');
    document.querySelector('.js-select-mountain').classList.add('select-mountain');
    document.querySelector('.js-select-date').classList.add('select-date');
    document.querySelector('.js-select-companions').classList.add('select-companions');
    document.querySelector('.js-select-duration').classList.add('select-duration');
    document.querySelector('.js-select-weather-conditions').classList.add('select-weather-conditions');
    document.querySelector('.js-buttons-container').classList.add('buttons-container');
  });

  let deleteButtons = document.querySelectorAll('.js-delete-completed-climb-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async () => {

      // Extract climb ID from class name
      const idClass = Array.from(button.classList).find(cls => 
        cls.startsWith('js-delete-completed-climb-button-')
      );
      if (!idClass) return;
      const climbId = idClass.split('-').pop();

      const climb = completedClimbs.find(climb => climb.id == climbId);
      console.log(climb);

      await deleteCompletedClimb(climb);
      await calculateDistanceAndAltitude();
      await renderCompletedClimbs();
    });
  });
}

