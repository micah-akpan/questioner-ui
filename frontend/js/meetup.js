/* eslint-disable */

/**
 * @module meetup
 * @description Meetup Detail script
 */

const apiBaseURL = 'http://localhost:9999/api/v1';
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
const imagePreviewWrapper = document.getElementById('image-preview');
const imagePreview = document.getElementById('meetup-image');
const thumbnailPhotosWrapper = document.getElementById('meetup-photos__wrapper');
const askQuestionWrapper = document.getElementById('ask-question');

const meetupTagsWrapper = document.getElementById('meetup-tags');
const addedMeetups = document.getElementById('meetup-tags-added');
const questionCards = document.getElementById('q-question-cards');
const postQuestionDirArea = document.getElementById('post-questions-directive');
const askGroupButton = document.getElementById('ask-group-btn');

const questionFormSection = document.getElementById('ask-question');

const displayQuestionBlock = () => {
  askQuestionWrapper.classList.add('active');
  postQuestionDirArea.classList.add('inactive');
  const divider = document.createElement('hr');
  divider.classList.add('divider');
  askQuestionWrapper.appendChild(divider);
  return askQuestionWrapper;
}

/**
 * @func getComments
 * @param {*} question
 * @returns {Array} A list of comments
 */
const getComments = async (question) => {
  const apiUrl = `${apiBaseURL}/questions/${question.id}/comments`;
  const response = await fetch(apiUrl, requestHeader);
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
 * @returns {HTMLElement} Returns a comment form
 */
const createCommentForm = () => {
  const commentForm = document.createElement('form');
  const textArea = document.createElement('textarea');
  textArea.placeholder = 'Add Your Comment';
  const commentButton = document.createElement('button');
  commentButton.classList.add('q-btn', 'btn');
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
  const response = await fetch(apiUrl, requestHeader);
  const responseBody = await response.json();
  const { status, data } = responseBody;
  const userImage = status === 200 ? data[0].avatar : '';
  return userImage;
};

/**
 * @func createUserAvatar
 * @returns {HTMLImageElement} Returns an HTML Image
 */
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
 * @returns {Promise<HTMLDivElement>} Resolves to a comment card HTML element
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

/**
 * @func createQuestionCardPrimary
 * @param {*} question Meetup question
 * @returns {HTMLElement} Question card primary section
 */
const createQuestionCardPrimary = (question) => {
  const section = document.createElement('section');
  section.classList.add('question-text');
  const questionTitle = document.createElement('h3');
  questionTitle.classList.add('question-title');
  questionTitle.textContent = question.title;

  const questionBody = document.createElement('p');
  questionBody.textContent = question.body;

  // TODO: Replace with dynamic content
  const askedBy = document.createElement('span');
  askedBy.classList.add('asked-by')
  askedBy.textContent = 'asked by X';
  const askedWhen = document.createElement('span');
  askedWhen.classList.add('asked-when');
  askedWhen.textContent = '';

  section.appendChild(questionTitle);
  section.appendChild(questionBody);
  section.appendChild(askedBy);
  section.appendChild(askedWhen);

  return section;
}

/**
 * @func addIcons
 * @param {HTMLElement} iconWrapper The parent container for the icons
 * @param {Array} icons List of icons
 */
const addIcons = (iconWrapper, icons) => {
  const urlPaths = window.location.pathname.split('/');
  icons.forEach((icon) => {
    const img = document.createElement('img');
    img.alt = icon.alt;
    img.title = icon.title;
    img.setAttribute('data-target', icon.id);
    if (urlPaths.includes('admin')) {
      img.src = icon.adminSrcPath;
    } else {
      img.src = icon.src;
    }
    iconWrapper.appendChild(img);
  });
}

/**
 * @func createQuestionCard
 * @param {*} question Meetup question
 * @returns {Promise<HTMLDivElement>} Resolves to a question card
 */
const createQuestionCard = async (question) => {
  const card = document.createElement('div');
  card.classList.add('question-card');
  const questionBlock = document.createElement('div');
  questionBlock.classList.add('question-block');
  const questionTextBlock = document.createElement('div');
  questionTextBlock.classList.add('question-text-block');

  // Question icons
  const questionIcons = document.createElement('div');
  questionIcons.classList.add('question-icons');
  const leftIcons = document.createElement('div');
  leftIcons.classList.add('question-icons__left');

  const rightIcons = document.createElement('div');
  rightIcons.classList.add('question-icons__right');

  addIcons(leftIcons, icons.left);
  addIcons(rightIcons, icons.right);

  const questionText = createQuestionCardPrimary(question);
  const comments = await getComments(question);
  const commentCard = await createCommentCard(comments)

  questionIcons.appendChild(leftIcons);
  questionIcons.appendChild(rightIcons);

  questionTextBlock.appendChild(questionText);
  questionTextBlock.appendChild(questionIcons);

  questionBlock.appendChild(questionTextBlock);
  questionBlock.appendChild(commentCard);

  card.appendChild(questionBlock);

  return card;
}

const getUser = async () => {
  const apiUrl = `${apiBaseURL}/users/${userId}`;
  const response = await fetch(apiUrl, requestHeader);
  const responseBody = await response.json();
  return responseBody.status === 200 ? responseBody.data[0] : null;
}

const askQuestion = async () => {
  try {
    const title = document.getElementById('user-question-title');
    const body = document.getElementById('user-question-body');

    const response = await fetch(`${apiBaseURL}/questions`, {
      method: 'POST',
      headers: requestHeader.headers,
      body: JSON.stringify({
        title: title.value,
        body: body.value,
        meetupId: activeMeetupId
      })
    });
    const responseBody = await response.json();
    const { status, data } = responseBody;
    if (status === 201) {
      return data[0];
    }

    throw new Error(responseBody.error);
  } catch (e) {
    throw e;
  }
}

const displayFormFeedback = (msg) => {
  const userFeedback = document.getElementById('user-feedback');
  const span = document.createElement('span');
  span.textContent = msg;
  userFeedback.classList.add('info-box');
  userFeedback.appendChild(span);
}

const createQuestionForm = () => {
  const wrapper = document.createElement('div');
  const bioSection = document.createElement('div');
  const userAvatar = document.createElement('img');
  userAvatar.classList.add('user-profile-avatar')
  const defaultAvatar = '../assets/icons/avatar1.svg';

  const bioText = document.createElement('p');
  bioText.classList.add('modal-content-title', 'question-text', 'user-profile-text');
  const userName = document.createElement('p');
  const clear = document.createElement('div');
  clear.classList.add('clear');

  Promise.all([getUserImage(), getUser()])
    .then((results) => {
      const [userImage, user] = results;
      userAvatar.setAttribute('src', userImage || defaultAvatar);
      userAvatar.setAttribute('alt', user.firstname);

      userName.textContent = `${user.firstname} ${user.lastname}`;
      bioText.textContent = user.bio;
    })
    .catch((err) => {
      console.log(err);
    })
  bioSection.appendChild(userAvatar);
  bioSection.appendChild(userName);
  bioSection.appendChild(bioText);

  const form = document.createElement('form');
  form.method = 'POST';
  const userFeedback = document.createElement('div');
  userFeedback.classList.add('user-feedback');
  userFeedback.id = 'user-feedback';


  const formInputSpec = [
    {
      id: 1,
      idText: 'user-question-title',
      labelClass: 'question-label',
      labelText: 'Give your question a title',
      placeholder: 'What, why, where or when are great words to start with',
      type: 'input'
    },

    {
      id: 2,
      idText: 'user-question-body',
      labelClass: 'question-label',
      labelText: 'Your question',
      placeholder: 'What, why, where or when are great words to start with',
      type: 'textarea'
    },

    {
      id: 3,
      idText: 'user-question-label',
      labelClass: 'question-label',
      labelText: 'Add tags to this question (Max 5)',
      placeholder: 'What, why, where or when are great words to start with',
      type: 'input'
    },

  ];

  const formInputs = formInputSpec.map((spec) => {
    const formGroup = document.createElement('div');
    formGroup.classList.add('q-form__group');
    const label = document.createElement('label');
    label.htmlFor = spec.idText;
    label.classList.add('q-form__label', spec.labelClass);
    label.textContent = spec.labelText;
    const requireValidation = document.createElement('abbr');
    requireValidation.textContent = ' * ';
    requireValidation.title = 'required';
    const emptyText = document.createTextNode('');
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

  const postBtnArea = document.createElement('div');
  postBtnArea.classList.add('post-btn-box', 'post-question-btn-box', 'q-form__group');
  const postQuestionButton = document.createElement('button');
  postQuestionButton.classList.add('q-btn', 'post-comment-btn');
  postQuestionButton.textContent = 'Ask';

  postBtnArea.appendChild(postQuestionButton);

  form.appendChild(userFeedback);

  formInputs.forEach((el) => {
    form.appendChild(el);
  })

  form.appendChild(postBtnArea);

  form.onsubmit = (e) => {
    e.preventDefault();
    askQuestion()
      .then((question) => {
        window.location.reload();
      })
      .catch((err) => {
        displayFormFeedback(err.message);
      })
  }

  wrapper.appendChild(bioSection);
  wrapper.appendChild(clear);
  wrapper.appendChild(form);
  askQuestionWrapper.appendChild(wrapper);

  return wrapper;
};


askGroupButton.onclick = (e) => {
  createQuestionForm();
  displayQuestionBlock();
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
}

/**
 * @func createMeetupTags
 * @param {Array<String>} tags Meetup tags
 * @returns {Array<HTMLLiElement>} Returns an array of html list elements
 */
const createMeetupTags = (tags) => {
  return tags.map((tag) => {
    const meetupTag = document.createElement('li');
    meetupTag.classList.add('meetup-tag');
    meetupTag.textContent = tag;
    return meetupTag;
  })
}

/**
 * @func displayMeetupTags
 * @returns {HTMLElement} Returns the container that holds the tags
 */
const displayMeetupTags = async () => {
  const meetupTags = await getMeetupTags();
  const meetupTagElems = createMeetupTags(meetupTags);
  const meetupList = document.createElement('ul');
  meetupTagElems.forEach((item) => {
    meetupList.appendChild(item);
  });

  addedMeetups.appendChild(meetupList);
  meetupTagsWrapper.appendChild(addedMeetups);
  return meetupTagsWrapper;
}

/**
 * @func displayMeetupQuestions;
 * @param {*} meetup Meetup
 * @returns {undefined} Makes an HTTP request for all meetup questions
 * displays them
 */
const displayMeetupQuestions = async (meetup) => {
  try {
    const apiUrl = `${apiBaseURL}/meetups/${activeMeetupId}/questions`;
    const response = await fetch(apiUrl, requestHeader);
    const responseBody = await response.json();
    const { status, data } = responseBody;
    if (status === 200) {
      const questions = data;
      questions.forEach(async (question) => {
        questionCards.appendChild(await createQuestionCard(question));
      })
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * @func addMeetupDetailsToDOM
 * @param {*} meetup Meetup
 * @returns {HTMLElement} Returns an HTML element representing the title of the meetup
 */
const addMeetupDetailsToDOM = (meetup) => {
  meetupTitle.textContent = meetup.topic;
  meetupOrganizer.textContent = 'Organized by X';
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
}

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
  const meetupDescription = document.getElementById('meetup-description');
  meetupDescription.textContent = meetup.description;
  return meetupDescription;
}

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
      thumbnailPhotosWrapper.appendChild(image);
    });
  } catch (e) {

  }
};

/**
 * @func addMeetupToPage
 * @param {*} meetup Meetup object
 * @description Adds Meetup Details sections to page 
 */
const addMeetupToPage = (meetup) => {
  detailsContent.appendChild(addMeetupDetailsToDOM(meetup));
  addMeetupDateToDOM(meetup);
  addMeetupImageToPage(meetup);
  addMeetupImagesToPage(meetup);
  addRsvpButtonsToPage(meetup);
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
          const meetup = res.data[0];
          document.title = `${meetup.topic} | Questioner`;
          addMeetupToPage(meetup);
        }
      } else {
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