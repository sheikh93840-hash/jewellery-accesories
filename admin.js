const adminStatusSteps = [
  'Order Placed',
  'Order Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('jewellery_orders') || '[]');
  } catch {
    return [];
  }
}

function setOrders(orders) {
  localStorage.setItem('jewellery_orders', JSON.stringify(orders));
}

function renderAdminOrders() {
  const list = document.getElementById('adminOrderList');
  const search = (document.getElementById('adminSearchInput')?.value || '').trim().toLowerCase();
  const orders = getOrders();

  const filteredOrders = orders.filter((order) => {
    if (!search) return true;
    const searchable = `${order.id} ${order.mobileNumber || ''} ${order.customerName || ''}`.toLowerCase();
    return searchable.includes(search);
  });

  if (!list) return;

  if (!filteredOrders.length) {
    list.innerHTML = '<div class="admin-order-card"><p>No orders found.</p></div>';
    return;
  }

  list.innerHTML = filteredOrders.map((order) => {
    const currentCharge = Number(order.deliveryCharges || 0).toFixed(0);
    return `
      <div class="admin-order-card">
        <div class="admin-order-header">
          <div>
            <h3>${order.id}</h3>
            <p>${order.customerName}</p>
          </div>
          <div class="admin-order-meta">
            <span>${order.mobileNumber}</span>
            <span>${order.status}</span>
          </div>
        </div>

        <div class="admin-order-body">
          <div class="admin-order-details">
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Address:</strong> ${order.deliveryAddress || order.address}, ${order.area}, ${order.city}</p>
            <p><strong>Items:</strong> ${order.items ? order.items.map(item => `${item.name} × ${item.quantity}`).join(', ') : 'No items'}</p>
            <p><strong>Subtotal:</strong> Rs. ${Number(order.subtotal || 0).toFixed(0)}</p>
            <p><strong>Delivery:</strong> Rs. ${currentCharge}</p>
            <p><strong>Total:</strong> Rs. ${Number(order.total || 0).toFixed(0)}</p>
            <p><strong>Payment:</strong> Cash on Delivery</p>
          </div>

          <div class="admin-order-actions">
            <select class="admin-select" data-order-id="${order.id}">
              ${adminStatusSteps.map(step => `
                <option value="${step}" ${step === order.status ? 'selected' : ''}>${step}</option>
              `).join('')}
            </select>

            <div class="admin-charge-row">
              <input
                class="admin-charge-input"
                type="number"
                min="0"
                value="${currentCharge}"
                data-order-id="${order.id}"
                placeholder="Delivery charges"
              />
              <button type="button" class="btn-admin-status" data-action="charge" data-order-id="${order.id}">Save</button>
            </div>

            <button type="button" class="btn-admin-status" data-action="status" data-order-id="${order.id}">Update Status</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-admin-status').forEach((button) => {
    button.addEventListener('click', () => {
      const orderId = button.dataset.orderId;
      const action = button.dataset.action;
      const orders = getOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) return;

      const order = orders[orderIndex];

      if (action === 'status') {
        const select = document.querySelector(`.admin-select[data-order-id="${orderId}"]`);
        const newStatus = select?.value || order.status;

        if (newStatus !== order.status) {
          order.status = newStatus;
          order.statusHistory = order.statusHistory || [];
          order.statusHistory.push({
            status: newStatus,
            date: new Date().toISOString(),
            timestamp: Date.now()
          });
        }
      }

      if (action === 'charge') {
        const input = document.querySelector(`.admin-charge-input[data-order-id="${orderId}"]`);
        const value = Number(input?.value || 0);
        const nextCharge = Number.isFinite(value) ? value : Number(order.deliveryCharges || 0);
        order.deliveryCharges = nextCharge;
        order.total = Number(order.subtotal || 0) + Number(nextCharge || 0);
      }

      orders[orderIndex] = order;
      setOrders(orders);
      renderAdminOrders();
      showAdminMessage('Order updated successfully.');
    });
  });
}

function showAdminMessage(message) {
  const msg = document.getElementById('adminMsg');
  if (!msg) return;
  msg.textContent = message;
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 2500);
}

function initializeAdminOrders() {
  const searchInput = document.getElementById('adminSearchInput');
  const refreshBtn = document.getElementById('refreshOrdersBtn');

  if (searchInput) searchInput.addEventListener('input', renderAdminOrders);
  if (refreshBtn) refreshBtn.addEventListener('click', renderAdminOrders);
  renderAdminOrders();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeAdminOrders();
});