const askQuestionWrapper = document.getElementById('ask-question');
const postQuestionDirArea = document.getElementById('post-questions-directive');
const askGroupButton = document.getElementById('ask-group-btn');

/**
 * @func askQuestion
 * @returns {*} Returns the newly created question
 */
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
};

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
  askedBy.classList.add('asked-by');
  getUser(question.createdby)
    .then((user) => {
      askedBy.textContent = `Asked by ${user.firstname} ${user.lastname}`;
    })
    .catch((err) => {
      throw err;
    });
  const askedWhen = document.createElement('span');
  askedWhen.classList.add('asked-when');
  askedWhen.textContent = '';

  section.appendChild(questionTitle);
  section.appendChild(questionBody);
  section.appendChild(askedBy);
  section.appendChild(askedWhen);

  return section;
};

const upvoteQuestion = (questionId) => {
  const apiUrl = `${apiBaseURL}/questions/${questionId}/upvote`;
  fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  })
    .then(response => response.json())
    .then((response) => {
      const { status, data } = response;
      if (status === 200) {
        const votes = document.getElementById(`user-vote-${questionId}`);
        votes.textContent = data[0].votes;
      }
    })
    .catch((err) => {
      throw err;
    });
};

const downvoteQuestion = (questionId) => {
  const apiUrl = `${apiBaseURL}/questions/${questionId}/downvote`;
  fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  })
    .then(response => response.json())
    .then((response) => {
      const { status, data } = response;
      if (status === 200) {
        const votes = document.getElementById(`user-vote-${questionId}`);
        votes.textContent = data[0].votes;
      }
    })
    .catch((err) => {
      throw err;
    });
};

const getQuestion = async (questionId) => {
  const apiURL = `${apiBaseURL}/meetups/${activeMeetupId}/questions/${questionId}`;
  try {
    const response = await fetch(apiURL, requestHeader);
    const responseBody = await response.json();
    const { status, data } = responseBody;
    return status === 200 ? data[0] : null;
  } catch (e) {
    throw e;
  }
};

/**
 * @func addIcons
 * @param {*} question
 * @param {HTMLElement} iconWrapper The parent container for the icons
 * @param {Array} icons List of icons
 * @returns {undefined} Adds icons to the page
 */
const addIcons = (question, iconWrapper, icons) => {
  const urlPaths = window.location.pathname.split('/');
  icons.forEach((icon) => {
    const img = document.createElement('img');
    img.alt = icon.alt;
    img.title = icon.title;
    img.setAttribute('data-action', icon.action);
    img.setAttribute('data-target', question.id);
    if (urlPaths.includes('admin')) {
      img.src = icon.adminSrcPath;
    } else {
      img.src = icon.src;
    }

    img.onclick = function vote() {
      const action = this.getAttribute('data-action');
      switch (action) {
        case 'upvote': {
          const questionId = this.getAttribute('data-target');
          upvoteQuestion(questionId);
          getQuestion(questionId)
            .then(() => {

            })
            .catch((err) => {
              throw err;
            });
          break;
        }

        case 'downvote': {
          const questionId = this.getAttribute('data-target');
          downvoteQuestion(questionId);
          getQuestion(questionId)
            .then((meetupQuestion) => {
              displayTotalUsersVotes(meetupQuestion.votes);
            })
            .catch((err) => {
              throw err;
            });
          break;
        }

        default:
          break;
      }
    };
    iconWrapper.appendChild(img);
  });
};

const cards = document.getElementById('q-question-cards');


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

  addIcons(question, leftIcons, icons.left);
  addIcons(question, rightIcons, icons.right);

  const votes = document.createElement('p');
  votes.classList.add('user-vote');
  votes.id = `user-vote-${question.id}`;
  votes.title = 'Total number of votes on this question';
  votes.textContent = question.votes;

  const questionText = createQuestionCardPrimary(question);
  const comments = await getComments(question);
  const commentSection = await createCommentSection(comments, question);

  questionIcons.appendChild(leftIcons);
  questionIcons.appendChild(rightIcons);

  questionTextBlock.appendChild(questionText);
  questionTextBlock.appendChild(questionIcons);

  questionTextBlock.appendChild(votes);

  questionBlock.appendChild(questionTextBlock);
  questionBlock.appendChild(commentSection);

  card.appendChild(questionBlock);

  return card;
};

/**
 * @const formInputSpec
 * @description Form input fields related information
 */
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

const getUserDetails = () => Promise.all([getUserImage(), getUser(userId)])
  .then(results => results)
  .catch((err) => {
    throw err;
  });

const createQuestionBioSection = () => {
  const bioSection = document.createElement('section');
  const userAvatar = document.createElement('img');
  userAvatar.classList.add('user-profile-avatar');
  const defaultAvatar = '../assets/icons/avatar1.svg';

  const bioText = document.createElement('p');
  bioText.classList.add('question-text', 'user-profile-text');
  const userName = document.createElement('p');

  getUserDetails()
    .then((details) => {
      const [userImage, user] = details;
      const { firstname, lastname, bio } = user;
      userAvatar.setAttribute('src', userImage || defaultAvatar);
      userAvatar.setAttribute('alt', firstname);
      userName.textContent = `${firstname} ${lastname}`;
      bioText.textContent = bio;
    }, (err) => {
      throw err;
    });

  bioSection.appendChild(userAvatar);
  bioSection.appendChild(userName);
  bioSection.appendChild(bioText);
  return bioSection;
};

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

const createQuestionFormButton = () => {
  const postButtonArea = document.createElement('div');
  postButtonArea.classList.add('post-btn-box', 'post-question-btn-box', 'q-form__group');
  const postQuestionButton = document.createElement('button');
  postQuestionButton.classList.add('q-btn', 'post-comment-btn');
  postQuestionButton.textContent = 'Ask';

  postButtonArea.appendChild(postQuestionButton);
  return postButtonArea;
};

const sendUserQuestion = (e) => {
  e.preventDefault();
  askQuestion()
    .then((question) => {
      createQuestionCard(question)
        .then((questionCard) => {
          cards.appendChild(questionCard);
        })
        .catch((err) => {
          throw err;
        });
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
