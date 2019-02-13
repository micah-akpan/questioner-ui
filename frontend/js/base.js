

/**
 * @class Token
 * @description Contains a collection of token related statics
 */
class Token {
  /**
   * @method setToken
   * @param {String} key
   * @param {String} value
   * @returns {String} Sets token to web storage and
   * returns a confirmation message
   */
  static setToken(key, value) {
    localStorage.setItem(key, value);
    return 'token set';
  }

  /**
   * @method getToken
   * @param {String} key
   * @returns {String} Returns the set token
   */
  static getToken(key) {
    return localStorage.getItem(key);
  }

  /**
   * @method tokenIsValid
   * @param {Number} status
   * @return {Boolean} Returns true if token
   * representing `status` is valid
   */
  static tokenIsValid(status) {
    return status !== 401;
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

const passwordToggleButtons = document.querySelectorAll('.toggle-password-visibility');
const passwordVisible = false;

/**
 * @function getMonth
 * @param {Number} date
 * @returns {String} A string version of date e.g 1 -> Jan
 */
const getMonth = date => numMonthToStr[date];

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

/**
 * @const genericRequestHeader
 * @description Customizable generic request header
 */
const genericRequestHeader = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Token.getToken('userToken')}`
};

/**
 * @func logOutUser
 * @returns {undefined} Logs out the user and redirect to the index page
 */
const logOutUser = () => {
  localStorage.removeItem('userToken');
  window.location.replace('../index.html');
};

/**
 * @func setAttributes
 * @param {Element} elem
 * @param {*} attrs A hash of attributes keys to values
 * @returns {HTMLElement} Returns `elem` with attributes in `attrs` set
 */
const setAttributes = (elem, attrs) => {
  const attrKeys = Object.keys(attrs);
  attrKeys.forEach((key) => {
    elem.setAttribute(key, attrs[key]);
  });
  return elem;
};

/**
 * @func getUserFullName
 * @param {String} firstname
 * @param {*} lastname
 * @returns {String} User's full name
 */
const getUserFullName = (firstname, lastname) => `${firstname} ${lastname}`;

/**
 * @func togglePasswordVisibility
 * @returns {undefined}
 */
const togglePasswordVisibility = () => {
  // adds toggle password functionality
  for (let i = 0; i < passwordToggleButtons.length; i += 1) {
    const toggleButton = passwordToggleButtons[i];
    toggleButton.setAttribute('p-visible', passwordVisible);
    toggleButton.onclick = function toggle() {
      const inputField = this.parentElement.querySelector('input');
      if (inputField.type === 'password') {
        inputField.type = 'text';
        this.textContent = 'hide';
      } else {
        inputField.type = 'password';
        this.textContent = 'show';
      }
    };
  }
};

/**
 * @func getUser
 * @param {Number|String} userId
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

togglePasswordVisibility();
