import { addPlannedClimb, plannedClimbs, loadPlannedClimbsFetch } from "../data/plannedClimbs.js";
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

await renderPlannedClimbs();

const url = new URL(window.location.href);
const formOpen = url.searchParams.get('formOpen');
const mountainId = url.searchParams.get('mountainId');

if (formOpen === 'true') {
  document.querySelector('.js-add-planned-climb-button').click();
  document.querySelector('.js-mountain-dropdown').value = `${mountainId}`;
}

async function renderPlannedClimbs() {
  console.log(plannedClimbs);
  await loadPlannedClimbsFetch();
  console.log(plannedClimbs);

  console.log(mountains);
  await loadMountainsFetch();
  console.log(mountains);

  let plannedClimbsHTML = `
    <div class="add-completed-mountain-section">
      <div class="plus-container">
        <img src="icons/plus.png" alt="a plus sign icon" class="plus-icon">
      </div>

      <div class="add-new-climb-button-container">
        <button class="add-new-climb-button js-add-planned-climb-button">Add new climb</button>
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

      <div class="buttons-container js-buttons-container">
        <button type="submit" class="js-submit-button">Submit</button>
        <button class="js-cancel-button">Cancel</button>
      </div>
    </div>
  `;

  function renderMountainsList(mountains) {
    let html = '<option value="" disabled selected>Select an option</option>';

    mountains.forEach((mountain) => {
      html += `<option value="${mountain.mountainId}">${mountain.name}</option>`;
    });

    return html;
  }

  plannedClimbs.forEach((plannedClimb) => {
    const mountain = getMountain(plannedClimb.mountainId);

    plannedClimbsHTML += `
      <div class="planned-climb-section">
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

            <div class="more-info-button-container">
              <a href="a-mountain-page.html?mountainId=${mountain.mountainId}">
                <button class="more-info-button">More Info About This Mountain</button>
              </a>
            </div>
          </div>
        </div>

        <div class="planned-climb-date">
          <h3>Date of Climb:</h3>
          <input type="date" class="climb-date-input" value=${plannedClimb.date}>
        </div>

        <div class="planned-climb-recommended">
          <h3>Recommended Gear:</h3>
          <ul>
            ${renderRecommendedGear(mountain)}
          </ul>
        </div>
      </div>
    `;
  });

  document.querySelector('.planned-climbs-grid').innerHTML = plannedClimbsHTML;

  function renderRecommendedGear(mountain) {
    let html = '';

    mountain.recommendedGear.forEach((gearItem) => {
      html += `
        <li>${gearItem}</li>
      `;
    });    

    return html;
  }

  document.querySelector('.js-add-planned-climb-button').addEventListener('click', () => {
    document.querySelector('.js-add-planned-climb-button').classList.add('climb-button-clicked');
    document.querySelector('.js-select-mountain').classList.remove('select-mountain');
    document.querySelector('.js-select-date').classList.remove('select-date');
    document.querySelector('.js-buttons-container').classList.remove('buttons-container');
  });

  document.querySelector('.js-submit-button').addEventListener('click', async () => {
    const mountain = document.querySelector('.js-mountain-dropdown').value;
    const date = document.querySelector('.js-climb-date').value;

    if (!mountain || !date) {
      alert("Please fill out fields");
    }
    else {
      addPlannedClimb(mountain, date);

      document.querySelector('.js-add-planned-climb-button').classList.remove('climb-button-clicked');
      document.querySelector('.js-select-mountain').classList.add('select-mountain');
      document.querySelector('.js-select-date').classList.add('select-date');
      document.querySelector('.js-buttons-container').classList.add('buttons-container');
      
      await renderPlannedClimbs();
    }
  });

  document.querySelector('.js-cancel-button').addEventListener('click', () => {
    // document.querySelector('.js-mountain-dropdown').value = '';

    document.querySelector('.js-add-planned-climb-button').classList.remove('climb-button-clicked');
    document.querySelector('.js-select-mountain').classList.add('select-mountain');
    document.querySelector('.js-select-date').classList.add('select-date');
    document.querySelector('.js-buttons-container').classList.add('buttons-container');
  });
}
