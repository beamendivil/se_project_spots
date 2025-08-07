import { enableValidation, resetForm, clearValidation } from "./validation.js";
import "../pages/index.css";
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Enable form validation
enableValidation(validationConfig);

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardAddButton = document.querySelector(".profile__add-btn");

const editModal = document.querySelector("#edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const previewModal = document.querySelector("#preview-modal");

const editFormElement = document.querySelector("#edit-modal .modal__form");
const addCardFormElement = document.querySelector(
  "#add-card-modal .modal__form"
);

const editModalNameInput = editFormElement.querySelector("#profile-name-input");
const editModalDescriptionInput = editFormElement.querySelector(
  "#profile-description-input"
);
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const cardModalNameInput = addCardFormElement.querySelector(
  "#add-card-name-input"
);
const cardModalLinkInput = addCardFormElement.querySelector(
  "#add-card-link-input"
);

const editModalCloseBtn = document.querySelector(
  "#edit-modal .modal__close-btn"
);
const addCardModalCloseBtn = document.querySelector(
  "#add-card-modal .modal__close-btn"
);
const previewModalExitButton = document.querySelector(
  ".modal__close-btn_type_preview"
);

const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const cardImageSelector = ".card__image";
const cardTitleSelector = ".card__title";
const cardLikeBtnSelector = ".card__like-btn";
const cardDeleteBtnSelector = ".card__delete-btn";

function createCard({ name, link }) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(cardImageSelector);
  const cardTitle = cardElement.querySelector(cardTitleSelector);
  const cardLikeBtn = cardElement.querySelector(cardLikeBtnSelector);
  const cardDeleteBtn = cardElement.querySelector(cardDeleteBtnSelector);

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = link;
    previewImage.alt = name;
    previewCaption.textContent = name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const name = editModalNameInput.value.trim();
  const description = editModalDescriptionInput.value.trim();

  if (name === "" || description === "") {
    alert("Both name and description must be filled out.");
    return;
  }

  profileName.textContent = name;
  profileDescription.textContent = description;
  closeModal(editModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const name = cardModalNameInput.value.trim();
  const link = cardModalLinkInput.value.trim();

  if (name === "" || link === "") {
    alert("Both name and link must be filled out.");
    return;
  }

  const newCardData = { name, link };
  const newCardElement = createCard(newCardData);
  cardsList.prepend(newCardElement);
  addCardFormElement.reset();
  resetForm(addCardFormElement, validationConfig);
  closeModal(addCardModal);
}

// Initial card rendering
const fragment = document.createDocumentFragment();
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData);
  fragment.appendChild(cardElement);
});
cardsList.prepend(fragment);

profileEditButton.addEventListener("click", () => {
  clearValidation(editFormElement, validationConfig);

  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  openModal(editModal);
});

cardAddButton.addEventListener("click", () => {
  resetForm(addCardFormElement, validationConfig);
  openModal(addCardModal);
});

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);

// Select the modal elements
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal__close-btn");

// Add event listeners to close buttons
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

// Add event listener to close modal when clicking on the overlay
modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});
