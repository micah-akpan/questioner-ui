window.addEventListener('load', () => {
  const userToken = localStorage.getItem('userToken');
  if (userToken.trim()) {
    window.location.href = './pages/meetups.html';
  } else {
    window.location.href = '/pages/sign-in.html';
  }
});
