/**
 * @module meetups
 * @description Contains logic for meetups list page
 * And logic here is used for both admin and non-admin
 * users
 */
const userToken = localStorage.getItem('userToken');

const requestHeaders = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`
  }
};

const searchIcon = document.getElementById('search-icon');
const searchBarForm = document.getElementById('search-bar__form');
const searchBar = document.getElementById('search-bar__field');
const cards = document.getElementById('meetup-cards');
const meetupCardsWrapper = document.getElementById('meetup-cards__wrapper');

/**
 * @func createPaginationButton
 * @param {String} text
 * @returns {HTMLButtonElement} Creates a pagination button
 * with `text` as its text content
 */
const createPaginationButton = (text) => {
  const pgButton = document.createElement('button');
  pgButton.textContent = text;
  pgButton.classList.add('q-btn', 'btn__centered', 'see-more-meetups_btn');
  return pgButton;
};

if (searchIcon) {
  searchIcon.onclick = () => {
    searchBar.classList.add('show');
    searchBar.focus();
  };
}

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
 *
 * @param {Array} images
 * @returns {String} Returns main meetup image url;
 */
const getMainMeetupImage = images => images[0].imageUrl;

/**
 * @func onAdminPage
 * @returns {Boolean} Returns true if user is
 * currently on an admin page, false otherwise
 */
const onAdminPage = () => {
  const urlPaths = window.location.pathname.split('/');
  return urlPaths.includes('admin');
};

/**
 * @func createCardActionButton
 * @param {*} meetup
 * @returns {HTMLElement} Creates Action button
 * on meetups cards and returns the wrapper element
 */
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

/**
 * @func createCardPrimaryDetails
 * @param {*} meetup
 * @returns {HTMLElement} Returns the primary content element
 */
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
  const { title, topic, happeningOn } = meetup;
  const content = document.createElement('div');
  content.classList.add('content', 'q-card__sec');

  const meetupTitle = document.createElement('p');
  meetupTitle.classList.add('meetup-title');
  meetupTitle.textContent = title || topic;

  const meetupDate = document.createElement('p');
  meetupDate.classList.add('meetup-sched-date');
  const [month, day] = parseDate(happeningOn);
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

/**
 * @func onMeetupsListPage
 * @returns {Boolean} Returns true if user
 * is currently on the meetups list page
 */
const onMeetupsListPage = () => {
  const urlPaths = window.location.pathname.split('/');
  return urlPaths.includes('meetups.html');
};
/**
 * @func getMeetups
 * @returns {Promise<Array>} Resolves to a list of meetups
 * or an empty array if no meetups were found
 */
const getMeetups = () => fetch(`${apiBaseURL}/meetups`, {
  headers: {
    Authorization: `Bearer ${userToken}`
  }
})
  .then(response => response.json())
  .then((responseBody) => {
    const { status, data } = responseBody;
    return status === 200 ? data : [];
  })
  .catch((err) => {
    // Periodically check if there's internet connection available
    throw err;
  });

/**
 * @func fetchAndAddMeetupsToPage
 * @returns {Promise<String>} Resolves to a success
 * message confirming meetups have been added to page
 */
const fetchAndAddMeetupsToPage = () => getMeetups().then((meetups) => {
  if (tokenIsValid(userToken)) {
    const MAX_MEETUPS = 6;
    if (meetups.length > MAX_MEETUPS) {
      const meetupsToBeDisplayed = meetups.slice(0, MAX_MEETUPS);
      addMeetupsToPage(meetupsToBeDisplayed);
      const remainingMeetups = meetups.length - MAX_MEETUPS;
      const paginateText = `SEE MORE ${remainingMeetups} ${remainingMeetups > 1 ? 'MEETUPS' : 'MEETUP'}`;
      meetupCardsWrapper.appendChild(createPaginationButton(paginateText));
    } else {
      addMeetupsToPage(meetups);
    }
    return 'Meetups added to page';
  }
  localStorage.removeItem('userToken');
  window.location.assign('./sign-in.html');
})
  .catch((err) => {
    throw err;
  });

/**
 * @const searchForMeetups
 * @param {String} searchTermValue
 * @returns {Promise<Array>} Resolves to an array of meetups
 * that meets criteria: `searchTermValue`
 */
const searchForMeetups = (searchTermValue) => {
  const searchAPIURL = `${apiBaseURL}/meetups?searchTerm=${searchTermValue}`;
  return fetch(searchAPIURL, {
    headers: genericRequestHeader
  })
    .then(res => res.json())
    .then((resBody) => {
      const { status, data } = resBody;
      return status === 200 ? data : [];
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func displayNoMeetupsFallback
 * @param {String} searchTermValue
 * @returns {HTMLElement} Returns Meetups cards HTML
 * Element wrapper
 */
const displayNoMeetupsFallback = (searchTermValue) => {
  cards.innerHTML = '';
  const fallback = document.createElement('section');
  fallback.classList.add('no-meetup-fallback');
  const fallbackText = document.createElement('p');
  fallbackText.classList.add('no-meetup-fallback__text');
  const term = document.createElement('span');
  term.textContent = searchTermValue;
  term.classList.add('no-meetup-fallback__term');
  fallbackText.textContent = 'We couldn\'t find any meetup having the topic, location or tag: ';
  fallbackText.appendChild(term);
  const fallbackLink = document.createElement('a');
  fallbackLink.href = '#search-bar__field';
  fallbackLink.textContent = 'Try Another Search?';
  fallbackLink.onclick = () => {
    clearFormField('search-bar__field');
    focusFormField('search-bar__field');
  };
  fallbackLink.classList.add('no-meetup-fallback__link');
  fallback.appendChild(fallbackText);
  fallback.appendChild(fallbackLink);
  cards.appendChild(fallback);
  return cards;
};

searchBarForm.onsubmit = (e) => {
  e.preventDefault();
  const searchTermValue = searchBar.value;
  searchForMeetups(searchTermValue)
    .then((meetups) => {
      if (meetups.length === 0) {
        displayNoMeetupsFallback(searchTermValue);
      } else {
        addMeetupsToPage(meetups);
      }
    })
    .catch((err) => {
      throw err;
    });
};

const searchSectionList = document.querySelector('.meetups-search-type-list');
const searchSectionListItems = searchSectionList.querySelectorAll('li');

const listItemNames = ['All', 'Favorites', 'Upcoming'];

searchSectionListItems.forEach((listItem) => {
  listItem.onclick = function toggleActiveItem() {
    searchSectionListItems.forEach((item) => {
      item.classList.remove('meetups-search-type-list__item--active');
    });

    this.classList.add('meetups-search-type-list__item--active');
  };
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchBar.classList.remove('show');
  }
});
