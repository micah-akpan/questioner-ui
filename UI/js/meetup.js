
(() => {

  const d = document;

  const mPhotosWrapper = d.querySelector('.meetup-photos__wrapper');
  const uploadBtn = d.querySelector('label[role="button"]');
  const fileInput = d.querySelector('input[type="file"]');
  const askQuestionWrapper = d.querySelector('#ask-question');
  const postQuestionDirArea = d.querySelector('#post-questions-directive');
  const askGroupBtn = d.querySelector('.ask-group-btn');
  const commentBoxes = d.querySelectorAll('.comment-box .question-comment textarea');

  // Tags
  const addTagBtn = d.querySelector('.btn__tag');
  const tagField = d.querySelector('input[id="tag"]');
  const addTagsContainer = d.querySelector('.meetup-tags-added');


  commentBoxes.forEach((commentBox) => {
    commentBox.oninput = function () {
      const text = this.value;
      const MAX_SIZE_TO_RESIZE = 40;
      if (text.length === MAX_SIZE_TO_RESIZE) {
        this.classList.add('long-comment-box');
      }
    }
  })

  askGroupBtn.onclick = function () {
    showEl({
      elem: askQuestionWrapper,
      activeClassName: 'active'
    });
    // User should not see
    // post question directive
    // after enabling ask questions UI
    postQuestionDirArea.classList.add('inactive');
    const divider = d.createElement('hr');
    divider.classList.add('divider');
    askQuestionWrapper.appendChild(divider);
  }

  /**
   * 
   * @param {*} elem an object with Element and activeClassName props
   * @returns {Element} elem
   * @description Shows an hidden element, applying the styles in activeClassName to it
   */
  const showEl = ({ elem, activeClassName }) => {
    elem.classList.add(activeClassName);
    return elem;
  }


})();
