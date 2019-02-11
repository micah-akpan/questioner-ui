const loginForm = document.getElementById('login-form');
const userFeedback = document.querySelector('.user-feedback');
const emailField = document.getElementById('userEmail');
const passwordField = document.getElementById('userPwd');

/**
 * @func displayFormFeedback
 * @param {String} message
 * @returns {HTMLElement} Returns HTML element representing the user feedback
 */
const displayFormFeedback = (message) => {
  const infoImage = document.createElement('img');
  infoImage.src = '../../assets/icons/cross.svg';
  infoImage.alt = '';
  userFeedback.innerHTML = '';
  userFeedback.appendChild(infoImage);
  const span = document.createElement('span');
  span.textContent = message;
  userFeedback.classList.remove('hide');
  userFeedback.classList.add('info-box');
  userFeedback.appendChild(span);
  return userFeedback;
};

/**
 * @func hideFormFeedback
 * @param {Number} secs
 * @returns {Number} Returns a ID of this timer process
 */
const hideFormFeedback = secs => setTimeout(() => {
  userFeedback.classList.add('hide');
}, secs * 1000);

/**
 * @func loginUser
 * @returns {*} Logins a user
 */
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
      const { status, data, error } = response;
      if (status === 201) {
        const { token, user } = data[0];
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', user.id);

        if (user.isadmin) {
          window.location.assign('./admin/meetups.html');
        } else {
          window.location.assign('./meetups.html');
        }
      } else {
        displayFormFeedback(error);
        hideFormFeedback(10);
      }
    })
    .catch((err) => {
      throw err;
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
