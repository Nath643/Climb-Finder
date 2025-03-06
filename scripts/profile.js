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
      <h3>Your age: 21</h3>
      <button>Change your age</button> <!--perhaps a built input like calendar?-->
    </div>

    <div class="fitness-container profile-grid-subcontainer">
      <h3>Your fitness level: intermediate</h3>
      <button>Change your fitness level</button>
      <!-- <div class="fitness-levels">
        <a href="">Beginner</a>
        <a href="">Intermediate</a>
        <a href="">Strong</a>
        <a href="">Athlete</a>
      </div> DROP DOWN MENU-->
    </div>

    <div class="transport-container profile-grid-subcontainer">
      <h3>Your mode of transport: car</h3>
      <button>Change your mode of transport</button>
    </div>

    <div class="looking-for-container profile-grid-subcontainer">
      <h3>What you are looking for in climbing: exercise, views.</h3>
      <button>Change what you are looking for in climbing</button>
    </div>

    <div class="gear-container profile-grid-subcontainer">
      <h3>What gear you have:</h3>
      <ul>
        <li>A warm waterproof coat.</li>
        <li>A good pair of walking shoes or boots.</li>
        <li>A GPS.</li>
      </ul>
      <button>Change your gear</button>
    </div>

    <div class="stats-container profile-grid-subcontainer">
      <h3>Total distance completed: 34 miles</h3>
      <h3>Total altitude climbed: 21 miles</h3>
    </div>
  `;

  document.querySelector('.profile-grid').innerHTML = profileHTML;
}
