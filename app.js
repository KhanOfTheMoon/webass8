// Общие помощники и состояние
window.helpers = (function () {
  const stateKey = 'qbook_state';

  function qs(name, search) {
    const p = new URLSearchParams(search ?? location.search);
    return p.get(name);
  }
  function stars(n) {
    const r = Math.round(n);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }
  function money(v) { return v.toLocaleString('ru-RU') + ' ₸'; }

  function read() {
    return JSON.parse(localStorage.getItem(stateKey) ||
      '{"cart":[],"reviews":{},"user":null}');
  }
  function write(s) { localStorage.setItem(stateKey, JSON.stringify(s)); updateBadges(); }
  function updateBadges() {
    const s = read();
    const cart = document.getElementById('cartBadge');
    if (cart) { cart.textContent = s.cart.length; cart.style.display = s.cart.length ? 'inline-grid' : 'none'; }
  }

  // отзывы
  function getReviews(id) { const s = read(); return s.reviews[id] || []; }
  function addReview(id, review) {
    const s = read(); s.reviews[id] = s.reviews[id] || []; s.reviews[id].push(review); write(s);
  }

  // пользователь
  function setUser(u) { const s = read(); s.user = u; write(s); }
  function getUser() { return read().user; }
  function isLogged() { return !!read().user; }
  function logout() { const s = read(); s.user = null; write(s); }

  // корзина
  function addToCart(id) { const s = read(); if (!s.cart.includes(id)) s.cart.push(id); write(s); }
  function getCart() { return read().cart; }
  function clearCart() { const s = read(); s.cart = []; write(s); }

  // поиск из хедера
  function bindHeaderSearch(formId, inputId) {
    const f = document.getElementById(formId); if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById(inputId).value.trim();
      location.href = 'search.html?q=' + encodeURIComponent(q);
    });
  }

  // badge при старте
  document.addEventListener('DOMContentLoaded', updateBadges);

  return {
    qs, stars, money,
    bindHeaderSearch,
    getReviews, addReview,
    addToCart, getCart, clearCart,
    setUser, getUser, isLogged, logout,
    read, write
  };
})();