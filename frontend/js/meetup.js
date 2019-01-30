/* eslint-disable */

const detailsWrapper = document.querySelector('.details-content');
const meetupTitleHost = document.querySelector('.meetup-title-host');
const meetupTitle = document.querySelector('.meetup-title-host h3');
const meetupOrganizer = document.querySelector('.meetup-title-host p');
const activeMeetupId = localStorage.getItem('activeMeetupId');
const imagePreviewWrapper = document.querySelector('.image-preview');
const imagePreview = document.querySelector('.image-preview img');
const photosWrapper = document.querySelector('.meetup-photos__wrapper');

const addMeetupDetailsToDOM = (meetup) => {
  meetupTitle.textContent = meetup.topic;
  meetupOrganizer.textContent = 'Organized by X';
  meetupTitleHost.appendChild(meetupTitle);
  meetupTitleHost.appendChild(meetupOrganizer);
  return meetupTitleHost;
};

const addMeetupDateToDOM = (meetup) => {
  const meetupDate = document.querySelector('.meetup-date__primary');
  const [month, day] = parseDate(meetup.happeningOn);
  meetupDate.textContent = month;
  const lineBreak = document.createElement('p');
  lineBreak.textContent = day;
  meetupDate.appendChild(lineBreak);
  return meetupDate;
}

const addMeetupMainImage = async (meetup) => {
  const response = await fetch(`${apiBaseURL}/meetups/${activeMeetupId}/images`, {
    headers: {
      Authorization: `Bearer ${Token.getToken('userToken')}`
    }
  });
  const result = await response.json();
  const defaultImage = '../assets/img/showcase2.jpg';
  const image = result.data[0];
  imagePreview.src = image.imageurl || defaultImage;
}

const addMeetupDescription = (meetup) => {
  const meetupDescription = document.querySelector('.meetup-desc');
  meetupDescription.textContent = meetup.description;
  return meetupDescription;
}

const createMeetupImages = (images) => {
  const pics = images.map((image) => {
    const a = document.createElement('a');
    a.href = image.imageurl;
    const img = document.createElement('img');
    img.src = image.imageurl;
    img.alt = '';
    a.appendChild(img);
    return a;
  });

  return pics;
}

const addMeetupImagesToDOM = async () => {
  const response = await fetch(`${apiBaseURL}/meetups/${activeMeetupId}/images`, {
    headers: {
      Authorization: `Bearer ${Token.getToken('userToken')}`
    }
  });
  const result = await response.json();
  const defaultImage = '../assets/img/showcase2.jpg';
  const images = result.data;

  const meetupImages = createMeetupImages(images);

  meetupImages.forEach(image => {
    photosWrapper.appendChild(image);
  });
}


const addMeetupToDOM = (meetup) => {
  detailsWrapper.appendChild(addMeetupDetailsToDOM(meetup));
  addMeetupDateToDOM(meetup);
  addMeetupMainImage(meetup);
  addMeetupImagesToDOM();
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
          addMeetupToDOM(res.data[0]);
        }
      } else {

      }
    })
    .catch((err) => {
      throw err;
    })
}

window.onload = (e) => {
  const userToken = Token.getToken('userToken');
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    displayMeetup()
  }
}