/**
 * @func showAllMeetups
 * @returns {undefined} Displays all meetups on the page
 */
const showAllMeetups = () => {
  getMeetups().then((res) => {
    if (tokenIsValid(res)) {
      const { status, data } = res;
      if (status === 200) {
        const meetups = data;
        const MAX_MEETUPS = 6;
        if (meetups.length > MAX_MEETUPS) {
          const meetupsToBeDisplayed = meetups.slice(0, MAX_MEETUPS);
          addMeetupsToPage(meetupsToBeDisplayed);
          const remainingMeetups = meetups.length - MAX_MEETUPS;
          const paginateText = `SEE MORE ${remainingMeetups} ${remainingMeetups > 1 ? 'MEETUPS' : 'MEETUP'}`;
          meetupCardsWrapper.appendChild(createPaginationButton(paginateText));
        } else {
          addMeetupsToPage(meetups);
        }
      }
    } else {
      localStorage.removeItem('userToken');
      window.location.assign('./sign-in.html');
    }
  });
};

addProfileAvatarToNav('../assets/icons/avatar1.svg');

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchBar.classList.remove('show');
  }
});

window.addEventListener('load', () => {
  if (!userToken) {
    window.location.assign('./sign-in.html');
  } else {
    showAllMeetups(userToken);
  }
});
