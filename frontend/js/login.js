const loginForm = document.getElementById("login-form");
const userFeedback = document.querySelector(".user-input-feedback");
const emailField = document.getElementById("userEmail");
const passwordField = document.getElementById("userPwd");

loginForm.onsubmit = function submitForm(e) {
  e.preventDefault();
  fetch("http://localhost:9999/api/v1/auth/login", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: emailField.value,
      password: passwordField.value
    })
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      if (response.status === 201) {
        window.location.href = "./meetups.html";
      } else {
        userFeedback.textContent = response.error;
      }
    })
    .catch(err => {
      console.log(err);
    });
};
