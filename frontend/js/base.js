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

const pToggleBtns = document.querySelectorAll('.toggle-password-visibility');
const passwordVisible = false;

// adds toggle password functionality
for (let i = 0; i < pToggleBtns.length; i++) {
  const toggleBtn = pToggleBtns[i];
  toggleBtn.setAttribute('p-visible', passwordVisible);
  toggleBtn.onclick = function () {
    const inputEl = this.parentElement.querySelector('input');

    if (inputEl.type === 'password') {
      inputEl.type = 'text';
      this.textContent = 'hide';
    } else {
      inputEl.type = 'password';
      this.textContent = 'show';
    }
  };
}

const matchPasswords = (val1, value2) => {};

/**
 * @func getUser
 * @returns {*} Returns a user payload
 */
const getUser = async (userId) => {
  try {
    const apiUrl = `${apiBaseURL}/users/${userId}`;
    const response = await fetch(apiUrl, requestHeader);
    const responseBody = await response.json();
    return responseBody.status === 200 ? responseBody.data[0] : null;
  } catch (e) {
    throw e;
  }
};