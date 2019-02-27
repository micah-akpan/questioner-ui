/* eslint-disable class-methods-use-this */

/**
 * @class Stat
 * @description A class about a user stats information
 */
class Stat {
  /**
   * @constructor
   */
  constructor() {
    this.baseUrl = 'http://localhost:9999/api/v1';
    this._userId = localStorage.getItem('userId');
    this._statRequestHeader = {
      Authorization: `Bearer ${Token.getToken('userToken')}`
    };
    this._questionStatsBlock = document.getElementById('user-statistics__total-questions');
    this._questionStatsValue = document.getElementById('questions-stat__value');
    this._commentStatsValue = document.getElementById('comments-stat__value');
    this._meetupRsvpStatsValue = document.getElementById('meetup-rsvp-state__value');
  }

  /**
   * @method getQuestionsByUser
   * @param {String} userId
   * @returns {Promise<Array>} Resolves to an array of questions
   * asked by the user with id `userId`
   */
  getQuestionsByUser(userId) {
    return fetch(`${this.baseUrl}/questions`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Token.getToken('userToken')}`
      }
    })
      .then(response => response.json())
      .then((responseBody) => {
        const { status, data } = responseBody;
        if (status === 200) {
          const questions = data.filter(question => question.user === userId * 1);

          return questions;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * @method getQuestionStat
   * @param {String} userId
   * @returns {Promise<Number>} Resolves to the total number of questions
   * asked by this user
   */
  getQuestionStat(userId) {
    return this.getQuestionsByUser(userId)
      .then(questions => questions.length)
      .catch((err) => {
        throw err;
      });
  }

  /**
   * @method getCommentStat
   * @param {String} userId
   * @returns {Promise<Number>} Resolves to the total number of
   * comments posted in each question in each meetup group
   */
  async getCommentStat(userId) {
    try {
      const meetupResults = await getMeetups();
      const meetupsIds = meetupResults.data.map(meetup => meetup.id);

      const allQuestionsPromises = meetupsIds.map((id) => {
        const apiUrl = `${this.baseUrl}/meetups/${id}/questions`;
        return fetch(apiUrl, { headers: this._statRequestHeader })
          .then(response => response.json())
          .then((responseBody) => {
            const { status, data } = responseBody;
            return status === 200 ? data : [];
          })
          .catch((err) => {
            throw err;
          });
      });

      const allQuestions = await Promise.all(allQuestionsPromises);
      const questions = allQuestions.reduce((prevArr, currArr) => prevArr.concat(currArr), []);
      const questionIds = questions.map(question => question.id);

      const commentsPromises = questionIds.map((id) => {
        const apiUrl = `${this.baseUrl}/questions/${id}/comments`;
        return fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
          .then(res => res.json())
          .then((res) => {
            const { status, data } = res;
            return status === 200 ? data : [];
          })
          .catch((err) => {
            throw err;
          });
      });

      const allComments = await Promise.all(commentsPromises);
      const comments = allComments.reduce((prevArr, currArr) => prevArr.concat(currArr), []);
      const commentsByUser = comments.filter(comment => comment.createdBy === Number(userId));
      return commentsByUser.length;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method getMeetupRsvpsForUser
   * @param {String|Number} userId
   * @returns {Promise<Array>} Resolves to an array of meetups user `userId` has rsvped for
   */
  async getMeetupRsvpsForUser(userId) {
    const meetups = await getMeetups();
    const meetupIds = meetups.data.map(meetup => meetup.id);
    const allRsvpsPromises = meetupIds.map((id) => {
      const apiUrl = `${this.baseUrl}/meetups/${id}/rsvps`;
      return fetch(apiUrl, { headers: this._statRequestHeader })
        .then(response => response.json())
        .then((responseBody) => {
          const { status, data } = responseBody;
          return status === 200 ? data : [];
        })
        .catch((err) => {
          throw err;
        });
    });

    const allRsvps = await Promise.all(allRsvpsPromises);
    const rsvps = allRsvps.reduce((prevArr, currArr) => prevArr.concat(currArr), []);
    const rsvpsByUser = rsvps.filter(rsvp => rsvp.user === userId * 1 && (rsvp.response === 'yes' || rsvp.response === 'maybe'));

    return rsvpsByUser;
  }

  /**
   * @method getMeetupRsvpStats
   * @param {String} userId
   * @returns {Promise<Number>} Resolve to the total number of
   * meetups the user is scheduled to attend
   */
  async getMeetupRsvpStats(userId) {
    return this.getMeetupRsvpsForUser(userId)
      .then(rsvps => rsvps.length)
      .catch((err) => {
        throw err;
      });
  }

  /**
   * @method addStatToPage
   * @param {HTMLElement} el
   * @param {Number} stat
   * @returns {HTMLElement} Returns the block for each stat
   * @description Adds `stat` to their respective position
   * on the page and returns the element
   */
  addStatToPage(el, stat) {
    el.textContent = stat;
    return el;
  }

  /**
   * @method addStatsToPage
   * @returns {undefined}
   * @description Adds all stats to page
   */
  addStatsToPage() {
    Promise.all([
      this.getQuestionStat(this._userId),
      this.getCommentStat(this._userId),
      this.getMeetupRsvpStats(this._userId)
    ])
      .then((stats) => {
        const [questionStat = 0, commentStat = 0, rsvpStat = 0] = stats;
        this.addStatToPage(this._questionStatsValue, questionStat);
        this.addStatToPage(this._commentStatsValue, commentStat);
        this.addStatToPage(this._meetupRsvpStatsValue, rsvpStat);
      })
      .catch((err) => {
        this.addStatToPage(this._questionStatsValue, 0);
        this.addStatToPage(this._commentStatsValue, 0);
        this.addStatToPage(this._meetupRsvpStatsValue, 0);
      });
  }
}

const userStat = new Stat();
userStat.addStatsToPage();
