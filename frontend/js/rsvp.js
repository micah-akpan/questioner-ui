const rsvpEnquiryWrapper = document.getElementById('meetup-rsvp__enquiry');

const rsvpButtonSpecs = [
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

/**
 * @func getMeetupRsvps
 * @param {*} meetup
 * @return {Promise<Array>} Resolves to the array
 * of the meetup rsvps
 */
const getMeetupRsvps = (meetup) => {
  const apiUrl = `${apiBaseURL}/meetups/${meetup.id}/rsvps`;
  return fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userAuthToken}`
    }
  })
    .then(response => response.json())
    .then((responseBody) => {
      const { status, data } = responseBody;
      return status === 200 ? data : [];
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func updateUserRsvpStatus
 * @param {*} rsvp
 * @param {String} userResponse
 * @returns {Promise} Resolves to the newly
 * updated Meetup RSVP or null if update
 * request was unsuccessful
 */
const updateUserRsvpStatus = async (rsvp, userResponse) => {
  const meetupId = localStorage.getItem('activeMeetupId');
  const rsvpAPIUrl = `${apiBaseURL}/meetups/${meetupId}/rsvps/${rsvp.id}`;
  return fetch(rsvpAPIUrl, {
    method: 'PATCH',
    headers: requestHeader.headers,
    body: JSON.stringify({ response: userResponse })
  })
    .then(response => response.json())
    .then((responseBody) => {
      const { status, data } = responseBody;
      return status === 200 ? data[0] : null;
    })
    .catch((err) => {
      throw err;
    });
};

/**
* @func getUserRsvp
* @param {*} meetup
* @returns {Promise} Resolves to a Meetup Rsvp of the
* currently logged in user
*/
const getUserRsvp = meetup => getMeetupRsvps(meetup)
  .then((rsvps) => {
    const userId = localStorage.getItem('userId');
    const userRsvp = rsvps.find(rsvp => rsvp.user === Number(userId));

    return userRsvp;
  })
  .catch((err) => {
    throw err;
  });

/**
* @func userHasRsvped
* @param {*} meetup Meetup object
* @returns {Promise<Boolean>} Resolve to true if user has rsvped for `meetup`, false otherwise
*/
const userHasRsvped = meetup => getUserRsvp(meetup)
  .then(userRsvp => userRsvp !== undefined)
  .catch((err) => {
    throw err;
  });


/**
 * @func formRsvpFeedbackMsg
 * @param {String} response
 * @returns {String} Rsvp feedback message
 */
const formRsvpFeedbackMsg = (response) => {
  let feedbackMessage = '';
  if (response === 'yes') {
    feedbackMessage = 'You are going to this meetup';
  } else if (response === 'no') {
    feedbackMessage = 'You are not going to this meetup';
  } else {
    feedbackMessage = 'You are likely to attend this meetup';
  }

  return feedbackMessage;
};

/**
 * @func getMeetup
 * @param {String|Number} meetupId
 * @returns {*} Meetup
 */
const getMeetup = meetupId => fetch(`${apiBaseURL}/meetups/${meetupId || activeMeetupId}`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userAuthToken}`
  }
})
  .then(response => response.json())
  .then((responseBody) => {
    const { status, data } = responseBody;
    return status === 200 ? data[0] : null;
  })
  .catch((err) => {
    throw err;
  });

/**
 * @func toggleButtons
 * @param {Array<HTMLButtonElement>} buttons
 * @param {String} userResponse
 * @returns {Array<HTMLButtonElement>} Returns the RSVP  action buttons
 * @description Toggle disabled classes for buttons
 */
const toggleButtons = (buttons, userResponse) => {
  buttons.forEach((button) => {
    if (button.textContent === userResponse) {
      button.disabled = true;
      button.classList.add('disabled__btn');
    } else {
      button.disabled = false;
      button.classList.remove('disabled__btn');
    }
  });
  return buttons;
};

/**
* @func rsvpForMeetup
* @param {String} userResponse
* @returns {Promise<Array>} Resolves to an array of the user rsvp for the meetup
*/
const rsvpForMeetup = async (userResponse) => {
  try {
    const feedbackPara = document.querySelector('.rsvp-user-feedback');
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
          Authorization: `Bearer ${userAuthToken}`
        },
        body: JSON.stringify({ response: userResponse })
      });
      const responseBody = await response.json();
      console.log(responseBody);
      feedbackPara.textContent = formRsvpFeedbackMsg(userResponse);
      return responseBody.data;
    }

    const btns = document.querySelectorAll('.rsvp-btn');
    toggleButtons(btns, userResponse);

    const meetup = await getMeetup();
    const rsvp = await getUserRsvp(meetup);
    feedbackPara.textContent = formRsvpFeedbackMsg(userResponse);
    updateUserRsvpStatus(rsvp, userResponse);
  } catch (err) {
    throw err;
  }
};

/**
* @func createRsvpButtons
* @returns {Array<HTMLButtonElement>} An array of button elements representing the rsvp actions
*/
const createRsvpButtons = () => rsvpButtonSpecs.map((spec) => {
  const button = document.createElement('button');
  button.classList.add('q-btn', 'rsvp-btn');
  button.textContent = spec.text;
  button.setAttribute('data-target', `${spec.text.toLowerCase()}-${spec.id}`);
  button.onclick = () => {
    rsvpForMeetup(spec.text);
  };
  return button;
});

/**
 * @func addRsvpButtonsToPage
 * @param {*} meetup
 * @return {HTMLElement} Returns the wrapper
 * HTML element that wraps the buttons
 */
const addRsvpButtonsToPage = (meetup) => {
  const rsvpWrapper = document.createElement('div');
  rsvpWrapper.classList.add('rsvp__wrapper');
  const rsvpButtons = createRsvpButtons();
  let feedback = '';
  const feedbackPara = document.createElement('p');
  feedbackPara.classList.add('rsvp-user-feedback');
  const p = document.createElement('p');
  p.classList.add('meetup-rsvp-sched-msg');
  Promise.all([userHasRsvped(meetup), getUserRsvp(meetup)])
    .then((values) => {
      const [hasRsvped, rsvp] = values;
      if (hasRsvped) {
        rsvpButtons.forEach((button) => {
          if (button.textContent === rsvp.response) {
            button.disabled = true;
            button.classList.add('disabled__btn');
          }
        });

        feedback = formRsvpFeedbackMsg(rsvp.response);
        feedbackPara.textContent = feedback;

        p.textContent = 'Change your mind? Let\'s know if you will attend this meetup or not?';
      } else {
        p.textContent = 'Will you attend this meetup?';
      }
    })
    .catch((err) => {
      throw err;
    });

  const btnsWrapper = document.createElement('div');
  btnsWrapper.classList.add('meetup-sched__btns');
  rsvpButtons.forEach((rsvpButton) => {
    btnsWrapper.appendChild(rsvpButton);
  });
  rsvpWrapper.appendChild(p);
  rsvpWrapper.appendChild(btnsWrapper);
  rsvpEnquiryWrapper.appendChild(rsvpWrapper);
  rsvpEnquiryWrapper.appendChild(feedbackPara);
  return rsvpEnquiryWrapper;
};
