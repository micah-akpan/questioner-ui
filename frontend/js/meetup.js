/* eslint-disable */
window.onload = (e) => {
  const userToken = Token.getToken('userToken');
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    displayMeetup()
  }
}

const detailsWrapper = document.querySelector('.details-content');
const meetupTitleHost = document.querySelector('.meetup-title-host'); 
const meetupTitle = document.querySelector('.meetup-title-host h3');
const meetupOrganizer = document.querySelector('.meetup-title-host p');

const setMeetupMainDetails = (meetup) => {
  meetupTitle.textContent = meetup.topic;
  meetupOrganizer.textContent = 'Organized by X';
  meetupTitleHost.appendChild(meetupTitle);
  meetupTitleHost.appendChild(meetupOrganizer);
  detailsWrapper.appendChild(meetupTitleHost);
};

const addMeetupDetailsToDOM = (meetup) => {
  console.log(meetup);
  setMeetupMainDetails(meetup);
}

const apiBaseURL = 'http://localhost:9999/api/v1';

const displayMeetup = () => {
  fetch(`${apiBaseURL}/meetups/${localStorage.getItem('activeMeetupId')}`, {
    headers: {
      Authorization: `Bearer ${Token.getToken('userToken')}`
    }
  })
    .then(res => res.json())
    .then(res => {
      const tokenValid = Token.tokenIsValid(res.status);
      if (tokenValid) {
        if (res.status === 200) {
          addMeetupDetailsToDOM(res.data[0]);
        }
      } else {

      }
    })
    .catch((err) => {
      throw err;
    })
}

