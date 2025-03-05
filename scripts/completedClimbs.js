import { getMountain } from "../data/mountains.js";
import { completedClimbs } from "../data/completedClimbs.js";

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

renderCompletedClimbs();

function renderCompletedClimbs() {
  let completedClimbsHTML = '';
  
  completedClimbs.forEach((climb) => {
    const mountain = getMountain(climb.mountainId);

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
          <p>Date: ${climb.date}</p>
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

  completedClimbsHTML += `
    <div class="add-completed-mountain-section">
    <div class="plus-container">
      <img src="icons/plus.png" alt="a plus sign icon" class="plus-icon">
    </div>

    <div class="add-new-climb-button-container">
      <button class="add-new-climb-button">Add new climb</button>
    </div>
  `;
  
  document.querySelector('.completed-mountains-grid').innerHTML = completedClimbsHTML;
}

