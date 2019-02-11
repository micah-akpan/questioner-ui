window.addEventListener('load', () => {
  const userToken = Token.getToken('userToken');
  if (userToken) {
    window.location.assign('./pages/meetups.html');
  }
});
