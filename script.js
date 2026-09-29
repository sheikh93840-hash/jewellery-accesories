// ========== PRODUCT DATA ==========
const products = [
  { name: 'Golden Pearl Earrings', category: 'Earrings', price: '$48.00', desc: 'Luminous freshwater pearls on 18k gold vermeil.', image: 'images/earrings-1.jpg' },
  { name: 'Elegant Stone Necklace', category: 'Necklaces', price: '$86.00', desc: 'A delicate chain finished with a champagne stone.', image: 'images/necklace-1.jpg' },
  { name: 'Minimal Gold Bracelet', category: 'Bracelets', price: '$54.00', desc: 'A barely-there everyday essential in polished gold.', image: 'images/bracelet-1.jpg' },
  { name: 'Crystal Signet Ring', category: 'Rings', price: '$42.00', desc: 'A softly sculptural ring with a crystal centre.', image: 'images/rings-1.jpg' },
  { name: 'Pearl Jewellery Set', category: 'Sets', price: '$112.00', desc: 'A timeless necklace and earring pairing for occasions.', image: 'images/jewellery-set-1.jpg' }
];

// ========== STORAGE MANAGEMENT ==========
const STORAGE_KEYS = {
  cart: 'jewellery_cart',
  orders: 'jewellery_orders'
};

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  updateCartCount();
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
  } catch {
    return [];
  }
}

function setOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

// ========== CART FUNCTIONS ==========
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  setCart(cart);
  toast(`${product.name} added to cart`);
}

function removeFromCart(productName) {
  const cart = getCart();
  const filtered = cart.filter(item => item.name !== productName);
  setCart(filtered);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

// ========== UTILITY FUNCTIONS ==========
function toast(message) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

function getSubtotal(items) {
  return items.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/[^0-9.]/g, '')) || 0;
    return sum + (price * Number(item.quantity || 1));
  }, 0);
}

function getDeliveryCharges(subtotal) {
  return subtotal > 75 ? 0 : 299;
}

function generateOrderId() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timePart = Date.now().toString(36).toUpperCase();
  return `ORD-${timePart}-${randomPart}`;
}

// ========== PRODUCT RENDERING ==========
const grid = document.querySelector('#productGrid');

function render(filter = 'All') {
  if (!grid) return;

  grid.innerHTML = products
    .filter(p => filter === 'All' || p.category === filter)
    .map((p, i) => `
      <article class="product-card">
        <div class="product-image">
          <img loading="lazy" src="${p.image}" alt="${p.name}" />
        </div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-footer">
          <span class="price">${p.price}</span>
          <button class="btn-add-to-cart" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">Add to Cart</button>
          <button class="wishlist" aria-label="Add to wishlist">♡</button>
        </div>
      </article>
    `)
    .join('');

  attachCardEvents();
}

function attachCardEvents() {
  document.querySelectorAll('.wishlist').forEach(b => {
    b.onclick = () => {
      b.classList.toggle('loved');
      b.textContent = b.classList.contains('loved') ? '♥' : '♡';
      toast(b.classList.contains('loved') ? 'Added to wishlist' : 'Removed from wishlist');
    };
  });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.onclick = () => {
      mobileNav.classList.toggle('open');
    };
  }

  const searchToggle = document.querySelector('.search-toggle');
  const searchPanel = document.querySelector('.search-panel');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle && searchPanel) {
    searchToggle.onclick = () => {
      searchPanel.classList.toggle('open');
      searchInput?.focus();
    };
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query)
        );

        if (grid && filtered.length) {
          grid.innerHTML = filtered
            .map(p => `
              <article class="product-card">
                <div class="product-image">
                  <img loading="lazy" src="${p.image}" alt="${p.name}" />
                </div>
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="product-footer">
                  <span class="price">${p.price}</span>
                  <button class="btn-add-to-cart" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">Add to Cart</button>
                  <button class="wishlist" aria-label="Add to wishlist">♡</button>
                </div>
              </article>
            `)
            .join('');
          attachCardEvents();
        }
      }
    });
  }

  if (grid) {
    render();

    document.querySelectorAll('.filter-tabs button').forEach(b => {
      b.onclick = () => {
        document.querySelectorAll('.filter-tabs button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        render(b.dataset.filter);
      };
    });

    document.querySelectorAll('.category-card').forEach(card => {
      card.onclick = () => {
        const filter = card.dataset.filter;
        document.querySelectorAll('.filter-tabs button').forEach(x => x.classList.remove('active'));
        document.querySelector(`.filter-tabs [data-filter="${filter}"]`)?.classList.add('active');
        render(filter);
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      };
    });
  }
});
