import { getAdminIdToken } from './firebase-client.js?v=20260725-4';

const adminConfig = window.NUNAA_CONFIG || {};
const adminSummary = document.getElementById('adminSummary');
const refreshAdminButton = document.getElementById('refreshAdminButton');
const orderSearchInput = document.getElementById('orderSearchInput');
const orderStatusFilter = document.getElementById('orderStatusFilter');
const adminOrdersBody = document.getElementById('adminOrdersBody');
const adminStockBody = document.getElementById('adminStockBody');
const stockSearchInput = document.getElementById('stockSearchInput');
const clearStockSearchButton = document.getElementById('clearStockSearchButton');
const stockUpdateForm = document.getElementById('stockUpdateForm');
const stockRows = document.getElementById('stockRows');
const addStockRowButton = document.getElementById('addStockRowButton');
const adminStatusMessage = document.getElementById('adminStatusMessage');

let adminOrders = [];
let adminProducts = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function adminRequest(action, payload = {}) {
  if (!adminConfig.appsScriptUrl) {
    throw new Error('กรุณาตั้งค่า appsScriptUrl ใน assets/js/config.js');
  }

  const idToken = await getAdminIdToken();
  const response = await fetch(adminConfig.appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, action, idToken })
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'คำขอผู้ดูแลไม่สำเร็จ');
  }
  return data;
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
}

function showAdminMessage(message, type = 'info') {
  adminStatusMessage.textContent = message;
  adminStatusMessage.className = `admin-status-message ${type}`;
  if (message) {
    window.setTimeout(() => {
      adminStatusMessage.textContent = '';
      adminStatusMessage.className = 'admin-status-message';
    }, 5000);
  }
}

function createStockRow(item = {}) {
  const row = document.createElement('div');
  row.className = 'admin-stock-row';
  row.innerHTML = `
    <label>
      รหัสสินค้า
      <input name="code" type="text" value="${escapeHtml(item.code || '')}" required />
    </label>
    <label>
      สี
      <input name="colorName" type="text" value="${escapeHtml(item.colorName || '')}" required />
    </label>
    <label>
      สต็อกใหม่
      <input name="stock" type="number" min="0" value="${escapeHtml(item.stock || 0)}" required />
    </label>
    <button type="button" class="button ghost remove-stock-row">ลบ</button>
  `;

  const removeButton = row.querySelector('.remove-stock-row');
  removeButton.addEventListener('click', () => row.remove());
  stockRows.appendChild(row);
}

function renderOrders() {
  const filterText = orderSearchInput.value.trim().toLowerCase();
  const statusFilter = orderStatusFilter.value;
  adminOrdersBody.innerHTML = '';

  const filtered = adminOrders.filter(order => {
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesText = !filterText || [order.orderId, String(order.customerName || ''), String(order.phone || ''), String(order.address || '')]
      .some(value => String(value).toLowerCase().includes(filterText));
    return matchesStatus && matchesText;
  });

  if (!filtered.length) {
    adminOrdersBody.innerHTML = '<tr><td colspan="6">ไม่มีคำสั่งซื้อที่ตรงกับเงื่อนไข</td></tr>';
    return;
  }

  filtered.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(order.orderId)}</td>
      <td>${escapeHtml(order.customerName || '-')}<br><small>${escapeHtml(order.phone || '')}</small></td>
      <td>${escapeHtml(order.status)}</td>
      <td>฿${escapeHtml(order.total)}</td>
      <td>${formatDateTime(order.createdAt)}</td>
      <td>
        <button class="button ghost order-action" data-order-id="${order.orderId}" data-action="paid">Paid</button>
        <button class="button ghost order-action" data-order-id="${order.orderId}" data-action="cancelled">Cancel</button>
        <button class="button ghost order-action" data-order-id="${order.orderId}" data-action="payment_rejected">Reject</button>
      </td>
    `;
    adminOrdersBody.appendChild(row);
  });

  adminOrdersBody.querySelectorAll('.order-action').forEach(button => {
    button.addEventListener('click', async () => {
      const orderId = button.dataset.orderId;
      const status = button.dataset.action;
      await updateOrderStatus(orderId, status);
    });
  });
}

function renderStockList() {
  adminStockBody.innerHTML = '';
  const searchText = stockSearchInput.value.trim().toLowerCase();
  const list = adminProducts.flatMap(product => product.colors.map(color => ({
    code: product.code,
    name: product.name,
    colorName: color.name,
    stock: Number.isFinite(Number(color.stock)) ? Number(color.stock) : '-' 
  }))).filter(item => !searchText || [item.code, item.name, item.colorName]
    .some(value => String(value || '').toLowerCase().includes(searchText)));

  if (!list.length) {
    adminStockBody.innerHTML = `<tr><td colspan="5">${searchText ? 'ไม่พบสินค้าที่ตรงกับคำค้น' : 'ไม่พบข้อมูลสต็อก'}</td></tr>`;
    return;
  }

  list.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(item.code)}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.colorName)}</td>
      <td>
        <input
          class="stock-inline-input"
          type="number"
          min="0"
          max="1000000"
          value="${escapeHtml(item.stock)}"
          aria-label="จำนวนสต็อก ${escapeHtml(item.code)} สี ${escapeHtml(item.colorName)}"
        />
      </td>
      <td><button class="button primary stock-inline-save" type="button">บันทึก</button></td>
    `;
    adminStockBody.appendChild(row);

    const stockInput = row.querySelector('.stock-inline-input');
    const saveButton = row.querySelector('.stock-inline-save');

    const saveStock = async () => {
      const stock = Number(stockInput.value);
      if (!Number.isInteger(stock) || stock < 0 || stock > 1000000) {
        showAdminMessage('กรุณากรอกจำนวนสต็อกเป็นเลขจำนวนเต็มตั้งแต่ 0 ถึง 1,000,000', 'error');
        stockInput.focus();
        return;
      }

      saveButton.disabled = true;
      saveButton.textContent = 'กำลังบันทึก...';
      try {
        await sendStockUpdate([{
          code: item.code,
          colorName: item.colorName,
          stock
        }]);
        showAdminMessage(`อัปเดต ${item.code} สี ${item.colorName} เป็น ${stock} ชิ้นแล้ว`, 'success');
        await fetchAdminData();
      } catch (error) {
        showAdminMessage(error.message || 'อัปเดตสต็อกไม่สำเร็จ', 'error');
        saveButton.disabled = false;
        saveButton.textContent = 'บันทึก';
      }
    };

    saveButton.addEventListener('click', saveStock);
    stockInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveStock();
      }
    });
  });
}

async function fetchAdminData() {
  const data = await adminRequest('adminOrders');

  adminOrders = data.orders || [];
  adminProducts = data.products || [];
  renderOrders();
  renderStockList();
  updateSummary();
}

function updateSummary() {
  const counts = adminOrders.reduce((acc, order) => {
    const status = order.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  adminSummary.innerHTML = `
    <div class="admin-summary-card">
      <strong>ทั้งหมด</strong>
      <span>${adminOrders.length}</span>
    </div>
    <div class="admin-summary-card">
      <strong>รอชำระ</strong>
      <span>${counts.pending || 0}</span>
    </div>
    <div class="admin-summary-card">
      <strong>รอตรวจสลิป</strong>
      <span>${counts.payment_reported || 0}</span>
    </div>
    <div class="admin-summary-card">
      <strong>ยืนยันยอดแล้ว</strong>
      <span>${counts.paid || 0}</span>
    </div>
  `;
}

async function updateOrderStatus(orderId, status) {
  try {
    await adminRequest('updateOrderStatus', { orderId, status });
    showAdminMessage(`อัปเดต ${orderId} เป็น ${status} สำเร็จ`, 'success');
    await fetchAdminData();
  } catch (error) {
    showAdminMessage(error.message || 'อัปเดตสถานะล้มเหลว', 'error');
  }
}

async function sendStockUpdate(items) {
  return adminRequest('updateProductStock', { items });
}

orderSearchInput.addEventListener('input', renderOrders);
orderStatusFilter.addEventListener('change', renderOrders);
stockSearchInput.addEventListener('input', renderStockList);
clearStockSearchButton.addEventListener('click', () => {
  stockSearchInput.value = '';
  renderStockList();
  stockSearchInput.focus();
});
refreshAdminButton.addEventListener('click', () => fetchAdminData().catch(error => showAdminMessage(error.message, 'error')));
addStockRowButton.addEventListener('click', () => createStockRow());

stockUpdateForm.addEventListener('submit', async event => {
  event.preventDefault();
  const rows = Array.from(stockRows.querySelectorAll('.admin-stock-row'));
  const items = rows.map(row => ({
    code: row.querySelector('[name="code"]').value.trim(),
    colorName: row.querySelector('[name="colorName"]').value.trim(),
    stock: Number(row.querySelector('[name="stock"]').value)
  }));

  try {
    const result = await sendStockUpdate(items);
    showAdminMessage(`อัปเดตสต็อก ${result.updated} รายการสำเร็จ`, 'success');
    await fetchAdminData();
    stockRows.innerHTML = '';
    createStockRow();
  } catch (error) {
    showAdminMessage(error.message, 'error');
  }
});

async function initAdmin() {
  createStockRow();
  await fetchAdminData();
}

initAdmin().catch(error => {
  adminSummary.textContent = 'ไม่สามารถโหลดแอดมินแดชบอร์ดได้';
  showAdminMessage(error.message, 'error');
});
