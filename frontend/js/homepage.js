window.addEventListener('load', () => {
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    window.location.href = './pages/meetups.html';
  }
});
