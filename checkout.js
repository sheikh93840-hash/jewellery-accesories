// ========== ORDER MANAGER CLASS ==========
class OrderManager {
  constructor() {
    this.orders = this.loadOrders();
    this.cart = this.loadCart();
  }

  loadOrders() {
    const stored = localStorage.getItem('jewellery_orders');
    return stored ? JSON.parse(stored) : [];
  }

  saveOrders() {
    localStorage.setItem('jewellery_orders', JSON.stringify(this.orders));
  }

  loadCart() {
    const stored = localStorage.getItem('jewellery_cart');
    return stored ? JSON.parse(stored) : [];
  }

  generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}${random}`;
  }

  createOrder(formData) {
    const orderId = this.generateOrderId();
    const now = new Date();

    const order = {
      id: orderId,
      customerName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      whatsappNumber: formData.whatsappNumber || formData.mobileNumber,
      deliveryAddress: formData.address,
      area: formData.area,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      orderNotes: formData.orderNotes,
      items: this.cart,
      subtotal: this.calculateSubtotal(),
      deliveryCharges: this.calculateDeliveryCharges(),
      total: this.calculateTotal(),
      paymentMethod: 'Cash on Delivery',
      status: 'Order Placed',
      statusHistory: [
        {
          status: 'Order Placed',
          date: now.toISOString(),
          timestamp: now.getTime()
        }
      ],
      createdAt: now.toISOString(),
      createdAtTimestamp: now.getTime()
    };

    this.orders.push(order);
    this.saveOrders();
    return order;
  }

  calculateSubtotal() {
    return this.cart.reduce((sum, item) => {
      const price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  calculateDeliveryCharges() {
    const subtotal = this.calculateSubtotal();
    return subtotal > 75 ? 0 : 299;
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateDeliveryCharges();
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem('jewellery_cart');
  }
}

const orderManager = new OrderManager();

// ========== PAGE INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkoutForm')) {
    initializeCheckout();
  }
});

function initializeCheckout() {
  const checkoutForm = document.getElementById('checkoutForm');
  const cartItems = orderManager.cart;

  if (cartItems.length === 0) {
    document.querySelector('.checkout-view').innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; grid-column: 1 / -1;">
        <h1 style="font-family: 'Playfair Display', serif; font-size: 2rem; color: #1a1a1a; margin-bottom: 1rem;">Your Cart is Empty</h1>
        <p style="color: #666; margin-bottom: 2rem;">Add some beautiful jewellery pieces to your cart before checking out.</p>
        <a href="index.html#shop" style="display: inline-block; padding: 1rem 2rem; background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: 600;">Continue Shopping</a>
      </div>
    `;
    return;
  }

  renderCartItems(cartItems);
  updateCheckoutTotals();

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    placeOrder();
  });
}

function renderCartItems(cartItems) {
  const orderItems = document.getElementById('orderItems');
  orderItems.innerHTML = cartItems.map(item => `
    <div class="order-item">
      <div class="order-item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
      </div>
      <div class="order-item-details">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-category">${item.category}</div>
        <div class="order-item-meta">
          <span>Qty: ${item.quantity}</span>
        </div>
        <div class="order-item-price">${item.price} × ${item.quantity}</div>
      </div>
    </div>
  `).join('');
}

function updateCheckoutTotals() {
  const subtotal = orderManager.calculateSubtotal();
  const deliveryCharges = orderManager.calculateDeliveryCharges();
  const total = orderManager.calculateTotal();

  document.getElementById('subtotal').textContent = `Rs. ${subtotal.toFixed(0)}`;
  document.getElementById('deliveryCharges').textContent = `Rs. ${deliveryCharges.toFixed(0)}`;
  document.getElementById('totalAmount').textContent = `Rs. ${total.toFixed(0)}`;
}

function placeOrder() {
  const form = document.getElementById('checkoutForm');
  const formData = new FormData(form);

  const orderData = {
    fullName: formData.get('fullName'),
    mobileNumber: formData.get('mobileNumber'),
    whatsappNumber: formData.get('whatsappNumber'),
    address: formData.get('address'),
    area: formData.get('area'),
    city: formData.get('city'),
    province: formData.get('province'),
    postalCode: formData.get('postalCode'),
    orderNotes: formData.get('orderNotes')
  };

  const order = orderManager.createOrder(orderData);
  orderManager.clearCart();
  showOrderConfirmation(order);
}

function showOrderConfirmation(order) {
  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('confirmationView').style.display = 'block';

  document.getElementById('confirmationOrderId').textContent = order.id;
  document.getElementById('confirmCustomerName').textContent = order.customerName;
  document.getElementById('confirmCustomerMobile').textContent = order.mobileNumber;
  document.getElementById('confirmDeliveryAddress').textContent =
    `${order.deliveryAddress}, ${order.area}, ${order.city}, ${order.province}`;

  const confirmationOrderItems = document.getElementById('confirmationOrderItems');
  confirmationOrderItems.innerHTML = `
    <h4 style="font-weight: 600; margin-bottom: 1rem;">Order Items</h4>
    ${order.items.map(item => `
      <div class="order-item" style="margin-bottom: 1rem;">
        <div class="order-item-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
        </div>
        <div class="order-item-details">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-category">${item.category}</div>
          <div class="order-item-meta">
            <span>Qty: ${item.quantity}</span>
          </div>
          <div class="order-item-price">${item.price} × ${item.quantity}</div>
        </div>
      </div>
    `).join('')}
  `;

  document.getElementById('confirmSubtotal').textContent = `Rs. ${order.subtotal.toFixed(0)}`;
  document.getElementById('confirmDeliveryCharges').textContent = `Rs. ${order.deliveryCharges.toFixed(0)}`;
  document.getElementById('confirmTotal').textContent = `Rs. ${order.total.toFixed(0)}`;

  setupWhatsAppButton(order);
  window.scrollTo(0, 0);
}

function setupWhatsAppButton(order) {
  const whatsappBtn = document.getElementById('confirmOrderWhatsApp');
  whatsappBtn.addEventListener('click', () => {
    sendWhatsAppMessage(order);
  });
}

function sendWhatsAppMessage(order) {
  const phoneNumber = order.whatsappNumber || order.mobileNumber;
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  let message = `Order Confirmation\n\n`;
  message += `Order ID: ${order.id}\n`;
  message += `Customer Name: ${order.customerName}\n`;
  message += `Mobile: ${order.mobileNumber}\n`;
  message += `Delivery Address: ${order.deliveryAddress}, ${order.area}, ${order.city}, ${order.province}\n\n`;

  message += `Products:\n`;
  order.items.forEach(item => {
    message += `${item.name} × ${item.quantity}\n`;
  });

  message += `\nSubtotal: Rs. ${order.subtotal.toFixed(0)}\n`;
  message += `Delivery Charges: Rs. ${order.deliveryCharges.toFixed(0)}\n`;
  message += `Total: Rs. ${order.total.toFixed(0)}\n\n`;

  message += `Payment Method: Cash on Delivery\n\n`;
  message += `Please confirm my order.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

function copyOrderId() {
  const orderId = document.getElementById('confirmationOrderId').textContent;
  navigator.clipboard.writeText(orderId).then(() => {
    alert('Order ID copied to clipboard: ' + orderId);
  }).catch(() => {
    alert('Failed to copy Order ID');
  });
}