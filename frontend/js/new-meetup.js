/* eslint-disable */

const topicField = document.getElementById('m-topic');
const locationField = document.getElementById('m-location');
const dateField = document.getElementById('m-date');
const tagsField = document.getElementById('m-tags');
const imagesField = document.getElementById('m-images');

const createForm = document.querySelector('form');

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

  fetch('http://localhost:9999/api/v1/meetups', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${Token.getToken('userToken')}`
    },
    body: formData
  })
    .then(res => res.json())
    .then((res) => {
      const { status, data } = res;
      if (status === 201) {
        window.location.replace('./meetups.html');
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
}