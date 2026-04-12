import { mountains, loadMountainsFetch } from "../data/mountains.js";

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

await renderAMountainPage();

async function renderAMountainPage() {
  await loadMountainsFetch();
  console.log(mountains);

  const url = new URL(window.location.href);
  const mountainId = url.searchParams.get('mountainId');

  let matchingMountain;

  mountains.forEach((mountain) => {
    if(mountain.mountain_id === mountainId) {
      matchingMountain = mountain;
    }

    return matchingMountain;
  });

  let aMountainHTML = `
    <section class="page-title">
      <h2>${matchingMountain.name}</h2>
    </section>

    <section class="a-mountain-grid">
      <div class="image-and-map-container">
        <div class="mountain-image-container">
          <img src="${matchingMountain.image}" alt="photo of ${matchingMountain.name} mountain." class="mountain-image">
        </div>

        <div class="map">
          ${matchingMountain.mapEmbed}
        </div>
      </div>

      <div class="climb-route-image-container">
        <img src="${matchingMountain.mapImage}" alt="photo of ${matchingMountain.name} mountain climb route map." class="climb-route-image">
      </div>

      <div class="mountain-info">
        <div class="mountain-description">
          <p>Height: ${matchingMountain.height} metres</p>
          <p>Difficulty: ${matchingMountain.difficulty}</p>
          <p>Views: ${matchingMountain.views}</p>
          <p>Total distance of the climb: ${matchingMountain.distance} miles</p>
        </div>

        <a href="planned-climbs.html?formOpen=true&mountainId=${matchingMountain.mountain_id}">
          <button class="add-to-planned-climbs-button js-add-to-planned-climbs-button">
            Add to planned climbs
          </button>
        </a>
        
        <a href="completed-climbs.html?formOpen=true&mountainId=${matchingMountain.mountain_id}">
          <button class="add-to-completed-climbs-button js-add-to-completed-climbs-button">
            Add to completed climbs
          </button>
        </a>
      </div>
    </section>
  `;

  document.querySelector('.a-mountain-main').innerHTML = aMountainHTML;
}