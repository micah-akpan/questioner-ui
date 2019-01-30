const loginForm = document.getElementById('login-form');
const userFeedback = document.querySelector('.user-input-feedback');
const emailField = document.getElementById('userEmail');
const passwordField = document.getElementById('userPwd');


loginForm.onsubmit = (e) => {
  e.preventDefault();
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
        // store user token in some storage
        const { token, user } = response.data[0];
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', user.id);

        if (user.isadmin) {
          window.location.assign('./admin/meetups.html');
        } else {
          window.location.assign('./meetups.html');
        }
      } else {
        // TODO: Use an aesthetic alert/pop-up here!
        userFeedback.textContent = response.error;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


window.onload = () => {
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    // redirect to meetups page
    window.location.assign('./meetups.html');
  }
};
