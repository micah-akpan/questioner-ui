const loginForm = document.getElementById('login-form');
const userFeedback = document.querySelector('.user-feedback');
const emailField = document.getElementById('userEmail');
const passwordField = document.getElementById('userPwd');
const requestFeedback = document.getElementById('sign-in-request-feedback');

/**
 * @func displayFormFeedback
 * @param {String} message
 * @returns {HTMLElement} Returns HTML element representing the user feedback
 */
const displayFormFeedback = (message) => {
  const feedbackText = document.getElementById('sign-in-request-feedback-text');
  feedbackText.textContent = message;
  feedbackText.classList.add('request-feedback__text');
  requestFeedback.classList.remove('request-feedback--hidden');
  requestFeedback.classList.add('request-feedback--shown');

  setTimeout(() => {
    requestFeedback.classList.add('request-feedback--active');
  }, 1000);
};

/**
 * @func hideFormFeedback
 * @param {Number} secs
 * @returns {Number} Returns a ID of this timer process
 */
const hideFormFeedback = secs => setTimeout(() => {
  requestFeedback.classList.remove('request-feedback--active');
  requestFeedback.classList.add('request-feedback--hidden');
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
        if (user.isAdmin) {
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
