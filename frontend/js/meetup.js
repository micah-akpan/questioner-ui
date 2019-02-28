/**
 * @module meetup
 * @description Meetup Detail script
 */
const activeMeetupId = localStorage.getItem('activeMeetupId');
const userId = localStorage.getItem('userId');
const userToken = localStorage.getItem('userToken');

const requestHeader = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`
  }
};

const detailsContent = document.getElementById('details-content');
const meetupTitleWrapper = document.getElementById('meetup-title__wrapper');
const meetupTitle = document.getElementById('meetup-title');
const meetupOrganizer = document.getElementById('meetup-host');
const imagePreview = document.getElementById('meetup-image');
const thumbnailPhotosWrapper = document.getElementById('meetup-photos__wrapper');

const meetupTagsWrapper = document.getElementById('meetup-tags');
const addedMeetups = document.getElementById('meetup-tags-added');
const questionCards = document.getElementById('q-question-cards');
const askGroupButton = document.getElementById('ask-group-btn');

/**
 * @func displayTotalUsersVotes
 * @param {Number} votes
 * @returns {HTMLParagraphElement} Returns a paragraph
 * element representing the total votes of a meetup
 */
const displayTotalUsersVotes = (votes) => {
  const p = document.createElement('p');
  p.classList.add('user-vote');
  p.title = 'Total number of votes on this question';
  p.textContent = votes;
  return p;
};

/**
 * @func displayFormFeedback
 * @param {String} msg
 * @returns {HTMLEmbedElement} Returns HTML Element
 * representing the feedback to the user
 */
const displayFormFeedback = (msg) => {
  const userFeedback = document.getElementById('user-feedback');
  const span = document.createElement('span');
  span.textContent = msg;
  userFeedback.classList.add('info-box');
  userFeedback.appendChild(span);
  return userFeedback;
};

/**
 * @func getMeetupTags
 * @returns {Promise<Array>} Resolves to an array of meetup tags
 */
const getMeetupTags = async () => {
  const response = await fetch(`${apiBaseURL}/meetups/${activeMeetupId}`, requestHeader);
  const responseBody = await response.json();
  if (responseBody.status === 200) {
    return responseBody.data[0].tags;
  }
  return [];
};

/**
 * @func createMeetupTags
 * @param {Array<String>} tags Meetup tags
 * @returns {Array<HTMLLiElement>} Returns an array of html list elements
 */
const createMeetupTags = tags => tags.map((tag) => {
  const meetupTag = document.createElement('li');
  meetupTag.classList.add('meetup-tag');
  meetupTag.textContent = tag;
  return meetupTag;
});

/**
 * @func displayMeetupTags
 * @param {Array<HTMLElement>} tags
 * @returns {HTMLElement} Returns the container that holds the tags
 */
const displayMeetupTags = async (tags) => {
  const meetupList = document.createElement('ul');
  tags.forEach((item) => {
    meetupList.appendChild(item);
  });

  addedMeetups.innerHTML = '';
  addedMeetups.appendChild(meetupList);
  meetupTagsWrapper.appendChild(addedMeetups);
  return meetupTagsWrapper;
};

/**
 * @func getMeetupQuestions
 * @param {String|Number} meetupId
 * @returns {Promise<Array>} Resolves to an array of questions
 * asked in `meetupId`
 */
const getMeetupQuestions = (meetupId) => {
  const apiUrl = `${apiBaseURL}/meetups/${meetupId}/questions`;
  return fetch(apiUrl, requestHeader)
    .then(response => response.json())
    .then((responseBody) => {
      const { status, data } = responseBody;
      return status === 200 ? data : [];
    });
};
/**
 * @func displayMeetupQuestions
 * @param {String|Number} meetupId Meetup
 * @returns {Promise<HTMLElement>} Resolves to an array of HTML Element
 * representing meetup cards
 */
const displayMeetupQuestions = meetupId => getMeetupQuestions(meetupId)
  .then((questions) => {
    const allCardsPromises = questions.map(question => createQuestionCard(question));

    return allCardsPromises;
  })
  .then(allCardsPromises => Promise.all(allCardsPromises)
    .then((cards) => {
      for (let i = 0, nCards = cards.length; i < nCards; i += 1) {
        const card = cards[i];
        questionCards.appendChild(card);
      }

      return questionCards;
    })
    .catch((err) => {
      throw err;
    }));

/**
 * @func createQuestionFormFields
 * @param {Array} specs
 * @returns {HTMLElement} Creates all question form form using
 * data in `specs`
 */
const createQuestionFormFields = specs => specs.map((spec) => {
  const formGroup = document.createElement('div');
  formGroup.classList.add('q-form__group');
  const label = document.createElement('label');
  label.htmlFor = spec.idText;
  label.classList.add('q-form__label', spec.labelClass);
  label.textContent = spec.labelText;
  const requireValidation = document.createElement('abbr');
  requireValidation.textContent = ' * ';
  requireValidation.title = 'required';
  const field = document.createElement(spec.type);
  field.id = spec.idText;
  field.placeholder = spec.placeholder;
  field.classList.add(`${spec.type === 'input' ? 'q-form__input' : 'q-form__textarea'}`);
  if (spec.idText !== 'user-question-label') {
    label.appendChild(requireValidation);
    field.setAttribute('required', '');
  }

  formGroup.appendChild(label);
  formGroup.appendChild(field);

  return formGroup;
});

/**
 * @func createQuestionFormButton
 * @returns {HTMLDivElement} Creates a wrapper that
 * holds the question form button
 */
const createQuestionFormButton = () => {
  const postButtonArea = document.createElement('div');
  postButtonArea.classList.add('post-btn-box', 'post-question-btn-box', 'q-form__group');
  const postQuestionButton = document.createElement('button');
  postQuestionButton.classList.add('q-btn', 'post-comment-btn');
  postQuestionButton.textContent = 'Ask';

  postButtonArea.appendChild(postQuestionButton);
  return postButtonArea;
};

/**
 * @func sendUserQuestion
 * @param {Event} e
 * @returns {Promise<HTMLElement>} Sends user question
 * and returns the wrapper
 * that wraps all question cards
 */
const sendUserQuestion = (e) => {
  e.preventDefault();
  return askQuestion()
    .then((question) => {
      questionCards.innerHTML = '';
      return displayMeetupQuestions(question.meetup);
    })
    .catch((err) => {
      displayFormFeedback(err.message);
    });
};

/**
 * @func createQuestionForm
 * @returns {HTMLElement} Returns an HTML Element that
 * wraps the form
 */
const createQuestionForm = () => {
  const wrapper = document.createElement('div');
  const bioSection = createQuestionBioSection();
  const clear = document.createElement('div');
  clear.classList.add('clear');

  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  const userFeedback = document.createElement('div');
  userFeedback.classList.add('user-feedback');
  userFeedback.id = 'user-feedback';

  const formInputs = createQuestionFormFields(formInputSpec);
  const postButtonArea = createQuestionFormButton();

  form.appendChild(userFeedback);

  formInputs.forEach((formField) => {
    form.appendChild(formField);
  });

  form.appendChild(postButtonArea);

  form.onsubmit = sendUserQuestion;
  wrapper.appendChild(bioSection);
  wrapper.appendChild(clear);
  wrapper.appendChild(form);
  askQuestionWrapper.appendChild(wrapper);

  return wrapper;
};

/**
 * @func displayQuestionBlock
 * @returns {HTMLElement} Displays the 'ask question'
 * wrapper
 */
const displayQuestionBlock = () => {
  askQuestionWrapper.classList.add('active');
  postQuestionDirArea.classList.add('inactive');
  const divider = document.createElement('hr');
  divider.classList.add('divider');
  askQuestionWrapper.appendChild(divider);
  return askQuestionWrapper;
};

askGroupButton.onclick = () => {
  createQuestionForm();
  displayQuestionBlock();
};

/**
 * @func addMeetupDetailsToDOM
 * @param {*} meetup Meetup
 * @returns {HTMLElement} Returns an HTML element representing the title of the meetup
 */
const addMeetupDetailsToDOM = (meetup) => {
  meetupTitle.textContent = meetup.topic;
  meetupOrganizer.textContent = meetup.location;
  meetupTitleWrapper.appendChild(meetupTitle);
  meetupTitleWrapper.appendChild(meetupOrganizer);
  return meetupTitleWrapper;
};

/**
 * @func addMeetupDateToDOM
 * @param {*} meetup Meetup
 * @returns {HTMLElement} Returns an HTML element representing the date of the meetup
 */
const addMeetupDateToDOM = (meetup) => {
  const meetupDate = document.getElementById('meetup-date__primary');
  const [month, day] = parseDate(meetup.happeningOn);
  meetupDate.textContent = month;
  const lineBreak = document.createElement('p');
  lineBreak.textContent = day;
  meetupDate.appendChild(lineBreak);
  return meetupDate;
};

/**
 * @func getMeetupImages
 * @param {*} meetup
 * @returns {Promise<Array>} Returns a list of meetup images
 */
const getMeetupImages = async (meetup) => {
  try {
    const url = `${apiBaseURL}/meetups/${meetup.id}/images`;
    const response = await fetch(url, requestHeader);
    const responseBody = await response.json();
    return responseBody.data;
  } catch (e) {
    throw e;
  }
};

/**
 * @func isAdminPage
 * @param {String} urlPath
 * @returns {Boolean} Returns true if current page is
 * an admin page, false otherwise
 */
const isAdminPage = urlPath => urlPath.split('/').includes('admin');

/**
 * @func addMeetupImageToPage
 * @param {*} meetup Meetup object
 * @returns {HTMLImageElement} Returns the image preview HTML element
 * @description Places a main meetup image on the page
 */
const addMeetupImageToPage = async (meetup) => {
  try {
    const meetupImages = await getMeetupImages(meetup);
    const image = meetupImages[0];
    const defaultImage = isAdminPage ? '../../assets/img/showcase2.jpg' : './assets/img/showcase2.jpg';
    imagePreview.setAttribute('src', (image && image.imageUrl) || defaultImage);
    return imagePreview;
  } catch (e) {
    throw e;
  }
};


/**
 * @func addDescriptionToPage
 * @param {*} meetup Meetup object
 * @description Adds meetup description to page
 * @return {HTMLElement} Returns the meetup description element
 */
const addDescriptionToPage = (meetup) => {
  const meetupDescription = document.getElementById('meetup-description');
  meetupDescription.textContent = meetup.description;
  return meetupDescription;
};

/**
 * @func createMeetupImages
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
};


/**
 * @func addMeetupImagesToPage
 * @param {*} meetup Meetup object
 * @returns {undefined} Adds meetup images to page
 * @description Adds meetup images to page
 */
const addMeetupImagesToPage = async (meetup) => {
  try {
    const meetupImages = await getMeetupImages(meetup);
    const allImages = createMeetupImages(meetupImages);
    allImages.forEach((image) => {
      thumbnailPhotosWrapper.appendChild(image);
    });
  } catch (e) {
    throw e;
  }
};

/**
 * @func addMeetupToPage
 * @param {*} meetup Meetup object
 * @returns {undefined} Meetup object
 * @description Adds Meetup Details sections to page
 */
const addMeetupToPage = (meetup) => {
  detailsContent.appendChild(addMeetupDetailsToDOM(meetup));
  addMeetupDateToDOM(meetup);
  addMeetupImageToPage(meetup);
  addMeetupImagesToPage(meetup);
  addRsvpButtonsToPage(meetup);
  addDescriptionToPage(meetup);

  displayMeetupQuestions(meetup.id);
  getMeetupTags()
    .then(tags => createMeetupTags(tags))
    .then((tagElems) => {
      displayMeetupTags(tagElems);
    })
    .catch((err) => {
      throw err;
    });
};
/**
 * @func displayMeetup
 * @returns {undefined}
 * @description Displays the meetup details on page
 */
const displayMeetup = () => {
  getMeetup()
    .then((meetup) => {
      document.title = `${meetup.topic} | Questioner`;
      addMeetupToPage(meetup);
    })
    .catch((err) => {
      throw err;
    });
};

window.onload = () => {
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    const currentPageURL = window.location.pathname;
    const avatarSrcPath = isAdminPage(currentPageURL) ? '../../assets/icons/avatar1.svg' : '../assets/icons/avatar1.svg';

    addProfileAvatarToNav(avatarSrcPath);
    displayMeetup();
  }
};
