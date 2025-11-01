// import { addCompletedClimb, loadCompletedClimbsFetch, completedClimbs } from "../data/completedClimbs.js";
// import { formatDate } from "../utils/formatDate.js";
// import { getMountain, mountains } from "../data/mountains.js";

// console.log(completedClimbs);
// await loadCompletedClimbsFetch();
// console.log(completedClimbs);

// // ----------------- MENU TOGGLE -----------------
// document.querySelector('.hamburger-menu-button').addEventListener('click', () => {
//   toggleMenu('.pages');
// });

// document.querySelector('.country-button').addEventListener('click', () => {
//   toggleMenu('.countries');
// });

// function toggleMenu(menuSelector) {
//   const menu = document.querySelector(menuSelector);
//   menu.classList.toggle('show-items');
// }

// // ----------------- URL PARAMETERS -----------------
// const url = new URL(window.location.href);
// const formOpen = url.searchParams.get('formOpen');
// const mountainId = url.searchParams.get('mountainId');

// // ----------------- RENDER COMPLETED CLIMBS -----------------
// renderCompletedClimbs();

// async function renderCompletedClimbs() {
//   // Fetch completed climbs
//   const completedClimbs = await loadCompletedClimbsFetch();

//   // Initial HTML for adding a new climb
//   let completedClimbsHTML = `
//     <div class="add-completed-mountain-section">
//       <div class="plus-container">
//         <img src="icons/plus.png" alt="a plus sign icon" class="plus-icon">
//       </div>

//       <div class="add-new-climb-button-container">
//         <button class="add-new-climb-button js-add-completed-climb-button">Add new climb</button>
//       </div>

//       <div class="select-mountain js-select-mountain">
//         <p>Mountain climbed:</p>
//         <select class="js-mountain-dropdown" name="dropdown">
//           ${renderMountainsList(mountains)}
//         </select>
//       </div>

//       <div class="select-date js-select-date">
//         <p>Date of climb:</p>
//         <input type="date" class="js-climb-date" name="date" max="${new Date().toISOString().split('T')[0]}" required />
//       </div>

//       <div class="select-duration js-select-duration">
//         <p>Duration of climb (hours, minutes):</p>
//         <input type="number" class="js-duration-hours" name="duration-hours" />
//         <input type="number" class="js-duration-mins" name="duration-mins" />
//       </div>

//       <div class="select-weather-conditions js-select-weather-conditions">
//         <p>Weather conditions:</p>
//         <select class="js-weather-dropdown" name="dropdown">
//           <option value="" disabled selected>Select an option</option>
//           <option value="clear">Clear</option>
//           <option value="overcast">Overcast</option>
//           <option value="raining">Raining</option>
//           <option value="snow">Snow</option>
//           <option value="storm">Storm</option>
//         </select>
//       </div>

//       <div class="select-companions js-select-companions">
//         <p>Companions:</p>
//         <input type="text" class="js-companions-input" name="companions-input" />
//       </div>

//       <div class="buttons-container js-buttons-container">
//         <button type="submit" class="js-submit-button">Submit</button>
//         <button class="js-cancel-button">Cancel</button>
//       </div>
//     </div>
//   `;

//   function renderMountainsList(mountains) {
//     return [
//       '<option value="" disabled selected>Select an option</option>',
//       ...mountains.map(m => `<option value="${m.id}">${m.name}</option>`)
//     ].join('');
//   }

//   // Render each completed climb
//   completedClimbs.forEach((climb) => {
//     const mountain = getMountain(climb.mountainId);

//     completedClimbsHTML += `
//       <div class="completed-mountain-section">
//         <div class="green-circle-container">
//           <div class="green-circle"></div>
//         </div>

//         <div class="mountain-image-container">
//           <img src="${mountain.image}" alt="photo of ${mountain.name} mountain." class="mountain-image">
//         </div>

//         <div class="mountain-info">
//           <div class="mountain-name">
//             <h3>${mountain.name}</h3>
//           </div>

//           <div class="mountain-description">
//             <p>Height: ${mountain.height} metres</p>
//             <p>Difficulty: ${mountain.difficulty}</p>
//             <p>Total distance of the climb: ${mountain.distance} miles</p>
//           </div>
//         </div>

//         <div class="climb-info">
//           <p>Date: ${formatDate(climb.date)}</p>
//           <p>Duration: ${climb.duration}</p>
//           <p>Weather conditions: ${climb.weather}</p>
//           <p>Companions: ${climb.companions}</p>
//         </div>

//         <div class="more-info-button-container">
//           <a href="a-mountain-page.html?mountainId=${mountain.id}">
//             <button class="more-info-button">More Info About This Mountain</button>
//           </a>
//         </div>
//       </div>
//     `;
//   });

//   document.querySelector('.completed-mountains-grid').innerHTML = completedClimbsHTML;

//   // ----------------- ADD/SHOW FORM -----------------
//   const addButton = document.querySelector('.js-add-completed-climb-button');
//   if (formOpen === 'true') {
//     addButton.click();
//     document.querySelector('.js-mountain-dropdown').value = mountainId;
//   }

//   addButton.addEventListener('click', () => {
//     addButton.classList.add('climb-button-clicked');
//     ['.js-select-mountain', '.js-select-date', '.js-select-companions', '.js-select-duration', '.js-select-weather-conditions', '.js-buttons-container']
//       .forEach(selector => document.querySelector(selector).classList.remove(selector.replace(/\./, '')));
//   });

//   // ----------------- SUBMIT -----------------
//   document.querySelector('.js-submit-button').addEventListener('click', () => {
//     const mountain = document.querySelector('.js-mountain-dropdown').value;
//     const date = document.querySelector('.js-climb-date').value;
//     const durationHours = document.querySelector('.js-duration-hours').value;
//     const durationMins = document.querySelector('.js-duration-mins').value;
//     const weather = document.querySelector('.js-weather-dropdown').value;
//     const companions = document.querySelector('.js-companions-input').value;

//     if (!mountain || !date || !durationHours || !durationMins || !weather || !companions) {
//       alert("Please fill out fields");
//       return;
//     }

//     addCompletedClimb(mountain, date, durationHours, durationMins, weather, companions);
//     renderCompletedClimbs(); // Re-render after adding

//     // Reset form
//     addButton.classList.remove('climb-button-clicked');
//     ['.js-select-mountain', '.js-select-date', '.js-select-companions', '.js-select-duration', '.js-select-weather-conditions', '.js-buttons-container']
//       .forEach(selector => document.querySelector(selector).classList.add(selector.replace(/\./, '')));
//   });

//   // ----------------- CANCEL -----------------
//   document.querySelector('.js-cancel-button').addEventListener('click', () => {
//     addButton.classList.remove('climb-button-clicked');
//     ['.js-select-mountain', '.js-select-date', '.js-select-companions', '.js-select-duration', '.js-select-weather-conditions', '.js-buttons-container']
//       .forEach(selector => document.querySelector(selector).classList.add(selector.replace(/\./, '')));
//   });
// }


import { addCompletedClimb, loadCompletedClimbsFetch, completedClimbs } from "../data/completedClimbs.js";
import { formatDate } from "../utils/formatDate.js";
import { getMountain, mountains, loadMountainsFetch } from "../data/mountains.js";

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

const url = new URL(window.location.href);
const formOpen = url.searchParams.get('formOpen');
const mountainId = url.searchParams.get('mountainId');

if (formOpen === 'true') {
  document.querySelector('.js-add-completed-climb-button').click();
  document.querySelector('.js-mountain-dropdown').value = `${mountainId}`;
}

// const urlWithoutParams = window.location.origin + window.location.pathname;
// window.history.replaceState({}, document.title, urlWithoutParams);

async function renderCompletedClimbs() {
  console.log(completedClimbs);
  await loadCompletedClimbsFetch();
  console.log(completedClimbs);

  console.log(mountains);
  await loadMountainsFetch();
  console.log(mountains);

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
      html += `<option value="${mountain.id}">${mountain.name}</option>`;
    });

    return html;
  }
  
  completedClimbs.forEach((climb) => {
    console.log(climb.mountainId);
    console.log(getMountain());
    const mountain = getMountain(climb.mountainId);
    console.log(mountain);

    completedClimbsHTML += `
      <div class="completed-mountain-section">
        <div class="green-circle-container">
          <div class="green-circle"></div>
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
          <a href="a-mountain-page.html?mountainId=${mountain.id}">
            <button class="more-info-button">More Info About This Mountain</button>
          </a>
        </div>
      </div>
    `;
  });

  // function renderCompanions(climb) {
  //   let html = '';

  //   climb.companions.forEach((companion) => {
  //     html += `
  //       <span>${companion}.</span>
  //     `;
  //   });

  //   return html;
  // }

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
    const mountain = document.querySelector('.js-mountain-dropdown').value;
    const date = document.querySelector('.js-climb-date').value;
    const durationHours = document.querySelector('.js-duration-hours').value;
    const durationMins = document.querySelector('.js-duration-mins').value;
    const weather = document.querySelector('.js-weather-dropdown').value;
    const companions = document.querySelector('.js-companions-input').value;

    if (!mountain || !date || !durationHours || !durationMins || !weather || !companions) {
      alert("Please fill out fields");
    }
    else {
      await addCompletedClimb(mountain, date, durationHours, durationMins, weather, companions);

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
}

