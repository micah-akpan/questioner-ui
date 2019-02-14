

const meetupPhotosWrapper = document.getElementById('meetup-photos__wrapper');
const imageSelectButton = document.getElementById('multi-image-select');
const fileInput = document.getElementById('meetupImage');
const imageUploadForm = document.getElementById('meetup-photos-upload-form');
const uploadPhotosButton = document.getElementById('upload-photos__btn');
// const meetupTagsWrapper = document.getElementById('meetup-tags');

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

fileInput.onchange = (e) => {
  const images = e.target.files;
  displayImagePreviews(images);
};

// Tags
const addTagBtn = document.querySelector('.btn__tag');
const tagField = document.querySelector('input[id="tag"]');
const addTagsContainer = document.querySelector('.meetup-tags-added');

let tags = null;

if (addTagBtn) {
  addTagBtn.onclick = (e) => {
    // allowed separators for tags are commas and hashes (#)
    tags = tagField.value.split(',');
    if (tags.length === 1 && tags[0].includes('#')) {
      tags = tags[0].split('#');
    }

    addTagsContainer.innerHTML = '';
    tags.forEach((tag, i) => {
      if (tag !== '') {
        const span = d.createElement('span');

        // to support deleting the tags later
        span.id = i;
        span.textContent = `#${tag}`;
        addTagsContainer.appendChild(span);
      }
    });
  };
}

/**
 * @func uploadMeetupImages
 * @param {Array<File>} images
 * @returns {Promise} Returns a promise
 * that resolves to the newly updated meetup
 */
const uploadMeetupImages = (images) => {
  const meetupId = localStorage.getItem('activeMeetupId');
  const userToken = localStorage.getItem('userToken');
  const apiUrl = `http://localhost:9999/api/v1/meetups/${meetupId}/images`;

  const formData = new FormData();
  formData.append('meetupPhotos', images);
  return fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${userToken}`
    },
    method: 'POST',
    body: formData
  })
    .then((res) => {
      if (res.ok) {
        uploadPhotosButton.textContent = 'Uploading...';
        return res.json();
      }
      throw new Error('Meetup images upload failed');
    })
    .then((res) => {

    })
    .catch((err) => {
      throw err;
    });
};

const createTagForm = () => {
  const section = document.createElement('section');
  const form = document.createElement('form');
  const label = document.createElement('label');
  const tagInputField = document.createElement('input');
  const tip = document.createElement('span');
  const button = document.createElement('q-btn', 'btn__tag');

  section.classList.add('meetup-tags__box');
  label.classList.add('q-form__label');
  label.htmlFor = 'tag';
  label.textContent = 'Add Tags';
  tagInputField.classList.add('q-input__small');
  tagInputField.id = 'tag';

  tip.textContent = 'Start tags with # or separate them with commas';

  const div = document.createElement('div');
  div.classList.add('q-form__group');
  div.appendChild(label);
  div.appendChild(tagInputField);
  div.appendChild(tip);

  form.appendChild(div);

  section.appendChild(form);
  return section;
};

meetupTagsWrapper.appendChild(createTagForm());

imageUploadForm.onsubmit = (e) => {
  e.preventDefault();
  const meetupPhotosInput = document.getElementById('meetupImage');
  const imageFiles = meetupPhotosInput.files;
  uploadMeetupImages(imageFiles);
};
