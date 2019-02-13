

/**
 * @func hideModal
 * @param {HTMLElement} modal
 * @returns {HTMLElement} Returns the `modal` HTML element
 */
const hideModal = (modal) => {
  modal.classList.remove('enabled');
  modal.classList.add('disabled');
  return modal;
};

/**
 * @func showModal
 * @param {HTMLElement} modal
 * @returns {HTMLElement} Returns the `modal` HTML element
 */
const showModal = (modal) => {
  modal.classList.remove('disabled');
  modal.classList.add('enabled');
  return modal;
};
