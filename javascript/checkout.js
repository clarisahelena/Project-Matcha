// Checkout Page Script
// Load cart from localStorage
let checkoutCart = JSON.parse(localStorage.getItem("matchaCart")) || [];

// DOM Elements
const checkoutContent = document.querySelector("#checkout-content");
const checkoutSubtotal = document.querySelector("#checkout-subtotal");
const checkoutTotal = document.querySelector("#checkout-total");
const placeOrderBtn = document.querySelector("#place-order-btn");

// Initialize checkout page
function initCheckout() {
  renderCheckoutItems();
  updateCheckoutTotals();
}

// Render cart items in checkout page
function renderCheckoutItems() {
  checkoutContent.innerHTML = "";

  if (checkoutCart.length === 0) {
    checkoutContent.innerHTML = `
      <div class="empty-checkout">
        <p>Your cart is empty</p>
        <a href="index.html" class="back-to-shop">← Back to Shop</a>
      </div>
    `;
    return;
  }

  checkoutCart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    const checkoutItem = document.createElement("div");
    checkoutItem.className = "checkout-item";
    checkoutItem.innerHTML = `
      <div class="checkout-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="checkout-item-details">
        <h3 class="checkout-item-name">${item.name}</h3>
        <p class="checkout-item-price">IDR ${item.price.toLocaleString()} each</p>
      </div>
      <div class="checkout-item-actions">
        <div class="quantity-control">
          <button class="qty-btn minus" data-index="${index}">-</button>
          <input type="number" class="qty-input" value="${
            item.quantity
          }" min="1" data-index="${index}" readonly>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>
        <div class="checkout-item-total">
          <strong>IDR ${itemTotal.toLocaleString()}</strong>
        </div>
        <button class="remove-item-btn" data-index="${index}">
          <i data-feather="trash-2"></i>
        </button>
      </div>
    `;

    checkoutContent.appendChild(checkoutItem);
  });

  // Re-render feather icons for the trash icon
  feather.replace();

  // Add event listeners for quantity controls
  addQuantityListeners();
}

// Add event listeners for quantity buttons and remove buttons
function addQuantityListeners() {
  // Minus buttons
  document.querySelectorAll(".qty-btn.minus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      if (checkoutCart[index].quantity > 1) {
        checkoutCart[index].quantity -= 1;
        saveAndRefresh();
      }
    });
  });

  // Plus buttons
  document.querySelectorAll(".qty-btn.plus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      checkoutCart[index].quantity += 1;
      saveAndRefresh();
    });
  });

  // Remove buttons
  document.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      checkoutCart.splice(index, 1);
      saveAndRefresh();
    });
  });
}

// Save cart to localStorage and refresh display
function saveAndRefresh() {
  localStorage.setItem("matchaCart", JSON.stringify(checkoutCart));
  renderCheckoutItems();
  updateCheckoutTotals();

  if (typeof updateCartDisplay === "function") {
    updateCartDisplay();
  }
}

// Update checkout totals
function updateCheckoutTotals() {
  const subtotal = checkoutCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (checkoutSubtotal) {
    checkoutSubtotal.textContent = subtotal.toLocaleString();
  }
  if (checkoutTotal) {
    checkoutTotal.textContent = subtotal.toLocaleString();
  }
}

// Place order button handler
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    if (checkoutCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Clear the cart after order
    localStorage.removeItem("matchaCart");
    checkoutCart = [];

    alert("Thank you for your order! 🍵");
    window.location.href = "index.html";
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initCheckout);
