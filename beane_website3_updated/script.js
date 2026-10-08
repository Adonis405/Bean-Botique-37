function showNotification(message, bgColor = "#212529", duration = 3000) {
  if (typeof Toastify === 'function') {
    Toastify({
      text: message,
      duration: duration,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: bgColor,
      stopOnFocus: true
    }).showToast();
  }
}

// --- Products Data Array ---
const productsData = [
  { name: "Espresso", price: 2.75, img: "images/coffee1.jpg", fact: "A proper shot takes 25-30 seconds to extract under 9 bars of pressure.", desc: "Rich, syrupy shot with golden crema. Brewed for pure flavor." },
  { name: "Americano", price: 3.25, img: "images/coffee2.jpg", fact: "Created by WWII American soldiers who diluted Italian espresso to match drip coffee.", desc: "Espresso over hot water for a smooth, long cup retaining espresso depth." },
  { name: "Café Latte", price: 4.50, img: "images/coffee3.jpg", fact: "\"Latte\" translates literally to \"milk\" in Italian.", desc: "Espresso blended with silky steamed milk and a thin foam topping." },
  { name: "Cappuccino", price: 4.50, img: "images/coffee4.jpg", fact: "Named after the Capuchin friars whose brown robes matched the drink.", desc: "Equal ratios of espresso, warm milk, and deep, cloud-like foam." },
  { name: "24-Hour Cold Brew", price: 4.75, img: "images/coffee6.jpg", fact: "Cold water extraction results in up to 65% lower acidity than hot brews.", desc: "Steeped cold for 24 hours. Naturally sweet, full-bodied, and chilled." },
  { name: "Café Mocha", price: 4.95, img: "images/coffee7.jpg", fact: "The name Mocha originates from the historic Yemeni port of Al-Mukha, renowned for its ancient coffee trade.", desc: "Rich espresso combined with dark artisan chocolate sauce and steamed milk." },
  { name: "Caramel Macchiato", price: 5.00, img: "images/coffee8.jpg", fact: "\"Macchiato\" means \"marked\" or \"stained\" in Italian, describing espresso poured over foamy milk.", desc: "Freshly steamed milk with vanilla, marked with bold espresso and buttery caramel drizzle." },
  { name: "Artisan Cortado", price: 3.75, img: "images/coffee9.jpg", fact: "A Spanish classic blending 1:1 espresso and warm steamed milk to reduce acidity while keeping strength.", desc: "Equal parts intense espresso and warm silky milk for an aromatic, balanced sip." },
  { name: "Vanilla Latte", price: 4.85, img: "images/coffee10.jpg", fact: "Made with Madagascar Bourbon vanilla syrup for natural aromatics without excess sweetness.", desc: "Double espresso and steamed milk infused with fragrant, natural Madagascar vanilla extract." }
];

// --- Template Renderer Function ---
function renderProductGrid() {
  const container = document.getElementById('coffee-list');
  if (!container) return; // If we are not on products.html, do nothing
  
  container.innerHTML = productsData.map((p, i) => `
  <div class="col-12 col-sm-6 col-lg-4 product-col" data-name="${p.name}" data-aos="fade-up">
  <div class="card product-card custom-box h-100 p-3">
    <div class="overflow-hidden rounded">
      <img src="${p.img}" class="card-img-top img-zoom" alt="${p.name}" loading="lazy">
    </div>
    <div class="card-body d-flex flex-column px-0 pb-0">
      <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
        <h2 class="h5 card-title mb-0">${p.name}</h2>
        <button type="button"
          class="btn btn-outline-warning rounded-circle p-0 info-btn flex-shrink-0"
         
          aria-expanded="false" aria-controls="fact-${i}"
          aria-label="Show fun fact about ${p.name}">i</button>
      </div>
      <div class="collapse mb-2" id="fact-${i}">
        <div class="p-2 small rounded bg-dark border border-secondary text-light">
          <em>Fact:</em> ${p.fact}
        </div>
      </div>
      <hr>
      <p class="card-text small flex-grow-1 textsecondary">${p.desc}</p>
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
        <span class="fw-bold fs-5">$${p.price.toFixed(2)}</span>
        <button type="button" class="btn btn-dark add-to-cart-btn flex-grow-1"
          data-name="${p.name}" data-price="${p.price}" data-image="${p.img}">Add to Cart</button>
      </div>
    </div>
  </div>
</div>
  `).join('');
  container.querySelectorAll('.info-btn').forEach(initInfoBtn);
}
// --- Cart Storage Helpers ---
function getCart() {
  const cart = localStorage.getItem('bb_cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('bb_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const iconBadge = document.getElementById('cartBadge');
  if (iconBadge) {
    iconBadge.textContent = totalCount;
  }
  const navBadge = document.getElementById('cart-count');
  if (navBadge) {
    navBadge.textContent = totalCount;
  }
}

function addToCart(name, price, image = '') {
  const cart = getCart();
  const existing = cart.find(item => item.name.toLowerCase() === name.toLowerCase());

  if (existing) {
    existing.quantity += 1;
    if (!existing.image && image) {
      existing.image = image;
    }
  } else {
    cart.push({
      name: name,
      price: parseFloat(price),
      quantity: 1,
      image: image || ''
    });
  }

  saveCart(cart);

  // Show Toastify alert
 // Show Toastify alert
  showNotification(`${name} added to cart!`, "#212529", 1800);

  //  refresh cart display
  renderCartPage();
}

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderProductGrid();
    updateCartCount();
  renderCartPage();
  AOS.init({
    duration: 800, // Animation duration
    once: true    
  });

  // Cart Buttons Listener decrease increase
  const cartContainerEl = document.getElementById('cart-items');
if (cartContainerEl) {
  cartContainerEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const idx = parseInt(btn.getAttribute('data-index'));
    const cart = getCart();
    
    if (btn.classList.contains('increase-btn')) {
      cart[idx].quantity += 1;
    } else if (btn.classList.contains('decrease-btn')) {
      cart[idx].quantity > 1 ? cart[idx].quantity -= 1 : cart.splice(idx, 1);
    } else if (btn.classList.contains('remove-btn')) {
      cart.splice(idx, 1);
    }
    
    saveCart(cart);
    renderCartPage();
  });
}



  // Redirect cart button to cart.html
  const cartBtn = document.getElementById('cartToggleBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Event Delegation for "Add to Cart" buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const name = btn.getAttribute('data-name');
    const price = btn.getAttribute('data-price');
    const image = btn.getAttribute('data-image')
      || btn.closest('.card')?.querySelector('img')?.getAttribute('src')
      || '';

    if (name && price) {
      addToCart(name, price, image);
    }
  });

  // --- Search Filter (Matches Item Names Only) ---
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('#coffee-list .product-col');

      cards.forEach(card => {
        // Compare strictly against item name
        const titleEl = card.querySelector('.card-title');
        const itemName = (titleEl ? titleEl.textContent : card.getAttribute('data-name') || '').toLowerCase().trim();

        if (itemName.includes(query)) {
          card.classList.remove('d-none');
        } else {
          card.classList.add('d-none');
        }
      });
    });
  }

  // --- First-Visit Discount Modal (Home Page) ---
  const discountModalEl = document.getElementById('discountModal');
  if (discountModalEl && typeof bootstrap !== 'undefined') {
    const hasSeenModal = sessionStorage.getItem('bb_seen_modal');
    if (!hasSeenModal) {
      setTimeout(() => {
        const modal = new bootstrap.Modal(discountModalEl);
        modal.show();
        sessionStorage.setItem('bb_seen_modal', 'true');
      }, 1000);
    }

    const modalForm = document.getElementById('modal-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('modal-email').value;
        const modalInstance = bootstrap.Modal.getInstance(discountModalEl);
        if (modalInstance) {
          modalInstance.hide();
        }
        localStorage.setItem('bb_discount_applied', 'true');

     showNotification(`Success! 10% coupon applied for ${email}`, "#198754", 3500);
        renderCartPage();
      });
    }
  }

  // --- Mouse-Selectable Events & Registration (Events Page) ---
  const eventCards = document.querySelectorAll('.selectable-event');
  const eventSelect = document.getElementById('event-select');
  const regForm = document.getElementById('event-registration-form');

  if (eventCards.length > 0 && eventSelect) {
    // Select an event via mouse click on card
    eventCards.forEach(card => {
      card.addEventListener('click', () => {
        const eventName = card.getAttribute('data-event');

        // Toggle selected state
        eventCards.forEach(c => {
          c.classList.remove('selected');
          const ind = c.querySelector('.select-indicator');
          if (ind) ind.textContent = 'Click to Select';
        });

        card.classList.add('selected');
        const indicator = card.querySelector('.select-indicator');
        if (indicator) indicator.textContent = 'Selected ✓';

        // Update dropdown in registration form
        eventSelect.value = eventName;
      });
    });

    // Sync dropdown changes back to card highlighting
    eventSelect.addEventListener('change', () => {
      const chosen = eventSelect.value;
      eventCards.forEach(c => {
        const ind = c.querySelector('.select-indicator');
        if (c.getAttribute('data-event') === chosen) {
          c.classList.add('selected');
          if (ind) ind.textContent = 'Selected ✓';
        } else {
          c.classList.remove('selected');
          if (ind) ind.textContent = 'Click to Select';
        }
      });
    });
  }

  // Event Registration Submission with Toastify Notification
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eventName = eventSelect.value;
      const firstName = document.getElementById('first-name').value.trim();
      const email = document.getElementById('email').value.trim();

     if (!eventName) {
        showNotification("Please select an event to register!", "#dc3545", 3000);
        return;
      }

    showNotification(`Registration confirmed for "${eventName}
      "! Welcome, ${firstName}! Confirmation sent to ${email}`, "#198754", 4000);

      // Reset form and card highlight
      regForm.reset();
      eventCards.forEach(c => {
        c.classList.remove('selected');
        const ind = c.querySelector('.select-indicator');
        if (ind) ind.textContent = 'Click to Select';
      });
    });
  }

  // Coupon apply button on Cart Page
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const codeInput = document.getElementById('coupon-input');
      const statusEl = document.getElementById('coupon-status');
      const code = codeInput ? codeInput.value.trim().toUpperCase() : '';

      if (code === 'COFFEE2026' || code === 'WELCOME10') {
        localStorage.setItem('bb_discount_applied', 'true');
        if (statusEl) {
          statusEl.textContent = 'Promo code applied: 10% discount!';
          statusEl.className = 'small text-success mb-2';
        }
      showNotification
      ("Promo code COFFEE2026 applied! 10% off your total.", "#198754", 3000);
        renderCartPage();
      } else {
        if (statusEl) {
          statusEl.textContent = 'Invalid promo code. Try COFFEE2026';
          statusEl.className = 'small text-danger mb-2';
        }
      }
    });
  }
});

// --- Cart Page Rendering Logic ---
function renderCartPage() {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;

  const cart = getCart();
  const emptyMsg = document.getElementById('empty-cart-message');
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.classList.remove('d-none');
    cartContainer.classList.add('d-none');
    document.getElementById('cart-subtotal').textContent = '$0.00';
    document.getElementById('cart-discount').textContent = '$0.00';
    document.getElementById('cart-total').textContent = '$0.00';
    return;
  }

  if (emptyMsg) emptyMsg.classList.add('d-none');
  cartContainer.classList.remove('d-none');

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const thumbnailHtml = item.image
      ? `<img src="${item.image}" alt="${item.name}" class="rounded border border-secondary" style="width: 80px; height: 80px; object-fit: cover;">`
      : `<div class="rounded d-flex align-items-center justify-content-center bg-dark border border-secondary textsecondary cart-thumbnail">
      ☕</div>`;

    const card = document.createElement('div');
    card.className = 'card custom-box p-3';
    card.innerHTML = `
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <!-- Thumbnail + Info -->
        <div class="d-flex align-items-center gap-3">
          ${thumbnailHtml}
          <div>
            <h5 class="mb-1 text-light fs-6">${item.name}</h5>
            <span class="text-secondary small">Unit Price: $${item.price.toFixed(2)}</span>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between justify-content-sm-end gap-3">
          <div class="input-group input-group-sm quantity-control">
            <button class="btn btn-outline-light decrease-btn" data-index="${index}">-</button>
            <span class="input-group-text bg-transparent text-light border-secondary justify-content-center flex-grow-1">${item.quantity}</span>
            <button class="btn btn-outline-light increase-btn" data-index="${index}">+</button>
          </div>
          <div class="text-end">
            <div class="small text-secondary">Subtotal</div>
            <span class="fw-bold text-light">$${itemSubtotal.toFixed(2)}</span>
          </div>
          <button class="btn btn-outline-danger btn-sm remove-btn ms-1" data-index="${index}" title="Remove item">&times;</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(card);
  });

  const discountApplied = localStorage.getItem('bb_discount_applied') === 'true';
  const discountAmount = discountApplied ? subtotal * 0.10 : 0;
  const total = subtotal - discountAmount;

  document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cart-discount').textContent = `-$${discountAmount.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

  // Attach button events for quantity and removal
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.onclick = () => {
      saveCart([]);
      renderCartPage();
    };
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      alert('Thank you for your order! Your order has been placed.');
      saveCart([]);
      renderCartPage();
    };
  }
}
