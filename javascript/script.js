//toggle class active
const navbarNav = document.querySelector(".navbar-nav");

// kalo hamburg menu di klik
document.querySelector("#hamburger-menu").onclick = (e) => {
  navbarNav.classList.toggle("active");
  e.preventDefault();
};

//klik di luar buat hilangin nav
const hamburger = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

//modal box
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailButtons = document.querySelectorAll(".item-detail-button");

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    itemDetailModal.style.display = "flex";
    e.preventDefault();
  };
});

//klik tombol close
document.querySelector(".modal .close-icon").onclick = (e) => {
  itemDetailModal.style.display = "none";
  e.preventDefault();
};

//klik di luar close
window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = "none";
  }
};


//products cart
// Load cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('matchaCart')) || [];
const cartItems = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const cartCount = document.querySelector('.cart-count');
const clearCartBtn = document.querySelector('#clear-cart');

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('matchaCart', JSON.stringify(cart));
}

// Add to cart functionality
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
  const cartItemsContainer = document.querySelector('#cart-items');
  const cartTotalElement = document.querySelector('#cart-total');
  const cartCountElement = document.querySelector('.cart-count');
  
  // Clear existing items
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    cartTotalElement.textContent = '0';
    cartCountElement.classList.remove('show');
    cartCountElement.textContent = '0';
    return;
  }
  
  let total = 0;
  let totalItems = 0;
  
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">IDR ${item.price.toLocaleString()}</div>
        <div class="cart-item-quantity">Qty: ${item.quantity}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
    `;
    cartItemsContainer.appendChild(cartItem);
    
    total += item.price * item.quantity;
    totalItems += item.quantity;

    const modalContainer = document.querySelector('.modal-cart');
    modalContainer.style.display = 'flex';

    let modalContainerText = document.querySelector('#modal-cart-content-text');
    modalContainerText.textContent = `${item.name} has been added to your cart.`;
  });
  
  cartTotalElement.textContent = total.toLocaleString();
  cartCountElement.textContent = totalItems;
  cartCountElement.classList.add('show');
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

// Clear cart
clearCartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  cart = [];
  updateCartDisplay();
});

// Add event listeners to "Add to Cart" buttons
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.product-icons a:first-child');
  
  addToCartButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get product details from the product card
      const productCard = button.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPriceText = productCard.querySelector('.product-price').textContent;
      // safer extraction: handles commas or dots and avoids runtime errors
      const m = productPriceText.match(/IDR\s*([\d.,]+)/);
      const productPrice = m ? parseInt(m[1].replace(/[^\d]/g, ''), 10) : 0;
      const productImage = productCard.querySelector('img').src;
      
      addToCart(productName, productPrice, productImage);
      
      // Show feedback
      button.style.color = 'var(--primary)';
      setTimeout(() => {
        button.style.color = '';
      }, 300);
    });
  });

  // Close cart modal functionality
  const modalCart = document.querySelector('.modal-cart');
  const modalCartCloseBtn = document.querySelector('.modal-cart .close-icon');

  // Close when clicking the close button (×)
  if (modalCartCloseBtn) {
    modalCartCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalCart.style.display = 'none';
    });
  }

  // Close when clicking the dark background overlay
  if (modalCart) {
    modalCart.addEventListener('click', (e) => {
      // Only close if clicking directly on the overlay, not the modal content
      if (e.target === modalCart) {
        modalCart.style.display = 'none';
      }
    });
  }

  // Checkout button - navigate to checkout page
  const checkoutBtn = document.querySelector('#checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'checkout.html';
    });
  }
});