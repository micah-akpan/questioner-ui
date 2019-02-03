/* eslint-disable */

const topicField = document.getElementById('m-topic');
const locationField = document.getElementById('m-location');
const dateField = document.getElementById('m-date');
const tagsField = document.getElementById('m-tags');

const createForm = document.querySelector('form');

const createMeetup = () => {
  const topic = topicField.value;
  const location = locationField.value;
  const happeningOn = dateField.value;
  const tags = tagsField.value.split(',');
  
  fetch('http://localhost:9999/api/v1/meetups', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token.getToken('userToken')}`

    },
    body: JSON.stringify({
      topic,
      location,
      happeningOn,
      tags
    })
  })
    .then(res => res.json())
    .then((res) => {
      const { status, data } = res;
      if (status === 201) {
        // Navigate to all meetups page for admins
      }
    })
    .catch((err) => {
      
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