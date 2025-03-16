import { profile, loadFromStorage, saveToStorage } from "../data/profile.js";

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
      <button class="js-age-submit-button">Submit</button>
      <button>Change your age</button>
    </div>

    <div class="fitness-container profile-grid-subcontainer">
      <h3>Your fitness level: ${profile.fitness}</h3>
      <button class="js-beginner-fitness-button">Beginner</button>
      <button class="js-intermediate-fitness-button">Intermediate</button>
      <button class="js-strong-fitness-button">Strong</button>
      <button class="js-athlete-fitness-button">Athlete</button>
      <button>Change your fitness level</button>
    </div>

    <div class="transport-container profile-grid-subcontainer">
      <h3>Your mode(s) of transport:</h3>
      <ul>
        ${renderTransport()}
      </ul>
      <input type="text" class="transport-input js-transport-input" />
      <button class="js-transport-submit-button">Submit</button>
      <button>Change your mode(s) of transport</button>
    </div>

    <div class="looking-for-container profile-grid-subcontainer">
      <h3>What you are looking for in climbing:</h3>
      <ul>
        ${renderLookingFor()}
      </ul>
      <input type="text" class="looking-for-input js-looking-for-input" />
      <button class="js-looking-for-submit-button">Submit</button>
      <button>Change what you are looking for in climbing</button>
    </div>

    <div class="gear-container profile-grid-subcontainer">
      <h3>What gear you have:</h3>
      <ul>
        ${renderGear()}
      </ul>
      <input type="text" class="gear-input js-gear-input" />
      <button class="js-gear-submit-button">Submit</button>
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
      let transportMethodClassName = transportMethod;
      transportMethod = transportMethod.replace(/-/g, " ");

      html += `
        <li>${transportMethod} <button 
        class="transport-delete-button js-transport-delete-button js-transport-delete-button-${transportMethodClassName}">x</button></li>
      `;
    });

    return html;
  }

  function renderLookingFor() {
    let html = '';

    profile.lookingFor.forEach((lookingForItem) => {
      let lookingForItemClassName = lookingForItem;
      lookingForItem = lookingForItem.replace(/-/g, " ");

      html += `
        <li>${lookingForItem} <button 
        class="looking-for-delete-button js-looking-for-delete-button js-looking-for-delete-button-${lookingForItemClassName}">x</button></li>
      `;
    });

    return html;
  }

  function renderGear() {
    let html ='';

    profile.gear.forEach((gearItem) => {
      let gearItemClassName = gearItem;
      gearItem = gearItem.replace(/-/g, " ");

      html += `
        <li>${gearItem} <button class="gear-delete-button js-gear-delete-button js-gear-delete-button-${gearItemClassName}">x</button></li>
      `;
    });

    return html;
  }

  document.querySelector('.profile-grid').innerHTML = profileHTML;

  let transportDeleteButtons = document.querySelectorAll('.js-transport-delete-button');
  transportDeleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      let transportArray = profile.transport;

      transportArray.forEach((transportItem) => {
        if (button.classList.contains(`js-transport-delete-button-${transportItem}`)) {
          let index = transportArray.indexOf(`${transportItem}`);

          // we check if index is = -1, because if the item is not found in the array, and we try to remove the item at index -1, it wraps around and removes the last item in the array:
          if (index !== -1) {
            transportArray.splice(index, 1);
            saveToStorage();
            renderProfilePage();
          }
        }
      });
    });
  });

  let lookingForDeleteButtons = document.querySelectorAll('.js-looking-for-delete-button');
  lookingForDeleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      let lookingForArray = profile.lookingFor;

      lookingForArray.forEach((lookingForItem) => {
        if (button.classList.contains(`js-looking-for-delete-button-${lookingForItem}`)) {
          let index = lookingForArray.indexOf(`${lookingForItem}`);

          // we check if index is = -1, because if the item is not found in the array, and we try to remove the item at index -1, it wraps around and removes the last item in the array:
          if (index !== -1) {
            lookingForArray.splice(index, 1);
            saveToStorage();
            renderProfilePage();
          }
        }
      });
    });
  });

  let gearDeleteButtons = document.querySelectorAll('.js-gear-delete-button');
  gearDeleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      let gearArray = profile.gear;
      console.log(button.classList);

      gearArray.forEach((gearItem) => {
        console.log(gearItem);
        if (button.classList.contains(`js-gear-delete-button-${gearItem}`)) {
          let index = gearArray.indexOf(`${gearItem}`);
          
          // we check if index is = -1, because if the item is not found in the array, and we try to remove the item at index -1, it wraps around and removes the last item in the array:
          if (index !== -1) {
            gearArray.splice(index, 1);
            saveToStorage();
            renderProfilePage();
          }
        }
      });
    });
  });

  let ageSubmitButton = document.querySelector('.js-age-submit-button')
  ageSubmitButton.addEventListener('click', () => {
    let ageInputValue = document.querySelector('.js-age-input').value;
    if (ageInputValue > 0 && ageInputValue < 150) {
      profile.age = ageInputValue;
      saveToStorage();
      renderProfilePage();
    }
    else {
      return;
    }
  });
}
