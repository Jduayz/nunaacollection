const PRODUCTS_SHEET = 'Products';
const ORDERS_SHEET = 'Orders';
const SPREADSHEET_ID = '1-ytw4BwY7E0LXAvkkI7B6_G2suv60l6-d_1UmfBE4g4';
const ORDERS_HEADERS = [
  'createdAt',
  'orderId',
  'status',
  'stockDeducted',
  'paidAt',
  'customerName',
  'phone',
  'address',
  'province',
  'postal',
  'note',
  'items',
  'total',
  'summary'
];

function doGet(event) {
  const action = event.parameter.action || 'products';

  if (action === 'products') {
    return jsonResponse({ ok: true, products: getProducts() });
  }

  return jsonResponse({ ok: false, message: 'Unknown action' }, 400);
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const result = createOrder(payload);
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message }, 400);
  }
}

function getProducts() {
  const sheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${PRODUCTS_SHEET}`);

  const rows = getRows(sheet);
  const productMap = {};

  rows.forEach(row => {
    const active = String(row.active || 'TRUE').toLowerCase();
    if (active === 'false' || active === '0' || !row.code) return;

    if (!productMap[row.code]) {
      productMap[row.code] = {
        code: row.code,
        name: row.name,
        price: Number(row.price || 0),
        detail: row.detail || '',
        image: row.image || '',
        colors: []
      };
    }

    productMap[row.code].colors.push({
      name: row.colorName || row.color || 'ไม่ระบุสี',
      value: row.colorValue || '#edf1ee',
      stock: Number(row.stock || 0)
    });
  });

  return Object.keys(productMap).map(code => productMap[code]);
}

function createOrder(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const orderId = payload.orderId || createOrderId();
    const items = payload.items || [];
    if (!items.length) throw new Error('ไม่มีสินค้าในออเดอร์');

    const ordersSheet = getOrCreateOrdersSheet();
    validateStock(items);
    appendPendingOrder(ordersSheet, orderId, payload, items);

    return { ok: true, orderId, status: 'pending' };
  } finally {
    lock.releaseLock();
  }
}

function appendPendingOrder(sheet, orderId, payload, items) {
  const customer = payload.customer || {};
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const values = {
    createdAt: new Date(),
    orderId,
    status: 'pending',
    stockDeducted: false,
    paidAt: '',
    customerName: customer.name || '',
    phone: customer.phone || '',
    address: customer.address || '',
    province: customer.province || '',
    postal: customer.postal || '',
    note: customer.note || '',
    items: JSON.stringify(items),
    total: Number(payload.total || 0),
    summary: payload.summary || ''
  };

  const row = headers.map(header => values[header] === undefined ? '' : values[header]);

  sheet.appendRow(row);
}

function validateStock(items) {
  const productsSheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  const productValues = productsSheet.getDataRange().getValues();
  const headers = productValues[0].map(String);
  const codeIndex = headers.indexOf('code');
  const colorIndex = headers.indexOf('colorName') >= 0 ? headers.indexOf('colorName') : headers.indexOf('color');
  const stockIndex = headers.indexOf('stock');

  if (codeIndex < 0 || colorIndex < 0 || stockIndex < 0) {
    throw new Error('Products sheet ต้องมี column: code, colorName, stock');
  }

  items.forEach(item => {
    const rowIndex = findProductRow(productValues, codeIndex, colorIndex, item.code, item.colorName);
    if (rowIndex < 1) throw new Error(`ไม่พบสินค้า ${item.code} สี${item.colorName}`);

    const currentStock = Number(productValues[rowIndex][stockIndex] || 0);
    const quantity = Number(item.quantity || 1);
    if (currentStock < quantity) {
      throw new Error(`${item.code} สี${item.colorName} เหลือ ${currentStock} ชิ้น`);
    }
  });
}

function onEdit(event) {
  const range = event.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== ORDERS_SHEET || range.getRow() === 1) return;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const statusColumn = headers.indexOf('status') + 1;
  if (range.getColumn() !== statusColumn) return;

  if (String(range.getValue()).toLowerCase() === 'paid') {
    deductStockForOrderRow(sheet, range.getRow());
  }
}

function processPaidOrders() {
  const sheet = getOrCreateOrdersSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const statusIndex = headers.indexOf('status');
  const stockDeductedIndex = headers.indexOf('stockDeducted');

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const status = String(values[rowIndex][statusIndex] || '').toLowerCase();
    const stockDeducted = String(values[rowIndex][stockDeductedIndex] || '').toLowerCase();
    if (status === 'paid' && stockDeducted !== 'true') {
      deductStockForOrderRow(sheet, rowIndex + 1);
    }
  }
}

function deductStockForOrderRow(ordersSheet, rowNumber) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const headers = ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0].map(String);
    const row = ordersSheet.getRange(rowNumber, 1, 1, ordersSheet.getLastColumn()).getValues()[0];
    const statusIndex = headers.indexOf('status');
    const stockDeductedIndex = headers.indexOf('stockDeducted');
    const paidAtIndex = headers.indexOf('paidAt');
    const itemsIndex = headers.indexOf('items');

    if (String(row[statusIndex]).toLowerCase() !== 'paid') return;
    if (String(row[stockDeductedIndex]).toLowerCase() === 'true') return;

    const items = JSON.parse(row[itemsIndex] || '[]');
    reduceStock(items);

    ordersSheet.getRange(rowNumber, stockDeductedIndex + 1).setValue(true);
    ordersSheet.getRange(rowNumber, paidAtIndex + 1).setValue(new Date());
  } finally {
    lock.releaseLock();
  }
}

function reduceStock(items) {
  const productsSheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  const productValues = productsSheet.getDataRange().getValues();
  const headers = productValues[0].map(String);
  const codeIndex = headers.indexOf('code');
  const colorIndex = headers.indexOf('colorName') >= 0 ? headers.indexOf('colorName') : headers.indexOf('color');
  const stockIndex = headers.indexOf('stock');

  items.forEach(item => {
    const rowIndex = findProductRow(productValues, codeIndex, colorIndex, item.code, item.colorName);
    if (rowIndex < 1) throw new Error(`ไม่พบสินค้า ${item.code} สี${item.colorName}`);

    const currentStock = Number(productValues[rowIndex][stockIndex] || 0);
    const quantity = Number(item.quantity || 1);
    if (currentStock < quantity) {
      throw new Error(`${item.code} สี${item.colorName} เหลือ ${currentStock} ชิ้น`);
    }

    const newStock = currentStock - quantity;
    productValues[rowIndex][stockIndex] = newStock;
    productsSheet.getRange(rowIndex + 1, stockIndex + 1).setValue(newStock);
  });
}

function findProductRow(values, codeIndex, colorIndex, code, colorName) {
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (String(values[rowIndex][codeIndex]) === String(code) &&
        String(values[rowIndex][colorIndex]) === String(colorName)) {
      return rowIndex;
    }
  }
  return -1;
}

function getRows(sheet) {
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);

  return values.map(row => headers.reduce((item, header, index) => {
    item[header] = row[index];
    return item;
  }, {}));
}

function getOrCreateOrdersSheet() {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(ORDERS_SHEET);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(ORDERS_SHEET);
    sheet.appendRow(ORDERS_HEADERS);
  } else {
    ensureOrderHeaders(sheet);
  }

  return sheet;
}

function ensureOrderHeaders(sheet) {
  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const missingHeaders = ORDERS_HEADERS.filter(header => !currentHeaders.includes(header));

  if (!missingHeaders.length) return;

  sheet.getRange(1, currentHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function createOrderId() {
  const now = new Date();
  const date = Utilities.formatDate(now, 'Asia/Bangkok', 'yyyyMMdd-HHmmss');
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NUNAA-${date}-${random}`;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
