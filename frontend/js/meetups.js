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
      if (res.status === 200) {
        addMeetupsToDOM(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
    })
}



async function getTotalQuestionsAsked(meetup) {
  try {
    let totalQuestions = 0;
    const response = await fetch(
      `http://localhost:9999/api/v1/meetups/${meetup.id}/questions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    });
    const res = await response.json();
    if (res.status === 200) {
      totalQuestions = res.data.length; 
    }

    return totalQuestions;
  } catch (e) {
    console.log(e);
  }
}

/**
 * @func createDOMElement
 * @param {String} elType The type of the element
 * @param {*} attrs An hash structure with attrs: `className`, and `id`
 * @returns {HTMLElement}
 */
function createDOMElement(elType, attrs) {
  const el = document.createElement(elType);
  const { className, id } = attrs;
  el.classList.add(className);
  el.id = id;
  return el;
}

function createMeetupPrimarySec(meetup) {
  const content = document.createElement('div');
  content.classList.add('content');
  const meetupImage = document.createElement('img');
  meetupImage.setAttribute('src', '../assets/img/startup-meetup2.jpg');
  meetupImage.setAttribute('alt', '')
  meetupImage.setAttribute('class', 'meetup-main-image');

  const meetupQuestionCount = document.createElement('span');
  meetupQuestionCount.classList.add('q-asked-count');
  meetupQuestionCount.setAttribute('title', 'Total questions asked in this meetup');

  getTotalQuestionsAsked(meetup)
    .then((value) => {
      meetupQuestionCount.textContent = value;
    })

  content.appendChild(meetupImage);
  content.appendChild(meetupQuestionCount);

  return content;
}

function createMeetupSecondarySec(meetup) {
  const content = document.createElement('div');
  content.setAttribute('class', 'q-card__sec');

  const meetupTitle = document.createElement('p');
  meetupTitle.setAttribute('class', 'meetup-title');
  meetupTitle.textContent = meetup.title;

  const meetupDate = document.createElement('p');
  meetupDate.setAttribute('class', 'meetup-sched-date');
  const [month, day ] = parseDate(meetup.happeningOn); 
  meetupDate.textContent = `${month} ${day}`;

  content.appendChild(meetupTitle);
  content.appendChild(meetupDate);

  return content;
}

function createMeetupLink(meetup) {
  const meetupCardLink = document.createElement('a');
  // TODO: Use dynamic link here
  meetupCardLink.setAttribute('href', './meetup.html');
  return meetupCardLink;
}

// creates the meetup card
// and its content
function createMeetup(meetup) {
  const meetupCard = document.createElement('div');
  meetupCard.classList.add('q-card');

  const meetupCardLink = createMeetupLink();
  const meetupCardContentWrapper = document.createElement('div');
  meetupCardContentWrapper.classList.add('q-card__primary');

  const primarySection = createMeetupPrimarySec(meetup);
  const secondarySection = createMeetupSecondarySec(meetup);

  meetupCardContentWrapper.appendChild(primarySection);

  meetupCardLink.appendChild(meetupCardContentWrapper);
  meetupCardLink.appendChild(secondarySection);

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
 * @param {Array<HTMLElement>} meetups 
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

function parseDate(date) {
  const currentDate = new Date(date);
  const month = currentDate.getMonth();
  const monthShortForm = getMonth(month + 1);
  const day = currentDate.getDay();

  return [monthShortForm, day];
}

const numMonthToStr = { 
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
  5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug',
  9: 'Sept', 10: 'Oct', 11: 'Nov', 12: 'Dec'
};

/**
 * 
 * @param {Number} date 
 */
function getMonth(date) {
  return numMonthToStr[date];
}