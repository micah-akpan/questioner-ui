/**
 * @module
 * @description Admin meetups list view
 */

window.onload = () => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    window.location.href = './pages/sign-in.html';
  }
};
