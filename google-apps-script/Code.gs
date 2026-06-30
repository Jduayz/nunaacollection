const PRODUCTS_SHEET = 'Products';
const ORDERS_SHEET = 'Orders';
const SPREADSHEET_ID = '1-ytw4BwY7E0LXAvkkI7B6_G2suv60l6-d_1UmfBE4g4';

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

    const productsSheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
    const ordersSheet = getOrCreateOrdersSheet();
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

      productValues[rowIndex][stockIndex] = currentStock - quantity;
      productsSheet.getRange(rowIndex + 1, stockIndex + 1).setValue(currentStock - quantity);
    });

    ordersSheet.appendRow([
      new Date(),
      orderId,
      payload.customer && payload.customer.name,
      payload.customer && payload.customer.phone,
      payload.customer && payload.customer.address,
      payload.customer && payload.customer.province,
      payload.customer && payload.customer.postal,
      payload.customer && payload.customer.note,
      JSON.stringify(items),
      Number(payload.total || 0),
      payload.summary || ''
    ]);

    return { ok: true, orderId };
  } finally {
    lock.releaseLock();
  }
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
    sheet.appendRow([
      'createdAt',
      'orderId',
      'customerName',
      'phone',
      'address',
      'province',
      'postal',
      'note',
      'items',
      'total',
      'summary'
    ]);
  }

  return sheet;
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
