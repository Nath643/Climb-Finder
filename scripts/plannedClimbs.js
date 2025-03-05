import { getMountain } from "../data/mountains.js";
import { plannedClimbs } from "../data/plannedClimbs.js";

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

renderPlannedClimbs();

function renderPlannedClimbs() {
  let plannedClimbsHTML = '';

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
              <a href="a-mountain-page.html?mountainId=${mountain.id}">
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
}

