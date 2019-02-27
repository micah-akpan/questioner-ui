const getUpcomingMeetups = () => {
  const apiUrl = `${apiBaseURL}/meetups/upcoming`;
  return fetch(apiUrl, {
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

const getMeetupImages = (meetupId) => {
  const apiUrl = `${apiBaseURL}/meetups/${meetupId}/images`;
  return fetch(apiUrl, {
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

const createCardPrimarySection = (meetup) => {
  const meetupDetailsPrimary = document.createElement('div');
  meetupDetailsPrimary.classList.add('meetup-details__primary');

  const meetupTitle = document.createElement('h3');
  meetupTitle.classList.add('title');
  meetupTitle.textContent = meetup.title;

  const meetupLocation = document.createElement('span');
  meetupLocation.textContent = meetup.location;

  const meetupFullDate = document.createElement('span');
  meetupFullDate.textContent = new Date(meetup.happeningOn).toDateString();

  meetupDetailsPrimary.appendChild(meetupTitle);
  meetupDetailsPrimary.appendChild(meetupLocation);
  meetupDetailsPrimary.appendChild(meetupFullDate);
  return meetupDetailsPrimary;
};

const createCardSecondarySection = (meetup) => {
  const meetupDetailsSecondary = document.createElement('div');
  meetupDetailsSecondary.classList.add('meetup-details__sec');

  const meetupDate = document.createElement('p');
  meetupDate.classList.add('date__sec_month');

  const month = new Date(meetup.happeningOn).getMonth();
  meetupDate.textContent = getMonth(month);

  const breakLine = document.createElement('br');
  meetupDate.appendChild(breakLine);

  const meetupDateMonth = document.createElement('span');
  meetupDateMonth.classList.add('date__sec_date');
  meetupDateMonth.textContent = new Date(meetup.happeningOn).getDate();

  meetupDate.appendChild(meetupDateMonth);
  meetupDetailsSecondary.appendChild(meetupDate);

  return meetupDetailsSecondary;
};

const createUpcomingMeetupCard = (meetup) => {
  const card = document.createElement('div');
  card.classList.add('q-card', 'q-card__no-border');

  const primaryContent = document.createElement('a');
  primaryContent.href = './pages/meetup.html';
  primaryContent.classList.add('q-card__primary');

  primaryContent.onclick = () => {
    localStorage.setItem('activeMeetupId', meetup.id);
  };

  const content = document.createElement('div');
  content.classList.add('content');

  const cardImage = document.createElement('img');

  getMeetupImages(meetup.id)
    .then((images) => {
      cardImage.src = (images[0] && images[0].imageUrl) || './assets/img/startup-meetup2.jpg';
      cardImage.alt = '';
    })
    .catch((err) => {
      throw err;
    });

  const meetupDetails = document.createElement('div');
  meetupDetails.classList.add('meetup-details');

  const meetupDetailsPrimary = createCardPrimarySection(meetup);

  const meetupDetailsSecondary = createCardSecondarySection(meetup);

  meetupDetails.appendChild(meetupDetailsSecondary);
  meetupDetails.appendChild(meetupDetailsPrimary);

  content.appendChild(cardImage);
  content.appendChild(meetupDetails);

  primaryContent.appendChild(content);
  card.appendChild(primaryContent);

  return card;
};

const addUpcomingMeetupCardsToPage = (meetups) => {
  const cards = document.querySelector('.cards');
  meetups.forEach((meetup) => {
    const card = createUpcomingMeetupCard(meetup);
    cards.appendChild(card);
  });
  return cards;
};

getUpcomingMeetups()
  .then((upcomingMeetups) => {
    addUpcomingMeetupCardsToPage(upcomingMeetups);
  })
  .catch((err) => {
    console.error(err);
  });
