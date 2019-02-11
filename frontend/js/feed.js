(() => {
  const d = document;
  const meetupList = d.getElementById('meetups-list');
  const meetupListItems = d.querySelectorAll('.meetups-list li');

  meetupListItems.forEach((listItem) => {
    listItem.onclick = function toggle(e) {
      for (let i = 0; i < meetupListItems.length; i += 1) {
        const item = meetupListItems[i];
        item.removeAttribute('class');
      }

      this.classList.toggle('active');
    };
  });
})();
