const deleteModal = document.getElementById('delete-modal');
const closeDeleteModalButton = document.getElementById('close-delete-modal__btn');
const cancelDeleteOpButton = document.getElementById('cancel-delete-op__btn');
const deleteMeetupButton = document.getElementById('delete-meetup__btn');
const deleteModalContent = document.getElementById('delete-modal-content');
const deleteModalHeader = document.getElementById('delete-modal-header');
const editModal = document.getElementById('edit-modal');
const editModalHeader = document.getElementById('edit-modal-header');
const closeEditModalButton = document.getElementById('close-edit-modal__btn');

const meetupTopicField = document.getElementById('mTopic');
const meetupLocationField = document.getElementById('mLocation');
const meetupDateField = document.getElementById('mDate');
const editModalForm = document.forms['edit-meetup-modal-form'];
const meetupInnerTagWrapper = document.getElementById('meetup-inner-tags__wrapper');

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

/**
 * @func updateMeetup
 * @param {*} newData New meetup data
 * @param {Number|String} meetupId
 * @returns {Promise} Resolves to the updated meetup, or null
 */
const updateMeetup = (newData, meetupId) => {
  const updateMeetupUrl = `${apiBaseURL}/meetups/${meetupId}`;
  return fetch(updateMeetupUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token.getToken('userToken')}`
    },
    method: 'PUT',
    body: JSON.stringify(newData)
  })
    .then(res => res.json())
    .then((res) => {
      const { status, data } = res;
      if (status === 200) {
        // TODO: Display some feedback here
      }
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func attachMeetupIdToModal
 * @param {*} modal
 * @param {*} meetupId
 * @returns {HTMLElement} Set the meetup id as an attribute of `modal`
 * and returns `modal`
 */
const attachMeetupIdToModal = (modal, meetupId) => {
  modal.setAttribute('data-target', meetupId);
  return modal;
};

/**
 * @func changeModalHeadingContent
 * @param {HTMLElement} header
 * @param {String} content
 * @returns {HTMLElement} Returns the modal content
 * `header`
 */
const changeModalHeadingContent = (header, content) => {
  header.textContent = content;
  return header;
};

/**
 * @func getMeetup
 * @param {Number|String} meetupId
 * @returns {Promise} Resolves to a promise
 * that returns a selected meetup
 */
const getMeetup = meetupId => getMeetups()
  .then(({ data }) => {
    const selectedMeetup = data.filter(meetup => meetup.id === meetupId);
    return selectedMeetup[0];
  })
  .catch((err) => {
    throw err;
  });

/**
 * @function convertDate
 * @param {String} date
 * @returns {String} Parses and converts `date` to
 * a different format (YYYY-MM-dd)
 * @description This util function prepares a date
 * suitable for use in date widget of form inputs
 */
const convertDate = (date) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = newDate.getDate();
  day = day < 10 ? `0${day}` : day;
  return `${year}-${month}-${day}`;
};

/**
 * @func prefillUpdateMeetupModalFormFields
 * @param {*} meetup
 * @returns {*} Returns `meetup`
 */
const prefillUpdateMeetupModalFormFields = (meetup) => {
  const { title, location, happeningOn } = meetup;
  meetupTopicField.placeholder = title;
  meetupLocationField.placeholder = location;
  const date = convertDate(happeningOn);
  meetupDateField.value = date;
  return meetup;
};

/**
 *
 * @param {Strin} tag
 * @param {Boolean} toBeDeleted
 * @returns {HTMLSpanElement} Returns a meetup tag badge
 * @description if `toBeDeleted` is true, it adds a delete
 * button to each badge
 */
const createMeetupTagBadge = (tag, toBeDeleted = true) => {
  const span = document.createElement('span');
  span.classList.add('meetup-tag__badge');
  span.textContent = tag.text;
  span.setAttribute('data-target', tag.id);
  let deleteButton = null;
  if (toBeDeleted) {
    deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    const img = document.createElement('img');
    img.src = '../../assets/icons/cross.svg';
    img.classList.add('meetup-tag__badge-img');
    deleteButton.appendChild(img);
    deleteButton.classList.add('meetup-tag__badge-btn', 'btn');
  }
  span.appendChild(deleteButton);
  return span;
};

/**
 * @func createMeetupTagBadges
 * @param {Array<String>} tags
 * @return {Array<HTMLSpanElement>} Returns an array of meetup tag badges
 */
const createMeetupTagBadges = tags => tags.map((tag) => {
  const tagBadge = createMeetupTagBadge(tag);
  return tagBadge;
});

/**
 * @func prepareTags
 * @param {Array<String>} tags
 * @returns {Array} Takes a list of tags in string form
 * and creates object of tags
 */
const prepareTags = (tags) => {
  const hashTags = tags.map((tag, counter) => {
    const hashTag = {};
    hashTag.id = counter + 1;
    hashTag.text = tag;
    return hashTag;
  });

  return hashTags;
};

/**
 * @func addMeetupTagBadgesToUpdateForm
 * @param {*} meetup
 * @returns {HTMLElement} Returns the HTML element
 * that wraps the meetup tag element
 */
const addMeetupTagBadgesToUpdateForm = (meetup) => {
  const { tags } = meetup;
  const hashTags = prepareTags(tags);
  const tagBadges = createMeetupTagBadges(hashTags);
  tagBadges.forEach((tagBadge) => {
    meetupInnerTagWrapper.appendChild(tagBadge);
  });

  return meetupInnerTagWrapper;
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
  const selectedModal = icon.action === 'edit' ? editModal : deleteModal;
  li.onclick = () => {
    getMeetup(meetup.id)
      .then((selectedMeetup) => {
        const selectedModalHeader = icon.action === 'edit'
          ? editModalHeader
          : deleteModalHeader;
        const modalHeaderContent = icon.action === 'edit'
          ? `Update ${selectedMeetup.title}`
          : `Delete ${selectedMeetup.title}`;
        changeModalHeadingContent(selectedModalHeader, modalHeaderContent);
      }, (err) => {
        throw err;
      });
    showModal(selectedModal);
    // only edit modal comes with a form
    // with fields that should be pre-populated
    if (editModal) {
      addMeetupTagBadgesToUpdateForm(meetup);
      prefillUpdateMeetupModalFormFields(meetup);
    }
    attachMeetupIdToModal(selectedModal, meetup.id);
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
  console.log(dropDownMenu);
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

if (closeEditModalButton) {
  closeEditModalButton.onclick = () => {
    hideModal(editModal);
  };
}

cancelDeleteOpButton.onclick = () => {
  hideModal(deleteModal);
};

deleteMeetupButton.onclick = () => {
  const meetupId = deleteModal.getAttribute('data-target');
  deleteMeetup(meetupId);
};

editModalForm.onsubmit = (e) => {
  e.preventDefault();
  const newMeetupData = {
    topic: meetupTopicField.value,
    location: meetupLocationField.value,
    happeningOn: meetupDateField.value
  };
  const meetupId = editModal.getAttribute('data-target');
  updateMeetup(newMeetupData, meetupId)
    .then(() => {
      hideModal(editModal);
      showAllMeetups();
    })
    .catch((err) => {
      throw err;
    });
};

document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    hideModal(deleteModal);
    hideModal(editModal);
  }
};

window.addEventListener('load', () => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    showAllMeetups();
  }
});
