
const userFeedback = document.querySelector('.user-feedback');
const requestFeedback = document.getElementById('sign-up-request-feedback');

/**
 * @func displayFormFeedback
 * @param {String} message
 * @returns {HTMLElement} Returns HTML Element wrapping `message`
 */
const displayFormFeedback = (message) => {
  const feedbackText = document.getElementById('sign-up-request-feedback-text');
  feedbackText.textContent = message;
  feedbackText.classList.add('request-feedback__text');
  requestFeedback.classList.remove('request-feedback--hidden');
  requestFeedback.classList.add('request-feedback--animate');

  setTimeout(() => {
    requestFeedback.classList.add('request-feedback--active');
  }, 1000);
};

const hideFormFeedback = (secs) => {
  setTimeout(() => {
    userFeedback.classList.add('hide');
  }, secs * 1000);
};

/**
 * @param {String} password1
 * @param {String} password2
 * @returns {Boolean} Test the equality of `password1` and `password2`
 * @description Returns true if `password` is equal to `password2`
 */
const passwordMatch = (password1, password2) => password1 === password2;

/**
 * @func registerUser
 * @param {*} newUser User payload
 * @return {undefined}
 * @description Signs up a user represented by `user`
 */
const registerUser = (newUser) => {
  fetch('http://localhost:9999/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(newUser)
  })
    .then(res => res.json())
    .then((res) => {
      if (res.status === 201) {
        const { token, user } = res.data[0];
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', user.id);

        window.location.assign('./meetups.html');
      } else {
        console.log(res.error);
        displayFormFeedback(res.error);
        hideFormFeedback(10);
      }
    })
    .catch(() => {

    });
};

window.onload = () => {
  const userToken = Token.getToken('userToken');
  if (userToken) {
    window.location.assign('./meetups.html');
  } else {
    const signUpForm = document.getElementById('sign-up-form');
    const confirmPasswordField = document.getElementById('c-pwd');
    const emailField = document.querySelector('input[name=email]');
    const passwordField = document.querySelector('input[name=password]');
    const lastNameField = document.querySelector('input[name=lastname]');
    const firstNameField = document.querySelector('input[name=firstname]');
    const passwordValidationMsg = document.querySelector('.pwd-validation-msg');

    confirmPasswordField.oninput = function validate() {
      const originalPassword = passwordField.value.trim();
      const repeatedPassword = this.value.trim();

      const validationMessage = passwordMatch(originalPassword, repeatedPassword) ? '' : 'passwords do not match';

      passwordValidationMsg.textContent = validationMessage;
    };

    signUpForm.onsubmit = (e) => {
      e.preventDefault();

      const userEmail = emailField.value;
      const userPassword = passwordField.value;
      const rUserPassword = confirmPasswordField.value;
      const lastName = lastNameField.value;
      const firstName = firstNameField.value;

      if (!passwordMatch(userPassword, rUserPassword)) {
        // password have to be the same
        // before proceeding to sign up
        return;
      }

      const user = {
        email: userEmail,
        password: userPassword,
        firstname: firstName,
        lastname: lastName
      };

      registerUser(user);
    };
  }
};
