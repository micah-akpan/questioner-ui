
const meetupList = document.getElementById('meetups-list');
const meetupListItems = document.querySelectorAll('.meetups-list > li');

/**
 * @func toggleUserFeedListItem
 * @returns {HTMLUListElement} Returns the feed list
 */
const toggleUserFeedListItem = () => {
  meetupListItems.forEach((listItem) => {
    listItem.onclick = function toggle(e) {
      for (let i = 0; i < meetupListItems.length; i += 1) {
        const item = meetupListItems[i];
        item.removeAttribute('class');
      }

      this.classList.toggle('active');
    };
  });

  return meetupListItems;
};


const getMeetupUserHasRsvped = () => {
  // get meetups rsvps
  // for each meetup, check if user has rsvped on it
  // if user has populate x
};
