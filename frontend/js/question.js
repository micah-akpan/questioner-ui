const askQuestionWrapper = document.getElementById('ask-question');
const postQuestionDirArea = document.getElementById('post-questions-directive');
const cards = document.getElementById('q-question-cards');

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
  getUser(question.user)
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

/**
 * @func upvoteQuestion
 * @param {String|Number} questionId
 * @returns {Number} Upvotes a question
 * and resolves to the total votes count
 */
const upvoteQuestion = (questionId) => {
  const apiUrl = `${apiBaseURL}/questions/${questionId}/upvote`;
  return fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userAuthToken}`
    }
  })
    .then(response => response.json())
    .then((response) => {
      const { status, data } = response;
      if (status === 200) {
        const question = data[0];
        const votes = document.getElementById(`user-vote-${questionId}`);
        votes.textContent = question.votes;
        return question.votes;
      }
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func downvoteQuestion
 * @param {String|Number} questionId
 * @returns {Number} Upvotes a question
 * and resolves to the total votes count
 */
const downvoteQuestion = (questionId) => {
  const apiUrl = `${apiBaseURL}/questions/${questionId}/downvote`;
  return fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userAuthToken}`
    }
  })
    .then(response => response.json())
    .then((response) => {
      const { status, data } = response;
      if (status === 200) {
        const usersVotes = data[0].votes;
        const votes = document.getElementById(`user-vote-${questionId}`);
        votes.textContent = usersVotes;
        return usersVotes;
      }
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func getQuestion
 * @param {String|Number} questionId
 * @returns {*} Resolves to a question with `questionId` or null
 */
const getQuestion = (questionId) => {
  const apiURL = `${apiBaseURL}/meetups/${activeMeetupId}/questions/${questionId}`;
  return fetch(apiURL, {
    headers: genericRequestHeader
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
    placeholder: 'A concise question gets more comments',
    type: 'textarea'
  }
];

/**
 * @func getUserDetails
 * @returns {Promise<Array>} Resolves to an array of
 * of user details
 */
const getUserDetails = () => Promise.all([getUserImage(), getUser(userId)])
  .then(results => results)
  .catch((err) => {
    throw err;
  });

/**
 * @func createQuestionBioSection
 * @returns {HTMLElement} Returns HTML element that
 * represent the question bio section
 */
const createQuestionBioSection = () => {
  const bioSection = document.createElement('section');
  const userAvatar = document.createElement('img');
  userAvatar.classList.add('user-profile-avatar');
  const defaultAvatar = '../assets/icons/avatar1.svg';

  const bioText = document.createElement('p');
  bioText.classList.add('question-text', 'user-profile-text');
  const userName = document.createElement('p');
  userName.classList.add('question-text', 'user-profile__name');

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

/**
 * @func displayMeetupQuestions1
 * @param {*} meetup Meetup
 * @returns {undefined} Makes an HTTP request for all meetup questions
 * displays them
 */
const displayMeetupQuestions1 = async (meetup) => {
  try {
    const apiUrl = `${apiBaseURL}/meetups/${meetup.id}/questions`;
    const response = await fetch(apiUrl, requestHeader);
    const responseBody = await response.json();
    const { status, data } = responseBody;
    if (status === 200) {
      const questions = data;
      questions.forEach(async (question) => {
        questionCards.appendChild(await createQuestionCard(question));
      });
    }
  } catch (e) {
    throw e;
  }
};
