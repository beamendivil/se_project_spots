export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((form) => {
    setEventListeners(form, config);
  });
}

export function setEventListeners(form, config) {
  const inputList = Array.from(form.querySelectorAll(config.inputSelector));
  const buttonElement = form.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(form, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

function checkInputValidity(form, inputElement, config) {
  if (!inputElement.validity.valid) {
    showInputError(form, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(form, inputElement, config);
  }
}

function showInputError(form, inputElement, errorMessage, config) {
  const errorElement = form.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
    inputElement.classList.add(config.inputErrorClass); // Add input error class
  }
}

function hideInputError(form, inputElement, config) {
  const errorElement = form.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove(config.errorClass);
    inputElement.classList.remove(config.inputErrorClass); // Remove input error class
  }
}

function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

export function clearValidation(form, config) {
  const inputList = Array.from(form.querySelectorAll(config.inputSelector));
  const buttonElement = form.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(form, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}

export function resetForm(form, config) {
  clearValidation(form, config);
  form.reset();
}
