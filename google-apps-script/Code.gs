const PRODUCTS_SHEET = 'Products';
const ORDERS_SHEET = 'Orders';
const SPREADSHEET_ID = '1J_9ip5tz6MrVN4XFrMEzvwvxvARmLETtsDs-qX4vg-g';
const ORDERS_HEADERS = [
  'createdAt',
  'orderId',
  'status',
  'expiresAt',
  'stockDeducted',
  'paidAt',
  'paymentReportedAt',
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

const FLOWER_VARIANT_PRODUCTS = [
  {
    code: 'nn-019',
    name: 'Spaghetti crop top (Flowers collection)',
    price: 290,
    detail: 'Salou cotton • Chest 26"-36" • Length 13" (excluding straps)',
    image: 'assets/images/products/nn-019-spaghetti-crop-top-flowers.jpeg'
  },
  {
    code: 'nn-020',
    name: 'Nunaa Shorts (Flowers collection)',
    price: 350,
    detail: 'Salou cotton • Waist 24"-36" • Hips 40" • Length 14"',
    image: 'assets/images/products/nn-020-nunaa-shorts-flowers.jpeg'
  },
  {
    code: 'nn-021',
    name: 'Puff Sleeve (Flowers collection)',
    price: 290,
    detail: 'Salou cotton • Chest 26"-36" • Length 13" (excluding straps)',
    image: 'assets/images/products/nn-021-puff-sleeve-flowers.jpeg'
  },
  {
    code: 'nn-022',
    name: 'Skirt (Flowers collection)',
    price: 350,
    detail: 'Salou cotton • Waist 24"-36" • Length 15"',
    image: 'assets/images/products/nn-022-skirt-flowers.jpeg'
  }
];

const FLOWER_VARIANTS = [
  { name: 'A', value: "url('assets/images/patterns/flower-a.jpeg') center / cover no-repeat" },
  { name: 'B', value: "url('assets/images/patterns/flower-b.jpeg') center / cover no-repeat" },
  { name: 'C', value: "url('assets/images/patterns/flower-c.jpeg') center / cover no-repeat" },
  { name: 'D', value: "url('assets/images/patterns/flower-d.jpeg') center / cover no-repeat" }
];

function doGet(event) {
  const action = event.parameter.action || 'products';

  if (action === 'products') {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    try {
      ensureFlowerProductsAreVariants();
      expirePendingOrders();
      return jsonResponse({ ok: true, products: getProducts() });
    } finally {
      lock.releaseLock();
    }
  }

  return jsonResponse({ ok: false, message: 'Unknown action' }, 400);
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const result = payload.action === 'reportPayment'
      ? reportPayment(payload)
      : createOrder(payload);
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message }, 400);
  }
}

function updateFlowerProductsToVariants() {
  const sheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${PRODUCTS_SHEET}`);

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  if (values.length < 1) throw new Error('Products sheet is empty');

  const headers = values[0].map(String);
  ensureProductHeaders(headers);

  const codeIndex = headers.indexOf('code');
  const colorNameIndex = headers.indexOf('colorName');
  const stockIndex = headers.indexOf('stock');
  const targetCodes = FLOWER_VARIANT_PRODUCTS.map(product => product.code);
  const existingStock = {};
  const keptRows = [values[0]];

  values.slice(1).forEach(row => {
    const code = String(row[codeIndex] || '');
    if (!targetCodes.includes(code)) {
      keptRows.push(row);
      return;
    }

    const colorName = String(row[colorNameIndex] || '').trim();
    const stock = Number(row[stockIndex] || 0);
    if (!existingStock[code]) existingStock[code] = {};

    if (FLOWER_VARIANTS.some(variant => variant.name === colorName)) {
      existingStock[code][colorName] = stock;
    } else if (existingStock[code].A === undefined) {
      existingStock[code].A = stock;
    }
  });

  FLOWER_VARIANT_PRODUCTS.forEach(product => {
    FLOWER_VARIANTS.forEach(variant => {
      const stock = existingStock[product.code]?.[variant.name] ?? 0;
      keptRows.push(buildProductRow(headers, {
        code: product.code,
        name: product.name,
        price: product.price,
        detail: product.detail,
        image: product.image,
        colorName: variant.name,
        colorValue: variant.value,
        stock,
        active: true
      }));
    });
  });

  sheet.clearContents();
  sheet.getRange(1, 1, keptRows.length, headers.length).setValues(keptRows);

  return `Updated ${FLOWER_VARIANT_PRODUCTS.length} products into ${FLOWER_VARIANT_PRODUCTS.length * FLOWER_VARIANTS.length} variant rows.`;
}

function ensureFlowerProductsAreVariants() {
  const sheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${PRODUCTS_SHEET}`);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    updateFlowerProductsToVariants();
    return;
  }

  const headers = values[0].map(String);
  ensureProductHeaders(headers);

  const codeIndex = headers.indexOf('code');
  const colorNameIndex = headers.indexOf('colorName');
  const targetCodes = FLOWER_VARIANT_PRODUCTS.map(product => product.code);
  const expectedColors = FLOWER_VARIANTS.map(variant => variant.name);
  const colorMap = {};
  let needsUpdate = false;

  targetCodes.forEach(code => {
    colorMap[code] = {};
  });

  values.slice(1).forEach(row => {
    const code = String(row[codeIndex] || '');
    if (!targetCodes.includes(code)) return;

    const colorName = String(row[colorNameIndex] || '').trim();
    if (!expectedColors.includes(colorName)) {
      needsUpdate = true;
      return;
    }

    colorMap[code][colorName] = true;
  });

  targetCodes.forEach(code => {
    expectedColors.forEach(colorName => {
      if (!colorMap[code][colorName]) needsUpdate = true;
    });
  });

  if (needsUpdate) updateFlowerProductsToVariants();
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
    ensureFlowerProductsAreVariants();
    expirePendingOrders();
    const orderId = payload.orderId || createOrderId();
    const items = payload.items || [];
    if (!items.length) throw new Error('ไม่มีสินค้าในออเดอร์');

    const ordersSheet = getOrCreateOrdersSheet();
    const existingOrder = findOrderById(ordersSheet, orderId);
    if (existingOrder) {
      const existingStatus = String(existingOrder.status || 'pending').toLowerCase();
      if (existingStatus !== 'pending' && existingStatus !== 'payment_reported' && existingStatus !== 'paid') {
        throw new Error(`ออเดอร์ ${orderId} อยู่ในสถานะ ${existingStatus} กรุณาสร้างออเดอร์ใหม่`);
      }
      return {
        ok: true,
        orderId,
        status: existingStatus,
        stockDeducted: String(existingOrder.stockDeducted).toLowerCase() === 'true',
        duplicate: true,
        products: getProducts()
      };
    }
    validateStock(items);
    reduceStock(items);
    appendPendingOrder(ordersSheet, orderId, payload, items, true);

    return { ok: true, orderId, status: 'pending', stockDeducted: true, products: getProducts() };
  } finally {
    lock.releaseLock();
  }
}

function reportPayment(payload) {
  const orderId = String(payload.orderId || '').trim();
  if (!orderId) throw new Error('ไม่พบ Order ID');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    expirePendingOrders();
    const sheet = getOrCreateOrdersSheet();
    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(String);
    const orderIdIndex = headers.indexOf('orderId');
    const statusIndex = headers.indexOf('status');
    const paymentReportedAtIndex = headers.indexOf('paymentReportedAt');

    for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
      if (String(values[rowIndex][orderIdIndex]) !== orderId) continue;

      const status = String(values[rowIndex][statusIndex] || '').toLowerCase();
      if (status === 'payment_reported' || status === 'paid') {
        return { ok: true, orderId, status };
      }
      if (status !== 'pending') {
        throw new Error(`ออเดอร์ ${orderId} อยู่ในสถานะ ${status} ไม่สามารถแจ้งชำระเงินได้`);
      }

      sheet.getRange(rowIndex + 1, statusIndex + 1).setValue('payment_reported');
      if (paymentReportedAtIndex >= 0) {
        sheet.getRange(rowIndex + 1, paymentReportedAtIndex + 1).setValue(new Date());
      }
      return { ok: true, orderId, status: 'payment_reported' };
    }

    throw new Error(`ไม่พบออเดอร์ ${orderId}`);
  } finally {
    lock.releaseLock();
  }
}

function findOrderById(sheet, orderId) {
  if (!orderId || sheet.getLastRow() < 2) return null;

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const orderIdIndex = headers.indexOf('orderId');
  if (orderIdIndex < 0) return null;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (String(values[rowIndex][orderIdIndex]) !== String(orderId)) continue;
    return headers.reduce((order, header, columnIndex) => {
      order[header] = values[rowIndex][columnIndex];
      return order;
    }, {});
  }
  return null;
}

function appendPendingOrder(sheet, orderId, payload, items, stockDeducted) {
  const customer = payload.customer || {};
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const values = {
    createdAt: new Date(),
    orderId,
    status: 'pending',
    expiresAt: payload.pendingExpiresAt ? new Date(payload.pendingExpiresAt) : createPendingExpiresAt(),
    stockDeducted: Boolean(stockDeducted),
    paidAt: '',
    paymentReportedAt: '',
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
  handleOrderStatusEdit(event);
}

function handleOrderStatusEdit(event) {
  if (!event || !event.range) return;
  const range = event.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== ORDERS_SHEET || range.getRow() === 1) return;

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const statusColumn = headers.indexOf('status') + 1;
  if (range.getColumn() !== statusColumn) return;

  const status = String(range.getValue()).toLowerCase();

  if (status === 'paid') {
    expirePendingOrders(sheet);
    deductStockForOrderRow(sheet, range.getRow());
  } else if (status === 'cancelled' || status === 'canceled' || status === 'expired' || status === 'payment_rejected') {
    restoreStockForOrderRow(sheet, range.getRow());
  }
}

function processCancelledOrders() {
  const sheet = getOrCreateOrdersSheet();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return 'No orders to process.';

  const headers = values[0].map(String);
  const statusIndex = headers.indexOf('status');
  const stockDeductedIndex = headers.indexOf('stockDeducted');
  if (statusIndex < 0 || stockDeductedIndex < 0) {
    throw new Error('Orders sheet ต้องมี column: status, stockDeducted');
  }

  let restoredCount = 0;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const status = String(values[rowIndex][statusIndex] || '').toLowerCase();
    const stockDeducted = String(values[rowIndex][stockDeductedIndex] || '').toLowerCase();
    if ((status === 'cancelled' || status === 'canceled' || status === 'expired' || status === 'payment_rejected') && stockDeducted === 'true') {
      restoreStockForOrderRow(sheet, rowIndex + 1);
      restoredCount += 1;
    }
  }

  return `Restored stock for ${restoredCount} order(s).`;
}

function setupOrderEditTrigger() {
  const spreadsheet = getSpreadsheet();
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'handleOrderStatusEdit')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('handleOrderStatusEdit')
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();

  return 'Installed order status edit trigger.';
}

function processPaidOrders() {
  const sheet = getOrCreateOrdersSheet();
  expirePendingOrders(sheet);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const statusIndex = headers.indexOf('status');
  const stockDeductedIndex = headers.indexOf('stockDeducted');
  const paidAtIndex = headers.indexOf('paidAt');

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const status = String(values[rowIndex][statusIndex] || '').toLowerCase();
    const stockDeducted = String(values[rowIndex][stockDeductedIndex] || '').toLowerCase();
    const paidAt = paidAtIndex >= 0 ? values[rowIndex][paidAtIndex] : '';
    if (status === 'paid' && (stockDeducted !== 'true' || !paidAt)) {
      deductStockForOrderRow(sheet, rowIndex + 1);
    }
  }
}

function expirePendingOrders(sheet) {
  const ordersSheet = sheet || getOrCreateOrdersSheet();
  const values = ordersSheet.getDataRange().getValues();
  if (values.length < 2) return;

  const headers = values[0].map(String);
  const statusIndex = headers.indexOf('status');
  const expiresAtIndex = headers.indexOf('expiresAt');
  const stockDeductedIndex = headers.indexOf('stockDeducted');
  if (statusIndex < 0 || expiresAtIndex < 0) return;

  const now = new Date();
  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const status = String(values[rowIndex][statusIndex] || '').toLowerCase();
    const stockDeducted = stockDeductedIndex >= 0
      ? String(values[rowIndex][stockDeductedIndex] || '').toLowerCase()
      : 'false';
    const expiresAt = values[rowIndex][expiresAtIndex];

    if (status === 'pending' && expiresAt && new Date(expiresAt) <= now) {
      if (stockDeducted === 'true') {
        const itemsIndex = headers.indexOf('items');
        const items = JSON.parse(values[rowIndex][itemsIndex] || '[]');
        restoreStock(items);
        if (stockDeductedIndex >= 0) {
          ordersSheet.getRange(rowIndex + 1, stockDeductedIndex + 1).setValue(false);
        }
      }
      ordersSheet.getRange(rowIndex + 1, statusIndex + 1).setValue('expired');
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

    const items = JSON.parse(row[itemsIndex] || '[]');
    if (String(row[stockDeductedIndex]).toLowerCase() !== 'true') {
      reduceStock(items);
      ordersSheet.getRange(rowNumber, stockDeductedIndex + 1).setValue(true);
    }

    if (!row[paidAtIndex]) {
      ordersSheet.getRange(rowNumber, paidAtIndex + 1).setValue(new Date());
    }
  } finally {
    lock.releaseLock();
  }
}

function restoreStockForOrderRow(ordersSheet, rowNumber) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const headers = ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0].map(String);
    const row = ordersSheet.getRange(rowNumber, 1, 1, ordersSheet.getLastColumn()).getValues()[0];
    const stockDeductedIndex = headers.indexOf('stockDeducted');
    const itemsIndex = headers.indexOf('items');

    if (stockDeductedIndex < 0 || itemsIndex < 0) return;
    if (String(row[stockDeductedIndex]).toLowerCase() !== 'true') return;

    const items = JSON.parse(row[itemsIndex] || '[]');
    restoreStock(items);

    ordersSheet.getRange(rowNumber, stockDeductedIndex + 1).setValue(false);
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

function restoreStock(items) {
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
    const newStock = currentStock + quantity;
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

function ensureProductHeaders(headers) {
  const requiredHeaders = ['code', 'name', 'price', 'detail', 'image', 'colorName', 'colorValue', 'stock', 'active'];
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

  if (missingHeaders.length) {
    throw new Error(`Products sheet ต้องมี column: ${missingHeaders.join(', ')}`);
  }
}

function buildProductRow(headers, values) {
  return headers.map(header => {
    if (values[header] === undefined) return '';
    return values[header];
  });
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

function createPendingExpiresAt() {
  return new Date(Date.now() + (15 * 60 * 1000));
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
