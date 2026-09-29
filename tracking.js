const statusSteps = [
  'Order Placed',
  'Order Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

function formatDateTime(dateValue) {
  const date = new Date(dateValue);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('jewellery_orders') || '[]');
  } catch {
    return [];
  }
}

function renderTracking(order) {
  const timeline = document.getElementById('trackingTimeline');
  const resultSection = document.getElementById('trackingResult');
  const statusIndex = statusSteps.indexOf(order.status || 'Order Placed');

  const orderStatuses = statusSteps.map((status, index) => {
    const completed = statusIndex > index;
    const current = status === (order.status || 'Order Placed');
    const upcoming = index > statusIndex;
    const icon = completed ? '✓' : current ? '●' : '○';

    let dateText = 'Not updated yet';
    if (order.statusHistory && order.statusHistory.length) {
      if (status === (order.status || 'Order Placed')) {
        const latestEntry = order.statusHistory
          .filter(entry => entry.status === status)
          .slice(-1)[0];
        dateText = latestEntry ? formatDateTime(latestEntry.date) : 'Not updated yet';
      } else if (completed) {
        const match = order.statusHistory.find(entry => entry.status === status);
        if (match) dateText = formatDateTime(match.date);
      }
    }

    return `
      <div class="timeline-item ${completed ? 'completed' : current ? 'current' : 'upcoming'}">
        <div class="timeline-icon">${icon}</div>
        <div class="timeline-content">
          <div class="timeline-status">${status}</div>
          <div class="timeline-date">${dateText}</div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('resultOrderId').textContent = order.id;
  document.getElementById('resultCustomerName').textContent = order.customerName;
  document.getElementById('resultMobile').textContent = order.mobileNumber;
  document.getElementById('resultCity').textContent = order.city || order.area;
  document.getElementById('resultTotal').textContent = `Rs. ${Number(order.total || 0).toFixed(0)}`;

  timeline.innerHTML = orderStatuses;
  resultSection.style.display = 'block';
}

function initializeTracking() {
  const trackingForm = document.getElementById('trackingForm');
  if (!trackingForm) return;

  trackingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const orderId = document.getElementById('orderIdInput').value.trim();
    const mobile = document.getElementById('mobileInput').value.trim();
    const orders = getOrders();
    const order = orders.find(item => item.id === orderId && String(item.mobileNumber) === String(mobile));

    if (!order) {
      alert('No order found for the given Order ID and Mobile Number.');
      return;
    }

    renderTracking(order);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTracking();
});