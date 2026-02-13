const API_BASE_URL = 'http://localhost:3001/api';

// Produkte
export const productService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Produkte konnten nicht geladen werden');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Produkt nicht gefunden');
    return response.json();
  }
};

// Warenkorb (für anonyme Benutzer verwenden wir localStorage-basierte userId)
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const cartService = {
  async getCart() {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
    if (!response.ok) throw new Error('Warenkorb konnte nicht geladen werden');
    return response.json();
  },

  async addItem(productId, quantity = 1) {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('Produkt konnte nicht hinzugefügt werden');
    return response.json();
  },

  async updateQuantity(productId, quantity) {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Menge konnte nicht aktualisiert werden');
    return response.json();
  },

  async removeItem(productId) {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/items/${productId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Produkt konnte nicht entfernt werden');
    return response.json();
  },

  async clearCart() {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Warenkorb konnte nicht geleert werden');
    return response.json();
  }
};

