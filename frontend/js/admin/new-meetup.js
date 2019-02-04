/* eslint-disable */
const apiBaseURL = 'http://localhost:9999/api/v1';

const topicField = document.getElementById('m-topic');
const locationField = document.getElementById('m-location');
const dateField = document.getElementById('m-date');
const tagsField = document.getElementById('m-tags');
const imagesField = document.getElementById('m-images');

// Image preview
const imgUpload = document.querySelector('.q-form__image-upload');
const imgBlock = document.querySelector('.outer-upload__block');
const imgUploadBtns = document.querySelector('.image-upload-btns');
const cancelUploadBtn = document.querySelector('.img-upload-cancel__btn');
const imageUploadWrapper = document.querySelector('.image-upload__wrapper');

const createImageUploadFormWidget = () => {
  const imageUploadWrapper = document.querySelector('.image-upload__wrapper');
  const outerLabel = document.createElement('label');
  outerLabel.classList.add('q-form__label');
  outerLabel.textContent = 'Upload an image for your meetup';

  const outerUploadBlock = document.createElement('div');
  outerUploadBlock.classList.add('outer-upload__block');
  const fileInput = document.createElement('input');
  fileInput.setAttribute('type', 'file');
  fileInput.setAttribute('name', 'image');
  fileInput.setAttribute('accept', 'image/*');
  fileInput.classList.add('q-form__image-upload');
  fileInput.setAttribute('id', 'm-images');
  fileInput.onchange = loadImagePreview;
  const innerUploadBlock = document.createElement('div');
  innerUploadBlock.classList.add('inner-upload__block');
  const innerLabel = document.createElement('label');
  innerLabel.setAttribute('for', 'm-images');
  innerLabel.classList.add('q-form__label');
  innerLabel.textContent = 'Upload an Image';

  innerUploadBlock.appendChild(innerLabel);

  imageUploadWrapper.innerHTML = '';

  outerUploadBlock.appendChild(fileInput);
  outerUploadBlock.appendChild(innerUploadBlock);

  imageUploadWrapper.appendChild(outerLabel);
  imageUploadWrapper.appendChild(outerUploadBlock);

  return imageUploadWrapper;
}

cancelUploadBtn.onclick = () => {
  createImageUploadFormWidget();
}

const createForm = document.querySelector('form');

const createFeedbackAlert = (msg) => {
  const displayBox = document.createElement('div');
  displayBox.textContent = msg;
  displayBox.classList.add('alert-box');
  return displayBox;
}

const displayFeedbackAlert = (msg) => {
  return document.body.appendChild(createFeedbackAlert(msg));
}

const loadImagePreview = (e) => {
  const uploadedImg = document.createElement('img');
  const imgBlock = document.querySelector('.outer-upload__block');
  uploadedImg.classList.add('upload-image-preview');
  const file = e.target.files[0];
  uploadedImg.file = file;
  imgBlock.innerHTML = '';
  imgBlock.appendChild(uploadedImg);
  imgUploadBtns.classList.add('image-upload-btns-show');
  imageUploadWrapper.appendChild(imgUploadBtns);

  const reader = new FileReader();
  reader.onload = ((aImg) =>
    (e) => {
      aImg.src = e.target.result;
    })(uploadedImg);
  reader.readAsDataURL(file);
}

const createMeetup = () => {
  const topic = topicField.value;
  const location = locationField.value;
  const happeningOn = dateField.value;
  const tags = tagsField.value.split(',');
  const image = imagesField.files[0];

  const data = {
    topic,
    location,
    happeningOn,
    tags,
    image
  };

  const formData = new FormData();

  for (const prop in data) {
    formData.append(prop, data[prop]);
  }

  fetch(`${apiBaseURL}/meetups`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${Token.getUserToken('userToken')}`
    },
    body: formData
  })
    .then(res => res.json())
    .then((res) => {
      const { status, data } = res;
      if (status === 201) {
        displayFeedbackAlert(`${topic} has been successfully created. Redirecting in 5 seconds`);
        setTimeout(() => {
          window.location.assign('./meetups.html');
        }, 5000);
      } else {
        console.log(res.error)
      }
    })
    .catch((err) => {
      console.error(err);
    })
};

createForm.onsubmit = (e) => {
  e.preventDefault();
  createMeetup();
};

window.onload = () => {
  const userToken = Token.getToken('userToken');
  if (!userToken) {
    window.location.replace('./sign-in.html');
  }
  createImageUploadFormWidget();
}