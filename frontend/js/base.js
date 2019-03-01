const apiBaseURL = 'http://localhost:9999/api/v1';
const userAuthToken = localStorage.getItem('userToken');
const currentUserId = localStorage.getItem('userId');

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
const getMonth = date => numMonthToStr[date + 1];

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
    const response = await fetch(apiUrl, {
      headers: genericRequestHeader
    });
    const responseBody = await response.json();
    return responseBody.status === 200 ? responseBody.data[0] : null;
  } catch (e) {
    throw e;
  }
};

/**
 * @func createSpinner
 * @param {Array<String>} classNames
 * @returns {HTMLDivElement} Returns a spinner UI
 */
const createSpinner = (classNames) => {
  const spinner = document.createElement('div');
  spinner.classList.add(...classNames);
  return spinner;
};

/**
 * @func showMeetupsSpinner
 * @returns {HTMLElement} Returns cards wrapper element
 * @description Displays meetup loading spinner
 */
const showMeetupsSpinner = () => {
  const cards = document.querySelector('.cards');
  const spinner = createSpinner(['spinner', 'meetups-spinner']);
  cards.appendChild(spinner);
  return cards;
};

/**
 * @func hideMeetupsSpinner
 * @returns {HTMLElement} Hides spinner UI
 */
const hideMeetupsSpinner = () => {
  const spinner = document.querySelector('.spinner');
  spinner.classList.add('hidden');
  return spinner;
};

togglePasswordVisibility();

/**
 * @func tokenIsValid
 * @param {String} token
 * @returns {Promise<Boolean>} Returns true if `token` is valid, false otherwise
 */
const tokenIsValid = token => fetch('http://localhost:9999/api/v1/meetups', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then((res) => {
    if (!res.ok) {
      if (res.status === 401) {
        return false;
      }
      return true;
    }
    return true;
  })
  .catch((err) => {
    throw err;
  });

/**
 * @func userIsAdmin
 * @param {*} user
 * @returns {Boolean} Returns true if user is admin, false otherwise
 */
const userIsAdmin = user => user.isAdmin;
