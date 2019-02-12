const tabListItems = document.querySelectorAll('.nav__profile-tablist li');
const userAcctArea = document.querySelector('.user-profile__main-content__wrapper');
const userAcctAvatarWrapper = document.querySelector('.user-profile__avatar-wrapper');
const userTopFeeds = document.querySelector('.user-feeds__wrapper');
const mainContainer = document.querySelector('.user-profile__main-content__wrapper');
const userFeedsList = document.querySelector('.user-feeds');
const uploadNewPicBtn = document.querySelector('.change-image__btn');
const uploadNewPicWidget = document.querySelector('.change-image__file');
const userImage = document.querySelector('.user-image');

const usersAPIUrl = 'http://localhost:9999/api/v1/users';

tabListItems.forEach((listItem) => {
  listItem.onclick = () => {
    if (listItem.textContent.trim().toLowerCase() === 'feeds') {
      userAcctArea.classList.add('n-active-block');
      userAcctAvatarWrapper.classList.add('n-active-block');

      userTopFeeds.classList.remove('n-active-block');
      userTopFeeds.classList.add('active-block');
      mainContainer.classList.add('no-border');

      userFeedsList.classList.remove('n-active-block');
      userFeedsList.classList.add('active-block');
    } else if (listItem.textContent.trim().toLowerCase() === 'profile') {
      userAcctArea.classList.remove('n-active-block');
      userAcctArea.classList.add('active-block');

      userTopFeeds.classList.remove('active-block');
      userTopFeeds.classList.add('n-active-block');

      userAcctAvatarWrapper.classList.remove('n-active-block');
      userAcctAvatarWrapper.classList.add('active-block');
      userFeedsList.classList.add('n-active-block');
    }
    tabListItems.forEach((item) => {
      item.removeAttribute('class');
    });

    listItem.setAttribute('class', 'active');
  };
});

uploadNewPicBtn.onclick = () => {
  uploadNewPicWidget.click();
};

uploadNewPicWidget.onchange = function changeAvatar(e) {
  const { files } = e.target;
  const file = files[0];
  const imgSrc = URL.createObjectURL(file);
  userImage.src = imgSrc;
};

const userProfileWrapper = document.getElementById('user-profile__wrapper');
const userProfileImageTextWrapper = document.getElementById('user-profile__image-text');
const profileTextWrapper = document.getElementById('profile-text__wrapper');

const displayUserAvatar = ({ avatar, firstname }) => {
  userImage.setAttribute('src', avatar);
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

const fullNameField = document.getElementById('fullName');
const otherNameField = document.getElementById('otherNames');
const locationField = document.getElementById('location');
const birthDateField = document.getElementById('birthDate');
const phoneNumberField = document.getElementById('phone-no');
const userBioField = document.getElementById('userBio');
const emailField = document.getElementById('userEmail');
const usernameField = document.getElementById('username');
const newPasswordField = document.getElementById('newPassword');
const saveChangesButton = document.getElementById('save-changes__btn');

/**
 * @function convertDate
 * @param {Date} date
 * @returns {String} Parses and converts date to
 * a different format (YYYY-MM-dd)
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

const accountDataForm = document.getElementById('account-data-form');
const personalDataForm = document.getElementById('personal-data-form');

const displayUpdateFeedback = (elId, message) => {
  const accountFeedback = document.getElementById(elId);
  accountFeedback.classList.remove('hide');
  accountFeedback.classList.add('show');
  accountFeedback.textContent = message;
  return accountFeedback;
};

const displayPersonalUpdateFeedback = (message) => {
  return displayUpdateFeedback('personal-data-feedback', message);
}

const displayAccountUpdateFeedback = (message) => {
  let a = displayUpdateFeedback('account-data-feedback', message);
  a.classList.add('error-feedback');
  return a;
}

const displayErrorFeedback = (message, section) => {
  const accountFeedback = section === 'personal'
    ? displayPersonalUpdateFeedback(message)
    : displayAccountUpdateFeedback(message);
  accountFeedback.classList.remove('success-feedback');
  accountFeedback.classList.add('error-feedback');
  return accountFeedback;
};

const displaySuccessFeedback = (message, section) => {
  const accountFeedback = section === 'personal'
    ? displayPersonalUpdateFeedback(message)
    : displayAccountUpdateFeedback(message);
  accountFeedback.classList.remove('error-feedback');
  accountFeedback.classList.add('success-feedback');
  return accountFeedback;
};

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

const getErrorType = (err) => {
  if (err.includes('username') || err.includes('email') || err.includes('password')) {
    return 'account'
  }

  return 'personal';
}

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
      } else if (personalDataFormFilled) {
        displaySuccessFeedback('Changes Saved', 'personal');
      } else if (accountDataFormFilled) {
        displaySuccessFeedback('Changes Saved', 'account');
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
      // TODO -> Display user feedback
      if (user) {
        replaceFormFields(user);
        const profileUserName = document.getElementById('profile-username');
        profileUserName.textContent = `${firstname} ${lastname}`;
        const defaultAvatar = '../assets/icons/avatar1.svg';
        userImage.setAttribute('src', user.avatar || defaultAvatar);
      }
    })
    .catch((err) => {

    });
};

const focusInput = (node) => {
  node.focus();
};

window.onload = () => {
  const userId = localStorage.getItem('userId');
  fetchUser(userId)
    .then((user) => {
      if (user) {
        const userDataCard = createUserDataSummaryCard(user);
        userProfileImageTextWrapper.appendChild(userDataCard);
        replaceFormFields(user);
        displayUserAvatar(user);
      }
    })
    .catch((err) => {
      throw err;
    });

  focusInput(fullNameField);
};
