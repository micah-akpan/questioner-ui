const qNavMenuWrapper = document.querySelector('.sidebar-menu__wrapper');
const logOutButtons = document.querySelectorAll('.logout__btn');
const dropDownTriggerButton = document.querySelector('.dropdown-trigger-btn');
const dropDownMenu = document.querySelector('.q-user-profile__dropdown-menu');
const qNavMenuIconWrapper = document.getElementById('mobile-nav-sidebar__wrapper');

const baseURL = 'http://localhost:9999/api/v1';
const nav = document.querySelector('.q-right-nav');

// const rightNavSpec = [
//   {
//     id: 1,
//     type: 'notifications',
//     src: '../assets/icons/notifications-button.svg',
//     classNames: ['q-btn'],
//     idText: ''
//   },

//   {
//     id: 2,
//     type: 'profile',
//     src: '../assets/icons/avatar1.svg',
//     classNames: ['q-btn', 'dropdown-trigger-btn'],
//     idText: 'dropdown-trigger-btn'
//   }
// ];


document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    qNavMenuWrapper.classList.remove('nav-menu-show');
    qNavMenuIconWrapper.classList.toggle('change');
    dropDownMenu.classList.remove('show');
  }
};

/**
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

// /**
//  * @func createRightNavList
//  * @param {Array} navSpec
//  * @returns {HTMLUListElement} Returns a new nav list
//  */
// const createRightNavList = (navSpec) => {
//   const navList = document.createElement('ul');
//   const navListItems = navSpec.map((spec) => {
//     const li = document.createElement('li');
//     const button = document.createElement('button');
//     button.classList.add(...spec.classNames);
//     button.title = spec.type;
//     const img = document.createElement('img');


//     if (spec.type === 'profile') {
//       li.classList.add('q-user-profile__dropdown-trigger');
//     }

//     const userId = localStorage.getItem('userId');

//     getUserData(userId)
//       .then((user) => {
//         if (user) {
//           const { avatar, firstname } = user;
//           if (avatar) {
//             img.src = spec.type === 'profile' ? avatar : spec.src;
//             img.alt = spec.type === 'profile' ? firstname : 'A light yellow colored bell';
//           } else {
//             img.src = spec.src;
//             img.alt = spec.type === 'profile' ? firstname : 'A light yellow colored bell';
//           }
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//       });

//     if (spec.type === 'profile') {
//       button.onclick = toggleDropDownMenu;
//     }

//     button.appendChild(img);
//     li.appendChild(button);

//     return li;
//   });

//   navListItems.forEach((item) => {
//     navList.appendChild(item);
//   });
//   return navList;
// };

// qNavMenuIconWrapper.onclick = function toggleMobileNav() {
//   this.classList.toggle('change');
//   qNavMenuWrapper.classList.toggle('nav-menu-show');
// };

// if (window.location.pathname !== '/') {
//   // This dynamic creates the content of the right navigation
//   const urlPath = window.location.pathname.split('/');
//   if (urlPath.includes('admin')) {
//     const navSpec = [
//       {
//         id: 1,
//         type: 'notifications',
//         src: '../../assets/icons/notifications-button.svg',
//         classNames: ['q-btn'],
//         idText: ''
//       },

//       {
//         id: 2,
//         type: 'profile',
//         src: '../../assets/icons/avatar1.svg',
//         classNames: ['q-btn', 'dropdown-trigger-btn'],
//         idText: 'dropdown-trigger-btn'
//       }
//     ];

//     const rightNav = createRightNavList(navSpec);
//     nav.appendChild(rightNav);
//   } else {
//     const rightNav = createRightNavList(rightNavSpec);
//     nav.appendChild(rightNav);
//   }
// }

const list = document.querySelector('.q-right-nav > ul');

const createUserAvatar = (avatarSrcPath) => {
  const userId = localStorage.getItem('userId');
  return getUserData(userId)
    .then((user) => {
      const { avatar, firstname } = user;
      const li = document.createElement('li');
      li.classList.add('nav-avatar__list-item');
      const button = document.createElement('button');
      button.classList.add('q-btn', 'dropdown-trigger-btn');
      button.id = 'dropdown-trigger-btn';
      button.title = 'Profile';
      const img = document.createElement('img');
      if (user) {
        img.src = avatar || avatarSrcPath;
        img.alt = firstname;
        button.appendChild(img);
        li.appendChild(button);
        return li;
      }

      img.src = avatarSrcPath;
      img.alt = 'User';
      button.appendChild(img);
      li.appendChild(button);
      return li;
    })
    .catch((err) => {
      throw err;
    });
};

const addProfileAvatarToNav = (avatarSrcPath) => {
  createUserAvatar(avatarSrcPath)
    .then((userAvatar) => {
      list.appendChild(userAvatar);
    })
    .catch((error) => {
      console.error(err);
    });
};
