const PRODUCTS_SHEET = 'Products';
const ORDERS_SHEET = 'Orders';
const SPREADSHEET_ID = '1J_9ip5tz6MrVN4XFrMEzvwvxvARmLETtsDs-qX4vg-g';
const EMS_FLAT_RATE = 60;
const EMS_FLAT_RATE_MAX_ITEMS = 10;
const MAX_QUANTITY_PER_ITEM = 10;
const MAX_ITEMS_PER_ORDER = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMITS = { createOrder: 5, reportPayment: 10, orderStatus: 20 };
const PAYMENT_REVIEW_HOURS = 24;
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
  { name: 'B', value: "url('assets/images/patterns/flower-b-filled.jpeg') center / cover no-repeat" },
  { name: 'C', value: "url('assets/images/patterns/flower-c-filled.jpeg') center / cover no-repeat" },
  { name: 'D', value: "url('assets/images/patterns/flower-d.jpeg') center / cover no-repeat" }
];

const NN013_BOTTOM_VARIANTS = [
  { name: 'ขาว', value: '#edf1ee' },
  { name: 'น้ำตาล', value: '#a8744b' },
  { name: 'ฟ้าเทา', value: '#6f7f90' }
];

function doGet(event) {
  const action = event.parameter.action || 'products';

  if (action === 'orderStatus') {
    try {
      enforceRateLimit('orderStatus', event.parameter.clientId);
      return jsonResponse(getOrderStatus(event.parameter.orderId));
    } catch (error) {
      return jsonResponse({ ok: false, message: error.message });
    }
  }

  if (action === 'products') {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    try {
      ensureNn013CombinationVariants();
      ensureFlowerProductsAreVariants();
      ensureNn027BlueVariant();
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
    if (payload.website) throw new Error('ไม่สามารถส่งคำขอนี้ได้');
    const action = payload.action === 'reportPayment' ? 'reportPayment' : 'createOrder';
    enforceRateLimit(action, payload.clientId);
    verifyCaptcha(payload.captchaToken);
    const result = payload.action === 'reportPayment'
      ? reportPayment(payload)
      : createOrder(payload);
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message }, 400);
  }
}

function enforceRateLimit(action, clientId) {
  const id = String(clientId || '').trim();
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(id)) throw new Error('Client ID ไม่ถูกต้อง กรุณารีเฟรชหน้าแล้วลองใหม่');
  const cache = CacheService.getScriptCache();
  const digest = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, id)).slice(0, 32);
  const key = `rate:${action}:${digest}`;
  const count = Number(cache.get(key) || 0) + 1;
  if (count > (RATE_LIMITS[action] || 5)) throw new Error('ส่งคำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่');
  cache.put(key, String(count), RATE_LIMIT_WINDOW_SECONDS);
}

function verifyCaptcha(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET_KEY');
  if (!secret) return;
  if (!token) throw new Error('กรุณายืนยัน CAPTCHA');
  const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post', payload: { secret, response: String(token) }, muteHttpExceptions: true
  });
  const result = JSON.parse(response.getContentText() || '{}');
  if (!result.success) throw new Error('CAPTCHA ไม่ผ่าน กรุณาลองใหม่');
}

function getOrderStatus(value) {
  const orderId = validateOrderId(value);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    expirePendingOrders();
    const order = findOrderById(getOrCreateOrdersSheet(), orderId);
    if (!order) throw new Error(`ไม่พบออเดอร์ ${orderId}`);
    return {
      ok: true,
      orderId,
      status: String(order.status || 'pending').toLowerCase(),
      createdAt: toIsoString(order.createdAt),
      expiresAt: toIsoString(order.expiresAt),
      paidAt: toIsoString(order.paidAt),
      total: Number(order.total || 0)
    };
  } finally {
    lock.releaseLock();
  }
}

function toIsoString(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
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

function ensureNn013CombinationVariants() {
  const sheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${PRODUCTS_SHEET}`);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return;
  const headers = values[0].map(String);
  ensureProductHeaders(headers);
  const codeIndex = headers.indexOf('code');
  const colorNameIndex = headers.indexOf('colorName');
  const stockIndex = headers.indexOf('stock');
  const nn013Rows = values.slice(1).filter(row => String(row[codeIndex]) === 'nn-013');
  if (!nn013Rows.length) return;

  const expectedNames = FLOWER_VARIANTS.flatMap(pattern => (
    NN013_BOTTOM_VARIANTS.map(bottom => `${pattern.name} / ${bottom.name}`)
  ));
  const existingNames = new Set(nn013Rows.map(row => String(row[colorNameIndex]).trim()));
  if (expectedNames.every(name => existingNames.has(name)) && nn013Rows.length === expectedNames.length) return;

  const exactStock = {};
  const legacyStock = {};
  nn013Rows.forEach(row => {
    const colorName = String(row[colorNameIndex] || '').trim();
    const stock = Number(row[stockIndex] || 0);
    if (expectedNames.includes(colorName)) exactStock[colorName] = stock;
    if (NN013_BOTTOM_VARIANTS.some(bottom => bottom.name === colorName)) legacyStock[colorName] = stock;
  });

  const source = headers.reduce((product, header, index) => {
    product[header] = nn013Rows[0][index];
    return product;
  }, {});
  const updatedRows = [values[0], ...values.slice(1).filter(row => String(row[codeIndex]) !== 'nn-013')];

  FLOWER_VARIANTS.forEach(pattern => {
    NN013_BOTTOM_VARIANTS.forEach(bottom => {
      const colorName = `${pattern.name} / ${bottom.name}`;
      updatedRows.push(buildProductRow(headers, {
        ...source,
        colorName,
        colorValue: bottom.value,
        stock: exactStock[colorName] ?? legacyStock[bottom.name] ?? 1,
        active: true
      }));
    });
  });

  sheet.clearContents();
  sheet.getRange(1, 1, updatedRows.length, headers.length).setValues(updatedRows);
}

function ensureNn027BlueVariant() {
  const sheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${PRODUCTS_SHEET}`);

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return;
  const headers = values[0].map(String);
  ensureProductHeaders(headers);
  const codeIndex = headers.indexOf('code');
  const colorNameIndex = headers.indexOf('colorName');
  const sourceRow = values.slice(1).find(row => String(row[codeIndex]) === 'nn-027');
  const alreadyExists = values.slice(1).some(row => (
    String(row[codeIndex]) === 'nn-027' && String(row[colorNameIndex]).trim() === 'ฟ้าเทา'
  ));
  if (!sourceRow || alreadyExists) return;

  const source = headers.reduce((product, header, index) => {
    product[header] = sourceRow[index];
    return product;
  }, {});
  sheet.appendRow(buildProductRow(headers, {
    ...source,
    colorName: 'ฟ้าเทา',
    colorValue: '#6f7f90',
    stock: 1,
    active: true
  }));
}

function getProducts() {
  const sheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${PRODUCTS_SHEET}`);

  const rows = getRows(sheet);
  const productMap = {};
  const reservedQuantities = getReservedQuantities();

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

    const stock = Number(row.stock || 0);
    const reservationKey = `${row.code}\u0000${row.colorName || row.color || 'ไม่ระบุสี'}`;
    productMap[row.code].colors.push({
      name: row.colorName || row.color || 'ไม่ระบุสี',
      value: row.colorValue || '#edf1ee',
      stock: Math.max(0, stock - Number(reservedQuantities[reservationKey] || 0))
    });
  });

  return Object.keys(productMap).map(code => productMap[code]);
}

function createOrder(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    ensureNn013CombinationVariants();
    ensureFlowerProductsAreVariants();
    ensureNn027BlueVariant();
    expirePendingOrders();
    const orderId = payload.orderId ? validateOrderId(payload.orderId) : createOrderId();
    const requestedItems = payload.items || [];
    if (!requestedItems.length) throw new Error('ไม่มีสินค้าในออเดอร์');

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
        total: Number(existingOrder.total || 0),
        pendingExpiresAt: existingOrder.expiresAt instanceof Date
          ? existingOrder.expiresAt.toISOString()
          : String(existingOrder.expiresAt || ''),
        summary: String(existingOrder.summary || ''),
        products: getProducts()
      };
    }
    const reservation = prepareStockReservation(requestedItems);
    const expiresAt = createPendingExpiresAt();
    const totals = calculateOrderTotals(reservation.items);
    const customer = normalizeCustomer(payload.customer || {});
    const summary = buildServerOrderSummary(orderId, customer, reservation.items, totals, expiresAt);
    const serverPayload = {
      customer,
      total: totals.total,
      summary
    };

    appendPendingOrder(ordersSheet, orderId, serverPayload, reservation.items, false, expiresAt);

    return {
      ok: true,
      orderId,
      status: 'pending',
      stockDeducted: false,
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      total: totals.total,
      pendingExpiresAt: expiresAt.toISOString(),
      summary,
      products: getProducts()
    };
  } finally {
    lock.releaseLock();
  }
}

function reportPayment(payload) {
  const orderId = validateOrderId(payload.orderId);
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
    const createdAtIndex = headers.indexOf('createdAt');
    const expiresAtIndex = headers.indexOf('expiresAt');

    for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
      if (String(values[rowIndex][orderIdIndex]) !== orderId) continue;

      const status = String(values[rowIndex][statusIndex] || '').toLowerCase();
      const reviewInfo = getPaymentReviewInfo(values[rowIndex][createdAtIndex]);
      if (status === 'payment_reported' || status === 'paid') {
        return { ok: true, orderId, status, ...reviewInfo };
      }
      if (status !== 'pending') {
        throw new Error(`ออเดอร์ ${orderId} อยู่ในสถานะ ${status} ไม่สามารถแจ้งชำระเงินได้`);
      }

      sheet.getRange(rowIndex + 1, statusIndex + 1).setValue('payment_reported');
      if (paymentReportedAtIndex >= 0) {
        sheet.getRange(rowIndex + 1, paymentReportedAtIndex + 1).setValue(new Date());
      }
      if (expiresAtIndex >= 0) {
        sheet.getRange(rowIndex + 1, expiresAtIndex + 1).setValue(new Date(Date.now() + (PAYMENT_REVIEW_HOURS * 60 * 60 * 1000)));
      }
      return { ok: true, orderId, status: 'payment_reported', ...reviewInfo };
    }

    throw new Error(`ไม่พบออเดอร์ ${orderId}`);
  } finally {
    lock.releaseLock();
  }
}

function getPaymentReviewInfo(createdAt) {
  const orderCreatedAt = createdAt ? new Date(createdAt) : new Date();
  const bangkokHour = Number(Utilities.formatDate(orderCreatedAt, 'Asia/Bangkok', 'H'));
  if (bangkokHour < 22) {
    return { afterHours: false, reviewDueAt: '' };
  }

  const bangkokDate = Utilities.formatDate(orderCreatedAt, 'Asia/Bangkok', 'yyyy-MM-dd');
  const nextDayAtOnePm = new Date(`${bangkokDate}T13:00:00+07:00`);
  nextDayAtOnePm.setTime(nextDayAtOnePm.getTime() + (24 * 60 * 60 * 1000));
  return { afterHours: true, reviewDueAt: nextDayAtOnePm.toISOString() };
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

function prepareStockReservation(requestedItems) {
  if (!Array.isArray(requestedItems) || !requestedItems.length) {
    throw new Error('ไม่มีสินค้าในออเดอร์');
  }

  const aggregated = {};
  let totalQuantity = 0;
  requestedItems.forEach(item => {
    const code = String(item.code || '').trim();
    const colorName = String(item.colorName || '').trim();
    const quantity = Number(item.quantity);
    if (!code || !colorName) throw new Error('ข้อมูลสินค้าไม่ครบถ้วน');
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      throw new Error(`จำนวนสินค้า ${code} ต้องเป็นจำนวนเต็ม 1-${MAX_QUANTITY_PER_ITEM}`);
    }

    const key = `${code}\u0000${colorName}`;
    if (!aggregated[key]) aggregated[key] = { code, colorName, quantity: 0 };
    aggregated[key].quantity += quantity;
    if (aggregated[key].quantity > MAX_QUANTITY_PER_ITEM) {
      throw new Error(`จำนวนสินค้า ${code} ต้องไม่เกิน ${MAX_QUANTITY_PER_ITEM} ชิ้น`);
    }
    totalQuantity += quantity;
  });
  if (totalQuantity > MAX_ITEMS_PER_ORDER) {
    throw new Error(`หนึ่งออเดอร์สั่งได้ไม่เกิน ${MAX_ITEMS_PER_ORDER} ชิ้น`);
  }

  const sheet = getSpreadsheet().getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`Missing sheet: ${PRODUCTS_SHEET}`);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const codeIndex = headers.indexOf('code');
  const nameIndex = headers.indexOf('name');
  const colorIndex = headers.indexOf('colorName') >= 0 ? headers.indexOf('colorName') : headers.indexOf('color');
  const priceIndex = headers.indexOf('price');
  const stockIndex = headers.indexOf('stock');
  const activeIndex = headers.indexOf('active');
  if ([codeIndex, nameIndex, colorIndex, priceIndex, stockIndex].some(index => index < 0)) {
    throw new Error('Products sheet มี column ไม่ครบสำหรับสร้างออเดอร์');
  }

  const reservedQuantities = getReservedQuantities();
  const items = Object.keys(aggregated).map(key => {
    const requested = aggregated[key];
    const rowIndex = findProductRow(values, codeIndex, colorIndex, requested.code, requested.colorName);
    if (rowIndex < 1) throw new Error(`ไม่พบสินค้า ${requested.code} สี${requested.colorName}`);

    const active = activeIndex < 0 || !['false', '0'].includes(String(values[rowIndex][activeIndex]).toLowerCase());
    if (!active) throw new Error(`สินค้า ${requested.code} สี${requested.colorName} ไม่เปิดจำหน่าย`);
    const currentStock = Number(values[rowIndex][stockIndex]);
    const price = Number(values[rowIndex][priceIndex]);
    const reserved = Number(reservedQuantities[key] || 0);
    const availableStock = Math.max(0, currentStock - reserved);
    if (!Number.isFinite(currentStock) || availableStock < requested.quantity) {
      throw new Error(`${requested.code} สี${requested.colorName} เหลือ ${availableStock} ชิ้น`);
    }
    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`ราคาสินค้า ${requested.code} ไม่ถูกต้อง`);
    }

    return {
      code: String(values[rowIndex][codeIndex]),
      name: String(values[rowIndex][nameIndex] || requested.code),
      colorName: String(values[rowIndex][colorIndex]),
      price,
      quantity: requested.quantity
    };
  });

  return { items };
}

function getReservedQuantities() {
  const sheet = getOrCreateOrdersSheet();
  const rows = getRows(sheet);
  const now = Date.now();
  return rows.reduce((reserved, order) => {
    const status = String(order.status || '').toLowerCase();
    const expiresAt = order.expiresAt ? new Date(order.expiresAt).getTime() : 0;
    const alreadyDeducted = String(order.stockDeducted || '').toLowerCase() === 'true';
    if (!['pending', 'payment_reported'].includes(status) || alreadyDeducted || (expiresAt && expiresAt <= now)) return reserved;
    let items = [];
    try { items = JSON.parse(order.items || '[]'); } catch (error) { return reserved; }
    items.forEach(item => {
      const key = `${item.code}\u0000${item.colorName}`;
      reserved[key] = Number(reserved[key] || 0) + validateQuantity(item.quantity, item.code);
    });
    return reserved;
  }, {});
}

function validateOrderId(value) {
  const orderId = String(value || '').trim();
  if (!/^NUNAA-\d{8}-\d{6}-[A-Z0-9]{4}$/.test(orderId)) {
    throw new Error('Order ID ไม่ถูกต้อง');
  }
  return orderId;
}

function validateQuantity(value, code) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
    throw new Error(`จำนวนสินค้า ${code || ''} ต้องเป็นจำนวนเต็ม 1-${MAX_QUANTITY_PER_ITEM}`);
  }
  return quantity;
}

function calculateOrderTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = itemCount <= EMS_FLAT_RATE_MAX_ITEMS ? EMS_FLAT_RATE : null;
  return {
    subtotal,
    shippingFee,
    total: shippingFee === null ? subtotal : subtotal + shippingFee
  };
}

function normalizeCustomer(customer) {
  const normalized = {
    name: String(customer.name || '').trim().slice(0, 120),
    phone: String(customer.phone || '').trim().slice(0, 30),
    address: String(customer.address || '').trim().slice(0, 500),
    province: String(customer.province || '').trim().slice(0, 100),
    postal: String(customer.postal || '').trim().slice(0, 20),
    note: String(customer.note || '').trim().slice(0, 500)
  };
  if (!normalized.name || !normalized.phone || !normalized.address || !normalized.province || !normalized.postal) {
    throw new Error('กรุณากรอกข้อมูลจัดส่งให้ครบถ้วน');
  }
  const compactPhone = normalized.phone.replace(/[\s-]/g, '');
  if (!/^(?:\+66\d{8,9}|0\d{8,9})$/.test(compactPhone)) {
    throw new Error('เบอร์ติดต่อไม่ถูกต้อง กรุณากรอกเบอร์ไทย 9-10 หลัก');
  }
  if (!/^\d{5}$/.test(normalized.postal)) {
    throw new Error('รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก');
  }
  normalized.phone = compactPhone;
  return normalized;
}

function sanitizeSheetText(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function buildServerOrderSummary(orderId, customer, items, totals, expiresAt) {
  const itemLines = items.map((item, index) => (
    `${index + 1}. ${item.code} • ${item.name} • สี ${item.colorName} x ${item.quantity} - ฿${item.price * item.quantity}`
  ));
  return [
    'Nunaa.Collection Order',
    `Order ID: ${orderId}`,
    `ออเดอร์ pending หมดอายุ: ${Utilities.formatDate(expiresAt, 'Asia/Bangkok', 'dd/MM/yyyy HH:mm')}`,
    'สินค้าถูกจองระหว่างที่ออเดอร์ pending นี้ยังไม่หมดอายุ',
    '',
    'รายการสินค้า',
    ...itemLines,
    `รวมค่าสินค้า: ฿${totals.subtotal}`,
    `ค่าส่ง EMS: ${totals.shippingFee === null ? 'ทางร้านจะแจ้งภายหลัง' : `฿${totals.shippingFee}`}`,
    `ยอดรวมสุทธิ: ฿${totals.total}`,
    '',
    'ข้อมูลจัดส่ง',
    `ชื่อ: ${customer.name}`,
    `เบอร์: ${customer.phone}`,
    `ที่อยู่: ${customer.address}`,
    `จังหวัด: ${customer.province}`,
    `รหัสไปรษณีย์: ${customer.postal}`,
    `หมายเหตุ: ${customer.note || '-'}`
  ].join('\n');
}

function appendPendingOrder(sheet, orderId, payload, items, stockDeducted, expiresAt) {
  const customer = payload.customer || {};
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const values = {
    createdAt: new Date(),
    orderId,
    status: 'pending',
    expiresAt: expiresAt || createPendingExpiresAt(),
    stockDeducted: Boolean(stockDeducted),
    paidAt: '',
    paymentReportedAt: '',
    customerName: sanitizeSheetText(customer.name),
    phone: sanitizeSheetText(customer.phone),
    address: sanitizeSheetText(customer.address),
    province: sanitizeSheetText(customer.province),
    postal: sanitizeSheetText(customer.postal),
    note: sanitizeSheetText(customer.note),
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
    const quantity = validateQuantity(item.quantity, item.code);
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

    if ((status === 'pending' || status === 'payment_reported') && expiresAt && new Date(expiresAt) <= now) {
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
    const quantity = validateQuantity(item.quantity, item.code);
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
    const quantity = validateQuantity(item.quantity, item.code);
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
