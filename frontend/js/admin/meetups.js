/**
 * @module meetups
 * @description Meetups specific logic for admins
 */

const apiBaseURL = 'http://localhost:9999/api/v1';
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const cards = document.querySelector('.cards');
const seeMoreBtn = document.querySelector('.see-more-meetups_btn');

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
          Authorization: `Bearer ${Token.getToken('userToken')}`
        }
      }
    );
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
const getMeetupImages = async (meetup) => {
  const res = await fetch(`${apiBaseURL}/meetups/${meetup.id}/images`, {
    headers: {
      Authorization: `Bearer ${getUserToken()}`
    }
  });

  const result = await res.json();
  return result.data;
};

const tokenIsValid = (response) => response.status !== 401;

const deleteMeetup = (meetupId) => {
  const apiUrl = `${apiBaseURL}/meetups/${meetupId}`;
  fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserToken()}`
    }
  })
  .then((res) => res.json())
  .then((res) => {
    window.location.reload();
  })
  .catch((err) => {
    console.error(err);
  })
}

const createDropDownMenuItems = (meetup) => {
  return icons.meetups.map((icon) => {
    const li = document.createElement('li');
    li.classList.add(icon.className);
    li.onclick = () => {
      const meetupId = meetup.id;
      deleteMeetup(meetupId);
    }
    const img = document.createElement('img');
    img.src = icon.src;
    img.alt = icon.alt;
    const span = document.createElement('span');
    span.textContent = icon.text;
    li.appendChild(img);
    li.appendChild(span);

    return li;
  })
}

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
}

const showDropDownMenu = (meetup) => {
  const dropDownMenu = document.getElementById(`dropdown-menu-${meetup.id}`);
  dropDownMenu.classList.toggle('show');
}

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
      meetupImage.setAttribute('src', image && image.imageUrl || defaultImage);
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
}

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
const addMeetupsToPage = (meetups) => {
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
