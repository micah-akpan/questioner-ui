/* eslint-disable */

/**
 * @const
 * @description Rsvp button specifications
 */
const rsvpBtnSpecs = [
  {
    id: 1,
    text: 'yes'
  },

  {
    id: 2,
    text: 'maybe'
  },

  {
    id: 3,
    text: 'no'
  }
];

const rsvpEnquiryWrapper = document.getElementById('meetup-rsvp__enquiry');

/**
 * @func getMeetupRsvps
 * @param {*} meetup Meetup object
 * @returns {Array} An Array of rsvps for `meetup` 
 */
const getMeetupRsvps = async (meetup) => {
  try {
    const apiUrl = `${apiBaseURL}/meetups/${meetup.id}/rsvps`;
    const response = await fetch(apiUrl, requestHeader);
    const responseBody = await response.json();
    if (responseBody.status === 200) {
      return responseBody.data;
    }
    return [];
  } catch (e) {

  }
}

const updateUserRsvpStatus = (meetup, rsvp) => {
  fetch(`${apiBaseURL}/meetups/${meetup.id}/rsvps/${rsvp.id}`, {
    method: 'PATCH',
    headers: requestHeader
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    })
}

/**
 * @func getUserRsvp
 * @param {*} meetup
 * @returns {Promise} Resolves to a Meetup Rsvp object
 */
const getUserRsvp = async (meetup) => {
  const rsvps = await getMeetupRsvps(meetup);
  const userId = localStorage.getItem('userId');
  const userRsvp = rsvps.find((rsvp) => {
    return rsvp.user === Number(userId);
  });

  return userRsvp;
}

/**
 * @func userHasRsvped
 * @param {*} meetup Meetup object
 * @returns {Promise<Boolean>} Resolve to true if user has rsvped for `meetup`, false otherwise
 */
const userHasRsvped = async (meetup) => {
  const userRsvp = await getUserRsvp(meetup);
  return userRsvp !== undefined;
}

/**
 * @func formRsvpFeedbackMsg
 * @param {String} response
 * @returns {String} Rsvp feedback message
 */
const formRsvpFeedbackMsg = (response) => {
  let feedbackMessage = '';
  if (response === 'yes') {
    feedbackMessage = 'You are going to this meetup'
  } else if (response === 'no') {
    feedbackMessage = 'You are not going to this meetup';
  } else {
    feedbackMessage = 'You are likely to attend this meetup'
  }

  return feedbackMessage;
}

/**
 * @func rsvpForMeetup
 * @param {String} userResponse
 * @returns {<Promise>Array} Resolves to an array of the user rsvp for the meetup
 */
const rsvpForMeetup = async (userResponse) => {
  // do a check here if user has rsvped for this meetup
  const rsvpExist = await userHasRsvped({
    id: activeMeetupId
  });
  if (!rsvpExist) {
    const meetupId = localStorage.getItem('activeMeetupId');
    const apiUrl = `${apiBaseURL}/meetups/${meetupId}/rsvps`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ response: userResponse })
    });
    const responseBody = await response.json();
    return responseBody.data;
  }

  const rsvpWrapper = document.querySelector('.rsvp__wrapper');
  rsvpWrapper.style.display = 'none';

  const meetup = await getMeetup();
  displayRsvpFeedbackMsg(meetup);
}


/**
 * @func createRsvpButtons
 * @returns {Array<HTMLButtonElement>} An array of button elements representing the rsvp actions
 */
const createRsvpButtons = () => {
  const rsvpButtons = rsvpBtnSpecs.map((spec) => {
    const button = document.createElement('button');
    button.classList.add('q-btn', 'rsvp-btn');
    button.textContent = spec.text;
    button.setAttribute('data-target', spec.id);
    button.onclick = () => rsvpForMeetup(spec.text);
    return button;
  })

  return rsvpButtons;
}


/**
 * @func displayRsvpBtns
 * @returns {HTMLElement}
 */
const displayRsvpBtns = () => {
  const rsvpWrapper = document.querySelector('.rsvp__wrapper');
  const userFeedbackWrapper = document.querySelector('.rsvp-feedback__wrapper');
  rsvpWrapper.style.display = 'block';
  userFeedbackWrapper.style.display = 'none';
  return rsvpWrapper;
}


const addRsvpButtonsToPage = (meetup) => {
  const rsvpWrapper = document.createElement('div');
  rsvpWrapper.classList.add('rsvp__wrapper');
  const rsvpButtons = createRsvpButtons();
  const p = document.createElement('p');
  p.textContent = 'Will you attend this meetup?';
  const btnsWrapper = document.createElement('div');
  btnsWrapper.classList.add('meetup-sched__btns');
  rsvpButtons.forEach((rsvpButton) => {
    btnsWrapper.appendChild(rsvpButton);
  });
  rsvpWrapper.appendChild(p);
  rsvpWrapper.appendChild(btnsWrapper);
  rsvpEnquiryWrapper.appendChild(rsvpWrapper);
  return rsvpEnquiryWrapper;
}

/**
 * 
 * @param {*} meetup Meetup object
 * @returns {Promise<Element>} Resolves to an HTMLElement
 * @description Adds An RSVP feedback to page
 */
const displayRsvpFeedbackMsg = async (meetup) => {
  const userRsvp = await getUserRsvp(meetup);
  const userResponse = userRsvp.response;
  const feedbackMessage = formRsvpFeedbackMsg(userResponse);

  const userResponseBlock = document.createElement('div');
  userResponseBlock.classList.add('rsvp-feedback__wrapper');

  const text = document.createTextNode(feedbackMessage);
  const p = document.createElement('p');
  p.classList.add('user-rsvp-feedback-msg');
  p.appendChild(text);

  const responseUpdateBtn = document.createElement('button');
  responseUpdateBtn.onclick = () => displayRsvpBtns();
  responseUpdateBtn.classList.add('q-btn');
  responseUpdateBtn.textContent = 'Change Response';

  userResponseBlock.appendChild(p);
  userResponseBlock.appendChild(responseUpdateBtn);

  rsvpEnquiryWrapper.appendChild(userResponseBlock);
  return rsvpEnquiryWrapper;
}