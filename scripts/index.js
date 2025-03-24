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
  console.log("Opening modal:", modal); // Add this line
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
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
  resetForm(editFormElement, validationConfig);
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
  closeModal(addCardModal);
  resetForm(addCardFormElement, validationConfig);
}

// Initial card rendering
const fragment = document.createDocumentFragment();
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData);
  fragment.appendChild(cardElement);
});
cardsList.prepend(fragment);

// Event listeners
profileEditButton.addEventListener("click", () => {
  console.log("Edit button clicked!"); // Add this line
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetForm(editFormElement, validationConfig);
  openModal(editModal);
});

cardAddButton.addEventListener("click", () => {
  console.log("Add button clicked!"); // Add this line
  resetForm(addCardFormElement, validationConfig);
  openModal(addCardModal);
});

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);

// Select the modal elements
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal__close-btn");

// Function to close the modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

// Add event listeners to close buttons
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose); // Remove listener
}

// Function to handle Escape key press
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Function to open the modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose); // Add listener
}

console.log("editModal:", editModal);
console.log("addCardModal:", addCardModal);
