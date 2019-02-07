/* eslint-disable */
const qNavMenuWrapper = document.querySelector('.sidebar-menu__wrapper');
const qNavMenuIconWrapper = document.getElementById('mobile-nav-sidebar__wrapper');
const logOutButtons = document.querySelectorAll('.logout__btn');
const dropDownTriggerButton = document.querySelector('.dropdown-trigger-btn');
const dropDownMenu = document.querySelector('.q-user-profile__dropdown-menu');

document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    qNavMenuWrapper.classList.remove('nav-menu-show');
    qNavMenuIconWrapper.classList.toggle('change');
    dropDownMenu.classList.remove('show');
  }
};

qNavMenuIconWrapper.onclick = function toggleMobileNav() {
  this.classList.toggle('change');
  qNavMenuWrapper.classList.toggle('nav-menu-show');
};


const toggleDropDownMenu = () => {
  dropDownMenu.classList.toggle('show');
}

dropDownTriggerButton.onclick = toggleDropDownMenu;

logOutButtons.forEach((logOutBtn) => {
  logOutBtn.onclick = (e) => {
    e.preventDefault();
    logOutUser();
  }
})