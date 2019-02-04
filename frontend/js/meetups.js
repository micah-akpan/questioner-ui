const d = document;

const apiBaseURL = 'http://localhost:9999/api/v1';

const searchIcon = d.getElementById('search-icon');
const searchBar = d.getElementById('search-bar');
const btnTrigger = d.querySelector('.dropdown-trigger-btn');
const dropDownMenu = d.querySelector('.q-user-profile__dropdown-menu');
const cards = d.querySelector('.cards');
const seeMoreBtn = d.querySelector('.see-more-meetups_btn');

// Toggle display of dropdown menu
btnTrigger.onclick = () => {
  dropDownMenu.classList.toggle('show');
};

searchIcon.onclick = () => {
  searchBar.classList.add('show');
};

const getUserToken = () => localStorage.getItem('userToken');

/**
 * @function createMeetupLink
 * @param {*} meetup Meetup object
 * @returns {HTMLElement} Returns an anchor link
 */
const createMeetupLink = (meetup) => {
  const meetupCardLink = document.createElement('a');
  meetupCardLink.setAttribute('href', './meetup.html');
  meetupCardLink.onclick = () => {
    localStorage.setItem('activeMeetupId', meetup.id);
  };
  return meetupCardLink;
};

/**
 * @func getTotalQuestionsAsked
 * @param {*} meetup Meetup
 * @returns {Promise<Number>} Returns the total number of questions
 * asked in a meetup
 */
async function getTotalQuestionsAsked(meetup) {
  try {
    let totalQuestions = 0;
    const response = await fetch(
      `${apiBaseURL}/meetups/${meetup.id}/questions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    );
    const res = await response.json();
    if (res.status === 200) {
      totalQuestions = res.data.length;
    }

    return totalQuestions;
  } catch (e) {
    console.log(e);
  }
}

/* eslint-disable */
const getMeetupImages = async (meetup) => {
  const res = await fetch(`${apiBaseURL}/meetups/${meetup.id}/images`, {
    headers: {
      Authorization: `Bearer ${getUserToken()}`
    }
  });

  const result = await res.json();
  return result.data;
};

const tokenIsValid = (response) => {
  if (response.status === 401) {
    return false;
  }

  return true;
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
  const defaultImage = '../assets/img/startup-meetup2.jpg';

  meetupImage.setAttribute('src', (meetup.images && meetup.images[0]) || defaultImage);
  meetupImage.setAttribute('alt', '');
  meetupImage.setAttribute('class', 'meetup-main-image');

  const meetupQuestionCount = document.createElement('span');
  meetupQuestionCount.classList.add('q-asked-count');
  meetupQuestionCount.setAttribute('title', 'Total questions asked in this meetup');

  getTotalQuestionsAsked(meetup)
    .then((value) => {
      meetupQuestionCount.textContent = value;
    });

  content.appendChild(meetupImage);
  content.appendChild(meetupQuestionCount);

  return content;
};

const createMeetupSecondarySec = (meetup) => {
  const content = document.createElement('div');
  content.setAttribute('class', 'q-card__sec');

  const meetupTitle = document.createElement('p');
  meetupTitle.setAttribute('class', 'meetup-title');
  meetupTitle.textContent = meetup.title;

  const meetupDate = document.createElement('p');
  meetupDate.setAttribute('class', 'meetup-sched-date');
  const [month, day] = parseDate(meetup.happeningOn);
  meetupDate.textContent = `${month} ${day}`;

  content.appendChild(meetupTitle);
  content.appendChild(meetupDate);

  return content;
};

/**
 * @function createMeetupCard
 * @param {*} meetup Meetup object
 * @returns {HTMLElement} Meetup Card
 */
const createMeetupCard = (meetup) => {
  const meetupCard = document.createElement('div');
  meetupCard.classList.add('q-card');

  const meetupCardLink = createMeetupLink(meetup);
  const meetupCardContentWrapper = document.createElement('div');
  meetupCardContentWrapper.classList.add('q-card__primary');

  const primarySection = createMeetupPrimarySec(meetup);
  const secondarySection = createMeetupSecondarySec(meetup);

  meetupCardContentWrapper.appendChild(primarySection);

  meetupCardLink.appendChild(meetupCardContentWrapper);
  meetupCardLink.appendChild(secondarySection);

  meetupCard.appendChild(meetupCardLink);

  return meetupCard;
};

const convertMeetupsToCards = meetups => meetups.map(meetup => createMeetupCard(meetup));

/**
 * @func addMeetupsToDOM
 * @param {Array<HTMLElement>} meetups An array of meetups cards
 * @returns {HTMLElement} The list of meetup cards
 */
const addMeetupsToDOM = (meetups) => {
  cards.innerHTML = '';
  const meetupsDOM = convertMeetupsToCards(meetups);
  meetupsDOM.forEach((meetup) => {
    cards.appendChild(meetup);
  });

  return cards;
};

const showAllMeetups = (userToken) => {
  fetch(`${apiBaseURL}/meetups`, {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  })
    .then(res => res.json())
    .then((res) => {
      if (tokenIsValid(res)) {
        if (res.status === 200) {
          const meetups = res.data;
          const MAX_MEETUPS = 6;
          if (meetups.length > MAX_MEETUPS) {
            const data = meetups.slice(0, MAX_MEETUPS);
            addMeetupsToDOM(data);
            const remainingMeetups = meetups.length - MAX_MEETUPS;
            seeMoreBtn.textContent = `SEE MORE ${remainingMeetups} ${remainingMeetups > 1 ? 'MEETUPS' : 'MEETUP'}`;
          } else {
            addMeetupsToDOM(meetups);
          }
        }
      } else {
        localStorage.removeItem('userToken');
        window.location.assign('./sign-in.html');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

window.addEventListener('load', () => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    showAllMeetups(userToken);
  }
});
