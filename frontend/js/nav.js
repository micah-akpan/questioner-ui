const logOutButtons = document.querySelectorAll('.logout__btn');

// Right Nav Profile Dropdown menu
const dropDownTriggerButton = document.querySelector('.dropdown-trigger-btn');
const dropDownMenu = document.querySelector('.q-user-profile__dropdown-menu');
const rightNavBarList = document.querySelector('.q-right-nav > ul');

// Mobile Nav Dropdown Menu
const mobileNavIconsBlock = document.getElementById('mobile-nav-sidebar__wrapper');
const mobileNavMenuBlock = document.querySelector('.sidebar-menu__wrapper');

const baseURL = 'http://localhost:9999/api/v1';
const nav = document.querySelector('.q-right-nav');

document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    mobileNavMenuBlock.classList.remove('nav-menu-show');
    mobileNavIconsBlock.classList.toggle('change');
    dropDownMenu.classList.remove('show');
  }
};

mobileNavIconsBlock.onclick = function toggleMobileNav() {
  mobileNavMenuBlock.classList.toggle('nav-menu-show');
  this.classList.toggle('change');
};

/**
 * @func toggleDropDownMenu
 * @returns {HTMLElement} Returns the dropdown HTML element
 */
const toggleDropDownMenu = () => {
  dropDownMenu.classList.toggle('show');
  return dropDownMenu;
};

if (dropDownTriggerButton) {
  dropDownTriggerButton.onclick = toggleDropDownMenu;
}

// Enable all logout buttons to logout a user
logOutButtons.forEach((logOutBtn) => {
  logOutBtn.onclick = (e) => {
    e.preventDefault();
    logOutUser();
  };
});

/**
 * @func getUserData
 * @param {Number} userId
 * @returns {Promise<User>} Returns the user with id: `userId`
 */
const getUserData = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    });
    const responseBody = await response.json();
    const { status, data } = responseBody;
    return status === 200 ? data[0] : null;
  } catch (e) {
    throw e;
  }
};

/**
 * @func getUserImage
 * @returns {Promise<String>} Resolves to the user avatar image
 */
const getUserImage = () => {
  const userId = localStorage.getItem('userId');
  return getUserData(userId)
    .then((user) => {
      if (user && user.avatar) {
        return user.avatar;
      }
      return '../assets/icons/avatar1.svg';
    })
    .catch((err) => {
      throw err;
    });
};

const createUserNameInitials = (user) => {
  const { firstname, lastname } = user;
  const userFirstNameInitial = firstname.charAt(0).toUpperCase();
  const userLastNameInitial = lastname.charAt(0).toUpperCase();
  return [userFirstNameInitial, userLastNameInitial];
};

const showUserNameInitials = (userInitials) => {
  const [firstNameInitial, lastNameInitial] = userInitials;
  const span = document.createElement('span');
  span.classList.add('user-initials__text');
  span.textContent = `${firstNameInitial}${lastNameInitial}`;
  return span;
};

/**
 * @func createUserProfileAvatar
 * @returns {Promise<HTMLLIElement>} Returns a promise
 * that resolves to an HTML list item element
 * representing a nav list item
 */
const createUserProfileAvatar = () => {
  const userId = localStorage.getItem('userId');
  return getUserData(userId)
    .then((user) => {
      const li = document.createElement('li');
      li.classList.add('nav-avatar__list-item');
      const button = document.createElement('button');
      button.classList.add('q-btn', 'dropdown-trigger-btn');
      button.id = 'dropdown-trigger-btn';
      button.title = 'Profile';
      const img = document.createElement('img');
      const span = document.createElement('span');
      span.style.width = '100%';
      if (user) {
        const { firstname, avatar } = user;
        img.alt = firstname;
        if (avatar) {
          img.src = user.avatar;
          button.appendChild(img);
        } else {
          const userInitials = createUserNameInitials(user);
          const userInitialsBlock = showUserNameInitials(userInitials);
          button.appendChild(userInitialsBlock);
          button.classList.add('user-initials__btn');
        }
      }
      li.appendChild(button);
      li.onclick = toggleDropDownMenu;
      return li;
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func addProfileAvatarToNav
 * @param {String} avatarSrcPath The path to the avatar image -> fallback if the user has no avatar
 * @returns {Promise<HTMLLIElement>} Returns a Promise
 * that resolves to nav list item HTML element
 */
const addProfileAvatarToNav = avatarSrcPath => createUserProfileAvatar(avatarSrcPath)
  .then((userAvatar) => {
    rightNavBarList.appendChild(userAvatar);
  })
  .catch((error) => {
    console.error(error);
  });
