

const mPhotosWrapper = document.querySelector('.meetup-photos__wrapper');
const uploadBtn = document.querySelector('label[role="button"]');
const fileInput = document.querySelector('input[type="file"]');
const askGroupBtn = document.querySelector('.ask-group-btn');
const commentBoxes = document.querySelectorAll('.comment-box .question-comment textarea');
const imageUploadForm = document.getElementById('meetup-photos-upload-form');
const uploadPhotosButton = document.getElementById('upload-photos__btn');

fileInput.onchange = (e) => {
  const image = new Image();
  const imageUrl = URL.createObjectURL(e.target.files[0]);
  image.setAttribute('src', imageUrl);
  uploadPhotosButton.classList.remove('hide');
  uploadPhotosButton.classList.add('show');
  mPhotosWrapper.appendChild(image);
};

// Tags
const addTagBtn = document.querySelector('.btn__tag');
const tagField = document.querySelector('input[id="tag"]');
const addTagsContainer = document.querySelector('.meetup-tags-added');

let tags = null;

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

/* eslint-disable */
const uploadMeetupImages = (images) => {
  const meetupId = localStorage.getItem('activeMeetupId');
  const userToken = localStorage.getItem('userToken');
  const apiUrl = `http://localhost:9999/api/v1/meetups/${meetupId}/images`;
  const formData = new FormData();
  const data = {
    meetupPhotos: images
  }
  for (const p in data) {
    if (Object.prototype.hasOwnProperty.call(data, p)) {
      formData.append(p, data[p]);
    }
  }
  return fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${userToken}`
    },
    method: 'POST',
    body: formData
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Meetup images upload failed')
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    })
}

imageUploadForm.onsubmit = (e) => {
  e.preventDefault();
  const meetupPhotosInput = document.getElementById('meetupImage');
  const imageFiles = meetupPhotosInput.files;
  uploadMeetupImages(imageFiles)
}