/* eslint-disable */

/**
 * @module meetup
 * @description Meetup Detail script
 */

const apiBaseURL = 'http://localhost:9999/api/v1';
const activeMeetupId = localStorage.getItem('activeMeetupId');

const requestHeader = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Token.getToken('userToken')}`
  }
};

const detailsWrapper = document.querySelector('.details-content');
const meetupTitleHost = document.querySelector('.meetup-title-host');
const meetupTitle = document.querySelector('.meetup-title-host h3');
const meetupOrganizer = document.querySelector('.meetup-title-host p');
const imagePreviewWrapper = document.querySelector('.image-preview');
const imagePreview = document.querySelector('.image-preview img');
const photosWrapper = document.querySelector('.meetup-photos__wrapper');
const rsvpEnquiryWrapper = document.querySelector('.meetup-rsvp__enquiry');
const askQuestionWrapper = document.querySelector('#ask-question');

const meetupTagsWrapper = document.getElementById('meetup-tags');
const addedMeetups = document.querySelector('.meetup-tags-added');
const questionCards = document.querySelector('.q-question-cards');
const postQuestionDirArea = document.querySelector('#post-questions-directive');
const askGroupBtn = document.querySelector('.ask-group-btn');


/**
  * @param {*} elem an object with Element and activeClassName props
  * @returns {Element} elem
  * @description Shows an hidden element, applying the styles in activeClassName to it
  */
const showEl = ({ elem, activeClassName }) => {
  elem.classList.add(activeClassName);
  return elem;
}

askGroupBtn.onclick = function () {
  showEl({
    elem: askQuestionWrapper,
    activeClassName: 'active'
  });
  // User should not see
  // post question directive
  // after enabling ask questions UI
  postQuestionDirArea.classList.add('inactive');
  const divider = document.createElement('hr');
  divider.classList.add('divider');
  askQuestionWrapper.appendChild(divider);
}

/**
 * @func getComments
 * @param {*} question
 * @returns {Array} A list of comments
 */
const getComments = async (question) => {
  const apiUrl = `${apiBaseURL}/questions/${question.id}/comments`;
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`
    }
  });
  const responseBody = await response.json();
  const { status, data } = responseBody;
  const comments = status === 200 ? data : [];
  return comments;
}

/**
 * @func formCommentLinkText
 * @param {Number} totalComments
 * @returns {String} Comment link text 
 */
const formCommentLinkText = (totalComments) => {
  let linkText = '';
  if (totalComments > 1) {
    linkText = `View all ${totalComments} comments`
  } else if (totalComments === 1) {
    linkText = `View ${totalComments} comment`
  }

  return linkText;
}

/**
 * @func createCommentForm
 */
const createCommentForm = () => {
  const commentForm = document.createElement('form');
  const textArea = document.createElement('textarea');
  textArea.placeholder = 'Add Your Comment';
  const commentButton = document.createElement('button');
  commentButton.classList.add('q-btn');
  commentButton.classList.add('btn');
  commentButton.textContent = 'Comment';
  commentForm.appendChild(textArea);
  commentForm.appendChild(commentButton);
  return commentForm;
}

/**
 * @func getUserImage
 * @returns {Promise<String>} Resolves to the user avatar image
 */
const getUserImage = async () => {
  const userId = localStorage.getItem('userId');
  const apiUrl = `${apiBaseURL}/users/${userId}`;
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }
  });
  const responseBody = await response.json();
  const { status, data } = responseBody;
  const userImage = status === 200 ? data[0].avatar : '';
  return userImage;
};

const createUserAvatar = async () => {
  const userImageUrl = await getUserImage();
  const userImage = document.createElement('img');
  const defaultUserAvatar = '../assets/icons/avatar1.svg';
  userImage.setAttribute('src', userImageUrl || defaultUserAvatar);
  userImage.setAttribute('alt', '');
  return userImage;
}

/**
 * @func createCommentCard
 * @param {Array} comments
 * @returns {HTMLElement} HTMLElement representing a comment card
 */
const createCommentCard = async (comments) => {
  const card = document.createElement('div');
  card.classList.add('comment-box');
  const viewComments = document.createElement('p');
  viewComments.classList.add('view-comments__link');
  viewComments.textContent = formCommentLinkText(comments.length);

  const questionComment = document.createElement('div');
  questionComment.classList.add('question-comment');

  const userImage = await createUserAvatar();

  const commentForm = createCommentForm();
  questionComment.appendChild(userImage);
  questionComment.appendChild(commentForm);

  card.appendChild(viewComments);
  card.appendChild(questionComment);

  return card;
}


// TODO: Refactor
const createQuestionCard = async (question) => {
  const card = document.createElement('div');
  card.classList.add('question-card');
  const questionBlock = document.createElement('div');
  questionBlock.classList.add('question-block');
  const questionTextBlock = document.createElement('div');
  questionTextBlock.classList.add('question-text-block');
  const questionText = document.createElement('div');
  questionText.classList.add('question-text');

  const questionTitle = document.createElement('h3');
  questionTitle.classList.add('question-title');
  questionTitle.textContent = question.title;

  const questionBody = document.createElement('p');
  questionBody.textContent = question.body;

  // To be replaced with dynamic content
  const askedBy = document.createElement('span');
  askedBy.classList.add('asked-by')
  askedBy.textContent = 'asked by X';
  const askedWhen = document.createElement('span');
  askedWhen.classList.add('asked-when');
  askedWhen.textContent = '';

  // Question icons
  const questionIcons = document.createElement('div');
  questionIcons.classList.add('question-icons');

  const leftIcons = document.createElement('div');
  leftIcons.classList.add('question-icons__left');

  icons.left.forEach((icon) => {
    const img = document.createElement('img');
    img.src = icon.src;
    img.alt = icon.alt;
    img.title = icon.title;
    img.setAttribute('data-target', icon.id);
    leftIcons.appendChild(img);
  });

  const rightIcons = document.createElement('div');
  rightIcons.classList.add('question-icons__right');

  icons.right.forEach((icon) => {
    const img = document.createElement('img');
    img.src = icon.src;
    img.alt = icon.alt;
    img.title = icon.title;
    img.setAttribute('data-target', icon.id);
    rightIcons.appendChild(img);
  });

  questionIcons.appendChild(leftIcons);
  questionIcons.appendChild(rightIcons);

  questionText.appendChild(questionTitle);
  questionText.appendChild(questionBody);
  questionText.appendChild(askedBy);
  questionText.appendChild(askedWhen);

  questionTextBlock.appendChild(questionText);
  questionTextBlock.appendChild(questionIcons);

  // total comments

  const comments = await getComments(question);
  const commentCard = await createCommentCard(comments)

  questionBlock.appendChild(questionTextBlock);
  questionBlock.appendChild(commentCard);

  card.appendChild(questionBlock);

  return card;
}

const getMeetupTags = async () => {
  const activeMeetupId = localStorage.getItem('activeMeetupId');
  const response = await fetch(`${apiBaseURL}/meetups/${activeMeetupId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }
  });
  const responseBody = await response.json();
  if (responseBody.status === 200) {
    return responseBody.data[0].tags;
  }
  return [];
}

const createMeetupTags = (tags) => {
  return tags.map((tag) => {
    const meetupTag = document.createElement('li');
    meetupTag.classList.add('meetup-tag');
    meetupTag.textContent = tag;
    return meetupTag;
  })
}

const displayMeetupTags = async () => {
  const meetupTags = await getMeetupTags();
  const meetupTagElems = createMeetupTags(meetupTags);
  const meetupList = document.createElement('ul');
  meetupTagElems.forEach((item) => {
    meetupList.appendChild(item);
  });

  addedMeetups.appendChild(meetupList);
  meetupTagsWrapper.appendChild(addedMeetups);
}

const displayMeetupQuestions = async (meetup) => {
  try {
    const activeMeetupId = localStorage.getItem('activeMeetupId');
    const apiUrl = `${apiBaseURL}/meetups/${activeMeetupId}/questions`;
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    });
    const responseBody = await response.json();
    if (responseBody.status === 200) {
      const questions = responseBody.data;
      questions.forEach(async (question) => {
        questionCards.appendChild(await createQuestionCard(question));
      })
    }
  } catch (e) {
    console.log(e);
  }
}

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

/**
 * @func getMeetupImages
 * @param {*} meetup
 * @returns {Promise<Array>} Returns a list of meetup images 
 */
const getMeetupImages = async (meetup) => {
  try {
    const url = `${apiBaseURL}/meetups/${meetup.id}/images`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    });
    const responseBody = await response.json();
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
    imagePreview.setAttribute('src', (image && image.imageUrl) || defaultImage);
    return imagePreview;
  } catch (e) {
    throw e;
  }
}


/**
 * @func addDescriptionToPage
 * @param {*} meetup Meetup object
 * @description Adds meetup description to page
 * @return {HTMLElement} Returns the meetup description element
 */
const addDescriptionToPage = (meetup) => {
  const meetupDescription = document.querySelector('.meetup-desc');
  meetupDescription.textContent = meetup.description;
  return meetupDescription;
}

/**
 * 
 * @param {Array} images An array of meetup image objects
 * @returns {Array<HTMLElement>} Returns an array of meetups 
 */
const createMeetupImages = (images) => {
  const pics = images.map((image) => {
    const a = document.createElement('a');
    a.href = image.imageUrl;
    const img = document.createElement('img');
    img.src = image.imageUrl;
    img.alt = '';
    a.appendChild(img);
    return a;
  });

  return pics;
}


/**
 * @func addMeetupImagesToPage
 * @param {*} meetup Meetup object 
 * @description Adds meetup images to page
 */
const addMeetupImagesToPage = async (meetup) => {
  try {
    const meetupImages = await getMeetupImages(meetup);
    const allImages = createMeetupImages(meetupImages);
    allImages.forEach((image) => {
      photosWrapper.appendChild(image);
    });
  } catch (e) {

  }
};

/**
 * @func getMeetupRsvps
 * @param {*} meetup Meetup object
 * @returns {Array} An Array of rsvps for `meetup` 
 */
const getMeetupRsvps = async (meetup) => {
  try {
    const apiUrl = `${apiBaseURL}/meetups/${meetup.id}/rsvps`;
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    });
    const responseBody = await response.json();
    if (responseBody.status === 200) {
      return responseBody.data;
    }
    return [];
  } catch (e) {

  }
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

const rsvpForMeetup = async (userResponse) => {
  const meetupId = localStorage.getItem('activeMeetupId');
  const apiUrl = `${apiBaseURL}/meetups/${meetupId}/rsvps`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token.getToken('userToken')}`
    },
    body: JSON.stringify({ response: userResponse })
  });
  const responseBody = await response.json();
  return responseBody.data;
}

const updateRsvpResponse = () => {

}


const createRsvpButtons = () => {
  const rsvpButtons = rsvpBtnSpecs.map((spec) => {
    const button = document.createElement('button');
    button.classList.add('q-btn');
    button.classList.add('rsvp-btn');
    button.textContent = spec.text;
    button.setAttribute('data-target', spec.id);
    button.onclick = () => rsvpForMeetup(spec.text);
    return button;
  })

  return rsvpButtons;
}

const displayRsvpBtns = () => {
  const rsvpButtons = createRsvpButtons();
  const p = document.createElement('p');
  p.textContent = 'Will you attend this meetup?';
  const btnsWrapper = document.createElement('div');
  btnsWrapper.classList.add('meetup-sched__btns');
  rsvpButtons.forEach((rsvpButton) => {
    btnsWrapper.appendChild(rsvpButton);
  });
  rsvpEnquiryWrapper.innerHTML = '';
  rsvpEnquiryWrapper.appendChild(p);
  rsvpEnquiryWrapper.appendChild(btnsWrapper);
  return rsvpEnquiryWrapper;
}

/**
 * 
 * @param {*} meetup Meetup object
 * @returns {Promise<Element>} Resolves to an HTMLElement
 * @description Adds An RSVP feedback to page
 */
const displayRsvpFeedbackMsg = async (meetup) => {
  const rsvpForMeetupExist = await userHasRsvped(meetup);
  if (rsvpForMeetupExist) {
    const userRsvp = await getUserRsvp(meetup);
    const userResponse = userRsvp.response;
    const feedbackMessage = formRsvpFeedbackMsg(userResponse);

    rsvpEnquiryWrapper.innerHTML = '';
    const text = document.createTextNode(feedbackMessage);
    const p = document.createElement('p');
    p.classList.add('user-rsvp-feedback-msg');
    p.appendChild(text);
    const responseUpdateBtn = document.createElement('button');
    responseUpdateBtn.onclick = () => displayRsvpBtns();
    responseUpdateBtn.classList.add('q-btn');
    responseUpdateBtn.textContent = 'Change Response';

    rsvpEnquiryWrapper.appendChild(p);
    rsvpEnquiryWrapper.appendChild(responseUpdateBtn);
  } else {
    displayRsvpBtns();
  }

  return rsvpEnquiryWrapper;
}



/**
 * @func addMeetupToPage
 * @param {*} meetup Meetup object
 * @description Adds Meetup Details sections to page 
 */
const addMeetupToPage = (meetup) => {
  detailsWrapper.appendChild(addMeetupDetailsToDOM(meetup));
  addMeetupDateToDOM(meetup);
  addMeetupImageToPage(meetup);
  addMeetupImagesToPage(meetup);
  displayRsvpFeedbackMsg(meetup);
  addDescriptionToPage(meetup);

  displayMeetupQuestions(meetup);
  displayMeetupTags();
}
/**
 * @func displayMeetup
 * @returns {*}
 * @description Displays the meetup details on page
 */
const displayMeetup = () => {
  const activeMeetupId = localStorage.getItem('activeMeetupId');
  const apiUrl = `${apiBaseURL}/meetups/${activeMeetupId}`
  fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('userToken')}`
    }
  })
    .then(res => res.json())
    .then((res) => {
      const tokenValid = Token.tokenIsValid(res.status);
      if (tokenValid) {
        if (res.status === 200) {
          addMeetupToPage(res.data[0]);

        }
      } else {
        console.log(res.error)
        window.location.assign('./sign-in.html');
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
    displayMeetup();
  }
}