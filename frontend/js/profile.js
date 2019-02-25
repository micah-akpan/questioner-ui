const tabList = document.getElementById('nav-profile__tabs');
const tabListItems = tabList.querySelectorAll('li');
const userPersonalAccountForm = document.getElementById('user-profile__personal__account__form');
const userAccountAvatar = document.getElementById('user__profile__avatar');

const userTopFeeds = document.getElementById('user-feeds-cards');
const userProfile = document.querySelector('.user__profile');
const meetupsList = document.getElementById('meetups-list');

const mainContainer = document.querySelector('.user-profile__personal__account');
const userFeedsList = document.querySelector('.user-feeds');
const uploadNewPicButton = document.getElementById('user__profile-update__btn');
const uploadNewPicWidget = document.getElementById('user__profile-avatar-update');
const userImage = document.getElementById('user-profile__image');

const fullNameField = document.getElementById('fullName');
const otherNameField = document.getElementById('otherNames');
const locationField = document.getElementById('location');
const birthDateField = document.getElementById('birthDate');
const phoneNumberField = document.getElementById('phone');
const userBioField = document.getElementById('userBio');
const emailField = document.getElementById('userEmail');
const usernameField = document.getElementById('username');
const newPasswordField = document.getElementById('newPassword');
const saveChangesButton = document.getElementById('save-changes__btn');
const accountDataForm = document.getElementById('account-data-form');
const personalDataForm = document.getElementById('personal-data-form');

const usersAPIUrl = 'http://localhost:9999/api/v1/users';

/**
 * @func toggleNavPanel
 * @param {String} panel
 * @returns {void}
 */
const toggleNavPanel = (panel) => {
  switch (panel) {
    case 'feeds': {
      meetupList.classList.add('active');
      userPersonalAccountForm.classList.add('hidden');
      userAccountAvatar.classList.add('hidden');

      userTopFeeds.classList.remove('hidden');
      userTopFeeds.classList.add('active');
      mainContainer.classList.add('no-border');

      userFeedsList.classList.remove('hidden');
      userFeedsList.classList.add('active');

      addMeetupFeedListToPage()
        .then((meetupList) => {
          toggleUserFeedListItem(meetupList);
        })
        .catch((err) => {
          throw err;
        });
      break;
    }

    case 'profile': {
      userPersonalAccountForm.classList.remove('hidden');
      userPersonalAccountForm.classList.add('active');

      userTopFeeds.classList.remove('active');
      userTopFeeds.classList.add('hidden');

      userAccountAvatar.classList.remove('hidden');
      userAccountAvatar.classList.add('active');
      userFeedsList.classList.add('hidden');
      break;
    }

    default: {
      break;
    }
  }
};

tabListItems.forEach((listItem) => {
  listItem.onclick = () => {
    const panel = listItem.textContent.toLowerCase().trim();
    toggleNavPanel(panel);
    tabListItems.forEach((item) => {
      item.removeAttribute('class');
    });

    listItem.setAttribute('class', 'active');
  };
});

uploadNewPicButton.onclick = () => {
  uploadNewPicWidget.click();
};

uploadNewPicWidget.onchange = function changeAvatar(e) {
  const { files } = e.target;
  const file = files[0];
  const imgSrc = URL.createObjectURL(file);
  userImage.src = imgSrc;
};

const userProfileImageTextWrapper = document.getElementById('user__profile__avatar-image');
const profileTextWrapper = document.getElementById('profile-text__wrapper');
const defaultAvatar = '../assets/icons/avatar1.svg';

const displayUserAvatar = ({ avatar, firstname }) => {
  userImage.setAttribute('src', avatar || defaultAvatar);
  userImage.setAttribute('alt', firstname);
  return userImage;
};

const fetchUser = userId => fetch(`${usersAPIUrl}/${userId}`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('userToken')}`
  }
})
  .then(res => res.json())
  .then(res => (res.status === 200 ? res.data[0] : null))
  .catch((err) => {
    throw err;
  });

const createUserDataSummaryCard = (user) => {
  const card = document.createElement('div');
  card.classList.add('profile-text__wrapper');
  card.id = 'profile-text__wrapper';
  const userBio = document.createElement('p');
  userBio.id = 'profile-bio';
  userBio.textContent = user.bio;
  const userName = document.createElement('p');
  userName.id = 'profile-username';
  const { firstname, lastname } = user;
  userName.textContent = `${firstname} ${lastname}`;
  card.appendChild(userName);
  card.appendChild(userBio);
  return card;
};

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

/* eslint-disable */
/**
 * @func fieldsAreNotEmpty
 * @param {HTMLFormElement} form
 * @returns {Boolean} Returns true if `form`
 * contains non-empty form fields
 */
const fieldsAreNotEmpty = (form) => {
  const formData = new FormData(form);
  const entries = formData.entries();
  for (let v of entries) {
    if (v[1] !== '') {
      return true;
    }
  }

  return false;
}

/**
 * @func displayUpdateFeedback
 * @param {Number} elId 
 * @param {String} message 
 * @returns {HTMLElement} Returns the user feedback
 * HTML element
 */
const displayUpdateFeedback = (elId, message) => {
  const accountFeedback = document.getElementById(elId);
  accountFeedback.classList.remove('hide');
  accountFeedback.classList.add('show');
  accountFeedback.textContent = message;
  return accountFeedback;
};

/**
 * @func displayPersonalUpdateFeedback
 * @param {String} message
 * @returns {HTMLElement} Returns the user feedback
 * HTML element for account data
 */
const displayPersonalUpdateFeedback = (message) => {
  return displayUpdateFeedback('personal-data-feedback', message);
}

/**
 * @func displayAccountUpdateFeedback
 * @param {String} message 
 * @returns {HTMLElement} Returns the user feedback
 * HTML element for account data
 */
const displayAccountUpdateFeedback = (message) => {
  return displayUpdateFeedback('account-data-feedback', message);
}

/**
 * @func displayErrorFeedback
 * @param {String} message 
 * @param {String} section 
 * @returns {HTMLElement} Returns the user feedback
 * HTML element
 */
const displayErrorFeedback = (message, section) => {
  const accountFeedback = section === 'personal'
    ? displayPersonalUpdateFeedback(message)
    : displayAccountUpdateFeedback(message);
  accountFeedback.classList.remove('success-feedback');
  accountFeedback.classList.add('error-feedback');
  return accountFeedback;
};

/**
 * @func displaySuccessFeedback
 * @param {String} message 
 * @param {String} section 
 * @returns {HTMLElement} Returns the user feedback 
 * HTML element
 */
const displaySuccessFeedback = (message, section) => {
  const accountFeedback = section === 'personal'
    ? displayPersonalUpdateFeedback(message)
    : displayAccountUpdateFeedback(message);
  accountFeedback.classList.remove('error-feedback');
  accountFeedback.classList.add('success-feedback');
  return accountFeedback;
};

/**
 * @func hideFeedback
 * @param {Number} time 
 * @param {HTMLElement} node
 * @returns {Number} Returns the timer interval id
 */
const hideFeedback = (time, node) => {
  return setTimeout(() => {
    node.classList.remove('show');
    node.classList.add('hide');
  }, time * 1000)
}

/**
 * @func replaceFormFields
 * @param {*} user user data
 * @returns {*} Replaces form fields placeholder values with data from `user`
 */
const replaceFormFields = (user) => {
  const {
    firstname, lastname,
    othername, address, birthday, phoneNumber,
    bio, username, email
  } = user;
  fullNameField.placeholder = `${firstname} ${lastname}`;
  otherNameField.placeholder = othername;
  locationField.placeholder = address || '';
  birthDateField.value = convertDate(new Date(birthday));
  phoneNumberField.placeholder = phoneNumber;
  userBioField.placeholder = bio;
  usernameField.placeholder = username;
  emailField.placeholder = email;
};

const personalDataFeedback = document.getElementById('personal-data-feedback');
const accountDataFeedback = document.getElementById('account-data-feedback');

/**
 * @func getErrorType
 * @param {String} err
 * @returns {String} Returns the type of error based on `err` 
 */
const getErrorType = (err) => {
  if (err.includes('username') || err.includes('email') || err.includes('password')) {
    return 'account'
  }
  return 'personal';
}

/**
 * @func updateUserData
 * @param {*} newData user
 * @returns {Promise<any>} Resolves to an updated user data or null
 */
const updateUserData = (newData) => {
  const userId = localStorage.getItem('userId');
  return fetch(`${usersAPIUrl}/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    },
    body: newData
  })
    .then(res => res.json())
    .then((res) => {
      const { status, data, error } = res;
      if (status !== 200) {
        if (getErrorType(error) === 'account') {
          displayErrorFeedback(error, 'account');
        } else {
          displayErrorFeedback(error, 'personal');
        }
        return null;
      }

      const bothFormsAreFilled = fieldsAreNotEmpty(personalDataForm) && fieldsAreNotEmpty(accountDataForm);
      const personalDataFormFilled = fieldsAreNotEmpty(personalDataForm);
      const accountDataFormFilled = fieldsAreNotEmpty(accountDataForm);

      if (bothFormsAreFilled) {
        displaySuccessFeedback('Changes Saved', 'personal');
        displaySuccessFeedback('Changes Saved', 'account');
        hideFeedback(5, personalDataFeedback);
        hideFeedback(5, accountDataFeedback);
      } else if (personalDataFormFilled) {
        displaySuccessFeedback('Changes Saved', 'personal');
        hideFeedback(5, personalDataFeedback);
      } else if (accountDataFormFilled) {
        displaySuccessFeedback('Changes Saved', 'account');
        hideFeedback(5, accountDataFeedback);
      }
      return data[0];
    })
    .catch((err) => {
      throw err;
    });
};

saveChangesButton.onclick = () => {
  const fullName = fullNameField.value;
  const firstname = fullName.substring(0, fullName.indexOf(' '));
  const lastname = fullName.substring(fullName.indexOf(' ') + 1);
  const avatarWidget = document.getElementById('change-image__file');

  const data = {
    firstname,
    lastname,
    email: emailField.value,
    username: usernameField.value,
    password: newPasswordField.value,
    birthday: birthDateField.value,
    bio: userBioField.value,
    othername: otherNameField.value,
    phoneNumber: phoneNumberField.value,
    avatar: avatarWidget.files[0]
  };

  const formData = new FormData();

  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      formData.append(prop, data[prop]);
    }
  }

  updateUserData(formData)
    .then((user) => {
      if (user) {
        replaceFormFields(user);
        const profileUserName = document.getElementById('profile-username');
        profileUserName.textContent = `${firstname} ${lastname}`;
        userImage.setAttribute('src', user.avatar || defaultAvatar);
      }
    })
    .catch((err) => {

    });
};

addProfileAvatarToNav('../assets/icons/avatar1.svg');

const focusInput = (node) => {
  node.focus();
};

const changeDocTitle = (title) => {
  document.title = title;
}

window.onload = () => {
  const userId = localStorage.getItem('userId');
  fetchUser(userId)
    .then((user) => {
      if (user) {
        const userDataCard = createUserDataSummaryCard(user);
        userProfileImageTextWrapper.appendChild(userDataCard);
        replaceFormFields(user);
        displayUserAvatar(user);
        changeDocTitle(`${user.firstname} | Questioner`);
      }
    })
    .catch((err) => {
      throw err;
    });

  focusInput(fullNameField);
  // toggleUserFeedListItem();
};
