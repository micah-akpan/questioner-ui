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

const fetchUser = userId => fetch(`${usersAPIUrl}/${userId}`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('userToken')}`
  }
})
  .then(res => res.json())
  .then((res) => {
    console.log(res);
    return res.status === 200 ? res.data[0] : null;
  })
  .catch((err) => {
    throw err;
  });

const createUserDataSummaryCard = (user) => {
  const card = document.createElement('div');
  card.classList.add('profile-text__wrapper');
  card.id = 'profile-text__wrapper';
  const userBio = document.createElement('p');
  userBio.id = 'profile-username';
  userBio.textContent = user.bio;
  const userName = document.createElement('p');
  userName.id = 'profile-bio';
  const { firstname, lastname } = user;
  userName.textContent = `${firstname} ${lastname}`;
  card.appendChild(userName);
  card.appendChild(userBio);
  return card;
};

const personalDataForm = document.getElementById('personal-data-form');
const fullNameField = document.getElementById('fullName');

const replaceFormFields = (user) => {
  fullNameField.placeholder = `${user.firstname} ${user.lastname}`;
  return fullNameField;
};

window.onload = () => {
  const userId = localStorage.getItem('userId');
  fetchUser(userId)
    .then((user) => {
      if (user) {
        const userDataCard = createUserDataSummaryCard(user);
        userProfileImageTextWrapper.appendChild(userDataCard);
        replaceFormFields(user);
      }
    })
    .catch((err) => {
      throw err;
    });
};
