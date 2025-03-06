import { profile } from "../data/profile.js";

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

renderProfilePage();

function renderProfilePage() {
  let profileHTML = `
    <div class="age-container profile-grid-subcontainer">
      <h3>Your age: ${profile.age}</h3>
      <button>Change your age</button> <!--perhaps a built input like calendar?-->
    </div>

    <div class="fitness-container profile-grid-subcontainer">
      <h3>Your fitness level: ${profile.fitness}</h3>
      <button>Change your fitness level</button>
      <!-- <div class="fitness-levels">
        <a href="">Beginner</a>
        <a href="">Intermediate</a>
        <a href="">Strong</a>
        <a href="">Athlete</a>
      </div> DROP DOWN MENU-->
    </div>

    <div class="transport-container profile-grid-subcontainer">
      <h3>Your mode(s) of transport:</h3>
      <ul>
        ${renderTransport()}
      </ul>
      <button>Change your mode(s) of transport</button>
    </div>

    <div class="looking-for-container profile-grid-subcontainer">
      <h3>What you are looking for in climbing:</h3>
      <ul>
        ${renderLookingFor()}
      </ul>
      <button>Change what you are looking for in climbing</button>
    </div>

    <div class="gear-container profile-grid-subcontainer">
      <h3>What gear you have:</h3>
      <ul>
        ${renderGear()}
      </ul>
      <button>Change your gear</button>
    </div>

    <div class="stats-container profile-grid-subcontainer">
      <h3>Total distance completed: ${profile.totalDistance} miles</h3>
      <h3>Total altitude climbed: ${profile.totalAltitude} miles</h3>
    </div>
  `;

  function renderTransport() {
    let html = '';

    profile.transport.forEach((transportMethod) => {
      html += `
        <li>${transportMethod}</li>
      `;
    });

    return html;
  }

  function renderLookingFor() {
    let html = '';

    profile.lookingFor.forEach((lookingForItem) => {
      html += `
        <li>${lookingForItem}</li>
      `;
    });

    return html;
  }

  function renderGear() {
    let html ='';

    profile.gear.forEach((gearItem) => {
      html += `
        <li>${gearItem}</li>
      `;
    });

    return html;
  }

  document.querySelector('.profile-grid').innerHTML = profileHTML;
}
