/**
 * @module meetups
 * @description Contains logic specific to the non-admin
 * meetups list page
 */

let intervalId;

/**
 * @func showAllMeetups
 * @returns {undefined} Displays all meetups on the page
 */
const showAllMeetups = () => {
  showMeetupsSpinner();
  fetchAndAddMeetupsToPage()
    .then((message) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    })
    .catch((err) => {
      // There was probably an internet connection problem
      // or some other network problem
      intervalId = setInterval(() => {
        fetchAndAddMeetupsToPage()
          .then((message) => {
            if (intervalId) {
              clearInterval(intervalId);
            }
          })
          .catch((err) => {

          });
      }, 5000);
    });
};

const getAllButton = document.getElementById('meetups-search-type-list__item-all');

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
