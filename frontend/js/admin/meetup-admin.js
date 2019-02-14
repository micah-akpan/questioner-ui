

const meetupPhotosWrapper = document.getElementById('meetup-photos__wrapper');
const imageSelectButton = document.getElementById('multi-image-select');
const fileInput = document.getElementById('meetupImage');
const imageUploadForm = document.getElementById('meetup-photos-upload-form');
const uploadPhotosButton = document.getElementById('upload-photos__btn');
const imageUploadModal = document.getElementById('image-upload-modal');
const uploadPhotoInput = document.getElementById('upload-photo-input');
const selectPhotosButton = document.getElementById('select-photos__btn');
const uploadButton = document.getElementById('upload__btn');

const photoUploadFeedback = document.getElementById('photo-upload-feedback');
const photoUploadHandler = document.querySelector('.photo-upload-handler');
const cancelPhotoUploadButton = document.getElementById('close-image-modal__btn');


/**
 * @author https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
 * @description Polyfill for `String.prototype.includes`
 */
if (!String.prototype.includes) {
  /* eslint-disable no-extend-native */
  Object.defineProperty(String.prototype, 'includes', {
    value: (search, start) => {
      if (typeof start !== 'number') {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      }
      return this.indexOf(search, start) !== -1;
    }
  });
}

/**
 * @func displayImagePreviews
 * @param {Array<File>} images
 * @returns {HTMLElement} Shows a preview of all
 * images and returns the container element
 */
const displayImagePreviews = (images) => {
  for (let i = 0, len = images.length; i < len; i += 1) {
    const imageBlob = images[i];
    const image = new Image();
    const imageUrl = URL.createObjectURL(imageBlob);
    image.setAttribute('src', imageUrl);
    meetupPhotosWrapper.appendChild(image);
  }

  uploadPhotosButton.classList.remove('hide');
  uploadPhotosButton.classList.add('show');

  imageSelectButton.classList.remove('show');
  imageSelectButton.classList.add('hide');
  return meetupPhotosWrapper;
};

/**
 * @func uploadMeetupImages
 * @param {FileList<File>} images
 * @returns {Promise} Returns a promise
 * that resolves to the newly updated meetup
 */
const uploadMeetupImages = (images) => {
  const meetupId = localStorage.getItem('activeMeetupId');
  const userToken = localStorage.getItem('userToken');
  const apiUrl = `http://localhost:9999/api/v1/meetups/${meetupId}/images`;

  const formData = new FormData();
  for (let i = 0; i < images.length; i += 1) {
    const image = images.item(i);
    formData.append('meetupPhotos', image);
  }
  return fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${userToken}`
    },
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then((res) => {
      const { status, error } = res;
      if (status === 201) {
        photoUploadFeedback.textContent = 'Meetup images were uploaded successfully';
        setTimeout(() => {
          photoUploadFeedback.classList.add('hide');
        }, 3000);
        hideModal(imageUploadModal);
      } else {
        photoUploadFeedback.textContent = error;
      }
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func clearInputField
 * @param {HTMLElement} inputFieldNode
 * @returns {HTMLElement} clears value in `inputFieldNode` and returns `inputFieldNode`
 */
const clearTagInputField = (inputFieldNode) => {
  inputFieldNode.value = '';
  return inputFieldNode;
};

/**
 * @func parseTags
 * @param {String} tags
 * @returns {Array<String> | String } Takes a string an parses it
 * into an array of tags
 */
const parseTags = (tags) => {
  let newTags = null;
  // Delimiters for tags (# and comma)
  if (tags.includes('#')) {
    newTags = tags.split('#');
    newTags = newTags.filter(tag => tag !== '');
  } else if (tags.includes(',')) {
    newTags = tags.split(',');
  } else {
    return 'Please separate your tags with # or comma';
  }
  return newTags;
};

const addMeetupTags = (tags) => {
  const meetupId = localStorage.getItem('activeMeetupId');
  const tagAPIUrl = `${baseURL}/meetups/${meetupId}/tags`;
  return fetch(tagAPIUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token.getToken('userToken')}`
    },
    body: JSON.stringify({
      tags
    })
  })
    .then(response => response.json())
    .then((response) => {
      const { status, error, data } = response;
      const tagFeedback = document.getElementById('tag-feedback');
      if (status === 201) {
        const tagInputField = document.getElementById('tag-input');
        const meetupTags = createMeetupTags(data[0].tags);
        displayMeetupTags(meetupTags);
        tagFeedback.classList.add('success-feedback');
        tagFeedback.textContent = 'New Tags were added successfully';
        clearTagInputField(tagInputField);
      } else {
        tagFeedback.classList.add('error-feedback');
        tagFeedback.textContent = error;
      }
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * @func createTagForm
 * @returns {HTMLElement} Returns a block element that
 * wraps the tag form
 */
const createTagForm = () => {
  const section = document.createElement('section');
  const form = document.createElement('form');
  form.setAttribute('name', 'tag-form');
  const label = document.createElement('label');
  const tagInputField = document.createElement('input');
  const tip1 = document.createElement('span');

  const tagFeedbackPara = document.createElement('p');
  tagFeedbackPara.id = 'tag-feedback';
  const proTip = document.createElement('span');
  proTip.textContent = 'Pro-Tip: ';
  proTip.classList.add('text__thick');

  section.classList.add('meetup-tags__box');
  label.classList.add('q-form__label');
  label.htmlFor = 'tag';
  label.textContent = 'Add Tags';
  tagInputField.classList.add('q-input__small');
  tagInputField.id = 'tag-input';

  tip1.textContent = 'Start tags with # or separate them with commas';
  tip1.insertAdjacentElement('afterbegin', proTip);

  const meetupId = localStorage.getItem('activeMeetupId');
  const MAX_TAGS_PER_MEETUP = 5;
  getMeetup(meetupId)
    .then(({ tags }) => {
      const totalTagsInMeetup = tags.length;
      const tagDifference = MAX_TAGS_PER_MEETUP - totalTagsInMeetup;
      // Tag maximum limit not exceeded yet
      const msg = tagDifference > 0 ? ` (Max ${tagDifference})` : '';
      label.textContent += msg;
    })
    .catch((err) => {
      const msg = '(Max 5)';
      label.textContent += msg;
    });

  form.onsubmit = (e) => {
    e.preventDefault();
    const inputField = document.getElementById('tag-input');
    const tags = parseTags(inputField.value);
    addMeetupTags(tags);
  };
  const div = document.createElement('div');
  div.classList.add('q-form__group');
  div.appendChild(label);
  div.appendChild(tagInputField);

  div.appendChild(tip1);

  form.appendChild(tagFeedbackPara);
  form.appendChild(div);

  section.appendChild(form);
  return section;
};


fileInput.onchange = (e) => {
  const images = e.target.files;
  displayImagePreviews(images);
};

uploadPhotosButton.onclick = () => {
  showModal(imageUploadModal);
};

selectPhotosButton.onclick = () => {
  uploadPhotoInput.click();
};

uploadButton.onclick = () => {
  const imageFiles = uploadPhotoInput.files;
  uploadMeetupImages(imageFiles);
};

uploadPhotoInput.onchange = (e) => {
  const { files } = e.target;
  const totalImageSelected = files.length;
  if (totalImageSelected > 5) {
    photoUploadFeedback.textContent = 'You selected more than 5 images';
  } else {
    const p = document.createElement('p');
    p.textContent = `${totalImageSelected} meetup images will be uploaded`;
    photoUploadHandler.appendChild(p);
    uploadButton.disabled = false;
    uploadButton.classList.remove('disabled__btn');
  }
};

cancelPhotoUploadButton.onclick = () => {
  hideModal(imageUploadModal);
};

meetupTagsWrapper.appendChild(createTagForm());

imageUploadForm.onsubmit = (e) => {
  e.preventDefault();
  const meetupPhotosInput = document.getElementById('meetupImage');
  const imageFiles = meetupPhotosInput.files;
  uploadMeetupImages(imageFiles);
};
