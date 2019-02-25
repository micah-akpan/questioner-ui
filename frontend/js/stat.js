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
      const totalComments = [];
      const allQuestions = await this.getQuestionsByUser(userId);
      const questionIds = allQuestions.map(question => question.id);

      const init = {
        headers: {
          Authorization: `Bearer ${Token.getToken('userToken')}`
        }
      };
      /* eslint-disable */
      const allPromises = questionIds.map((questionId) => {
        return fetch(`${this.baseUrl}/questions/${questionId}/comments`, init)
          .then(response => response.json())
          .then((responseBody) => {
            const { status, data } = responseBody;
            return status === 200 ? data : [];
          })
          .catch((err) => {
            throw err;
          })
      });

      Promise.all(allPromises)
        .then((results) => {
          // all comments results
          const o = results.forEach((result) => {
            console.log(Array.isArray(result))
          })
          console.log(o)
        })
        .catch((err) => {
          console.log(err);
        })
      for (let id of questionIds) {
        const response = await fetch(`${this.baseUrl}/questions/${id}/comments`, {
          headers: {
            Authorization: `Bearer ${Token.getToken('userToken')}`
          }
        });
        const { status, data } = await response.json();
        if (status === 200) {
          totalComments.push(data[0])
          console.log(totalComments)
        }
        const userComments = totalComments.filter(comment => comment.createdBy === Number(userId));
        return userComments.length;
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method getMeetupRsvpStats
   * @param {String} userId
   * @returns {Promise<Number>} Resolve to the total number of
   * meetups the user is scheduled to attend
   */
  async getMeetupRsvpStats(userId) {
    const meetups = await getMeetups();
    const meetupIds = meetups.data.map(meetup => meetup.id);
    const allRsvps = [];
    for (let id of meetupIds) {
      const rsvps = await getMeetupRsvps({ id });
      allRsvps.push(rsvps[0]);
    }

    const userRsvps = allRsvps.filter((rsvp) => rsvp !== undefined && rsvp.user === userId * 1);
    return userRsvps.length;
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
        const [questionStat, commentStat, rsvpStat] = stats;
        this.addStatToPage(this._questionStatsValue, questionStat);
        this.addStatToPage(this._commentStatsValue, commentStat);
        this.addStatToPage(this._meetupRsvpStatsValue, rsvpStat);
      })
      .catch((err) => {
        this.addStatToPage(this._questionStatsValue, 0);
        this.addStatToPage(this._commentStatsValue, 0);
        this.addStatToPage(this._meetupRsvpStatsValue, 0);
      })
  }
}

const userStat = new Stat();
userStat.addStatsToPage();
