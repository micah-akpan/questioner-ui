/* eslint-disable */

const d = document;

const searchIcon = d.getElementById('search-icon');
const searchBar = d.getElementById('search-bar');

const btnTrigger = d.querySelector('.dropdown-trigger-btn');
const dropDownMenu = d.querySelector('.q-user-profile__dropdown-menu');

const meetupDropdownTrigger = d.querySelector('.q-card__primary-options');
const meetupDropdownMenu = d.querySelector(
  '.q-card__primary-options .dropdown-menu'
);
const delBtn = d.querySelector('.dropdown-menu .delete-option');
const editBtn = d.querySelector('.dropdown-menu .edit-option');
const modal = d.querySelector('.modal');
const closeModalBtn = d.querySelector('.close-modal-btn');


// Meetups Cards
const cards = d.querySelector('.cards');

// Toggle display of dropdown menu
btnTrigger.onclick = () => {
  dropDownMenu.classList.toggle('show');
};

searchIcon.onclick = () => {
  searchBar.classList.add('show');
};

// close search bar
d.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideNode(searchBar, 'show');
    hideNode(modal, 'active');
  }
});

function hideNode(node, className) {
  node.classList.remove(className);
}

function showNode(node, keyPressed) {
  if (keyPressed === 'Escape') {
    node.classList.add('show');
  }
}

// meetupDropdownTrigger.onclick = (e) => {
//   meetupDropdownMenu.classList.toggle('active');
// };

// delBtn.onclick = (e) => {
//   // pop open delete modal
//   modal.classList.toggle('active');
// };

// closeModalBtn.onclick = (e) => {
//   modal.classList.toggle('active');
// };

window.addEventListener('load', () => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    window.location.href = './sign-in.html';
  } else {
    showAllMeetups(userToken); 
  }
});

function showAllMeetups(userToken) {
  fetch('http://localhost:9999/api/v1/meetups', {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        addMeetupsToDOM(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

// creates the meetup card
// and its content
function createMeetup(meetup) {
  const meetupCard = document.createElement('div');
  meetupCard.classList.add('q-card');
  const meetupCardLink = document.createElement('a');
  meetupCardLink.setAttribute('href', './meetup.html')
  const meetupCardContentWrapper = document.createElement('div');
  meetupCardContentWrapper.classList.add('q-card__primary');

  const content = document.createElement('div');
  content.classList.add('content');
  const meetupImage = document.createElement('img');
  meetupImage.setAttribute('src', '../assets/img/startup-meetup2.jpg');
  meetupImage.setAttribute('alt', '')
  meetupImage.setAttribute('class', 'meetup-main-image');

  const meetupQuestionCount = document.createElement('span');
  meetupQuestionCount.classList.add('q-asked-count');
  meetupQuestionCount.setAttribute('title', 'Total questions asked in this meetup');
  meetupQuestionCount.textContent = 20;

  const meetupDetail = document.createElement('div');
  meetupDetail.setAttribute('class', 'q-card__sec');
  
  const meetupTitle = document.createElement('p');
  meetupTitle.setAttribute('class', 'meetup-title');
  meetupTitle.textContent = meetup.topic;
  const meetupDate = document.createElement('p');
  meetupDate.setAttribute('class', 'meetup-sched-date');
  meetupDate.textContent = meetup.happeningOn;

  content.appendChild(meetupImage);
  content.appendChild(meetupQuestionCount);

  meetupCardContentWrapper.appendChild(content);

  meetupCardLink.appendChild(meetupCardContentWrapper);

  meetupCard.appendChild(meetupCardLink);

  return meetupCard;
}

function convertMeetupsToCards(meetups) {
  const allMeetups = meetups.map(meetup => {
    return createMeetup(meetup);
  });

  return allMeetups;
}

/**
 * 
 * @param {Array<Element>} meetups 
 */
function addMeetupsToDOM(meetups) {
  cards.innerHTML = '';
  const meetupsDOM = convertMeetupsToCards(meetups);
  meetupsDOM.forEach((meetup) => {
    cards.appendChild(meetup);
  });
}


function createButton({ attribs, text }) {
  const button = document.createElement('button');
  button.classList.add('q-btn');
  button.classList.add('btn__centered');
  button.textContent = 'SEE MORE X Meetups';

  return button;
}