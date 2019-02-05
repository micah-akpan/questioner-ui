const loginForm = document.getElementById('login-form');
const userFeedback = document.querySelector('.user-feedback');
const emailField = document.getElementById('userEmail');
const passwordField = document.getElementById('userPwd');

const displayFormFeedback = (msg) => {
  const infoImage = document.createElement('img');
  infoImage.src = '../../assets/icons/cross.svg';
  infoImage.alt = '';
  userFeedback.appendChild(infoImage);
  const span = document.createElement('span');
  span.textContent = msg;
  userFeedback.classList.add('info-box');
  userFeedback.appendChild(span);
};

const hideFormFeedback = (secs) => {
  setTimeout(() => {
    userFeedback.classList.add('hide');
  }, secs * 1000);
};


const loginUser = () => {
  fetch('http://localhost:9999/api/v1/auth/login', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: emailField.value,
      password: passwordField.value
    })
  })
    .then(response => response.json())
    .then((response) => {
      if (response.status === 201) {
        const { token, user } = response.data[0];
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', user.id);

        if (user.isadmin) {
          window.location.assign('./admin/meetups.html');
        } else {
          window.location.assign('./meetups.html');
        }
      } else {
        displayFormFeedback(response.error);
        hideFormFeedback(10);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


loginForm.onsubmit = (e) => {
  e.preventDefault();
  loginUser();
};


window.onload = () => {
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    window.location.assign('./meetups.html');
  }
};
