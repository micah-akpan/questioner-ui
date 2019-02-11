/**
 * @module meetups
 * @description Contains logic for meetups list page
 */

const apiBaseURL = 'http://localhost:9999/api/v1';
const userToken = localStorage.getItem('userToken');

const requestHeaders = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`
  }
};

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

/**
 * @func getMeetupImages
 * @param {*} meetup Meetup
 * @returns {Promise<Array>} Resolves to a list of meetup images
 */
const getMeetupImages = async (meetup) => {
  try {
    const apiUrl = `${apiBaseURL}/meetups/${meetup.id}/images`;
    const response = await fetch(apiUrl, requestHeaders);
    const responseBody = await response.json();
    const { status, data } = responseBody;
    return status === 200 ? data : [];
  } catch (e) {
    throw e;
  }
};

/**
 * @func tokenIsValid
 * @param {*} response Response hash
 * @returns {Boolean} true if token is valid, false otherwise
 */
const tokenIsValid = response => response.status !== 401;

/**
 *
 * @param {Array} images
 * @returns {String} Returns main meetup image url;
 */
const getMainMeetupImage = images => images[0].imageUrl;


const onAdminPage = () => {
  const urlPaths = window.location.pathname.split('/');
  return urlPaths.includes('admin');
};

const createCardActionButton = (meetup) => {
  const buttonBlock = document.createElement('div');
  buttonBlock.classList.add('q-card__primary-options');
  const button = document.createElement('button');
  button.classList.add('q-btn', 'btn');
  const actionButtonImg = document.createElement('img');
  const imgSrc = '../../assets/icons/horizontal.svg';
  actionButtonImg.src = imgSrc;
  actionButtonImg.alt = '3 dot ellipsis image to toggle drop down menu';
  button.appendChild(actionButtonImg);
  const dropDownMenu = createDropDownMenu(meetup);
  buttonBlock.appendChild(button);
  buttonBlock.appendChild(dropDownMenu);
  return buttonBlock;
};

const createCardPrimaryDetails = (meetup) => {
  const content = document.createElement('div');
  content.classList.add('content');
  const meetupImage = document.createElement('img');
  const urlPaths = window.location.pathname.split('/');
  const isAdminPage = urlPaths.includes('admin');
  const defaultImage = isAdminPage ? '../../assets/img/startup-meetup2.jpg' : '../assets/img/startup-meetup2.jpg';

  getMeetupImages(meetup)
    .then((images) => {
      if (images.length > 0) {
        return getMainMeetupImage(images);
      }
      return defaultImage;
    })
    .then((image) => {
      meetupImage.setAttribute('src', image);
    });
  meetupImage.setAttribute('alt', '');
  meetupImage.classList.add('meetup-main-image');

  const meetupQuestionCount = document.createElement('span');
  meetupQuestionCount.classList.add('q-asked-count');
  meetupQuestionCount.setAttribute('title', 'Total questions asked in this meetup');

  if (onAdminPage()) {
    const actionButton = createCardActionButton(meetup);
    content.appendChild(actionButton);
    actionButton.onclick = (e) => {
      e.preventDefault();
      showDropDownMenu(meetup);
    };
  }

  getTotalQuestionsAsked(meetup)
    .then((value) => {
      meetupQuestionCount.textContent = value;
    })
    .catch((err) => {
      throw err;
    });
  content.appendChild(meetupImage);
  content.appendChild(meetupQuestionCount);

  return content;
};

/**
 * @func createCardSecondaryDetails
 * @param {*} meetup Meetup
 * @returns {HTMLDivElement} HTML element representing the meetup card
 */
const createCardSecondaryDetails = (meetup) => {
  const content = document.createElement('div');
  content.classList.add('content', 'q-card__sec');

  const meetupTitle = document.createElement('p');
  meetupTitle.classList.add('meetup-title');
  meetupTitle.textContent = meetup.title;

  const meetupDate = document.createElement('p');
  meetupDate.classList.add('meetup-sched-date');
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
  const meetupCardPrimaryWrapper = document.createElement('div');
  meetupCardPrimaryWrapper.classList.add('q-card__primary');

  const primarySection = createCardPrimaryDetails(meetup);
  const secondarySection = createCardSecondaryDetails(meetup);

  meetupCardPrimaryWrapper.appendChild(primarySection);

  meetupCardLink.appendChild(meetupCardPrimaryWrapper);
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
 * @func addMeetupsToPage
 * @param {Array<HTMLElement>} meetups An array of meetups cards
 * @returns {HTMLElement} The list of meetup cards
 */
const addMeetupsToPage = (meetups) => {
  cards.innerHTML = '';
  const meetupsDOM = convertMeetupsToCards(meetups);
  meetupsDOM.forEach((meetup) => {
    cards.appendChild(meetup);
  });

  return cards;
};

const getMeetups = () => fetch(`${apiBaseURL}/meetups`, {
  headers: {
    Authorization: `Bearer ${userToken}`
  }
})
  .then(response => response.json())
  .then(response => response)
  .catch((err) => {
    throw err;
  });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchBar.classList.remove('show');
  }
});