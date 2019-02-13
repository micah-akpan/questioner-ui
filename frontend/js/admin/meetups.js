const deleteModal = document.getElementById('delete-modal');
const closeDeleteModalButton = document.getElementById('close-delete-modal__btn');
const cancelDeleteOpButton = document.getElementById('cancel-delete-op__btn');
const deleteMeetupButton = document.getElementById('delete-meetup__btn');

/**
 * @func deleteMeetup
 * @param {Number|String} meetupId
 * @returns {Promise} Returns a promise that resolves
 * to the deleted meetup record
 */
const deleteMeetup = (meetupId) => {
  const apiUrl = `${apiBaseURL}/meetups/${meetupId}`;
  return fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token.getToken('userToken')}`
    }
  })
    .then(res => res.json())
    .then(() => {
      window.location.reload();
    })
    .catch((err) => {
      throw err;
    });
};

const attachMeetupIdToModal = (modal, meetupId) => {
  modal.setAttribute('data-target', meetupId);
  return modal;
};

/**
 * @func createDropDownMenuItems
 * @param {*} meetup
 * @returns {Array<HTMLLIElement>} Returns a list of
 * dropdown HTML list items
 */
const createDropDownMenuItems = meetup => icons.meetups.map((icon) => {
  const li = document.createElement('li');
  li.classList.add(icon.className);
  li.onclick = () => {
    showModal(deleteModal);
    attachMeetupIdToModal(deleteModal, meetup.id);
  };
  const img = document.createElement('img');
  img.src = icon.src;
  img.alt = icon.alt;
  const span = document.createElement('span');
  span.textContent = icon.text;
  li.appendChild(img);
  li.appendChild(span);

  return li;
});

/**
 * @func createDropDownMenu
 * @param {*} meetup
 * @returns {HTMLDivElement} Returns an HTML element
 * representing the dropdown menu
 */
const createDropDownMenu = (meetup) => {
  const menuBlock = document.createElement('div');
  menuBlock.classList.add('dropdown-menu');
  menuBlock.id = `dropdown-menu-${meetup.id}`;
  const menu = document.createElement('ul');
  const menuItems = createDropDownMenuItems(meetup);
  menuItems.forEach((menuItem) => {
    menu.appendChild(menuItem);
  });
  menuBlock.appendChild(menu);
  return menuBlock;
};

/**
 * @func showDropDownMenu
 * @param {*} meetup
 * @returns {HTMLElement} Displays and returns the
 * dropdown menu element
 */
const showDropDownMenu = (meetup) => {
  const dropDownMenu = document.getElementById(`dropdown-menu-${meetup.id}`);
  dropDownMenu.classList.toggle('show');
  return dropDownMenu;
};

/**
 * @function createMeetupPrimarySec
 * @param {*} meetup Meetup object
 * @returns {HTMLElement} A wrapper HTMLElement for primary details about a meetup
 */
const createMeetupPrimarySec = (meetup) => {
  const content = document.createElement('div');
  content.classList.add('content');
  const meetupImage = document.createElement('img');

  getMeetupImages(meetup)
    .then((images) => {
      const image = images[0];
      const defaultImage = '../../assets/img/startup-meetup2.jpg';
      meetupImage.setAttribute('src', (image && image.imageUrl) || defaultImage);
      meetupImage.setAttribute('alt', '');
    });

  meetupImage.classList.add('meetup-main-image');

  const meetupQuestionCount = document.createElement('span');
  meetupQuestionCount.classList.add('q-asked-count');
  meetupQuestionCount.setAttribute('title', 'Total questions asked in this meetup');

  getTotalQuestionsAsked(meetup)
    .then((value) => {
      meetupQuestionCount.textContent = value;
    });

  const actionButton = createCardActionButton(meetup);
  actionButton.onclick = (e) => {
    // Stops the redirection to the meetup
    // detail page
    e.preventDefault();
    showDropDownMenu(meetup);
  };

  content.appendChild(actionButton);
  content.appendChild(meetupImage);
  content.appendChild(meetupQuestionCount);

  return content;
};

/**
 * @func showAllMeetups
 * @returns {undefined} Adds and displays all meetups
 */
const showAllMeetups = () => {
  getMeetups().then((res) => {
    if (tokenIsValid(res)) {
      if (res.status === 200) {
        const meetups = res.data;
        const MAX_MEETUPS = 6;
        if (meetups.length > MAX_MEETUPS) {
          const data = meetups.slice(0, MAX_MEETUPS);
          addMeetupsToPage(data);
          const remainingMeetups = meetups.length - MAX_MEETUPS;
          seeMoreBtn.textContent = `SEE MORE ${remainingMeetups} ${remainingMeetups > 1 ? 'MEETUPS' : 'MEETUP'}`;
        } else {
          addMeetupsToPage(meetups);
        }
      }
    } else {
      localStorage.removeItem('userToken');
      window.location.assign('./sign-in.html');
    }
  });
};

addProfileAvatarToNav('../../assets/icons/avatar1.svg');

if (closeDeleteModalButton) {
  closeDeleteModalButton.onclick = () => {
    hideModal(deleteModal);
  };
}

cancelDeleteOpButton.onclick = () => {
  hideModal(deleteModal);
};

window.addEventListener('load', () => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    showAllMeetups();
  }
});
