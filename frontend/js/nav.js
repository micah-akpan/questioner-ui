const qNavMenuWrapper = document.querySelector('.sidebar-menu__wrapper');
const logOutButtons = document.querySelectorAll('.logout__btn');
const dropDownTriggerButton = document.querySelector('.dropdown-trigger-btn');
const dropDownMenu = document.querySelector('.q-user-profile__dropdown-menu');
const qNavMenuIconWrapper = document.getElementById('mobile-nav-sidebar__wrapper');
const list = document.querySelector('.q-right-nav > ul');

const baseURL = 'http://localhost:9999/api/v1';
const nav = document.querySelector('.q-right-nav');


document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    qNavMenuWrapper.classList.remove('nav-menu-show');
    qNavMenuIconWrapper.classList.toggle('change');
    dropDownMenu.classList.remove('show');
  }
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
  getUserData()
    .then((user) => {
      if (user) {
        return user.avatar;
      }
      return '../assets/icons/avatar1.svg';
    })
    .catch((err) => {
      throw err;
    });
};

const createUserProfileAvatar = (avatarSrcPath) => {
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
      if (user) {
        const { avatar, firstname } = user;
        img.src = avatar || avatarSrcPath;
        img.alt = firstname;
      } else {
        img.src = avatarSrcPath;
        img.alt = 'User';
      }

      button.appendChild(img);
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
    list.appendChild(userAvatar);
  })
  .catch((error) => {
    console.error(error);
  });
