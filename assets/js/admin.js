import { getAdminIdToken } from './firebase-client.js?v=20260726-1';

const adminConfig = window.NUNAA_CONFIG || {};
const adminSummary = document.getElementById('adminSummary');
const refreshAdminButton = document.getElementById('refreshAdminButton');
const orderSearchInput = document.getElementById('orderSearchInput');
const orderStatusFilter = document.getElementById('orderStatusFilter');
const adminOrdersBody = document.getElementById('adminOrdersBody');
const posOrderForm = document.getElementById('posOrderForm');
const posOrderRows = document.getElementById('posOrderRows');
const addPosOrderRowButton = document.getElementById('addPosOrderRowButton');
const posCustomerName = document.getElementById('posCustomerName');
const posPaymentMethod = document.getElementById('posPaymentMethod');
const posOrderNote = document.getElementById('posOrderNote');
const posOrderSubtotal = document.getElementById('posOrderSubtotal');
const posAdjustedTotal = document.getElementById('posAdjustedTotal');
const posOrderDiscount = document.getElementById('posOrderDiscount');
const submitPosOrderButton = document.getElementById('submitPosOrderButton');
const adminStockBody = document.getElementById('adminStockBody');
const stockSearchInput = document.getElementById('stockSearchInput');
const clearStockSearchButton = document.getElementById('clearStockSearchButton');
const adminStatusMessage = document.getElementById('adminStatusMessage');

let adminOrders = [];
let adminProducts = [];
let currentPosOrderId = '';

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

function formatMoney(value) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function createAdminOrderId() {
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  const date = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('');
  const time = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('');
  const random = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');
  return `NUNAA-${date}-${time}-${random}`;
}

function updatePosOrderTotal() {
  const subtotal = Array.from(posOrderRows.querySelectorAll('.pos-order-row')).reduce((sum, row) => {
    const product = adminProducts.find(item => item.code === row.querySelector('[name="posCode"]').value);
    const quantity = Number(row.querySelector('[name="posQuantity"]').value || 0);
    return sum + (Number(product?.price || 0) * quantity);
  }, 0);
  posOrderSubtotal.textContent = formatMoney(subtotal);
  posAdjustedTotal.max = String(subtotal);
  posAdjustedTotal.value = String(subtotal);
  posOrderDiscount.textContent = formatMoney(0);
}

function updatePosOrderDiscount() {
  const subtotal = Array.from(posOrderRows.querySelectorAll('.pos-order-row')).reduce((sum, row) => {
    const product = adminProducts.find(item => item.code === row.querySelector('[name="posCode"]').value);
    const quantity = Number(row.querySelector('[name="posQuantity"]').value || 0);
    return sum + (Number(product?.price || 0) * quantity);
  }, 0);
  const adjustedTotal = Number(posAdjustedTotal.value);
  const discount = Number.isInteger(adjustedTotal) && adjustedTotal >= 0 && adjustedTotal <= subtotal
    ? subtotal - adjustedTotal
    : 0;
  posOrderDiscount.textContent = formatMoney(discount);
}

function updatePosColorOptions(row) {
  const productSelect = row.querySelector('[name="posCode"]');
  const colorSelect = row.querySelector('[name="posColor"]');
  const product = adminProducts.find(item => item.code === productSelect.value);
  const previousColor = colorSelect.value;
  colorSelect.innerHTML = '';

  (product?.colors || []).forEach(color => {
    const option = document.createElement('option');
    const stock = Number(color.stock || 0);
    option.value = color.name;
    option.textContent = `${color.name} (เหลือ ${stock})`;
    option.disabled = stock < 1;
    colorSelect.appendChild(option);
  });

  const availableColor = (product?.colors || []).find(color => (
    color.name === previousColor && Number(color.stock || 0) > 0
  ))
    || (product?.colors || []).find(color => Number(color.stock || 0) > 0);
  if (availableColor) colorSelect.value = availableColor.name;
  updatePosQuantityLimit(row);
}

function updatePosQuantityLimit(row) {
  const productSelect = row.querySelector('[name="posCode"]');
  const colorSelect = row.querySelector('[name="posColor"]');
  const quantityInput = row.querySelector('[name="posQuantity"]');
  const product = adminProducts.find(item => item.code === productSelect.value);
  const availableColor = (product?.colors || []).find(color => color.name === colorSelect.value);
  const stock = Number(availableColor?.stock || 0);
  quantityInput.max = String(Math.min(10, stock));
  if (Number(quantityInput.value) > stock) quantityInput.value = stock ? '1' : '0';
  updatePosOrderTotal();
}

function createPosOrderRow() {
  const row = document.createElement('div');
  row.className = 'pos-order-row';
  row.innerHTML = `
    <label>
      สินค้า
      <select name="posCode" required></select>
    </label>
    <label>
      สี
      <select name="posColor" required></select>
    </label>
    <label>
      จำนวน
      <input name="posQuantity" type="number" min="1" max="10" value="1" required />
    </label>
    <button class="button ghost remove-pos-row" type="button">ลบ</button>
  `;

  const productSelect = row.querySelector('[name="posCode"]');
  adminProducts.forEach(product => {
    const option = document.createElement('option');
    option.value = product.code;
    option.textContent = `${product.code} — ${product.name} (${formatMoney(product.price)})`;
    productSelect.appendChild(option);
  });

  productSelect.addEventListener('change', () => updatePosColorOptions(row));
  row.querySelector('[name="posColor"]').addEventListener('change', () => updatePosQuantityLimit(row));
  row.querySelector('[name="posQuantity"]').addEventListener('input', updatePosOrderTotal);
  row.querySelector('.remove-pos-row').addEventListener('click', () => {
    row.remove();
    if (!posOrderRows.children.length) createPosOrderRow();
    updatePosOrderTotal();
  });

  posOrderRows.appendChild(row);
  updatePosColorOptions(row);
}

function resetPosOrderForm() {
  posOrderRows.innerHTML = '';
  posCustomerName.value = '';
  posOrderNote.value = '';
  posPaymentMethod.value = 'cash';
  currentPosOrderId = '';
  createPosOrderRow();
  updatePosOrderTotal();
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
      <td>
        ${escapeHtml(order.customerName || '-')}
        ${order.orderSource === 'pos' ? '<br><small>ขายหน้าร้าน</small>' : `<br><small>${escapeHtml(order.phone || '')}</small>`}
      </td>
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

const stockDrafts = new Map();
let savingStock = false;
const saveStockChanges = document.getElementById('saveStockChanges');
const discardStockChanges = document.getElementById('discardStockChanges');
const stockKey = item => JSON.stringify([item.code, item.colorName]);

function updateStockDraftSummary() {
  document.getElementById('stockDraftStatus').textContent = savingStock
    ? 'กำลังบันทึก...' : stockDrafts.size ? `แก้ไข ${stockDrafts.size} รายการ ยังไม่ได้บันทึก` : 'ยังไม่มีรายการแก้ไข';
  saveStockChanges.disabled = savingStock || !stockDrafts.size;
  discardStockChanges.disabled = savingStock || !stockDrafts.size;
  document.getElementById('stockDraftReview').hidden = !stockDrafts.size;
  document.getElementById('stockDraftList').innerHTML = Array.from(stockDrafts.values(), item =>
    `<li>${escapeHtml(item.code)} · ${escapeHtml(item.colorName)}: ${item.original} → ${escapeHtml(item.stock === '' ? 'ยังไม่ระบุ' : item.stock)} ชิ้น</li>`
  ).join('');
}

function renderStockList() {
  const searchTerms = stockSearchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list = adminProducts.flatMap(product => product.colors.map(color => ({
    code: product.code, name: product.name, colorName: color.name,
    stock: Number(color.stock || 0)
  }))).filter(item => searchTerms.every(term =>
    `${item.code} ${item.name} ${item.colorName}`.toLowerCase().includes(term)));
  adminStockBody.innerHTML = '';
  updateStockDraftSummary();
  if (!list.length) {
    adminStockBody.innerHTML = '<tr><td colspan="5">ไม่พบสินค้าที่ตรงกับคำค้น</td></tr>';
    return;
  }
  list.forEach(item => {
    const key = stockKey(item);
    const row = document.createElement('tr');
    row.classList.toggle('stock-edited', stockDrafts.has(key));
    row.innerHTML = `
      <td data-label="รหัส">${escapeHtml(item.code)}</td>
      <td data-label="สินค้า">${escapeHtml(item.name)}</td>
      <td data-label="สี / ลาย / ไซซ์">${escapeHtml(item.colorName)}</td>
      <td data-label="จำนวน">
        <div class="stock-stepper">
          <button type="button" data-step="-1" aria-label="ลดจำนวน ${escapeHtml(item.code)} ${escapeHtml(item.colorName)}">−</button>
          <input class="stock-inline-input" type="number" min="0" max="1000000" step="1" inputmode="numeric"
            value="${escapeHtml(stockDrafts.get(key)?.stock ?? item.stock)}" aria-label="จำนวน ${escapeHtml(item.code)} ${escapeHtml(item.colorName)}" />
          <button type="button" data-step="1" aria-label="เพิ่มจำนวน ${escapeHtml(item.code)} ${escapeHtml(item.colorName)}">+</button>
        </div>
        <small>ยอดที่โหลดมา ${item.stock} ชิ้น</small>
      </td>
      <td><button type="button" class="button ghost stock-zero">หมด</button></td>`;
    adminStockBody.appendChild(row);
    const input = row.querySelector('input');
    const sync = () => {
      const value = input.value;
      const original = stockDrafts.get(key)?.original ?? item.stock;
      if (value !== '' && Number(value) === original) stockDrafts.delete(key);
      else stockDrafts.set(key, { ...item, original, stock: value });
      row.classList.toggle('stock-edited', stockDrafts.has(key));
      row.querySelector('[data-step="-1"]').disabled = savingStock || Number(value) <= 0;
      row.querySelector('[data-step="1"]').disabled = savingStock || Number(value) >= 1000000;
      updateStockDraftSummary();
    };
    row.querySelectorAll('button, input').forEach(control => { control.disabled = savingStock; });
    row.querySelector('[data-step="-1"]').disabled = savingStock || Number(input.value) <= 0;
    row.querySelector('[data-step="1"]').disabled = savingStock || Number(input.value) >= 1000000;
    input.addEventListener('input', sync);
    row.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
      input.value = String(Math.max(0, Math.min(1000000, Math.trunc(Number(input.value) || 0) + Number(button.dataset.step))));
      sync();
    }));
    row.querySelector('.stock-zero').addEventListener('click', () => { input.value = '0'; sync(); });
  });
}

saveStockChanges.addEventListener('click', async () => {
  if (savingStock || !stockDrafts.size) return;
  const items = Array.from(stockDrafts.values());
  if (items.some(item => item.stock === '' || !Number.isInteger(Number(item.stock)) || Number(item.stock) < 0 || Number(item.stock) > 1000000)) {
    showAdminMessage('กรอกจำนวนเต็มตั้งแต่ 0 ถึง 1,000,000 ให้ครบทุกรายการก่อนบันทึก', 'error');
    return;
  }
  if (items.length > 100) {
    showAdminMessage('บันทึกได้ครั้งละไม่เกิน 100 รายการ กรุณาลดรายการที่แก้ไขก่อน', 'error');
    return;
  }
  savingStock = true;
  renderStockList();
  try {
    await sendStockUpdate(items.map(({ code, colorName, stock }) => ({ code, colorName, stock: Number(stock) })));
    for (const item of items) {
      const product = adminProducts.find(product => product.code === item.code);
      const color = product?.colors.find(color => color.name === item.colorName);
      if (color) color.stock = Number(item.stock);
    }
    stockDrafts.clear();
    showAdminMessage(`บันทึกสต็อก ${items.length} รายการแล้ว`, 'success');
    try { await fetchAdminData(); } catch (error) {
      showAdminMessage('บันทึกสำเร็จแล้ว แต่โหลดข้อมูลล่าสุดไม่สำเร็จ กรุณากดรีเฟรช', 'error');
    }
  } catch (error) {
    showAdminMessage(error.message || 'บันทึกไม่สำเร็จ รายการที่แก้ไขยังอยู่ กรุณาลองใหม่', 'error');
  } finally {
    savingStock = false;
    renderStockList();
  }
});
discardStockChanges.addEventListener('click', () => { stockDrafts.clear(); renderStockList(); });
window.addEventListener('beforeunload', event => {
  if (stockDrafts.size) { event.preventDefault(); event.returnValue = ''; }
});

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
addPosOrderRowButton.addEventListener('click', createPosOrderRow);
posAdjustedTotal.addEventListener('input', updatePosOrderDiscount);
refreshAdminButton.addEventListener('click', () => fetchAdminData().catch(error => showAdminMessage(error.message, 'error')));

posOrderForm.addEventListener('submit', async event => {
  event.preventDefault();
  const rows = Array.from(posOrderRows.querySelectorAll('.pos-order-row'));
  const items = rows.map(row => ({
    code: row.querySelector('[name="posCode"]').value,
    colorName: row.querySelector('[name="posColor"]').value,
    quantity: Number(row.querySelector('[name="posQuantity"]').value)
  }));
  const subtotal = rows.reduce((sum, row) => {
    const product = adminProducts.find(item => item.code === row.querySelector('[name="posCode"]').value);
    const quantity = Number(row.querySelector('[name="posQuantity"]').value || 0);
    return sum + (Number(product?.price || 0) * quantity);
  }, 0);
  const adjustedTotal = Number(posAdjustedTotal.value);

  if (items.some(item => !item.code || !item.colorName || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    showAdminMessage('กรุณาเลือกสินค้า สี และจำนวนให้ครบถ้วน', 'error');
    return;
  }
  if (!Number.isInteger(adjustedTotal) || adjustedTotal < 0 || adjustedTotal > subtotal) {
    showAdminMessage(`ยอดขายสุทธิต้องเป็นจำนวนเต็มตั้งแต่ 0 ถึง ${formatMoney(subtotal)}`, 'error');
    posAdjustedTotal.focus();
    return;
  }

  if (!currentPosOrderId) currentPosOrderId = createAdminOrderId();
  submitPosOrderButton.disabled = true;
  submitPosOrderButton.textContent = 'กำลังบันทึก...';
  try {
    const result = await adminRequest('createPosOrder', {
      orderId: currentPosOrderId,
      customerName: posCustomerName.value.trim(),
      paymentMethod: posPaymentMethod.value,
      note: posOrderNote.value.trim(),
      adjustedTotal,
      items
    });
    showAdminMessage(`บันทึกออเดอร์หน้าร้าน ${result.orderId} ยอด ${formatMoney(result.total)} และตัดสต็อกแล้ว`, 'success');
    await fetchAdminData();
    resetPosOrderForm();
  } catch (error) {
    showAdminMessage(error.message || 'สร้างออเดอร์หน้าร้านไม่สำเร็จ', 'error');
  } finally {
    submitPosOrderButton.disabled = false;
    submitPosOrderButton.textContent = 'บันทึกการขายและตัดสต็อก';
  }
});

async function initAdmin() {
  await fetchAdminData();
  createPosOrderRow();
}

initAdmin().catch(error => {
  adminSummary.textContent = 'ไม่สามารถโหลดแอดมินแดชบอร์ดได้';
  showAdminMessage(error.message, 'error');
});
