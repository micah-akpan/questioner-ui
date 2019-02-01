/* eslint-disable */
const apiBaseURL = 'http://localhost:9999/api/v1';

const detailsWrapper = document.querySelector('.details-content');
const meetupTitleHost = document.querySelector('.meetup-title-host');
const meetupTitle = document.querySelector('.meetup-title-host h3');
const meetupOrganizer = document.querySelector('.meetup-title-host p');
const activeMeetupId = localStorage.getItem('activeMeetupId');
const imagePreviewWrapper = document.querySelector('.image-preview');
const imagePreview = document.querySelector('.image-preview img');
const photosWrapper = document.querySelector('.meetup-photos__wrapper');
const rsvpEnquiryWrapper = document.querySelector('.meetup-rsvp__enquiry');

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

const genericRequestHeader = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Token.getToken('userToken')}`
  }
};

/**
 * @func getMeetupImages
 * @param {*} meetup
 * @returns {Promise<Array>} Returns a list of meetup images 
 */
const getMeetupImages = async (meetup) => {
  try {
    const url = `${apiBaseURL}/meetups/${meetup.id}/images`;
    const response = await fetch(url, genericRequestHeader);
    const responseBody = await response.json();
    console.log(responseBody)
    return responseBody.data;
  } catch (e) {

  }
}

/**
 * @func addMeetupImageToPage
 * @param {*} meetup Meetup object
 * @returns {*}
 * @description Places a main meetup image on the page 
 */
const addMeetupImageToPage = async (meetup) => {
  try {
    const meetupImages = await getMeetupImages(meetup);
    const image = meetupImages[0];
    const defaultImage = '../assets/img/showcase2.jpg';
    imagePreview.setAttribute('src', image.imageUrl || defaultImage);
    return imagePreview;
  } catch (e) {

  }
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
};

const getMeetupRsvps = async (meetup) => {
  const response = await fetch(`${apiBaseURL}/meetups/${meetup.id}/rsvps`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token.getToken('userToken')}`
    }
  });
  const result = await response.json();
  const rsvps = result.data;
  return rsvps;
}

const userHasRsvped = async (meetup) => {
  const rsvps = await getMeetupRsvps(meetup);
  const userId = localStorage.getItem('userId');
  const userRsvp = rsvps.find(rsvp => {
    return rsvp.user === Number(userId);
  });

  return userRsvp !== null;
}

const sendRsvpFeedback = async (meetup) => {
  const rsvpForMeetupExist = await userHasRsvped(meetup);
  if (rsvpForMeetupExist) {
    const allRsvpsForMeetup = await getMeetupRsvps(meetup);
    const rsvp = allRsvpsForMeetup[0];
    const feedbackMsg = `You are ${rsvp.response === 'yes' || rsvp.response === 'maybe' ? 'going' : 'not going'} to this meetup`;

    rsvpEnquiryWrapper.innerHTML = '';
    const text = document.createTextNode(feedbackMsg);
    const p = document.createElement('p');
    p.appendChild(text);
    const responseUpdateBtn = document.createElement('button');
    responseUpdateBtn.classList.add('q-btn');
    responseUpdateBtn.textContent = 'Change Response';

    rsvpEnquiryWrapper.appendChild(p);
    rsvpEnquiryWrapper.appendChild(responseUpdateBtn);
  }
}


const addMeetupToDOM = (meetup) => {
  detailsWrapper.appendChild(addMeetupDetailsToDOM(meetup));
  addMeetupDateToDOM(meetup);
  addMeetupImageToPage(meetup);
  addMeetupImagesToDOM();
  sendRsvpFeedback(meetup);
}


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