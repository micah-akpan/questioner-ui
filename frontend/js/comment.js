
const getComments = async (question) => {
  try {
    const apiUrl = `${apiBaseURL}/questions/${question.id}/comments`;
    const response = await fetch(apiUrl, requestHeader);
    if (response.ok) {
      const responseBody = await response.json();
      const { status, data } = responseBody;
      const comments = status === 200 ? data : [];
      return comments;
    }

    return [];
  } catch (e) {
    throw e;
  }
};

const createCardUserAvatarSec = (user) => {
  const userAvatar = document.createElement('img');
  const defaultImage = '../assets/icons/avatar1.svg';
  userAvatar.setAttribute('src', user.avatar || defaultImage);
  userAvatar.classList.add('rounded-border-avatar', 'light-border');
  return userAvatar;
};

const createCardPrimarySection = ({ firstname, lastname }, comment) => {
  const primaryDetails = document.createElement('div');
  primaryDetails.classList.add('comment-card__primary');

  const userName = document.createElement('h3');
  userName.textContent = getUserFullName(firstname, lastname);
  const commentBody = document.createElement('p');
  commentBody.textContent = comment.body;
  const commentDate = document.createElement('span');
  const [month, day] = parseDate(comment.createdOn);
  commentDate.textContent = `${month} ${day}`;

  primaryDetails.appendChild(userName);
  primaryDetails.appendChild(commentBody);
  primaryDetails.appendChild(commentDate);
  return primaryDetails;
};

const createCommentCard = (user, comment) => {
  const card = document.createElement('div');
  card.classList.add('comment-card');
  const primaryDetailsWrapper = createCardPrimarySection(user, comment);
  const userAvatar = createCardUserAvatarSec(user);
  const avatarWrapper = document.createElement('div');
  avatarWrapper.appendChild(userAvatar);

  card.appendChild(avatarWrapper);
  card.appendChild(primaryDetailsWrapper);

  return card;
};


/**
* @func formCommentLinkText
* @param {Number} totalComments
* @returns {String} Comment link text
*/
const formCommentLinkText = (totalComments) => {
  let linkText = '';
  if (totalComments > 1) {
    linkText = `View all ${totalComments} comments`;
  } else if (totalComments === 1) {
    linkText = `View ${totalComments} comment`;
  }
  return linkText;
};


const postComment = async (questionId, comment) => {
  try {
    const response = await fetch(`${apiBaseURL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },

      body: JSON.stringify({
        comment,
        questionId
      })
    });

    const responseBody = await response.json();
    const { status, data } = responseBody;
    return status === 201 ? data[0] : null;
  } catch (e) {
    throw e;
  }
};

const createComment = (questionId, comment) => {
  Promise.all([
    getQuestion(questionId), postComment(questionId, comment)
  ])
    .then((values) => {
      window.location.reload();
    })
    .catch((err) => {
      throw err;
    });
};

const createCommentTextBox = () => {
  const textArea = document.createElement('textarea');
  setAttributes(textArea, {
    required: true,
    name: 'comment',
    placeholder: 'Add your comment'
  });
  return textArea;
};

const createCommentButton = () => {
  const commentButton = document.createElement('button');
  commentButton.classList.add('q-btn', 'btn');
  commentButton.textContent = 'Comment';
  return commentButton;
};

const createCommentForm = async (question) => {
  const commentForm = document.createElement('form');
  commentForm.classList.add('comment-form');
  commentForm.setAttribute('data-target', question.id);
  commentForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(commentForm);
    const questionId = commentForm.getAttribute('data-target');
    createComment(questionId, formData.get('comment'));
  };
  const commentTextBox = createCommentTextBox();
  const commentButton = createCommentButton();
  commentForm.appendChild(commentTextBox);
  commentForm.appendChild(commentButton);
  return commentForm;
};

const createCommentFormWidget = (elType,
  { attrs, classNames, textValue }) => {
  const widget = document.createElement(elType);
  const attrKeys = Object.keys(attrs);
  attrKeys.forEach((key) => {
    widget.setAttribute(key, attrs[key]);
  });
  widget.classList.add(...classNames);
  widget.textContent = textValue;
  return widget;
};

const displayComments = async ({
  card, commentsWrapper,
  questionComment, commentForm, viewComments, question
}) => {
  getComments(question)
    .then((comments) => {
      commentsWrapper.innerHTML = '';
      card.innerHTML = '';

      for (let i = 0; i < comments.length; i += 1) {
        const comment = comments[i];
        getUser(comment.createdBy)
          .then((user) => {
            const commentCard = createCommentCard(user, comment);
            commentsWrapper.appendChild(commentCard);
          }, (err) => {
            throw err;
          });
      }
      card.appendChild(commentsWrapper);
      questionComment.appendChild(commentForm);

      viewComments.textContent = 'View less comments';

      card.appendChild(viewComments);
      card.appendChild(questionComment);
      return card;
    })
    .catch((e) => {
      throw e;
    });
};

/**
* @func createCommentSection
* @param {Array} comments
* @param {*} question
* @returns {Promise<HTMLDivElement>} Resolves to a comment card HTML element
*/
const createCommentSection = async (comments, question) => {
  const card = document.createElement('div');

  card.classList.add('comment-box');
  const viewComments = document.createElement('p');
  viewComments.classList.add('view-comments__link');
  viewComments.textContent = formCommentLinkText(comments.length);
  const commentsWrapper = document.createElement('div');
  commentsWrapper.classList.add('comments-wrapper');

  const questionComment = document.createElement('div');
  questionComment.classList.add('question-comment');

  const userImage = await createUserProfileAvatar('../assets/icons/avatar1.svg');
  const commentForm = await createCommentForm(question);

  viewComments.onclick = () => {
    displayComments({
      card,
      commentsWrapper,
      questionComment,
      commentForm,
      viewComments,
      question
    });
  };

  questionComment.appendChild(userImage);
  questionComment.appendChild(commentForm);

  card.appendChild(viewComments);
  card.appendChild(questionComment);

  return card;
};
