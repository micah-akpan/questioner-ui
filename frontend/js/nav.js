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

const rightNavSpec = [
  {
    id: 1,
    type: 'notifications',
    src: '../assets/icons/notifications-button.svg',
    classNames: ['q-btn'],
    idText: ''
  },

  {
    id: 2,
    type: 'profile',
    src: '../assets/icons/avatar1.svg',
    classNames: ['q-btn', 'dropdown-trigger-btn'],
    idText: 'dropdown-trigger-btn'
  }
];

const createRightNavList = (navSpec) => {
  const navList = document.createElement('ul');
  const navListItems = navSpec.map((spec) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.classList.add(...spec.classNames);
    button.title = spec.type;
    const img = document.createElement('img');


    if (spec.type === 'profile') {
      li.classList.add('q-user-profile__dropdown-trigger');
    }

    getUserData()
      .then((user) => {
        if (user) {
          const { avatar, firstname } = user;
          if (avatar) {
            img.src = avatar;
            img.alt = firstname;
          } else {
            img.src = spec.src;
            img.alt = firstname;
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });

    button.onclick = toggleDropDownMenu;

    button.appendChild(img);
    li.appendChild(button);

    return li;
  });

  navListItems.forEach((item) => {
    navList.appendChild(item);
  });
  return navList;
}

qNavMenuIconWrapper.onclick = function toggleMobileNav() {
  this.classList.toggle('change');
  qNavMenuWrapper.classList.toggle('nav-menu-show');
};


const toggleDropDownMenu = () => {
  dropDownMenu.classList.toggle('show');
}

if (dropDownTriggerButton) {
  dropDownTriggerButton.onclick = toggleDropDownMenu;
}

logOutButtons.forEach((logOutBtn) => {
  logOutBtn.onclick = (e) => {
    e.preventDefault();
    logOutUser();
  }
});

const baseURL = 'http://localhost:9999/api/v1';

const getUserData = async () => {
  const userId = localStorage.getItem('userId');
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
    console.error(e);
  }
}


const nav = document.querySelector('.q-right-nav');

const urlPath = window.location.pathname.split('/');
if (urlPath.includes('admin')) {
  const navSpec = [
    {
      id: 1,
      type: 'notifications',
      src: '../../assets/icons/notifications-button.svg',
      classNames: ['q-btn'],
      idText: ''
    },

    {
      id: 2,
      type: 'profile',
      src: '../../assets/icons/avatar1.svg',
      classNames: ['q-btn', 'dropdown-trigger-btn'],
      idText: 'dropdown-trigger-btn'
    }
  ];

  const rightNav = createRightNavList(navSpec);
  console.log(rightNav);
  nav.appendChild(rightNav);
} else {
  const rightNav = createRightNavList(rightNavSpec);
  nav.appendChild(rightNav);
}