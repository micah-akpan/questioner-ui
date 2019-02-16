/* eslint-disable */
const apiBaseURL = 'http://localhost:9999/api/v1';

const topicField = document.getElementById('m-topic');
const locationField = document.getElementById('m-location');
const dateField = document.getElementById('m-date');
const tagsField = document.getElementById('m-tags');

// Image preview
const imgUpload = document.querySelector('.q-form__image-upload');
const imgBlock = document.querySelector('.outer-upload__block');
const imgUploadBtns = document.querySelector('.image-upload-btns');
const cancelUploadBtn = document.querySelector('.img-upload-cancel__btn');
const imageUploadWrapper = document.querySelector('.image-upload__wrapper');
const userFeedback = document.querySelector('.feedback');

/**
 * @func createImageUploadFormWidget
 * @returns {HTMLElement} Returns the image upload wrapper element
 */
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

  innerUploadBlock.onclick = () => {
    // This is meant to increase
    // surface area for better user
    // clicks on the image upload area
    fileInput.click();
  }
  const innerLabel = document.createElement('label');
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

/**
 * 
 * @param {String} msg 
 * @returns {HTMLDivElement} The HTML element wrapping the
 * user action feedback
 */
const createFeedbackAlert = (msg) => {
  const displayBox = document.createElement('div');
  displayBox.textContent = msg;
  displayBox.classList.add('alert-box');
  return displayBox;
}

/**
 * @func displayFeedbackAlert
 * @param {String} msg 
 * @returns {HTMLDivElement} Appends the feedback HTML element
 * and returns it
 */
const displayFeedbackAlert = (msg) => {
  return document.body.appendChild(createFeedbackAlert(msg));
}

/**
 * @func displayFormFeedback
 * @param {String} msg 
 * @returns {HTMLElement} Returns the HTML element wrapping
 * the Form feedback
 */
const displayFormFeedback = (msg) => {
  const infoImage = document.createElement('img');
  infoImage.src = '../../../assets/icons/cross.svg';
  infoImage.alt = '';
  userFeedback.innerHTML = '';
  userFeedback.appendChild(infoImage);
  const span = document.createElement('span');
  span.textContent = msg;
  userFeedback.classList.remove('hide');
  userFeedback.classList.add('');
  userFeedback.appendChild(span);
  return userFeedback;
};

/**
 * @func addFeedbackMessage
 * @param {String} msg 
 * @param {String} feedbackType
 * @returns {HTMLElement} Adds error/success classes
 * to feedback element, according to `feedbackType`
 */
const addFeedbackMessage = (msg, feedbackType = 'error') => {
  const userFeedback = document.querySelector('.feedback');
  userFeedback.textContent = msg;
  userFeedback.classList.add(feedbackType === 'error' ?
    'error-feedback' : 'success-feedback');
  return userFeedback;
}

/**
 * @func displayFeedback
 * @param {String} msg
 * @param {String} feedbackType 
 * @returns {HTMLElement} 
 * @description Displays the feedback pop-up
 */
const displayFeedback = (msg, feedbackType) => {
  const userFeedback = addFeedbackMessage(msg, feedbackType);
  userFeedback.classList.remove('hidden');
  userFeedback.classList.add('active');
  return userFeedback;
}

/**
 * @func hideFeedback
 * @param {Number} secs 
 * @return {Number} Timer Interval
 * @description Hides the feedback pop-up
 */
const hideFeedback = (secs) => {
  return setTimeout(() => {
    userFeedback.classList.remove('active');
    userFeedback.classList.add('hidden');
  }, secs * 1000);
};

/**
 * @func loadImagePreview
 * @param {Event} e 
 * @returns {undefined}
 * @description Shows a preview of the selected meetup image
 */
const loadImagePreview = (e) => {
  const uploadedImg = document.createElement('img');
  const imgBlock = document.querySelector('.outer-upload__block');
  uploadedImg.classList.add('upload-image-preview');
  const file = e.target.files[0];
  uploadedImg.file = file;
  uploadedImg.id = 'm-images';
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

/**
 * @func createMeetup
 * @returns {undefined} 
 * @description Creates a meetup
 */
const createMeetup = () => {
  const imagesField = document.getElementById('m-images');
  const topic = topicField.value;
  const location = locationField.value;
  const happeningOn = dateField.value;
  const tags = tagsField.value.split(',');
  const image = imagesField.file;

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
      Authorization: `Bearer ${Token.getToken('userToken')}`
    },
    body: formData
  })
    .then(res => res.json())
    .then((res) => {
      const { status, data, error } = res;
      if (status === 201) {
        displayFeedback(`${data[0].topic} meetup was successfully created`, 'success');
        setTimeout(() => {
          window.location.assign('./meetups.html');
        }, 5000);
      } else {
        displayFeedback(error, 'error');
        hideFeedback(10);
      }
    })
    .catch((err) => {

    })
};

createForm.onsubmit = (e) => {
  e.preventDefault();
  createMeetup();
};

addProfileAvatarToNav('../../assets/icons/avatar1.svg');

window.onload = () => {
  const userToken = Token.getToken('userToken');
  if (!userToken) {
    window.location.replace('./sign-in.html');
  }
  createImageUploadFormWidget();
}