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