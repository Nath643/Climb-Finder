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
      <input type="number" class="age-input js-age-input" />
      <button>Change your age</button> <!--perhaps a built input like calendar?-->
    </div>

    <div class="fitness-container profile-grid-subcontainer">
      <h3>Your fitness level: ${profile.fitness}</h3>
      <input type="text" class="fitness-input js-fitness-input" />
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
      <input type="text" class="transport-input js-transport-input" />
      <button>Change your mode(s) of transport</button>
    </div>

    <div class="looking-for-container profile-grid-subcontainer">
      <h3>What you are looking for in climbing:</h3>
      <ul>
        ${renderLookingFor()}
      </ul>
      <input type="text" class="looking-for-input js-looking-for-input" />
      <button>Change what you are looking for in climbing</button>
    </div>

    <div class="gear-container profile-grid-subcontainer">
      <h3>What gear you have:</h3>
      <ul>
        ${renderGear()}
      </ul>
      <input type="text" class="gear-input js-gear-input" />
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
        <li>${transportMethod} <button 
        class="transport-delete-button js-transport-delete-button js-transport-delete-button-${transportMethod}">x</button></li>
      `;
    });

    return html;
  }

  function renderLookingFor() {
    let html = '';

    profile.lookingFor.forEach((lookingForItem) => {
      html += `
        <li>${lookingForItem} <button 
        class="looking-for-delete-button js-looking-for-delete-button js-looking-for-delete-button-${lookingForItem}">x</button></li>
      `;
    });

    return html;
  }

  function renderGear() {
    let html ='';

    profile.gear.forEach((gearItem) => {
      html += `
        <li>${gearItem} <button class="gear-delete-button js-gear-delete-button js-gear-delete-button-${gearItem}">x</button></li>
      `;
    });

    return html;
  }

  document.querySelector('.profile-grid').innerHTML = profileHTML;

  let deleteButtons = document.querySelectorAll('.js-transport-delete-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      let transportArray = profile.transport;

      transportArray.forEach((transportItem) => {
        if (button.classList.contains(`js-transport-delete-button-${transportItem}`)) {
          // transportArray.removeItem(`${transportItem}`);
          let index = transportArray.indexOf(`${transportItem}`);

          // we check if index is = -1, because if the item is not found in the array, and we try to remove the item at index -1, it wraps around and removes the last item in the array:
          if (index !== -1) {
            transportArray.splice(index, 1);
          }
        }
      });
    });
  });
}
