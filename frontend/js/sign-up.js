window.onload = () => {
  /* eslint-disable */
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    window.location.href = './meetups.html';
  } else {
    const
      signUpForm = document.getElementById('sign-up-form'),
      emailField = document.querySelector('input[name=email]'),
      passwordField = document.querySelector('input[name=password]'),
      confirmPasswordField = document.getElementById('c-pwd'),
      lastNameField = document.querySelector('input[name=lastname]'),
      firstNameField = document.querySelector('input[name=firstname]'),
      userFeedback = document.querySelector('.user-feedback'),
      passwordValidationMsg = document.querySelector('.pwd-validation-msg');


    confirmPasswordField.oninput = () => {
      const originalPassword = passwordField.value.trim();
      const repeatedPassword = confirmPasswordField.value.trim();

      const validationMsg = passwordMatch(originalPassword, repeatedPassword)
        ? 'passwords match'
        : 'passwords do not match';

      passwordValidationMsg.textContent = validationMsg;
    }

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
    }
  }
};

/**
 * @func registerUser
 * @param {*} user User payload
 * @return {*}
 * @description Signs up a user represented by `user`
 */
function registerUser(user) {
  fetch('http://localhost:9999/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(user)
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 201) {
        const { token } = res.data[0];
        localStorage.setItem('userToken', token);

        window.location.href = './meetups.html';
      } else {
        userFeedback.textContent = res.error;
      }
    })
    .catch((err) => {
      // handle error
    })
}

/**
 * 
 */
function passwordMatch(password1,password2) {
  return password1 === password2;
}