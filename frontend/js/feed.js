const userId = localStorage.getItem('userId');
const meetupList = document.getElementById('meetups-list');
const feedCards = document.getElementById('feeds-cards');
const meetupTopic = document.getElementById('meetup-topic');

const createQuestionFeedCard = (question) => {
  const { id, body, createdOn } = question;
  const card = document.createElement('div');
  card.classList.add('question-card');
  card.setAttribute('data-target', `question-card-${id}`);
  const questionTitle = document.createElement('p');
  questionTitle.classList.add('question-card__title');
  questionTitle.textContent = body;
  const questioneer = document.createElement('p');
  questioneer.textContent = 'Asked by Bob On';
  const questionDate = document.createElement('span');
  questionDate.classList.add('question-card__date', 'date-asked');
  questionDate.textContent = new Date(createdOn);
  questioneer.appendChild(questionDate);
  card.appendChild(questionTitle);
  card.appendChild(questioneer);
  return card;
};

/**
 * @func toggleUserFeedListItem
 * @param {HTMLElement} list
 * @returns {HTMLUListElement} Returns the feed list
 */
const toggleUserFeedListItem = (list) => {
  const meetupListItems = list.querySelectorAll('li');
  meetupListItems.forEach((listItem) => {
    listItem.onclick = function toggle(e) {
      const meetupId = this.getAttribute('data-target');
      getMeetup(meetupId)
        .then((meetup) => {
          meetupTopic.textContent = meetup.topic;
        }, (err) => {
          throw err;
        });
      for (let i = 0; i < meetupListItems.length; i += 1) {
        const item = meetupListItems[i];
        item.classList.remove('active');
      }

      this.classList.toggle('active');
    };
  });

  return meetupListItems;
};

const stat = new Stat();

const getMeetupsUserHasRsvped = async (currentUserId) => {
  const rsvps = await stat.getMeetupRsvpsForUser(currentUserId);
  const meetupPromises = rsvps.map((rsvp) => {
    const apiUrl = `${baseURL}/meetups/${rsvp.meetup}`;
    return fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${Token.getToken('userToken')}`
      }
    })
      .then(res => res.json())
      .then((res) => {
        const { status, data } = res;
        return status === 200 ? data[0] : [];
      })
      .catch((err) => {
        throw err;
      });
  });

  const meetups = await Promise.all(meetupPromises);
  return meetups;
};

const createTopMeetupFeedList = (meetups) => {
  meetups.forEach((meetup) => {
    const { topic, id } = meetup;
    const feedItem = document.createElement('li');
    feedItem.textContent = topic;
    feedItem.setAttribute('data-target', id);
    feedItem.setAttribute('id', `meetup-${id}`);
    feedItem.classList.add('meetups-list__item');
    meetupList.appendChild(feedItem);
  });

  return meetupList;
};

const addMeetupFeedListToPage = () => getMeetupsUserHasRsvped(userId)
  .then((meetups) => {
    meetupList.innerHTML = '';
    createTopMeetupFeedList(meetups);
    return meetupList;
  })
  .catch((err) => {
    throw err;
  });


const addMeetupTopicToPage = () => {

};
