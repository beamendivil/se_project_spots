import { enableValidation, resetForm, clearValidation } from "./validation.js";
import Api from "./api.js";
import { API_CONFIG, ERROR_MESSAGES } from "./config.js";
import "../pages/index.css";

// Constants and Selectors
const SELECTORS = {
  cardsList: ".cards__list",
  cardTemplate: "#card-template",
  card: ".card",
  cardImage: ".card__image",
  cardTitle: ".card__title",
  cardLikeBtn: ".card__like-btn",
  cardDeleteBtn: ".card__delete-btn",
  profileEditBtn: ".profile__edit-btn",
  profileAddBtn: ".profile__add-btn",
  profileName: ".profile__name",
  profileDescription: ".profile__description",
  profileAvatar: ".profile__avatar",
  profileAvatarEditBtn: ".profile__avatar-edit-btn",
  modalOpened: ".modal_opened",
  modalSubmitBtn: ".modal__submit-btn",
  modalCancelBtn: ".modal__cancel-btn",
  modals: {
    edit: "#edit-modal",
    addCard: "#add-card-modal",
    preview: "#preview-modal",
    avatar: "#avatar-modal",
    confirm: "#confirm-modal",
  },
  inputs: {
    profileName: "#profile-name-input",
    profileDescription: "#profile-description-input",
    cardName: "#add-card-name-input",
    cardLink: "#add-card-link-input",
    avatarLink: "#avatar-link-input",
  },
  closeButtons: ".modal__close-btn",
  previewCloseBtn: ".modal__close-btn_type_preview",
  modalImage: ".modal__image",
  modalCaption: ".modal__caption",
};

const BUTTON_TEXT = {
  saving: "Saving...",
  save: "Save",
  creating: "Creating...",
  create: "Create",
  deleting: "Deleting...",
  delete: "Yes",
};

// Initialize API
const api = new Api(API_CONFIG);
// Keep initial cards as fallback
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

// Utility functions for loading states and error handling
function renderLoading(
  isLoading,
  button,
  loadingText = BUTTON_TEXT.saving,
  defaultText = BUTTON_TEXT.save
) {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}

function handleError(error) {
  console.error("API Error:", error);

  // More specific error handling based on status code
  if (error.status) {
    switch (error.status) {
      case 400:
        alert(ERROR_MESSAGES.VALIDATION_ERROR);
        break;
      case 401:
        alert(ERROR_MESSAGES.AUTH_ERROR);
        break;
      case 404:
        alert("Resource not found.");
        break;
      case 500:
        alert(ERROR_MESSAGES.SERVER_ERROR);
        break;
      default:
        alert(error.message || ERROR_MESSAGES.SERVER_ERROR);
    }
  } else {
    alert(ERROR_MESSAGES.NETWORK_ERROR);
  }
}

// Utility function to get DOM elements safely
function getElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
  }
  return element;
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

// DOM Elements
const cardsList = getElement(SELECTORS.cardsList);
const cardTemplate = getElement(SELECTORS.cardTemplate)?.content.querySelector(
  SELECTORS.card
);

const profileEditButton = getElement(SELECTORS.profileEditBtn);
const cardAddButton = getElement(SELECTORS.profileAddBtn);
const profileAvatarEditButton = getElement(SELECTORS.profileAvatarEditBtn);

const editModal = getElement(SELECTORS.modals.edit);
const addCardModal = getElement(SELECTORS.modals.addCard);
const previewModal = getElement(SELECTORS.modals.preview);
const avatarModal = getElement(SELECTORS.modals.avatar);
const confirmModal = getElement(SELECTORS.modals.confirm);

const editFormElement = getElement(`${SELECTORS.modals.edit} .modal__form`);
const addCardFormElement = getElement(
  `${SELECTORS.modals.addCard} .modal__form`
);
const avatarFormElement = getElement(`${SELECTORS.modals.avatar} .modal__form`);

const editModalNameInput = editFormElement?.querySelector(
  SELECTORS.inputs.profileName
);
const editModalDescriptionInput = editFormElement?.querySelector(
  SELECTORS.inputs.profileDescription
);
const profileName = getElement(SELECTORS.profileName);
const profileDescription = getElement(SELECTORS.profileDescription);
const profileAvatar = getElement(SELECTORS.profileAvatar);

const cardModalNameInput = addCardFormElement?.querySelector(
  SELECTORS.inputs.cardName
);
const cardModalLinkInput = addCardFormElement?.querySelector(
  SELECTORS.inputs.cardLink
);
const avatarModalLinkInput = avatarFormElement?.querySelector(
  SELECTORS.inputs.avatarLink
);

const previewImage = previewModal?.querySelector(SELECTORS.modalImage);
const previewCaption = previewModal?.querySelector(SELECTORS.modalCaption);

// Card event handlers
function handleCardLike(cardData, cardLikeBtn) {
  const isCurrentlyLiked = cardLikeBtn.classList.contains(
    "card__like-btn_liked"
  );

  api
    .changeLikeCardStatus(cardData._id, isCurrentlyLiked)
    .then((updatedCard) => {
      cardLikeBtn.classList.toggle("card__like-btn_liked");
      cardData.isLiked = updatedCard.isLiked;
    })
    .catch(handleError);
}

function handleCardDelete(cardData, cardElement) {
  pendingCardDelete = { cardData, cardElement };
  openModal(confirmModal);
}

function handleConfirmDelete() {
  if (!pendingCardDelete) return;

  const { cardData, cardElement } = pendingCardDelete;
  const submitButton = confirmModal.querySelector(SELECTORS.modalSubmitBtn);

  renderLoading(true, submitButton, BUTTON_TEXT.deleting, BUTTON_TEXT.delete);

  api
    .deleteCard(cardData._id)
    .then(() => {
      cardElement.remove();
      closeModal(confirmModal);
      pendingCardDelete = null;
    })
    .catch(handleError)
    .finally(() => {
      renderLoading(
        false,
        submitButton,
        BUTTON_TEXT.deleting,
        BUTTON_TEXT.delete
      );
    });
}

function handleImagePreview(cardData) {
  previewImage.src = cardData.link;
  previewImage.alt = cardData.name;
  previewCaption.textContent = cardData.name;
  openModal(previewModal);
}

function createCard(cardData, currentUserId) {
  console.log("Creating card with data:", cardData); // Debug log
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(SELECTORS.cardImage);
  const cardTitle = cardElement.querySelector(SELECTORS.cardTitle);
  const cardLikeBtn = cardElement.querySelector(SELECTORS.cardLikeBtn);
  const cardDeleteBtn = cardElement.querySelector(SELECTORS.cardDeleteBtn);

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  console.log("Setting image src to:", cardData.link); // Debug log

  // Set initial like state
  if (cardData.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  // Event listeners
  cardLikeBtn.addEventListener("click", () =>
    handleCardLike(cardData, cardLikeBtn)
  );
  cardDeleteBtn.addEventListener("click", () =>
    handleCardDelete(cardData, cardElement)
  );
  cardImage.addEventListener("click", () => handleImagePreview(cardData));

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
  const submitButton = evt.target.querySelector(SELECTORS.modalSubmitBtn);
  const name = editModalNameInput.value.trim();
  const description = editModalDescriptionInput.value.trim();

  if (name === "" || description === "") {
    alert("Both name and description must be filled out.");
    return;
  }

  renderLoading(true, submitButton);

  api
    .updateUserInfo({ name, about: description })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      currentUser = userData; // Update global user data
      closeModal(editModal);
    })
    .catch(handleError)
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(SELECTORS.modalSubmitBtn);
  const name = cardModalNameInput.value.trim();
  const link = cardModalLinkInput.value.trim();

  if (name === "" || link === "") {
    alert("Both name and link must be filled out.");
    return;
  }

  renderLoading(true, submitButton, BUTTON_TEXT.creating, BUTTON_TEXT.create);

  api
    .addCard({ name, link })
    .then((newCard) => {
      console.log("New card received from API:", newCard); // Debug log
      const newCardElement = createCard(newCard, currentUser._id);
      cardsList.prepend(newCardElement);
      addCardFormElement.reset();
      resetForm(addCardFormElement, validationConfig);
      closeModal(addCardModal);
    })
    .catch(handleError)
    .finally(() => {
      renderLoading(
        false,
        submitButton,
        BUTTON_TEXT.creating,
        BUTTON_TEXT.create
      );
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(SELECTORS.modalSubmitBtn);
  const avatar = avatarModalLinkInput.value.trim();

  if (avatar === "") {
    alert("Avatar link must be filled out.");
    return;
  }

  renderLoading(true, submitButton);

  api
    .updateAvatar({ avatar })
    .then((userData) => {
      setProfileAvatar(userData.avatar, userData.name || "User Avatar");
      currentUser = userData; // Update global user data
      avatarFormElement.reset();
      resetForm(avatarFormElement, validationConfig);
      closeModal(avatarModal);
    })
    .catch(handleError)
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

// Global variable to store current user data
let currentUser = null;
// Global variables for pending actions
let pendingCardDelete = null;

// Utility function to set avatar safely
function setProfileAvatar(avatarUrl, altText = "User Avatar") {
  if (!profileAvatar) {
    console.warn("profileAvatar element not found");
    return;
  }

  // Ensure we have a valid URL
  if (!avatarUrl || avatarUrl.trim() === "") {
    console.log("No avatar URL provided, keeping current avatar");
    return;
  }

  // Normalize the URLs for comparison (handle relative paths)
  const currentSrc = profileAvatar.src;
  const newUrl = avatarUrl.startsWith("./") ? avatarUrl : "./" + avatarUrl;

  console.log("Current avatar src:", currentSrc);
  console.log("New avatar URL:", avatarUrl);

  // Only set if we have a valid URL and it's different from current
  if (avatarUrl !== currentSrc && !currentSrc.endsWith(avatarUrl)) {
    console.log("Setting avatar to:", avatarUrl);
    profileAvatar.src = avatarUrl;
    profileAvatar.alt = altText;

    // Add error handling for avatar loading
    profileAvatar.onerror = function () {
      console.warn("Avatar failed to load, using fallback");
      this.src = "images/avatar.jpg";
      this.alt = "Default Avatar";
      this.onerror = null; // Prevent infinite loop
    };
  } else {
    console.log("Avatar already set to this URL, skipping");
  }
}

// Initialize the application
function initializeApp() {
  // Don't set default avatar here since it's already in HTML
  console.log("Initializing app...");

  // Load user profile and cards from API
  api
    .getAppInfo()
    .then(([userData, cardsData]) => {
      console.log("User data received:", userData); // Debug log      // Store current user data
      currentUser = userData;

      // Update profile information
      profileName.textContent = userData.name || "User Name";
      profileDescription.textContent = userData.about || "User Description";

      // Update avatar using the centralized function (only if user has a real custom avatar)
      // Ignore placeholder avatars from practicum-content
      if (
        userData.avatar &&
        !userData.avatar.includes("practicum-content.s3.amazonaws.com")
      ) {
        setProfileAvatar(userData.avatar, userData.name || "User Avatar");
      } else {
        console.log(
          "Using default avatar (no custom avatar or placeholder detected)"
        );
      }

      // Render cards
      renderCards(cardsData);
    })
    .catch((error) => {
      console.error("Failed to initialize app:", error);

      // Fallback: set default avatar and profile info
      setProfileAvatar("./images/avatar.jpg", "Default Avatar");
      profileName.textContent = "User Name";
      profileDescription.textContent = "User Description";

      // Fallback to local data
      renderCards(initialCards);
    });
}

// Function to render cards
function renderCards(cardsData) {
  const fragment = document.createDocumentFragment();

  cardsData.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      currentUser ? currentUser._id : null
    );
    fragment.appendChild(cardElement);
  });

  cardsList.innerHTML = ""; // Clear existing cards
  cardsList.appendChild(fragment);
}

// Initial card rendering - replace with API initialization
// const fragment = document.createDocumentFragment();
// initialCards.forEach((cardData) => {
//   const cardElement = createCard(cardData);
//   fragment.appendChild(cardElement);
// });
// cardsList.prepend(fragment);

// Initialize the app
initializeApp();

// Event listeners setup
function setupEventListeners() {
  // Form submissions
  addCardFormElement?.addEventListener("submit", handleAddCardSubmit);
  editFormElement?.addEventListener("submit", handleEditFormSubmit);
  avatarFormElement?.addEventListener("submit", handleAvatarSubmit);

  // Confirmation modal
  const confirmButton = confirmModal?.querySelector(SELECTORS.modalSubmitBtn);
  const cancelButton = confirmModal?.querySelector(SELECTORS.modalCancelBtn);

  confirmButton?.addEventListener("click", handleConfirmDelete);
  cancelButton?.addEventListener("click", () => {
    closeModal(confirmModal);
    pendingCardDelete = null;
  });

  // Button clicks
  profileEditButton?.addEventListener("click", () => {
    clearValidation(editFormElement, validationConfig);

    if (currentUser) {
      editModalNameInput.value = currentUser.name;
      editModalDescriptionInput.value = currentUser.about || "";
    } else {
      editModalNameInput.value = profileName.textContent;
      editModalDescriptionInput.value = profileDescription.textContent;
    }

    openModal(editModal);
  });

  cardAddButton?.addEventListener("click", () => {
    resetForm(addCardFormElement, validationConfig);
    openModal(addCardModal);
  });

  profileAvatarEditButton?.addEventListener("click", () => {
    resetForm(avatarFormElement, validationConfig);
    openModal(avatarModal);
  });

  // Modal close buttons
  const closeButtons = document.querySelectorAll(SELECTORS.closeButtons);
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      closeModal(modal);

      // Clear pending actions when closing confirmation modal
      if (modal === confirmModal) {
        pendingCardDelete = null;
      }
    });
  });

  // Modal overlay clicks
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);

        // Clear pending actions when closing confirmation modal
        if (modal === confirmModal) {
          pendingCardDelete = null;
        }
      }
    });
  });
}

// Initialize the app
initializeApp();
setupEventListeners();
