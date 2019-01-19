
(() => {

  const d = document;

  const mPhotosWrapper = d.querySelector('.meetup-photos__wrapper');
  const uploadBtn = d.querySelector('label[role="button"]');
  const fileInput = d.querySelector('input[type="file"]');
  const askQuestionWrapper = d.querySelector('#ask-question');
  const postQuestionDirArea = d.querySelector('#post-questions-directive');
  const askGroupBtn = d.querySelector('.ask-group-btn');
  const commentBoxes = d.querySelectorAll('.comment-box .question-comment textarea');

  fileInput.onchange = (e) => {
    const image = new Image();
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    image.setAttribute('src', imageUrl);

    mPhotosWrapper.appendChild(image);
  }

  // Tags
  const addTagBtn = d.querySelector('.btn__tag');
  const tagField = d.querySelector('input[id="tag"]');
  const addTagsContainer = d.querySelector('.meetup-tags-added');

  let tags = null;

  addTagBtn.onclick = (e) => {
    // allowed separators for tags are commas and hashes (#)
    tags = tagField.value.split(",");
    if (tags.length === 1 && tags[0].includes('#')) {
      tags = tags[0].split('#');
    }

    addTagsContainer.innerHTML = "";
    tags.forEach((tag, i) => {
      if (tag !== '') {
        const span = d.createElement('span');

        // to support deleting the tags later
        span.id = i;
        span.textContent = `#${tag}`;
        addTagsContainer.appendChild(span);
      }
    })
  }


  commentBoxes.forEach((commentBox) => {
    commentBox.oninput = function () {

      const text = this.value;
      // TODO: Implement auto-resize as user types feature
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

  // Meetup location on the map
})();
