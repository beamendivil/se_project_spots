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

const editFormElement = editModal.querySelector(".modal__form");
const addCardFormElement = addCardModal.querySelector(".modal__form");

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

function createCard({ name, link }) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

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
    const previewImage = previewModal.querySelector(".modal__image");
    const previewCaption = previewModal.querySelector(".modal__caption");
    previewImage.src = link;
    previewImage.alt = name;
    previewCaption.textContent = name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardModalNameInput.value,
    link: cardModalLinkInput.value,
  };
  const newCardElement = createCard(newCardData);
  cardsList.prepend(newCardElement);
  closeModal(addCardModal);
  addCardFormElement.reset();
}

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData);
  cardsList.prepend(cardElement);
});

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardAddButton.addEventListener("click", () => {
  openModal(addCardModal);
});

addCardModalCloseBtn.addEventListener("click", () => {
  closeModal(addCardModal);
});

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

previewModalExitButton.addEventListener("click", () => {
  closeModal(previewModal);
});
