/* eslint-disable */

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
};

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
  const comments = await Comment.getComments(question);
  const commentSection = await Comment.createCommentSection(comments, question);

  questionIcons.appendChild(leftIcons);
  questionIcons.appendChild(rightIcons);

  questionTextBlock.appendChild(questionText);
  questionTextBlock.appendChild(questionIcons);

  questionTextBlock.appendChild(votes);

  questionBlock.appendChild(questionTextBlock);
  questionBlock.appendChild(commentSection);

  card.appendChild(questionBlock);

  return card;
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

const displayQuestionBlock = () => {
  askQuestionWrapper.classList.add('active');
  postQuestionDirArea.classList.add('inactive');
  const divider = document.createElement('hr');
  divider.classList.add('divider');
  askQuestionWrapper.appendChild(divider);
  return askQuestionWrapper;
}

/**
 * @func addIcons
 * @param {HTMLElement} iconWrapper The parent container for the icons
 * @param {Array} icons List of icons
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

    img.onclick = function () {
      const action = this.getAttribute('data-action');
      switch (action) {
        case 'upvote': {
          const questionId = this.getAttribute('data-target');
          upvoteQuestion(questionId);
          getQuestion(questionId)
            .then((question) => {

            })
            .catch((err) => {
              throw err;
            })
        }

        case 'downvote': {
          const questionId = this.getAttribute('data-target');
          downvoteQuestion(questionId);
          getQuestion(questionId)
            .then((question) => {
              displayTotalUsersVotes(question.votes);
            })
            .catch((err) => {
              throw err;
            })
        }

        default:
          break;
      }
    }
    iconWrapper.appendChild(img);
  });
}

const downvoteQuestion = (questionId) => {
  const apiUrl = `${apiBaseURL}/questions/${questionId}/downvote`;
  fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  })
    .then((response) => response.json())
    .then((response) => {
      const { status, data } = response;
      if (status === 200) {
        const votes = document.getElementById(`user-vote-${questionId}`);
        votes.textContent = data[0].votes;
      }
    })
    .catch((err) => {
      throw err;
    })
}

const upvoteQuestion = (questionId) => {
  const apiUrl = `${apiBaseURL}/questions/${questionId}/upvote`;
  fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  })
    .then((response) => response.json())
    .then((response) => {
      const { status, data } = response;
      if (status === 200) {
        const votes = document.getElementById(`user-vote-${questionId}`);
        votes.textContent = data[0].votes;
      }
    })
    .catch((err) => {
      throw err;
    })
}

const getQuestion = async (questionId) => {
  const apiURL = `${apiBaseURL}/meetups/${activeMeetupId}/questions/${questionId}`
  try {
    const response = await fetch(apiURL, requestHeader);
    const responseBody = await response.json();
    const { status, data } = responseBody;
    return status === 200 ? data[0] : null;
  } catch (e) {
    throw e;
  }
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
