/* eslint-disable */

/**
 * @class Comment
 */
const Comment = {
  async getComments(question) {
    try {
      const apiUrl = `${apiBaseURL}/questions/${question.id}/comments`;
      const response = await fetch(apiUrl, requestHeader);
      if (response.ok) {
        const responseBody = await response.json();
        const { status, data } = responseBody;
        const comments = status === 200 ? data : [];
        return comments;
      }
    } catch (e) {
      throw e;
    }
  },

  async postComment(questionId, comment) {
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
  },

  handleCommentFormSubmit(questionId, comment) {
    Promise.all([
      getQuestion(questionId), postComment(questionId, comment)
    ])
      .then((values) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      })
  },

  createCommentForm() {
    const commentForm = document.createElement('form');
    commentForm.classList.add('comment-form');
    commentForm.setAttribute('data-target', question.id);
    commentForm.onsubmit = (e) => {
      const formData = new FormData(commentForm);
      const questionId = commentForm.getAttribute('data-target');
      this.handleCommentFormSubmit(questionId, formData.get('comment'));
    }
    const commentTextBox = this.createCommentTextBox();
    const commentButton = this.createCommentButton();
    commentForm.appendChild(commentTextBox);
    commentForm.appendChild(commentButton);
    return commentForm;
  },

  createCommentFormWidget(elType,
    { attrs, classNames, textValue }) {
    const widget = document.createElement(elType);
    const attrKeys = Object.keys(attrs);
    attrKeys.forEach((key) => {
      widget.setAttribute(key, attrs[key]);
    });
    widget.classList.add(...classNames);
    widget.textContent = textValue;
    return widget;
  },

  createCommentTextBox() {
    const textArea = document.createElement('textarea');
    setAttributes(textArea, {
      required: true,
      name: 'comment',
      placeholder: 'Add your comment'
    });
    return textArea;
  },

  createCommentButton() {
    const commentButton = document.createElement('button');
    commentButton.classList.add('q-btn', 'btn');
    commentButton.textContent = 'Comment';
    return commentButton;
  },

  displayComments({ card, commentsWrapper,
    questionComment, commentForm, viewComments, question }) {
    Promise.all([getUser(), getComments(question)])
      .then((values) => {
        const [user, comments] = values;
        commentsWrapper.innerHTML = '';
        comments.forEach((comment) => {
          const commentCard = createCommentCard(user, comment);
          commentsWrapper.appendChild(commentCard);
        })
        card.innerHTML = '';
        card.appendChild(commentsWrapper);
        questionComment.appendChild(commentForm);

        viewComments.textContent = `View less comments`;

        card.appendChild(viewComments);
        card.appendChild(questionComment);

        return card;
      })
      .catch((e) => {
        throw e;
      })
  },

  /**
 * @func createCommentSection
 * @param {Array} comments
 * @returns {Promise<HTMLDivElement>} Resolves to a comment card HTML element
 */
  async createCommentSection(comments, question) {
    const card = document.createElement('div');

    card.classList.add('comment-box');
    const viewComments = document.createElement('p');
    viewComments.classList.add('view-comments__link');
    viewComments.textContent = formCommentLinkText(comments.length);
    const commentsWrapper = document.createElement('div');
    commentsWrapper.classList.add('comments-wrapper');

    const questionComment = document.createElement('div');
    questionComment.classList.add('question-comment');

    const userImage = await createUserAvatar();
    const commentForm = createCommentForm(question);

    viewComments.onclick = () => {
      displayComments({
        card,
        commentsWrapper,
        questionComment,
        commentForm,
        viewComments,
        question
      });
    }

    questionComment.appendChild(userImage);
    questionComment.appendChild(commentForm);

    card.appendChild(viewComments);
    card.appendChild(questionComment);

    return card;
  },

  createCommentBody() {

  },

  createCardPrimarySection({ firstname, lastname }, comment) {
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
  },

  createCardUserAvatarSec(user) {
    const userAvatar = document.createElement('img');
    const defaultImage = '../assets/icons/avatar1.svg'
    userAvatar.setAttribute('src', user.avatar || defaultImage);
    userAvatar.classList.add('rounded-border-avatar', 'light-border');
    return userAvatar;
  },

  createCommentCard(user, comment) {
    const card = document.createElement('div');
    card.classList.add('comment-card');
    const primaryDetailsWrapper = this.createCardPrimarySection(user, comment);
    const userAvatar = this.createCardUserAvatarSec(user);
    const avatarWrapper = document.createElement('div');
    avatarWrapper.appendChild(userAvatar);

    card.appendChild(avatarWrapper);
    card.appendChild(primaryDetailsWrapper);

    return card;
  },
  /**
 * @func formCommentLinkText
 * @param {Number} totalComments
 * @returns {String} Comment link text 
 */
  formCommentLinkText(totalComments) {
    let linkText = '';
    if (totalComments > 1) {
      linkText = `View all ${totalComments} comments`
    } else if (totalComments === 1) {
      linkText = `View ${totalComments} comment`
    }

    return linkText;
  }
}
