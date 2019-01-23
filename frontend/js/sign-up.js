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
      lastNameField = document.querySelector('input[name=lastname]'),
      firstNameField = document.querySelector('input[name=firstname]'),
      userFeedback = document.querySelector('.user-feedback');

    signUpForm.onsubmit = (e) => {

      e.preventDefault();

      const userEmail = emailField.value;
      const userPassword = passwordField.value;
      const lastName = lastNameField.value;
      const firstName = firstNameField.value;

      fetch('http://localhost:9999/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
          firstname: firstName,
          lastname: lastName
        })
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
  }
};
