/* eslint-disable */

const apiBaseURL = 'http://localhost:9999/api/v1';
const userToken = localStorage.getItem('userToken');

const requestHeaders = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`
  }
};

const btnTrigger = document.querySelector('.dropdown-trigger-btn');
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const cards = document.getElementById('meetup-cards');
const meetupCardsWrapper = document.getElementById('meetup-cards__wrapper');


const createPaginationButton = (text) => {
  const pgButton = document.createElement('button');
  pgButton.textContent = text;
  pgButton.classList.add('q-btn', 'btn__centered', 'see-more-meetups_btn');
  return pgButton;
};

searchIcon.onclick = () => {
  searchBar.classList.add('show');
};

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
    const response = await fetch(`${apiBaseURL}/meetups/${meetup.id}/questions`, requestHeaders);
    const res = await response.json();
    if (res.status === 200) {
      totalQuestions = res.data.length;
    }
    return totalQuestions;
  } catch (e) {
    throw e;
  }
}

/* eslint-disable */
/**
 * @func getMeetupImages
 * @param {*} meetup Meetup
 * @returns {Promise<Array>} Resolves to a list of meetup images
 */
const getMeetupImages = async (meetup) => {
  const apiUrl = `${apiBaseURL}/meetups/${meetup.id}/images`;
  const response = await fetch(apiUrl, requestHeaders);
  const responseBody = await response.json();
  const { status, data } = responseBody;
  return status === 200 ? data : [];
};

/**
 * @func tokenIsValid
 * @param {*} response Response hash
 * @returns {Boolean} true if token is valid, false otherwise
 */
const tokenIsValid = (response) => response.status !== 401;

/**
 * @function createMeetupCardPrimarySec
 * @param {*} meetup Meetup object
 * @returns {HTMLElement} A wrapper HTMLElement for primary details about a meetup
 */
const createMeetupCardPrimarySec = (meetup) => {
  const content = document.createElement('div');
  content.classList.add('content');
  const meetupImage = document.createElement('img');
  const defaultImage = '../assets/img/startup-meetup2.jpg';

  getMeetupImages(meetup)
    .then(images => images.length > 0 ? images[0].imageUrl : defaultImage)
    .then((image) => {
      meetupImage.setAttribute('src', image);
    })
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

/**
 * @func createMeetupCardSecondarySec
 * @param {*} Meetup
 * @returns {HTMLDivElement} HTML element representing the meetup card
 */
const createMeetupCardSecondarySec = (meetup) => {
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
 * @func createMeetupCard
 * @param {*} meetup Meetup object
 * @returns {HTMLElement} Meetup Card
 */
const createMeetupCard = (meetup) => {
  const meetupCard = document.createElement('div');
  meetupCard.classList.add('q-card');

  const meetupCardLink = createMeetupLink(meetup);
  const meetupCardContentWrapper = document.createElement('div');
  meetupCardContentWrapper.classList.add('q-card__primary');

  const primarySection = createMeetupCardPrimarySec(meetup);
  const secondarySection = createMeetupCardSecondarySec(meetup);

  meetupCardContentWrapper.appendChild(primarySection);

  meetupCardLink.appendChild(meetupCardContentWrapper);
  meetupCardLink.appendChild(secondarySection);

  meetupCard.appendChild(meetupCardLink);

  return meetupCard;
};

/**
 * @func convertMeetupsToCards
 * @param {Array} meetups list of meetups
 * @returns {Array<HTMLElement>} List of meetups HTML DOM elements
 */
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
  fetch(`${apiBaseURL}/meetups`, requestHeaders)
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
            const paginateText = `SEE MORE ${remainingMeetups} ${remainingMeetups > 1 ? 'MEETUPS' : 'MEETUP'}`;
            meetupCardsWrapper.appendChild(createPaginationButton(paginateText));
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
