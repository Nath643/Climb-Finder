function showItems(menuName) {
  let menu = document.querySelector(menuName);

  if (menu.classList.contains('show-items')) {
    menu.classList.remove('show-items');
  } 
  else {
    menu.classList.add('show-items');
  }
}