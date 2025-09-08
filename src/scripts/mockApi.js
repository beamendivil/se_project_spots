// Mock API for demonstration purposes
class MockApi {
  constructor() {
    this.mockUser = {
      _id: "demo-user-123",
      name: "Demo User",
      about: "Demo Description",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    };

    this.mockCards = [
      {
        _id: "card-1",
        name: "Beautiful Mountain",
        link: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        owner: "demo-user-123",
        isLiked: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "card-2",
        name: "City Skyline",
        link: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop",
        owner: "demo-user-123",
        isLiked: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // Simulate API delay
  _delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getUserInfo() {
    await this._delay();
    return Promise.resolve(this.mockUser);
  }

  async getInitialCards() {
    await this._delay();
    return Promise.resolve([...this.mockCards]);
  }

  async getAppInfo() {
    await this._delay();
    return Promise.resolve([this.mockUser, [...this.mockCards]]);
  }

  async updateUserInfo(data) {
    await this._delay();
    this.mockUser = { ...this.mockUser, ...data };
    return Promise.resolve(this.mockUser);
  }

  async updateAvatar(data) {
    await this._delay();
    this.mockUser.avatar = data.avatar;
    return Promise.resolve(this.mockUser);
  }

  async addCard(data) {
    await this._delay();
    const newCard = {
      _id: `card-${Date.now()}`,
      name: data.name,
      link: data.link,
      owner: this.mockUser._id,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    this.mockCards.unshift(newCard);
    return Promise.resolve(newCard);
  }

  async deleteCard(cardId) {
    await this._delay();
    const index = this.mockCards.findIndex((card) => card._id === cardId);
    if (index > -1) {
      this.mockCards.splice(index, 1);
    }
    return Promise.resolve();
  }

  async changeLikeCardStatus(cardId, isLiked) {
    await this._delay();
    const card = this.mockCards.find((card) => card._id === cardId);
    if (card) {
      card.isLiked = !isLiked;
    }
    return Promise.resolve(card);
  }
}

export default MockApi;
