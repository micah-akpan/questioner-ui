
const userFeedback = document.querySelector('.user-feedback');

const displayFormFeedback = (msg) => {
  const infoImage = document.createElement('img');
  infoImage.src = '../../assets/icons/cross.svg';
  infoImage.alt = '2 slanted lines representing a cancel symbol';
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

      const validationMessage = passwordMatch(originalPassword, repeatedPassword) ? 'passwords match' : 'passwords do not match';

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
