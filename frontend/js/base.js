/* eslint-disable */

class Token {
  static setToken(key, value) {
    localStorage.setItem(key, value);
  }

  static getToken(key) {
    return localStorage.getItem(key);
  }

  static tokenIsValid(status) {
    if (status === 401) {
      return false;
    }

    return true;
  }
}

/**
 * @const numMonthToStr
 * @description A hash of month ordinal numbers to their short forms
 */
const numMonthToStr = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sept',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
};

/**
 * @function getMonth
 * @param {Number} date
 * @returns {String} A string version of date e.g 1 -> Jan
 */
const getMonth = (date) => {
  return numMonthToStr[date];
}

/**
 * @function parseDate
 * @param {String} date
 * @returns {Array} Returns an array of 2 elements (short form of the month and day)
 */
const parseDate = (date) => {
  const currentDate = new Date(date);
  const month = currentDate.getMonth();
  const monthShortForm = getMonth(month + 1);
  const day = currentDate.getDate();

  return [monthShortForm, day];
};


const genericRequestHeader = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Token.getToken('userToken')}`
};

const logOutUser = () => {
  localStorage.removeItem('userToken');
  window.location.replace('../index.html');
};


const setAttributes = (el, attrs) => {
  const attrKeys = Object.keys(attrs);
  attrKeys.forEach((key) => {
    el.setAttribute(key, attrs[key]);
  });
  return el;
}

const getUserFullName = (firstname, lastname) => `${firstname} ${lastname}`;