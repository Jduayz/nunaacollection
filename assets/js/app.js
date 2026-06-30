const appConfig = window.NUNAA_CONFIG || {};

const colorOptions = {
  white: { name: 'ขาว', value: '#edf1ee' },
  cream: { name: 'ครีม', value: '#e2d3b9' },
  beige: { name: 'เบจ', value: '#d8c4a3' },
  pink: { name: 'ชมพูอ่อน', value: '#e9bdc0' },
  dustyPink: { name: 'ชมพูกะปิ', value: '#de9298' },
  coral: { name: 'คอรัล', value: '#d66960' },
  rust: { name: 'ส้มอิฐ', value: '#bb4a33' },
  burgundy: { name: 'แดงไวน์', value: '#9e1c36' },
  mustard: { name: 'มัสตาร์ด', value: '#e7b65d' },
  green: { name: 'เขียว', value: '#94bd78' },
  olive: { name: 'เขียวมะกอก', value: '#4f5b2d' },
  blueGray: { name: 'ฟ้าเทา', value: '#6f7f90' },
  navy: { name: 'กรม', value: '#454b63' },
  taupe: { name: 'เทาเบจ', value: '#8d867c' },
  brown: { name: 'น้ำตาล', value: '#a8744b' },
  darkBrown: { name: 'น้ำตาลเข้ม', value: '#5a240d' },
  black: { name: 'ดำ', value: '#101010' },
  linenPattern: { name: 'ลายผ้าลินิน', value: 'linear-gradient(135deg, #f2eadb 0 35%, #b8a58a 35% 50%, #f7f4ec 50% 68%, #6f7374 68% 100%)' },
  flowerPattern: { name: 'ลายดอก', value: 'linear-gradient(135deg, #f5efd9 0 40%, #d9b184 40% 50%, #f8f1df 50% 70%, #8ea36d 70% 100%)' }
};

const colorSets = {
  cottonBasic: ['white', 'pink', 'coral', 'rust', 'burgundy', 'black'],
  cropTop: ['white', 'pink', 'dustyPink', 'coral', 'rust', 'burgundy', 'black'],
  softWarm: ['white', 'pink', 'dustyPink', 'rust', 'burgundy', 'blueGray', 'black'],
  ribbon: ['white', 'blueGray', 'black'],
  smock: ['white', 'green', 'blueGray', 'navy', 'taupe', 'darkBrown'],
  pretzel: ['white', 'cream', 'mustard', 'rust', 'taupe', 'black'],
  candy: ['white', 'mustard', 'black'],
  shorts: ['white', 'cream', 'brown', 'olive', 'taupe', 'darkBrown'],
  vest: ['white', 'dustyPink', 'burgundy', 'brown', 'darkBrown', 'black', 'blueGray', 'green'],
  linenPattern: ['linenPattern'],
  flowerPattern: ['flowerPattern']
};

function getColors(keys) {
  return keys.map(key => colorOptions[key]);
}

function getSelectedColor(product) {
  return product.colors[selectedColors.get(product.id) || 0] || product.colors[0];
}

let products = [
  {
    id: 1,
    code: 'nn-001',
    name: 'Pumpkins crop top',
    price: 250,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(['white', 'pink', 'rust', 'burgundy', 'black']),
    image: 'assets/images/products/nn-001-pumpkins-crop-top.jpeg'
  },
  {
    id: 2,
    code: 'nn-002',
    name: 'Nunaa crop top',
    price: 250,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(['white', 'pink', 'coral', 'rust', 'burgundy', 'taupe', 'black']),
    image: 'assets/images/products/nn-002-nunaa-crop-top.jpeg'
  },
  {
    id: 3,
    code: 'nn-003',
    name: 'Spaghetti strap top',
    price: 250,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(colorSets.cropTop),
    image: 'assets/images/products/nn-003-spaghetti-strap-top.jpeg'
  },
  {
    id: 4,
    code: 'nn-004',
    name: 'Spaghetti crop top',
    price: 250,
    detail: 'Cotton • Chest 26"-36"',
    colors: getColors(colorSets.softWarm),
    image: 'assets/images/products/nn-004-spaghetti-crop-top.jpeg'
  },
  {
    id: 5,
    code: 'nn-005',
    name: 'Spaghetti crop top linen fabric',
    price: 290,
    detail: 'Linen • Chest 26"-36"',
    colors: getColors(colorSets.linenPattern),
    image: 'assets/images/products/nn-005-spaghetti-crop-top-linen.jpeg'
  },
  {
    id: 6,
    code: 'nn-006',
    name: 'Nunaa crop top with ribbon',
    price: 290,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(colorSets.ribbon),
    image: 'assets/images/products/nn-006-ribbon-crop-top.jpeg'
  },
  {
    id: 7,
    code: 'nn-007',
    name: 'Smock tube top with straps',
    price: 290,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(colorSets.smock),
    image: 'assets/images/products/nn-007-smock-tube-top.jpeg'
  },
  {
    id: 8,
    code: 'nn-008',
    name: 'Pretzel top',
    price: 290,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(colorSets.pretzel),
    image: 'assets/images/products/nn-008-pretzel-top.jpeg'
  },
  {
    id: 9,
    code: 'nn-009',
    name: 'Pretzel top',
    price: 290,
    detail: 'Cotton • Chest 26"-36"',
    colors: getColors(['white', 'pink', 'brown']),
    image: 'assets/images/products/nn-009-pretzel-top.jpeg'
  },
  {
    id: 10,
    code: 'nn-010',
    name: 'Chinese collar shirt',
    price: 290,
    detail: 'Cotton • Chest 26"-36"',
    colors: getColors(['white', 'coral', 'burgundy']),
    image: 'assets/images/products/nn-010-chinese-collar-shirt.jpeg'
  },
  {
    id: 11,
    code: 'nn-011',
    name: 'Cupcake top',
    price: 290,
    detail: 'Cotton • Chest 28"-36"',
    colors: getColors(['white', 'pink', 'dustyPink', 'cream', 'green', 'blueGray']),
    image: 'assets/images/products/nn-011-cupcake-top.jpeg'
  },
  {
    id: 12,
    code: 'nn-012',
    name: 'Puff Sleeve',
    price: 290,
    detail: 'Cotton • Chest 26"-36"',
    colors: getColors(['white', 'cream', 'taupe', 'green', 'blueGray']),
    image: 'assets/images/products/nn-012-puff-sleeve.jpeg'
  },
  {
    id: 13,
    code: 'nn-013',
    name: 'Smock tube top with straps',
    price: 290,
    detail: 'Cotton + salou cotton • Chest 24"-36"',
    colors: getColors(['white', 'brown', 'blueGray']),
    image: 'assets/images/products/nn-013-smock-tube-flower.jpeg'
  },
  {
    id: 14,
    code: 'nn-014',
    name: 'Nunaa mini skirt',
    price: 290,
    detail: 'Cotton • Waist 24"-36"',
    colors: getColors(['white', 'brown']),
    image: 'assets/images/products/nn-014-nunaa-mini-skirt.jpeg'
  },
  {
    id: 15,
    code: 'nn-015',
    name: 'Nunaa shorts',
    price: 290,
    detail: 'Cotton • S/M size',
    colors: getColors(colorSets.shorts),
    image: 'assets/images/products/nn-015-nunaa-shorts.jpeg'
  },
  {
    id: 16,
    code: 'nn-016',
    name: 'Button crop top',
    price: 320,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(['white', 'cream', 'mustard', 'green', 'brown']),
    image: 'assets/images/products/nn-016-button-crop-top.jpeg'
  },
  {
    id: 17,
    code: 'nn-017',
    name: 'Nunaa vest',
    price: 320,
    detail: 'Cotton • Chest 36"',
    colors: getColors(colorSets.vest),
    image: 'assets/images/products/nn-017-nunaa-vest.jpeg'
  },
  {
    id: 18,
    code: 'nn-018',
    name: 'Smock tube top with straps',
    price: 320,
    detail: 'Cotton with linen • Chest 24"-36"',
    colors: getColors(colorSets.linenPattern),
    image: 'assets/images/products/nn-018-smock-tube-basic-stripes.jpeg'
  },
  {
    id: 19,
    code: 'nn-019 + nn-020',
    name: 'Spaghetti crop top + Shorts',
    price: 640,
    detail: 'Flowers collection • Set',
    colors: getColors(colorSets.flowerPattern),
    image: 'assets/images/products/nn-019-020-flower-set.jpeg'
  },
  {
    id: 20,
    code: 'nn-021 + nn-022',
    name: 'Puff Sleeve + Skirt',
    price: 640,
    detail: 'Flowers collection • Set',
    colors: getColors(colorSets.flowerPattern),
    image: 'assets/images/products/nn-021-022-flower-set.jpeg'
  },
  {
    id: 21,
    code: 'nn-023',
    name: 'Cupcake top linen fabric',
    price: 350,
    detail: 'Linen • Chest 24"-36"',
    colors: getColors(colorSets.linenPattern),
    image: 'assets/images/products/nn-023-cupcake-top-linen.jpeg'
  },
  {
    id: 22,
    code: 'nn-024',
    name: 'Long sleeve candy collection',
    price: 350,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(colorSets.candy),
    image: 'assets/images/products/nn-024-long-sleeve-candy.jpeg'
  },
  {
    id: 23,
    code: 'nn-025',
    name: 'Long sleeve crop top cotton',
    price: 350,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(['white', 'cream', 'brown']),
    image: 'assets/images/products/nn-025-long-sleeve-crop-top-cotton.jpeg'
  },
  {
    id: 24,
    code: 'nn-026',
    name: 'Long sleeve crop top linen',
    price: 420,
    detail: 'Linen • Chest 24"-36"',
    colors: getColors(colorSets.linenPattern),
    image: 'assets/images/products/nn-026-long-sleeve-crop-top-linen.jpeg'
  },
  {
    id: 25,
    code: 'nn-027',
    name: 'Nunaa cotton coat',
    price: 420,
    detail: 'Cotton • Chest 40"',
    colors: getColors(['white', 'cream', 'black']),
    image: 'assets/images/products/nn-027-nunaa-cotton-coat.jpeg'
  }
];

const cart = [];
const selectedColors = new Map();
const formatter = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 });
let currentOrderId = '';

const productGrid = document.querySelector('#productGrid');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const cartCount = document.querySelector('#cartCount');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const checkoutForm = document.querySelector('#checkoutForm');
const orderSummary = document.querySelector('#orderSummary');
const copyStatus = document.querySelector('#copyStatus');
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerAddress = document.querySelector('#customerAddress');
const customerProvince = document.querySelector('#customerProvince');
const customerPostal = document.querySelector('#customerPostal');
const customerNote = document.querySelector('#customerNote');

function createOrderId() {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('');
  const timePart = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join('');
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NUNAA-${datePart}-${timePart}-${randomPart}`;
}

function isStockManaged(color) {
  return Number.isFinite(Number(color.stock));
}

function getCartQuantity(code, colorName) {
  return cart.filter(item => item.code === code && item.selectedColor.name === colorName).length;
}

function getRemainingStock(product, color) {
  if (!isStockManaged(color)) return Infinity;
  return Math.max(0, Number(color.stock) - getCartQuantity(product.code, color.name));
}

function isColorAvailable(product, color) {
  return getRemainingStock(product, color) > 0;
}

function getProductAvailability(product) {
  return product.colors.some(color => isColorAvailable(product, color));
}

function formatStockText(product) {
  const selectedColor = getSelectedColor(product);
  if (!isStockManaged(selectedColor)) return 'พร้อมสั่งซื้อ';
  const remaining = getRemainingStock(product, selectedColor);
  return remaining > 0 ? `เหลือ ${remaining} ชิ้น` : 'สินค้าหมด';
}

function normalizeProduct(row, index) {
  const colors = Array.isArray(row.colors) && row.colors.length > 0
    ? row.colors.map(color => ({
      name: color.name || color.colorName || 'ไม่ระบุสี',
      value: color.value || color.colorValue || '#edf1ee',
      stock: color.stock === '' || color.stock === undefined ? undefined : Number(color.stock)
    }))
    : [{ name: row.colorName || 'ไม่ระบุสี', value: row.colorValue || '#edf1ee', stock: Number(row.stock) }];

  return {
    id: index + 1,
    code: row.code,
    name: row.name,
    price: Number(row.price) || 0,
    detail: row.detail || '',
    image: row.image || '',
    colors
  };
}

async function loadProductsFromSheet() {
  if (!appConfig.appsScriptUrl) return;

  try {
    const response = await fetch(`${appConfig.appsScriptUrl}?action=products`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Products API failed');
    const data = await response.json();
    const sheetProducts = Array.isArray(data.products) ? data.products : [];
    if (sheetProducts.length > 0) {
      products = sheetProducts.map(normalizeProduct);
    }
  } catch (error) {
    console.warn('Using fallback products because Google Sheets data could not be loaded.', error);
  }
}

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card${getProductAvailability(product) ? '' : ' sold-out'}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-meta">
        <div>
          <span class="product-code">${product.code}</span>
          <h3>${product.name}</h3>
          <p>${product.detail}</p>
        </div>
        <strong>${formatter.format(product.price)}</strong>
      </div>
      <p class="stock-status" data-stock-id="${product.id}">${formatStockText(product)}</p>
      <div class="color-picker" role="group" aria-label="เลือกสี ${product.name}">
        <span>สี</span>
        <div class="color-options">
          ${product.colors.map((color, index) => `
            <button
              class="color-swatch${index === 0 ? ' selected' : ''}"
              type="button"
              data-id="${product.id}"
              data-color-index="${index}"
              aria-label="${product.name} สี${color.name}"
              aria-pressed="${index === 0 ? 'true' : 'false'}"
              title="${color.name}"
              ${isColorAvailable(product, color) ? '' : 'disabled'}
            >
              <span style="background: ${color.value};"></span>
            </button>
          `).join('')}
        </div>
      </div>
      <button class="button primary add-cart" data-id="${product.id}" ${getProductAvailability(product) ? '' : 'disabled'}>เพิ่มลงตะกร้า</button>
    </article>
  `).join('');
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>ยังไม่มีสินค้าในตะกร้า</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-row">
        <span>${item.code} • ${item.name} • สี${item.selectedColor.name}</span>
        <strong>${formatter.format(item.price)}</strong>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatter.format(total);
  cartCount.textContent = cart.length;
  renderOrderSummary();
}

function buildOrderSummary() {
  if (cart.length === 0) {
    return 'เลือกสินค้าในตะกร้าเพื่อสร้างสรุปออเดอร์';
  }

  const orderItems = cart.map((item, index) => (
    `${index + 1}. ${item.code} • ${item.name} • สี${item.selectedColor.name} - ${formatter.format(item.price)}`
  )).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return [
    'Nunaa.Collection Order',
    `Order ID: ${currentOrderId || 'จะสร้างเมื่อกดคัดลอกออเดอร์'}`,
    '',
    'รายการสินค้า',
    orderItems,
    `รวมทั้งหมด: ${formatter.format(total)}`,
    '',
    'ข้อมูลจัดส่ง',
    `ชื่อ: ${customerName.value.trim() || '-'}`,
    `เบอร์: ${customerPhone.value.trim() || '-'}`,
    `ที่อยู่: ${customerAddress.value.trim() || '-'}`,
    `จังหวัด: ${customerProvince.value.trim() || '-'}`,
    `รหัสไปรษณีย์: ${customerPostal.value.trim() || '-'}`,
    `หมายเหตุ: ${customerNote.value.trim() || '-'}`
  ].join('\n');
}

function buildOrderPayload() {
  const items = cart.map(item => ({
    code: item.code,
    name: item.name,
    colorName: item.selectedColor.name,
    price: item.price,
    quantity: 1
  }));

  return {
    orderId: currentOrderId,
    customer: {
      name: customerName.value.trim(),
      phone: customerPhone.value.trim(),
      address: customerAddress.value.trim(),
      province: customerProvince.value.trim(),
      postal: customerPostal.value.trim(),
      note: customerNote.value.trim()
    },
    items,
    total: cart.reduce((sum, item) => sum + item.price, 0),
    summary: buildOrderSummary()
  };
}

async function submitOrderToSheet() {
  if (!appConfig.appsScriptUrl) {
    return { ok: true, skipped: true };
  }

  const response = await fetch(appConfig.appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(buildOrderPayload())
  });
  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || 'ไม่สามารถบันทึกออเดอร์ได้');
  }

  if (data.orderId) {
    currentOrderId = data.orderId;
    renderOrderSummary();
  }

  return data;
}

function renderOrderSummary() {
  orderSummary.textContent = buildOrderSummary();
}

productGrid.addEventListener('click', event => {
  const colorButton = event.target.closest('.color-swatch');
  if (colorButton) {
    const productId = Number(colorButton.dataset.id);
    const product = products.find(item => item.id === productId);
    selectedColors.set(productId, Number(colorButton.dataset.colorIndex));

    const card = colorButton.closest('.product-card');
    card.querySelectorAll('.color-swatch').forEach(swatch => {
      const isSelected = swatch === colorButton;
      swatch.classList.toggle('selected', isSelected);
      swatch.setAttribute('aria-pressed', String(isSelected));
    });

    const stockStatus = card.querySelector('[data-stock-id]');
    if (stockStatus && product) stockStatus.textContent = formatStockText(product);
    return;
  }

  const button = event.target.closest('.add-cart');
  if (!button) return;
  const product = products.find(item => item.id === Number(button.dataset.id));
  const selectedColor = getSelectedColor(product);

  if (!selectedColor || !isColorAvailable(product, selectedColor)) {
    button.textContent = 'สินค้าหมด';
    window.setTimeout(() => {
      button.textContent = 'เพิ่มลงตะกร้า';
    }, 1200);
    return;
  }

  cart.push({ ...product, selectedColor });
  renderCart();

  button.textContent = 'เพิ่มแล้ว';
  button.classList.add('added');
  window.setTimeout(() => {
    button.textContent = 'เพิ่มลงตะกร้า';
    button.classList.remove('added');
  }, 1200);

  const card = button.closest('.product-card');
  const stockStatus = card.querySelector('[data-stock-id]');
  if (stockStatus) stockStatus.textContent = formatStockText(product);
});

menuButton.addEventListener('click', () => {
  nav.classList.toggle('open');
});

checkoutForm.addEventListener('input', () => {
  copyStatus.textContent = '';
  renderOrderSummary();
});

checkoutForm.addEventListener('submit', async event => {
  event.preventDefault();

  if (cart.length === 0) {
    copyStatus.textContent = 'กรุณาเลือกสินค้าในตะกร้าก่อนสร้างออเดอร์';
    document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  currentOrderId = createOrderId();
  renderOrderSummary();

  try {
    await submitOrderToSheet();
    await navigator.clipboard.writeText(orderSummary.textContent);
    copyStatus.textContent = `สร้าง ${currentOrderId} และคัดลอกออเดอร์แล้ว สามารถส่งให้ร้านทาง Instagram ได้เลย`;
  } catch (error) {
    copyStatus.textContent = `สร้าง ${currentOrderId} แล้ว แต่ยังบันทึก/คัดลอกไม่สำเร็จ: ${error.message}`;
  }
});

async function init() {
  await loadProductsFromSheet();
  renderProducts();
  renderCart();
}

init();
