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

await renderRecommendedMountains();

async function renderRecommendedMountains() {
  await loadMountainsFetch();
  console.log(mountains);
  
  let recommendedMountainsHTML = '';

  mountains.forEach((mountain) => {
    const mountainId = mountain.mountain_id;
    const mountainName = mountain.name;
    const mountainImage = mountain.image;
    const mountainMap = mountain.mapEmbed;
    const mountainHeight = mountain.height;
    const mountainDifficulty = mountain.difficulty;
    const mountainClimbDistance = mountain.distance;

    recommendedMountainsHTML += `
      <div class="recommended-mountain-section">
        <div class="mountain-image-container">
          <img src="${mountainImage}" alt="photo of ${mountainName}" class="mountain-image">
        </div>

        <div class="map">
          ${mountainMap}
        </div>

        <div class="mountain-info">
          <div class="mountain-name">
            <h3>${mountainName}</h3>
          </div>

          <div class="mountain-description">
            <p>Height: ${mountainHeight} metres</p>
            <p>Difficulty: ${mountainDifficulty}</p>
            <p>Total distance of the climb: ${mountainClimbDistance} miles</p>
          </div>
        </div>

        <div class="more-info-button-container">
          <a href="a-mountain-page.html?mountainId=${mountainId}">
            <button class="more-info-button">More Info About This Mountain</button>
          </a>
        </div>
      </div>
    `;
  })

  document.querySelector('.recommended-mountains-grid').innerHTML = recommendedMountainsHTML;
}

