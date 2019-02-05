/* eslint-disable */
const userFeedback = document.querySelector('.user-feedback');
const form = document.querySelector('form');

const displayFormFeedback = (msg) => {
  const infoImage = document.createElement('img');
  infoImage.src = '../../assets/icons/cross.svg';
  infoImage.alt = '';
  userFeedback.appendChild(infoImage);
  const span = document.createElement('span');
  span.textContent = msg;
  userFeedback.classList.add('info-box');
  userFeedback.appendChild(span);
  
}

/**
 * @param {String} password1
 * @param {String} password2
 * @returns {Boolean} Test the equality of `password1` and `password2`
 * @description Returns true if `password` is equal to `password2`
 */
const passwordMatch = (password1, password2) => password1 === password2;

/**
 * @func registerUser
 * @param {*} user User payload
 * @return {undefined}
 * @description Signs up a user represented by `user`
 */
const registerUser = (user) => {
  fetch('http://localhost:9999/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then((res) => {
      if (res.status === 201) {
        const { token } = res.data[0];
        localStorage.setItem('userToken', token);
        window.location.assign('./meetups.html');
      } else {
        console.log(res.error)
        displayFormFeedback(res.error);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

window.onload = () => {
  const userToken = Token.getToken('userToken');
  if (userToken) {
    window.location.assign('./meetups.html');
  } else {
    const
      signUpForm = document.getElementById('sign-up-form'),
      emailField = document.querySelector('input[name=email]'),
      passwordField = document.querySelector('input[name=password]'),
      confirmPasswordField = document.getElementById('c-pwd'),
      lastNameField = document.querySelector('input[name=lastname]'),
      firstNameField = document.querySelector('input[name=firstname]'),
      passwordValidationMsg = document.querySelector('.pwd-validation-msg');

    confirmPasswordField.oninput = () => {
      const originalPassword = passwordField.value.trim();
      const repeatedPassword = confirmPasswordField.value.trim();

      const validationMsg = passwordMatch(originalPassword, repeatedPassword)
        ? 'passwords match'
        : 'passwords do not match';

      passwordValidationMsg.textContent = validationMsg;
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
