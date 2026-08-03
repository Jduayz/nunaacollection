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
  return keys.map(key => ({ key, ...colorOptions[key] }));
}

const PRODUCT_IMAGE_VERSION = '20260721-4';

function getProductImageUrl(image) {
  const url = String(image || '');
  if (!url) return '';
  return `${url}${url.includes('?') ? '&' : '?'}v=${PRODUCT_IMAGE_VERSION}`;
}

const stoneWashColorOptions = [
  {
    key: 'stoneWashA',
    name: 'A',
    value: 'repeating-linear-gradient(90deg, #6685a3 0 6px, #9aafc2 6px 10px, #3f6486 10px 15px)'
  },
  {
    key: 'stoneWashB',
    name: 'B',
    value: 'repeating-linear-gradient(0deg, #2f4f72 0 5px, #607c9b 5px 9px, #263f60 9px 14px)'
  },
  {
    key: 'stoneWashC',
    name: 'C',
    value: 'repeating-linear-gradient(90deg, #6f8daa 0 5px, #b6c4d0 5px 9px, #4f708f 9px 13px)'
  }
];

const flowerColorOptions = [
  {
    key: 'flowerA',
    name: 'A',
    image: 'assets/images/patterns/flower-a.jpeg?v=20260714-nn013-hover-images',
    value: "url('assets/images/patterns/flower-a.jpeg?v=20260711-fill') center / cover no-repeat"
  },
  {
    key: 'flowerB',
    name: 'B',
    image: 'assets/images/patterns/flower-b-filled.jpeg?v=20260714-nn013-hover-images',
    value: "url('assets/images/patterns/flower-b-filled.jpeg?v=20260714-equal-scale') center / cover no-repeat"
  },
  {
    key: 'flowerC',
    name: 'C',
    image: 'assets/images/patterns/flower-c-filled.jpeg?v=20260714-nn013-hover-images',
    value: "url('assets/images/patterns/flower-c-filled.jpeg?v=20260714-equal-scale') center / cover no-repeat"
  },
  {
    key: 'flowerD',
    name: 'D',
    image: 'assets/images/patterns/flower-d.jpeg?v=20260714-nn013-hover-images',
    value: "url('assets/images/patterns/flower-d.jpeg?v=20260711-fill-d2') center / cover no-repeat"
  }
];

function getFlowerColors(sourceColors = []) {
  const source = Array.isArray(sourceColors) ? sourceColors : [];

  return flowerColorOptions.map((color, index) => {
    const sourceColor = source.find(item => item.name === color.name || item.colorName === color.name)
      || (source.length === flowerColorOptions.length ? source[index] : {});
    const rawStock = sourceColor.stock;

    return {
      ...color,
      stock: rawStock === undefined || rawStock === '' ? undefined : Number(rawStock)
    };
  });
}

const nn013BottomOptions = getColors(['white', 'brown', 'blueGray']);

function getNn013Colors(sourceColors = []) {
  const source = Array.isArray(sourceColors) ? sourceColors : [];

  return flowerColorOptions.flatMap(pattern => nn013BottomOptions.map(bottom => {
    const compositeName = `${pattern.name} / ${bottom.name}`;
    const exactSource = source.find(item => (
      (item.name || item.colorName) === compositeName
    ));
    const legacySource = source.find(item => (
      (item.name || item.colorName) === bottom.name
    ));
    const rawStock = (exactSource || legacySource || {}).stock;

    return {
      key: `nn013-${pattern.name}-${bottom.key}`,
      name: compositeName,
      value: bottom.value,
      patternName: pattern.name,
      patternValue: pattern.value,
      bottomName: bottom.name,
      bottomValue: bottom.value,
      stock: rawStock === undefined || rawStock === '' ? undefined : Number(rawStock)
    };
  }));
}

const nn015SizeOptions = ['S', 'M'];
const nn015ColorOptions = getColors(colorSets.shorts);

function getNn015Colors(sourceColors = []) {
  const source = Array.isArray(sourceColors) ? sourceColors : [];

  return nn015SizeOptions.flatMap(size => nn015ColorOptions.map(shade => {
    const compositeName = `${size} / ${shade.name}`;
    const exactSource = source.find(item => (
      (item.name || item.colorName) === compositeName
    ));
    const legacySource = source.find(item => (
      (item.name || item.colorName) === shade.name
    ));
    const rawStock = (exactSource || legacySource || {}).stock;

    return {
      key: `nn015-${size}-${shade.key}`,
      name: compositeName,
      value: shade.value,
      sizeName: size,
      shadeName: shade.name,
      shadeValue: shade.value,
      stock: rawStock === undefined || rawStock === '' ? undefined : Number(rawStock)
    };
  }));
}

const linenColorOptions = [
  {
    key: 'linen23A',
    name: 'A',
    image: 'assets/images/patterns/linen-a.jpeg?v=20260714-pattern-hover-images',
    value: "url('assets/images/patterns/linen-a.jpeg?v=20260711-linen') center / cover no-repeat"
  },
  {
    key: 'linen23B',
    name: 'B',
    image: 'assets/images/patterns/linen-b.jpeg?v=20260714-pattern-hover-images',
    value: "url('assets/images/patterns/linen-b.jpeg?v=20260711-linen') center / cover no-repeat"
  },
  {
    key: 'linen23C',
    name: 'C',
    image: 'assets/images/patterns/linen-c.jpeg?v=20260714-pattern-hover-images',
    value: "url('assets/images/patterns/linen-c.jpeg?v=20260711-linen') center / cover no-repeat"
  }
];

const nn005LinenColorOptions = ['a', 'b', 'c', 'd'].map((suffix, index) => ({
  key: `linen05${String.fromCharCode(65 + index)}`,
  name: String.fromCharCode(65 + index),
  image: `assets/images/patterns/linen-005-${suffix}.jpeg?v=20260721-linen-variants`,
  value: `url('assets/images/patterns/linen-005-${suffix}.jpeg?v=20260721-linen-variants') center / cover no-repeat`
}));

const nn018LinenColorOptions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((suffix, index) => ({
  key: `linen18${String.fromCharCode(65 + index)}`,
  name: String.fromCharCode(65 + index),
  image: `assets/images/patterns/linen-018-${suffix}.jpeg?v=20260721-linen-variants`,
  value: `url('assets/images/patterns/linen-018-${suffix}.jpeg?v=20260721-linen-variants') center / cover no-repeat`
}));

const nn026LinenColorOptions = ['a', 'b', 'c', 'd'].map((suffix, index) => ({
  key: `linen26${String.fromCharCode(65 + index)}`,
  name: String.fromCharCode(65 + index),
  image: `assets/images/patterns/linen-026-${suffix}.jpeg?v=20260721-linen-variants`,
  value: `url('assets/images/patterns/linen-026-${suffix}.jpeg?v=20260721-linen-variants') center / cover no-repeat`
}));

function mergePatternStocks(options, sourceColors = []) {
  const source = Array.isArray(sourceColors) ? sourceColors : [];

  return options.map((color, index) => {
    const sourceColor = source.find(item => item.name === color.name || item.colorName === color.name)
      || (source.length === options.length ? source[index] : {});
    const rawStock = sourceColor.stock;

    return {
      ...color,
      stock: rawStock === undefined || rawStock === '' ? undefined : Number(rawStock)
    };
  });
}

function getNn005Colors(sourceColors = []) {
  return mergePatternStocks(nn005LinenColorOptions, sourceColors);
}

function getNn018Colors(sourceColors = []) {
  return mergePatternStocks(nn018LinenColorOptions, sourceColors);
}

function getNn026Colors(sourceColors = []) {
  return mergePatternStocks(nn026LinenColorOptions, sourceColors);
}

function getLinenColors(sourceColors = []) {
  const source = Array.isArray(sourceColors) ? sourceColors : [];

  return linenColorOptions.map((color, index) => {
    const sourceColor = source.find(item => item.name === color.name || item.colorName === color.name)
      || (source.length === linenColorOptions.length ? source[index] : {});
    const rawStock = sourceColor.stock;

    return {
      ...color,
      stock: rawStock === undefined || rawStock === '' ? undefined : Number(rawStock)
    };
  });
}

function getNn027Colors(sourceColors = []) {
  const source = Array.isArray(sourceColors) ? sourceColors : [];
  if (source.some(color => color.name === 'ฟ้าเทา' || color.colorName === 'ฟ้าเทา')) return source;
  const blackIndex = source.findIndex(color => color.name === 'ดำ' || color.colorName === 'ดำ');
  const blueGray = { key: 'blueGray', name: 'ฟ้าเทา', value: '#6f7f90', stock: 1 };
  if (blackIndex < 0) return [...source, blueGray];
  return [...source.slice(0, blackIndex), blueGray, ...source.slice(blackIndex)];
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
    colors: getNn005Colors(),
    image: 'assets/images/products/nn-005-spaghetti-crop-top-linen-v2.jpeg'
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
    colors: getNn013Colors(getColors(['white', 'brown', 'blueGray'])),
    image: 'assets/images/products/nn-013-smock-tube-flower.jpeg'
  },
  {
    id: 14,
    code: 'nn-014',
    name: 'Nunaa mini skirt',
    price: 290,
    detail: 'Cotton • Waist 24"-36"',
    colors: getColors(['white', 'brown']),
    image: 'assets/images/products/nn-014-nunaa-mini-skirt-v2.jpeg'
  },
  {
    id: 15,
    code: 'nn-015',
    name: 'Nunaa shorts',
    price: 290,
    detail: 'Cotton • S/M size',
    colors: getNn015Colors(getColors(colorSets.shorts)),
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
    colors: getNn018Colors(),
    image: 'assets/images/products/nn-018-smock-tube-basic-stripes-v2.jpeg'
  },
  {
    id: 19,
    code: 'nn-019',
    name: 'Spaghetti crop top (Flowers collection)',
    price: 290,
    detail: 'Salou cotton • Chest 26"-36" • Length 13" (excluding straps)',
    colors: getFlowerColors(),
    image: 'assets/images/products/nn-019-spaghetti-crop-top-flowers.jpeg'
  },
  {
    id: 20,
    code: 'nn-020',
    name: 'Nunaa Shorts (Flowers collection)',
    price: 350,
    detail: 'Salou cotton • Waist 24"-36" • Hips 40" • Length 14"',
    colors: getFlowerColors(),
    image: 'assets/images/products/nn-020-nunaa-shorts-flowers.jpeg'
  },
  {
    id: 21,
    code: 'nn-021',
    name: 'Puff Sleeve (Flowers collection)',
    price: 290,
    detail: 'Salou cotton • Chest 26"-36" • Length 13" (excluding straps)',
    colors: getFlowerColors(),
    image: 'assets/images/products/nn-021-puff-sleeve-flowers.jpeg'
  },
  {
    id: 22,
    code: 'nn-022',
    name: 'Skirt (Flowers collection)',
    price: 350,
    detail: 'Salou cotton • Waist 24"-36" • Length 15"',
    colors: getFlowerColors(),
    image: 'assets/images/products/nn-022-skirt-flowers.jpeg'
  },
  {
    id: 23,
    code: 'nn-023',
    name: 'Cupcake top linen fabric',
    price: 350,
    detail: 'Linen • Chest 24"-36" • Length 15"',
    colors: getLinenColors(),
    image: 'assets/images/products/nn-023-cupcake-top-linen-fabric.jpeg'
  },
  {
    id: 24,
    code: 'nn-024',
    name: 'Long sleeve candy collection',
    price: 350,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(colorSets.candy),
    image: 'assets/images/products/nn-024-long-sleeve-candy.jpeg'
  },
  {
    id: 25,
    code: 'nn-025',
    name: 'Long sleeve crop top cotton',
    price: 350,
    detail: 'Cotton • Chest 24"-36"',
    colors: getColors(['white', 'cream', 'brown']),
    image: 'assets/images/products/nn-025-long-sleeve-crop-top-cotton.jpeg'
  },
  {
    id: 26,
    code: 'nn-026',
    name: 'Long sleeve crop top linen',
    price: 420,
    detail: 'Linen • Chest 24"-36"',
    colors: getNn026Colors(),
    image: 'assets/images/products/nn-026-long-sleeve-crop-top-linen.jpeg'
  },
  {
    id: 27,
    code: 'nn-027',
    name: 'Nunaa cotton coat',
    price: 420,
    detail: 'Cotton • Chest 40"',
    colors: getColors(['white', 'cream', 'blueGray', 'black']),
    image: 'assets/images/products/nn-027-nunaa-cotton-coat.jpeg'
  },
  {
    id: 28,
    code: 'nn-028',
    name: 'Mini dress',
    price: 350,
    detail: 'Cotton • Chest 28"-38" • Length 30"',
    colors: getColors(['white', 'cream', 'green', 'black']),
    image: 'assets/images/products/nn-028-mini-dress.jpeg'
  },
  {
    id: 29,
    code: 'nn-029',
    name: 'Mini dress with button',
    price: 350,
    detail: 'Cotton • Chest 28"-38" • Length 30"',
    colors: getColors(['white', 'black']),
    image: 'assets/images/products/nn-029-mini-dress-button.jpeg'
  },
  {
    id: 30,
    code: 'nn-030',
    name: 'Mini dress with button (Stone wash fabric)',
    price: 450,
    detail: 'Cotton • Chest 28"-38" • Length 30"',
    colors: stoneWashColorOptions,
    image: 'assets/images/products/nn-030-mini-dress-button-stone-wash.jpeg'
  }
];

const productOverrides = {
  'nn-005': {
    image: 'assets/images/products/nn-005-spaghetti-crop-top-linen-v2.jpeg',
    colors: getNn005Colors
  },
  'nn-013': {
    colors: getNn013Colors
  },
  'nn-015': {
    colors: getNn015Colors
  },
  'nn-018': {
    image: 'assets/images/products/nn-018-smock-tube-basic-stripes-v2.jpeg',
    colors: getNn018Colors
  },
  'nn-026': {
    colors: getNn026Colors
  },
  'nn-019': {
    name: 'Spaghetti crop top (Flowers collection)',
    detail: 'Salou cotton • Chest 26"-36" • Length 13" (excluding straps)',
    image: 'assets/images/products/nn-019-spaghetti-crop-top-flowers.jpeg',
    colors: getFlowerColors
  },
  'nn-020': {
    name: 'Nunaa Shorts (Flowers collection)',
    detail: 'Salou cotton • Waist 24"-36" • Hips 40" • Length 14"',
    image: 'assets/images/products/nn-020-nunaa-shorts-flowers.jpeg',
    colors: getFlowerColors
  },
  'nn-021': {
    name: 'Puff Sleeve (Flowers collection)',
    detail: 'Salou cotton • Chest 26"-36" • Length 13" (excluding straps)',
    image: 'assets/images/products/nn-021-puff-sleeve-flowers.jpeg',
    colors: getFlowerColors
  },
  'nn-022': {
    name: 'Skirt (Flowers collection)',
    detail: 'Salou cotton • Waist 24"-36" • Length 15"',
    image: 'assets/images/products/nn-022-skirt-flowers.jpeg',
    colors: getFlowerColors
  },
  'nn-023': {
    name: 'Cupcake top linen fabric',
    detail: 'Linen • Chest 24"-36" • Length 15"',
    image: 'assets/images/products/nn-023-cupcake-top-linen-fabric.jpeg',
    colors: getLinenColors
  },
  'nn-027': {
    colors: getNn027Colors
  }
};

const cart = [];
const selectedColors = new Map();
const formatter = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 });
const EMS_FLAT_RATE = 60;
const EMS_FLAT_RATE_MAX_ITEMS = 10;
const PENDING_ORDER_EXPIRY_MINUTES = 15;
const PRODUCT_SWIPE_MIN_DISTANCE = 32;
const PRODUCT_SWIPE_FLICK_DISTANCE = 20;
const PRODUCT_SWIPE_MAX_DURATION = 1600;
const PRODUCT_SWIPE_FLICK_DURATION = 380;
const PRODUCT_SWIPE_DIRECTION_RATIO = 1.08;
const CART_STORAGE_KEY = 'nunaaCartV1';
const ACTIVE_ORDER_STORAGE_KEY = 'nunaaActiveOrderV1';
const CLIENT_ID_STORAGE_KEY = 'nunaaClientIdV1';
const PRODUCT_SORT_STORAGE_KEY = 'nunaaProductSortV1';
let currentOrderId = '';
let currentPendingExpiresAt = '';
let submittedOrderSummary = '';
let submittedOrderId = '';
let submittedOrderExpiresAt = '';
let isSubmittingOrder = false;
let countdownTimer = null;

const productGrid = document.querySelector('#productGrid');
const productSortSelect = document.querySelector('#productSort');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const cartShipping = document.querySelector('#cartShipping');
const cartGrandTotal = document.querySelector('#cartGrandTotal');
const cartCount = document.querySelector('#cartCount');
const mobileCartBar = document.querySelector('#mobileCartBar');
const mobileCartCount = document.querySelector('#mobileCartCount');
const mobileCartTotal = document.querySelector('#mobileCartTotal');
const backToTopButton = document.querySelector('#backToTopButton');
const clearCartButton = document.querySelector('#clearCartButton');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const checkoutForm = document.querySelector('#checkoutForm');
const orderSummary = document.querySelector('#orderSummary');
const copyStatus = document.querySelector('#copyStatus');
const reserveOrderButton = document.querySelector('#reserveOrderButton');
const paymentConfirmation = document.querySelector('#paymentConfirmation');
const confirmedOrderId = document.querySelector('#confirmedOrderId');
const confirmationCountdown = document.querySelector('#confirmationCountdown');
const sendInstagramButton = document.querySelector('#sendInstagramButton');
const reportPaymentButton = document.querySelector('#reportPaymentButton');
const copyOrderIdButton = document.querySelector('#copyOrderIdButton');
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerAddress = document.querySelector('#customerAddress');
const customerProvince = document.querySelector('#customerProvince');
const customerPostal = document.querySelector('#customerPostal');
const customerNote = document.querySelector('#customerNote');
const customerWebsite = document.querySelector('#customerWebsite');
const captchaContainer = document.querySelector('#captchaContainer');
const orderStatusForm = document.querySelector('#orderStatusForm');
const statusOrderId = document.querySelector('#statusOrderId');
const orderStatusResult = document.querySelector('#orderStatusResult');
const languageButtons = document.querySelectorAll('.language-button');
const productModal = document.querySelector('#productModal');
const productModalContent = document.querySelector('#productModalContent');
const productModalDialog = document.querySelector('.product-modal-dialog');
const modalSwipeHint = document.querySelector('#modalSwipeHint');
const modalCloseControls = document.querySelectorAll('[data-modal-close]');
const modalNavigationControls = document.querySelectorAll('[data-modal-direction]');
let activeDetailProductId = null;
let productTouchStart = null;
let swipeHintShown = false;
let swipeHintTimer = null;
let captchaWidgetId = null;
let currentProductSort = localStorage.getItem(PRODUCT_SORT_STORAGE_KEY) || 'code';

function getClientId() {
  try {
    let id = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (!id) {
      const bytes = new Uint8Array(18);
      crypto.getRandomValues(bytes);
      id = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
    }
    return id;
  } catch (error) {
    return `session_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }
}

const clientId = getClientId();

const translations = {
  th: {
    'meta.title': 'Nunaa.Collection | Everyday Look from Chiang Mai Local Fabric',
    'meta.description': 'Nunaa.Collection เสื้อผ้า everyday look จากผ้าท้องถิ่นเชียงใหม่ ใส่สบาย แมตช์ง่าย และดูแลง่าย',
    'menu.open': 'เปิดเมนู',
    'nav.about': 'About',
    'nav.shop': 'Shop',
    'nav.fabric': 'Fabric',
    'nav.care': 'Care',
    'nav.order': 'Order',
    'nav.cart': 'Cart',
    'nav.contact': 'Contact',
    'hero.eyebrow': 'Bloom as yourself',
    'hero.title': 'เสื้อผ้าใส่สบายที่แมตช์ได้ทุกคอลเลคชั่น',
    'hero.body': 'Nunaa.Collection ออกแบบเสื้อผ้าเรียบง่ายสำหรับทุกวัน ใช้ผ้าท้องถิ่นจากเชียงใหม่ ใส่แล้วสบาย ดูแลง่าย และอยู่กับตู้เสื้อผ้าได้นาน',
    'hero.shopButton': 'ดูสินค้า',
    'hero.cardLabel': 'Handmade',
    'hero.cardTitle': 'piece by piece',
    'hero.cardText': 'soft textures • timeless palette • local story',
    'about.eyebrow': 'About Us',
    'about.title': 'Bloom as yourself',
    'about.bodyOne': 'เราเชื่อว่าทุกคนล้วนมีความงดงามในแบบของตัวเองอยู่แล้ว',
    'about.bodyTwo': 'เหมือนดอกไม้ที่รอวันผลิบาน แต่ละคนล้วนมีเสน่ห์ เรื่องราว และเอกลักษณ์ที่ไม่เหมือนใคร',
    'about.bodyThree': 'พวกเราอยากเป็นส่วนหนึ่งที่ช่วยให้คุณแสดงความเป็นตัวของตัวเองออกมาได้อย่างมั่นใจ ผ่านเสื้อผ้าที่รังสรรค์ด้วยความใส่ใจและความตั้งใจในทุกชิ้น',
    'about.bodyFour': 'เราแค่อยากเห็นคุณงดงามในแบบที่คุณเป็น',
    'shop.title': 'สินค้าพร้อมสั่งซื้อ',
    'shop.sortLabel': 'เรียงสินค้า',
    'shop.sortCode': 'รหัสสินค้า',
    'shop.sortPriceAsc': 'ราคา: ถูกไปแพง',
    'shop.sortPriceDesc': 'ราคา: แพงไปถูก',
    'shop.sortAvailable': 'สินค้าที่มีในร้าน (สินค้าหมดอยู่หลังสุด)',
    'cart.eyebrow': 'Cart',
    'cart.title': 'ตะกร้าสินค้า',
    'cart.total': 'รวมค่าสินค้า',
    'cart.shipping': 'ค่าส่ง EMS',
    'cart.grandTotal': 'ยอดรวมสุทธิ',
    'cart.shippingEmpty': '-',
    'cart.shippingFixed': '฿60',
    'cart.shippingContact': 'ทางร้านจะติดต่อเพื่อแจ้งราคาค่าส่ง',
    'cart.checkout': 'Checkout',
    'cart.clear': 'Clear cart',
    'fabric.eyebrow': 'Fabric',
    'fabric.title': 'ผ้าท้องถิ่นจากเชียงใหม่',
    'fabric.body': 'ผ้าจากทางร้านเป็นผ้าท้องถิ่นจากเชียงใหม่ เราเลือกเนื้อผ้าที่ใส่สบาย ระบายอากาศได้ดี และเหมาะกับ everyday look ที่หยิบมาแมตช์ได้ง่ายในหลายโอกาส',
    'care.eyebrow': 'Care Guide',
    'care.title': 'วิธีดูแลผ้า',
    'care.itemOne': 'ซักมือจะช่วยถนอมเนื้อผ้าได้มากกว่า',
    'care.itemTwo': 'สามารถซักเครื่องได้ โดยแนะนำใส่ถุงถนอมผ้า',
    'care.itemThree': 'ใช้โหมดถนอมผ้าและน้ำอุณหภูมิปกติ',
    'care.itemFour': 'หลีกเลี่ยงแดดจัดเพื่อรักษาสีและสัมผัสของผ้า',
    'order.eyebrow': 'How to Order',
    'order.title': 'วิธีสั่งซื้อ',
    'order.stepOne': 'เลือกสินค้าและเพิ่มลงตะกร้า',
    'order.stepTwo': 'กด Checkout แล้วกรอกชื่อ ที่อยู่ และเบอร์ติดต่อ',
    'order.stepThree': 'ชำระเงินผ่าน QR / โอนเงิน แล้วส่งสลิป',
    'order.stepFour': 'ระบบจอง stock อัตโนมัติระหว่างรอชำระเงิน',
    'form.title': 'ข้อมูลจัดส่ง',
    'form.subtitle': 'กรอกรายละเอียดสำหรับจัดส่งสินค้า',
    'form.name': 'ชื่อ-นามสกุล',
    'form.phone': 'เบอร์ติดต่อ',
    'form.address': 'ที่อยู่จัดส่ง',
    'form.province': 'จังหวัด',
    'form.postal': 'รหัสไปรษณีย์',
    'form.note': 'หมายเหตุ',
    'form.reserveOrder': 'ยืนยันออเดอร์และจองสินค้า',
    'form.reserving': 'กำลังจองสินค้า…',
    'form.copyAndInstagram': 'คัดลอกออเดอร์และเปิด Instagram',
    'form.reportPayment': 'ส่งสลิปแล้ว — แจ้งชำระเงิน',
    'form.reportingPayment': 'กำลังแจ้งชำระเงิน…',
    'form.copyOrderId': 'คัดลอก Order ID',
    'form.sendInstagram': 'ส่งทาง Instagram',
    'confirmation.eyebrow': 'Order reserved',
    'confirmation.title': 'จองสินค้าเรียบร้อยแล้ว',
    'confirmation.timeLeft': 'กรุณาชำระและส่งสลิปภายใน {time}',
    'confirmation.expired': 'หมดเวลาจองแล้ว กรุณาสร้างออเดอร์ใหม่ก่อนชำระเงิน',
    'confirmation.paymentReported': 'แจ้งชำระเงินแล้ว สินค้ายังคงถูกจองระหว่างรอร้านตรวจสลิป',
    'confirmation.paymentReportedAfterHours': 'แจ้งชำระเงินแล้ว ร้านจะตรวจสอบภายใน {deadline} สินค้ายังคงถูกจองระหว่างรอตรวจสอบ',
    'summary.title': 'สรุปออเดอร์',
    'summary.empty': 'เลือกสินค้าในตะกร้าเพื่อสร้างสรุปออเดอร์',
    'payment.title': 'ชำระเงินผ่าน QR',
    'payment.body': 'สแกน QR เพื่อชำระเงิน แล้วส่งสลิปพร้อมสรุปออเดอร์ให้ร้านทาง Instagram',
    'payment.notice': 'กรุณาส่งสลิปก่อนหมดเวลาจอง 15 นาที',
    'payment.qrAlt': 'Nunaa.Collection payment QR code',
    'contact.eyebrow': 'Contact',
    'contact.title': 'คุยกับร้าน',
    'contact.body': 'สำหรับสอบถามสินค้า แจ้งชำระเงิน หรือเช็กออเดอร์ ติดต่อผ่าน Instagram ได้เลย',
    'footer.tagline': 'Bloom as yourself.',
    'product.color': 'สี',
    'product.colorAria': 'เลือกสี',
    'product.topPattern': '1. เลือกลายผ้าด้านบน',
    'product.bottomColor': '2. เลือกสีผ้าด้านล่าง',
    'product.pattern': 'ลาย',
    'product.selectedCombination': 'แบบที่เลือก',
    'product.size': '1. เลือกไซส์',
    'product.shortsColor': '2. เลือกสี',
    'product.addCart': 'เพิ่มลงตะกร้า',
    'product.added': 'เพิ่มแล้ว',
    'product.viewDetails': 'ดูรายละเอียด',
    'product.previous': 'สินค้าก่อนหน้า',
    'product.next': 'สินค้าถัดไป',
    'product.details': 'รายละเอียดสินค้า',
    'product.swipeHint': '↔ ปัดเบา ๆ บนรูปเพื่อดูสินค้าอื่น',
    'product.soldOut': 'สินค้าหมด',
    'product.ready': 'พร้อมสั่งซื้อ',
    'product.remaining': 'เหลือ {count} ชิ้น',
    'cart.empty': 'ยังไม่มีสินค้าในตะกร้า',
    'cart.colorPrefix': 'สี',
    'cart.quantity': 'จำนวน',
    'cart.decrease': 'ลดจำนวน',
    'cart.increase': 'เพิ่มจำนวน',
    'mobileCart.viewCart': 'ดูตะกร้า',
    'utility.backToTop': 'กลับขึ้นด้านบน',
    'summary.orderIdPending': 'จะสร้างเมื่อยืนยันและจองสินค้า',
    'summary.items': 'รายการสินค้า',
    'summary.pendingExpires': 'ออเดอร์ pending หมดอายุ',
    'summary.pendingNotice': 'สินค้าถูกจองระหว่างที่ออเดอร์ pending นี้ยังไม่หมดอายุ',
    'summary.total': 'รวมค่าสินค้า',
    'summary.shippingFee': 'ค่าส่ง EMS',
    'summary.grandTotal': 'ยอดรวมสุทธิ',
    'summary.shippingDetails': 'ข้อมูลจัดส่ง',
    'summary.name': 'ชื่อ',
    'summary.phone': 'เบอร์',
    'summary.address': 'ที่อยู่',
    'summary.province': 'จังหวัด',
    'summary.postal': 'รหัสไปรษณีย์',
    'summary.note': 'หมายเหตุ',
    'status.emptyCart': 'กรุณาเลือกสินค้าในตะกร้าก่อนสร้างออเดอร์',
    'status.copySaved': 'สร้าง {orderId} เป็น pending และจองสินค้าแล้ว กรุณาส่งสลิปภายใน 15 นาที',
    'status.savedNoCopy': 'สร้าง {orderId} เป็น pending และจองสินค้าแล้ว กรุณาส่งสลิปภายใน 15 นาที แต่ browser ไม่อนุญาตให้คัดลอกอัตโนมัติ กรุณาเลือกข้อความสรุปออเดอร์แล้วคัดลอกเอง',
    'status.orderIdCopied': 'คัดลอก Order ID แล้ว',
    'status.orderCopied': 'คัดลอกออเดอร์แล้ว กรุณาวางข้อความและแนบสลิปใน Instagram',
    'status.copyUnavailable': 'เปิด Instagram แล้ว แต่คัดลอกอัตโนมัติไม่ได้ กรุณาคัดลอกจากสรุปออเดอร์',
    'status.paymentReported': 'แจ้งชำระเงินสำหรับ {orderId} แล้ว กรุณารอร้านตรวจสลิปและยืนยันออเดอร์',
    'status.paymentReportFailed': 'ยังแจ้งชำระเงินไม่ได้: {message}',
    'status.copySaveFailed': 'ยังไม่ได้บันทึกออเดอร์ {orderId}: {message} กรุณาแก้ตะกร้าแล้วลองคัดลอกใหม่',
    'status.failed': 'ยังไม่ได้บันทึก/คัดลอกออเดอร์ {orderId}: {message}',
    'status.stockUnavailable': '{item} เหลือ {available} ชิ้น กรุณาแก้ตะกร้าก่อนสร้างออเดอร์',
    'status.stockMissing': 'ไม่พบสินค้า {item} ใน stock ล่าสุด กรุณาแก้ตะกร้าก่อนสร้างออเดอร์',
    'error.saveOrder': 'ไม่สามารถบันทึกออเดอร์ได้'
  },
  en: {
    'meta.title': 'Nunaa.Collection | Everyday Looks from Chiang Mai Local Fabric',
    'meta.description': 'Nunaa.Collection makes comfortable everyday clothing from local Chiang Mai fabric, designed to mix easily and last in your wardrobe.',
    'menu.open': 'Open menu',
    'nav.about': 'About',
    'nav.shop': 'Shop',
    'nav.fabric': 'Fabric',
    'nav.care': 'Care',
    'nav.order': 'Order',
    'nav.cart': 'Cart',
    'nav.contact': 'Contact',
    'hero.eyebrow': 'Bloom as yourself',
    'hero.title': 'Comfortable pieces made to match every collection',
    'hero.body': 'Nunaa.Collection designs simple everyday clothing with local fabrics from Chiang Mai. Each piece is comfortable, easy to style, easy to care for, and made to stay in your wardrobe.',
    'hero.shopButton': 'Shop now',
    'hero.cardLabel': 'Handmade',
    'hero.cardTitle': 'piece by piece',
    'hero.cardText': 'soft textures • timeless palette • local story',
    'about.eyebrow': 'About Us',
    'about.title': 'Bloom as yourself',
    'about.bodyOne': 'We believe everyone already carries a beauty that is uniquely their own.',
    'about.bodyTwo': 'Like flowers waiting to bloom, each person has a charm, a story, and an identity unlike anyone else’s.',
    'about.bodyThree': 'We hope to play a small part in helping you express who you are with confidence, through clothes created with care and intention in every piece.',
    'about.bodyFour': 'We simply want to see you bloom beautifully as yourself.',
    'shop.title': 'Ready-to-order pieces',
    'shop.sortLabel': 'Sort products',
    'shop.sortCode': 'Product code',
    'shop.sortPriceAsc': 'Price: low to high',
    'shop.sortPriceDesc': 'Price: high to low',
    'shop.sortAvailable': 'Available first (sold out last)',
    'cart.eyebrow': 'Cart',
    'cart.title': 'Shopping cart',
    'cart.total': 'Item total',
    'cart.shipping': 'EMS shipping',
    'cart.grandTotal': 'Grand total',
    'cart.shippingEmpty': '-',
    'cart.shippingFixed': '฿60',
    'cart.shippingContact': 'The shop will contact you with the shipping fee.',
    'cart.checkout': 'Checkout',
    'cart.clear': 'Clear cart',
    'fabric.eyebrow': 'Fabric',
    'fabric.title': 'Local fabric from Chiang Mai',
    'fabric.body': 'Our fabrics are sourced locally from Chiang Mai. We choose comfortable, breathable materials that work well for everyday looks and can be mixed easily for many occasions.',
    'care.eyebrow': 'Care Guide',
    'care.title': 'Fabric care',
    'care.itemOne': 'Hand washing helps preserve the fabric best.',
    'care.itemTwo': 'Machine washing is possible; we recommend using a laundry bag.',
    'care.itemThree': 'Use a gentle cycle with normal-temperature water.',
    'care.itemFour': 'Avoid harsh sunlight to protect color and texture.',
    'order.eyebrow': 'How to Order',
    'order.title': 'How to order',
    'order.stepOne': 'Choose items and add them to your cart.',
    'order.stepTwo': 'Tap Checkout and enter your name, address, and contact number.',
    'order.stepThree': 'Pay by QR / bank transfer, then send the payment slip.',
    'order.stepFour': 'The order reserves stock automatically while pending.',
    'form.title': 'Shipping details',
    'form.subtitle': 'Enter the details for delivery.',
    'form.name': 'Full name',
    'form.phone': 'Phone number',
    'form.address': 'Shipping address',
    'form.province': 'Province',
    'form.postal': 'Postal code',
    'form.note': 'Note',
    'form.reserveOrder': 'Confirm and reserve items',
    'form.reserving': 'Reserving items…',
    'form.copyAndInstagram': 'Copy order and open Instagram',
    'form.reportPayment': 'Slip sent — report payment',
    'form.reportingPayment': 'Reporting payment…',
    'form.copyOrderId': 'Copy Order ID',
    'form.sendInstagram': 'Send via Instagram',
    'confirmation.eyebrow': 'Order reserved',
    'confirmation.title': 'Your items are reserved',
    'confirmation.timeLeft': 'Please pay and send the slip within {time}',
    'confirmation.expired': 'The reservation has expired. Please create a new order before paying.',
    'confirmation.paymentReported': 'Payment reported. Your items remain reserved while the shop checks the slip.',
    'confirmation.paymentReportedAfterHours': 'Payment reported. The shop will verify it by {deadline}. Your items remain reserved while waiting.',
    'summary.title': 'Order summary',
    'summary.empty': 'Add items to your cart to create an order summary.',
    'payment.title': 'Pay by QR',
    'payment.body': 'Scan the QR to pay, then send the payment slip with your order summary to the shop via Instagram.',
    'payment.notice': 'Please send the payment slip before the 15-minute reservation expires.',
    'payment.qrAlt': 'Nunaa.Collection payment QR code',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Talk to the shop',
    'contact.body': 'For product questions, payment slips, or order checks, contact us on Instagram.',
    'footer.tagline': 'Bloom as yourself.',
    'product.color': 'Color',
    'product.colorAria': 'Choose color',
    'product.topPattern': '1. Choose top pattern',
    'product.bottomColor': '2. Choose bottom color',
    'product.pattern': 'Pattern',
    'product.selectedCombination': 'Selected combination',
    'product.size': '1. Choose size',
    'product.shortsColor': '2. Choose color',
    'product.addCart': 'Add to cart',
    'product.added': 'Added',
    'product.viewDetails': 'View details',
    'product.previous': 'Previous product',
    'product.next': 'Next product',
    'product.details': 'Product details',
    'product.swipeHint': '↔ Gently swipe the image for more products',
    'product.soldOut': 'Sold out',
    'product.ready': 'Ready to order',
    'product.remaining': '{count} left',
    'cart.empty': 'Your cart is empty.',
    'cart.colorPrefix': 'Color',
    'cart.quantity': 'Quantity',
    'cart.decrease': 'Decrease quantity',
    'cart.increase': 'Increase quantity',
    'mobileCart.viewCart': 'View cart',
    'utility.backToTop': 'Back to top',
    'summary.orderIdPending': 'created when you confirm and reserve items',
    'summary.items': 'Items',
    'summary.pendingExpires': 'Pending order expires',
    'summary.pendingNotice': 'Items are reserved while this pending order is active.',
    'summary.total': 'Item total',
    'summary.shippingFee': 'EMS shipping',
    'summary.grandTotal': 'Grand total',
    'summary.shippingDetails': 'Shipping details',
    'summary.name': 'Name',
    'summary.phone': 'Phone',
    'summary.address': 'Address',
    'summary.province': 'Province',
    'summary.postal': 'Postal code',
    'summary.note': 'Note',
    'status.emptyCart': 'Please add items to your cart before creating an order.',
    'status.copySaved': 'Created {orderId} as pending and reserved the items. Please send the payment slip within 15 minutes.',
    'status.savedNoCopy': 'Created {orderId} as pending and reserved the items. Please send the payment slip within 15 minutes, but the browser did not allow automatic copy. Please select and copy the order summary manually.',
    'status.orderIdCopied': 'Order ID copied.',
    'status.orderCopied': 'Order copied. Paste it and attach your payment slip in Instagram.',
    'status.copyUnavailable': 'Instagram opened, but automatic copy was unavailable. Please copy the order summary manually.',
    'status.paymentReported': 'Payment reported for {orderId}. Please wait for the shop to verify the slip.',
    'status.paymentReportFailed': 'Payment could not be reported: {message}',
    'status.copySaveFailed': 'Order {orderId} was not saved: {message} Please update your cart and copy again.',
    'status.failed': 'Order {orderId} was not saved/copied: {message}',
    'status.stockUnavailable': '{item} has {available} left. Please update your cart before creating the order.',
    'status.stockMissing': '{item} was not found in the latest stock. Please update your cart before creating the order.',
    'error.saveOrder': 'Could not save the order.'
  },
  zh: {
    'meta.title': 'Nunaa.Collection | 清迈本地布料日常穿搭',
    'meta.description': 'Nunaa.Collection 使用清迈本地布料制作舒适日常服饰，容易搭配，也便于保养。',
    'menu.open': '打开菜单',
    'nav.about': '关于',
    'nav.shop': '商品',
    'nav.fabric': '布料',
    'nav.care': '保养',
    'nav.order': '订购',
    'nav.cart': '购物车',
    'nav.contact': '联系',
    'hero.eyebrow': 'Bloom as yourself',
    'hero.title': '舒适好搭的日常服饰',
    'hero.body': 'Nunaa.Collection 以清迈本地布料设计简约日常服饰。每一件都舒适、好搭、容易保养，也适合长久留在衣柜里。',
    'hero.shopButton': '查看商品',
    'hero.cardLabel': '手工制作',
    'hero.cardTitle': '一件一件完成',
    'hero.cardText': '柔软质感 • 耐看色调 • 在地故事',
    'about.eyebrow': '关于我们',
    'about.title': 'Bloom as yourself',
    'about.bodyOne': '我们相信，每个人本来就拥有属于自己的独特美丽。',
    'about.bodyTwo': '如同等待绽放的花朵，每个人都有与众不同的魅力、故事和个性。',
    'about.bodyThree': '我们希望通过每一件用心制作的衣服，陪伴你自信地展现真实的自己。',
    'about.bodyFour': '我们只是想看见你以自己的方式美丽绽放。',
    'shop.title': '可订购商品',
    'shop.sortLabel': '商品排序',
    'shop.sortCode': '商品编号',
    'shop.sortPriceAsc': '价格：从低到高',
    'shop.sortPriceDesc': '价格：从高到低',
    'shop.sortAvailable': '有货优先（售罄置后）',
    'cart.eyebrow': '购物车',
    'cart.title': '购物车',
    'cart.total': '商品小计',
    'cart.shipping': 'EMS 运费',
    'cart.grandTotal': '总计',
    'cart.shippingEmpty': '-',
    'cart.shippingFixed': '฿60',
    'cart.shippingContact': '店铺会联系您确认运费。',
    'cart.checkout': '结账',
    'cart.clear': '清空购物车',
    'fabric.eyebrow': '布料',
    'fabric.title': '来自清迈的本地布料',
    'fabric.body': '店内布料来自清迈本地。我们选择舒适、透气的材质，适合日常穿搭，也能轻松应对不同场合。',
    'care.eyebrow': '保养说明',
    'care.title': '布料保养',
    'care.itemOne': '手洗更能保护布料质感。',
    'care.itemTwo': '也可以机洗，建议放入洗衣袋。',
    'care.itemThree': '使用轻柔模式与常温水清洗。',
    'care.itemFour': '避免强烈日晒，以保持颜色与触感。',
    'order.eyebrow': '订购方式',
    'order.title': '如何订购',
    'order.stepOne': '选择商品并加入购物车。',
    'order.stepTwo': '点击结账，填写姓名、地址和联系电话。',
    'order.stepThree': '通过 QR / 转账付款，并发送付款凭证。',
    'order.stepFour': '待确认订单会自动预留库存。',
    'form.title': '收件资料',
    'form.subtitle': '填写配送所需资料。',
    'form.name': '姓名',
    'form.phone': '联系电话',
    'form.address': '收件地址',
    'form.province': '省 / 府',
    'form.postal': '邮政编码',
    'form.note': '备注',
    'form.reserveOrder': '确认订单并预留商品',
    'form.reserving': '正在预留商品…',
    'form.copyAndInstagram': '复制订单并打开 Instagram',
    'form.reportPayment': '已发送凭证 — 通知付款',
    'form.reportingPayment': '正在通知付款…',
    'form.copyOrderId': '复制订单编号',
    'form.sendInstagram': '通过 Instagram 发送',
    'confirmation.eyebrow': '已预留订单',
    'confirmation.title': '商品已成功预留',
    'confirmation.timeLeft': '请在 {time} 内付款并发送凭证',
    'confirmation.expired': '预留时间已结束。请先重新建立订单再付款。',
    'confirmation.paymentReported': '已通知付款。店铺核对凭证期间，商品将继续为您保留。',
    'confirmation.paymentReportedAfterHours': '已通知付款。店铺将在 {deadline} 前核对，等待期间商品将继续为您保留。',
    'summary.title': '订单摘要',
    'summary.empty': '请先将商品加入购物车以生成订单摘要。',
    'payment.title': 'QR 付款',
    'payment.body': '扫描 QR 付款后，请将付款凭证和订单摘要通过 Instagram 发给店铺。',
    'payment.notice': '请在 15 分钟预留时间结束前发送付款凭证。',
    'payment.qrAlt': 'Nunaa.Collection 付款 QR 码',
    'contact.eyebrow': '联系',
    'contact.title': '联系店铺',
    'contact.body': '如需询问商品、发送付款凭证或查询订单，请通过 Instagram 联系我们。',
    'footer.tagline': 'Bloom as yourself.',
    'product.color': '颜色',
    'product.colorAria': '选择颜色',
    'product.topPattern': '1. 选择上部图案',
    'product.bottomColor': '2. 选择下部颜色',
    'product.pattern': '图案',
    'product.selectedCombination': '已选组合',
    'product.size': '1. 选择尺码',
    'product.shortsColor': '2. 选择颜色',
    'product.addCart': '加入购物车',
    'product.added': '已加入',
    'product.viewDetails': '查看详情',
    'product.previous': '上一个商品',
    'product.next': '下一个商品',
    'product.details': '商品详情',
    'product.swipeHint': '↔ 在图片上轻轻左右滑动查看更多商品',
    'product.soldOut': '售罄',
    'product.ready': '可订购',
    'product.remaining': '剩余 {count} 件',
    'cart.empty': '购物车还是空的。',
    'cart.colorPrefix': '颜色',
    'cart.quantity': '数量',
    'cart.decrease': '减少数量',
    'cart.increase': '增加数量',
    'mobileCart.viewCart': '查看购物车',
    'utility.backToTop': '返回顶部',
    'summary.orderIdPending': '确认并预留商品时生成',
    'summary.items': '商品列表',
    'summary.pendingExpires': '待确认订单过期时间',
    'summary.pendingNotice': '商品会在此待确认订单有效期间被预留。',
    'summary.total': '商品小计',
    'summary.shippingFee': 'EMS 运费',
    'summary.grandTotal': '总计',
    'summary.shippingDetails': '收件资料',
    'summary.name': '姓名',
    'summary.phone': '电话',
    'summary.address': '地址',
    'summary.province': '省 / 府',
    'summary.postal': '邮政编码',
    'summary.note': '备注',
    'status.emptyCart': '请先将商品加入购物车，再建立订单。',
    'status.copySaved': '已建立 {orderId} 为待确认订单并预留商品。请在 15 分钟内发送付款凭证。',
    'status.savedNoCopy': '已建立 {orderId} 为待确认订单并预留商品。请在 15 分钟内发送付款凭证。但浏览器不允许自动复制，请手动选择并复制订单摘要。',
    'status.orderIdCopied': '订单编号已复制。',
    'status.orderCopied': '订单已复制。请在 Instagram 粘贴并附上付款凭证。',
    'status.copyUnavailable': 'Instagram 已打开，但无法自动复制。请手动复制订单摘要。',
    'status.paymentReported': '已通知订单 {orderId} 的付款。请等待店铺核对凭证。',
    'status.paymentReportFailed': '无法通知付款：{message}',
    'status.copySaveFailed': '订单 {orderId} 尚未保存成功：{message} 请调整购物车后重新复制。',
    'status.failed': '订单 {orderId} 尚未保存/复制成功：{message}',
    'status.stockUnavailable': '{item} 剩余 {available} 件。请先调整购物车再建立订单。',
    'status.stockMissing': '最新库存中找不到 {item}。请先调整购物车再建立订单。',
    'error.saveOrder': '无法保存订单。'
  }
};

const colorTranslations = {
  white: { en: 'White', zh: '白色' },
  cream: { en: 'Cream', zh: '米色' },
  beige: { en: 'Beige', zh: '米棕色' },
  pink: { en: 'Light pink', zh: '浅粉色' },
  dustyPink: { en: 'Dusty pink', zh: '豆沙粉' },
  coral: { en: 'Coral', zh: '珊瑚色' },
  rust: { en: 'Rust', zh: '砖橙色' },
  burgundy: { en: 'Burgundy', zh: '酒红色' },
  mustard: { en: 'Mustard', zh: '芥末黄' },
  green: { en: 'Green', zh: '绿色' },
  olive: { en: 'Olive', zh: '橄榄绿' },
  blueGray: { en: 'Blue gray', zh: '灰蓝色' },
  navy: { en: 'Navy', zh: '藏青色' },
  taupe: { en: 'Taupe', zh: '灰棕色' },
  brown: { en: 'Brown', zh: '棕色' },
  darkBrown: { en: 'Dark brown', zh: '深棕色' },
  black: { en: 'Black', zh: '黑色' },
  linenPattern: { en: 'Linen pattern', zh: '亚麻图案' },
  flowerPattern: { en: 'Floral pattern', zh: '花朵图案' }
};

let currentLanguage = localStorage.getItem('nunaaLanguage') || 'th';

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

function createPendingExpiresAt() {
  return new Date(Date.now() + (PENDING_ORDER_EXPIRY_MINUTES * 60 * 1000)).toISOString();
}

function formatPendingExpiresAt() {
  if (!currentPendingExpiresAt) return '-';

  return new Intl.DateTimeFormat(currentLanguage === 'th' ? 'th-TH' : currentLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok'
  }).format(new Date(currentPendingExpiresAt));
}

function formatReviewDueAt(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(currentLanguage === 'th' ? 'th-TH' : currentLanguage, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Bangkok'
  }).format(new Date(value));
}

function t(key, values = {}) {
  const template = translations[currentLanguage]?.[key] || translations.th[key] || key;
  return Object.entries(values).reduce((text, [name, value]) => (
    text.replaceAll(`{${name}}`, value)
  ), template);
}

function getColorName(color) {
  if (currentLanguage === 'th') return color.name;
  if (color[`name${currentLanguage.toUpperCase()}`]) return color[`name${currentLanguage.toUpperCase()}`];
  return colorTranslations[color.key]?.[currentLanguage] || color.name;
}

function updateLanguageButtons() {
  languageButtons.forEach(button => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage === 'zh' ? 'zh-Hans' : currentLanguage;
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', t('meta.description'));

  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    element.setAttribute('alt', t(element.dataset.i18nAlt));
  });

  updateLanguageButtons();
  renderProducts();
  renderCart();
}

function isStockManaged(color) {
  return Number.isFinite(Number(color.stock));
}

function getCartQuantity(code, colorName) {
  const cartItem = cart.find(item => item.code === code && item.selectedColor.name === colorName);
  return cartItem ? cartItem.quantity : 0;
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

function getProductStockAvailability(product) {
  return product.colors.some(color => !isStockManaged(color) || Number(color.stock) > 0);
}

function compareProductCodes(productA, productB) {
  return String(productA.code).localeCompare(String(productB.code), 'en', {
    numeric: true,
    sensitivity: 'base'
  });
}

function getSortedProducts() {
  const sortedProducts = [...products];

  if (currentProductSort === 'price-asc') {
    return sortedProducts.sort((productA, productB) => (
      Number(productA.price) - Number(productB.price) || compareProductCodes(productA, productB)
    ));
  }

  if (currentProductSort === 'price-desc') {
    return sortedProducts.sort((productA, productB) => (
      Number(productB.price) - Number(productA.price) || compareProductCodes(productA, productB)
    ));
  }

  if (currentProductSort === 'available') {
    return sortedProducts.sort((productA, productB) => (
      Number(getProductStockAvailability(productB)) - Number(getProductStockAvailability(productA))
      || compareProductCodes(productA, productB)
    ));
  }

  return sortedProducts.sort(compareProductCodes);
}

function getStockStatus(product) {
  const selectedColor = getSelectedColor(product);
  if (!isStockManaged(selectedColor)) {
    return { text: t('product.ready'), state: 'in-stock', remaining: null };
  }

  const remaining = getRemainingStock(product, selectedColor);
  if (remaining <= 0) {
    return { text: t('product.soldOut'), state: 'sold-out', remaining };
  }

  return {
    text: t('product.remaining', { count: remaining }),
    state: remaining <= 3 ? 'low-stock' : 'in-stock',
    remaining
  };
}

function formatStockText(product) {
  return getStockStatus(product).text;
}

function findCartItem(code, colorName) {
  return cart.find(item => item.code === code && item.selectedColor.name === colorName);
}

function getProductByCode(code) {
  return products.find(product => product.code === code);
}

function getCartItemLabel(item) {
  return `${item.code} ${t('cart.colorPrefix')} ${getColorName(item.selectedColor)}`;
}

function getLatestColorForCartItem(item) {
  const product = getProductByCode(item.code);
  if (!product) return null;

  return product.colors.find(color => color.name === item.selectedColor.name) || null;
}

function validateCartStockAgainstLatestProducts() {
  for (const item of cart) {
    const latestColor = getLatestColorForCartItem(item);
    const itemLabel = getCartItemLabel(item);

    if (!latestColor) {
      return t('status.stockMissing', { item: itemLabel });
    }

    if (isStockManaged(latestColor) && Number(latestColor.stock) < item.quantity) {
      return t('status.stockUnavailable', {
        item: itemLabel,
        available: Math.max(0, Number(latestColor.stock))
      });
    }
  }

  return '';
}

function saveCart() {
  try {
    const savedItems = cart.map(item => ({
      code: item.code,
      colorName: item.selectedColor.name,
      quantity: item.quantity
    }));
    if (savedItems.length) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(savedItems));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  } catch (error) {
    // Shopping remains available when browser storage is blocked.
  }
}

function restoreCart() {
  let savedItems = [];
  try {
    savedItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  } catch (error) {
    savedItems = [];
  }

  if (!Array.isArray(savedItems)) return;
  cart.length = 0;
  savedItems.forEach(savedItem => {
    const product = getProductByCode(savedItem.code);
    const selectedColor = product?.colors.find(color => color.name === savedItem.colorName);
    if (!product || !selectedColor || !isColorAvailable(product, selectedColor)) return;

    const requestedQuantity = Math.max(1, Number(savedItem.quantity) || 1);
    const availableQuantity = isStockManaged(selectedColor)
      ? Math.max(0, Number(selectedColor.stock))
      : requestedQuantity;
    const quantity = Math.min(requestedQuantity, availableQuantity);
    if (quantity > 0) cart.push({ ...product, selectedColor, quantity });
  });
  saveCart();
}

function resetPendingOrderDraft() {
  if (isSubmittingOrder) return;
  currentOrderId = '';
  currentPendingExpiresAt = '';
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getShippingInfo() {
  const itemCount = getCartItemCount();

  if (itemCount === 0) {
    return {
      fee: 0,
      isFixed: false,
      label: t('cart.shippingEmpty'),
      grandTotalLabel: formatter.format(0)
    };
  }

  if (itemCount <= EMS_FLAT_RATE_MAX_ITEMS) {
    const grandTotal = getCartSubtotal() + EMS_FLAT_RATE;
    return {
      fee: EMS_FLAT_RATE,
      isFixed: true,
      label: formatter.format(EMS_FLAT_RATE),
      grandTotalLabel: formatter.format(grandTotal)
    };
  }

  return {
    fee: null,
    isFixed: false,
    label: t('cart.shippingContact'),
    grandTotalLabel: t('cart.shippingContact')
  };
}

function refreshProductStockDisplays() {
  products.forEach(product => {
    const card = productGrid.querySelector(`[data-product-id="${product.id}"]`);
    if (!card) return;

    const stockStatus = card.querySelector('[data-stock-id]');
    const stockInfo = getStockStatus(product);
    if (stockStatus) {
      stockStatus.textContent = stockInfo.text;
      stockStatus.className = `stock-status ${stockInfo.state}`;
      stockStatus.dataset.stockState = stockInfo.state;
    }
    card.querySelectorAll('.color-swatch').forEach(swatch => {
      const color = product.colors[Number(swatch.dataset.colorIndex)];
      swatch.disabled = !isColorAvailable(product, color);
    });

    if (product.code === 'nn-013') {
      const selectedColor = getSelectedColor(product);
      card.querySelectorAll('[data-nn013-pattern]').forEach(button => {
        const color = product.colors.find(item => (
          item.patternName === button.dataset.nn013Pattern
          && item.bottomName === selectedColor.bottomName
        ));
        button.disabled = !color || !isColorAvailable(product, color);
      });
      card.querySelectorAll('[data-nn013-bottom]').forEach(button => {
        const color = product.colors.find(item => (
          item.patternName === selectedColor.patternName
          && item.bottomName === button.dataset.nn013Bottom
        ));
        button.disabled = !color || !isColorAvailable(product, color);
      });
    }

    if (product.code === 'nn-015') {
      const selectedColor = getSelectedColor(product);
      card.querySelectorAll('[data-nn015-size]').forEach(button => {
        const color = product.colors.find(item => (
          item.sizeName === button.dataset.nn015Size
          && item.shadeName === selectedColor.shadeName
        ));
        button.disabled = !color || !isColorAvailable(product, color);
      });
      card.querySelectorAll('[data-nn015-color]').forEach(button => {
        const color = product.colors.find(item => (
          item.sizeName === selectedColor.sizeName
          && item.shadeName === button.dataset.nn015Color
        ));
        button.disabled = !color || !isColorAvailable(product, color);
      });
    }

    const addButton = card.querySelector('.add-cart');
    if (addButton) addButton.disabled = !getProductAvailability(product);
    card.classList.toggle('sold-out', !getProductAvailability(product));
  });
}

function renderColorSwatches(product, context) {
  return product.colors.map((color, index) => `
    <button
      class="color-swatch${color.key?.startsWith('flower') || color.key?.startsWith('linen23') || color.key?.startsWith('linen05') || color.key?.startsWith('linen18') || color.key?.startsWith('linen26') ? ' pattern-swatch' : ''}${color.image ? ' has-image-preview' : ''}${index === (selectedColors.get(product.id) || 0) ? ' selected' : ''}"
      type="button"
      data-id="${product.id}"
      data-color-index="${index}"
      data-context="${context}"
      style="--swatch-preview: ${color.value};"
      aria-label="${product.name} ${t('cart.colorPrefix')} ${getColorName(color)}"
      aria-pressed="${index === (selectedColors.get(product.id) || 0) ? 'true' : 'false'}"
      title="${getColorName(color)}"
      ${isColorAvailable(product, color) ? '' : 'disabled'}
    >
      <span style="background: ${color.value};"></span>
      ${color.image ? `<img class="swatch-image-preview" src="${color.image}" alt="" aria-hidden="true">` : ''}
    </button>
  `).join('');
}

function renderNn013Selector(product, context) {
  const selectedColor = getSelectedColor(product);
  const selectedPattern = selectedColor?.patternName || flowerColorOptions[0].name;
  const selectedBottom = selectedColor?.bottomName || nn013BottomOptions[0].name;
  const combinationAvailable = (patternName, bottomName) => {
    const combination = product.colors.find(color => (
      color.patternName === patternName && color.bottomName === bottomName
    ));
    return combination && isColorAvailable(product, combination);
  };

  return `
    <div class="nn013-selector" data-nn013-selector="${product.id}">
      <div class="nn013-selector-group" role="group" aria-label="${t('product.topPattern')} ${product.name}">
        <span>${t('product.topPattern')}</span>
        <div class="nn013-options nn013-pattern-options">
          ${flowerColorOptions.map(pattern => `
            <button
              class="nn013-option nn013-pattern-option${pattern.name === selectedPattern ? ' selected' : ''}"
              type="button"
              data-id="${product.id}"
              data-context="${context}"
              data-nn013-pattern="${pattern.name}"
              style="--nn013-preview: ${pattern.value};"
              aria-label="${t('product.pattern')} ${pattern.name}"
              aria-pressed="${pattern.name === selectedPattern ? 'true' : 'false'}"
              ${combinationAvailable(pattern.name, selectedBottom) ? '' : 'disabled'}
            ><span class="nn013-pattern-preview"><img src="${pattern.image}" alt="${t('product.pattern')} ${pattern.name}"></span><b>${pattern.name}</b><span class="nn013-hover-preview" aria-hidden="true"><img src="${pattern.image}" alt=""></span></button>
          `).join('')}
        </div>
      </div>
      <div class="nn013-selector-group" role="group" aria-label="${t('product.bottomColor')} ${product.name}">
        <span>${t('product.bottomColor')}</span>
        <div class="nn013-options">
          ${nn013BottomOptions.map(bottom => `
            <button
              class="nn013-option nn013-bottom-option${bottom.name === selectedBottom ? ' selected' : ''}"
              type="button"
              data-id="${product.id}"
              data-context="${context}"
              data-nn013-bottom="${bottom.name}"
              aria-label="${t('product.bottomColor')} ${bottom.name}"
              aria-pressed="${bottom.name === selectedBottom ? 'true' : 'false'}"
              ${combinationAvailable(selectedPattern, bottom.name) ? '' : 'disabled'}
            ><span class="nn013-color-preview" style="background: ${bottom.value};"></span><b>${bottom.name}</b></button>
          `).join('')}
        </div>
      </div>
      <p class="nn013-selection">${t('product.selectedCombination')}: <strong>${t('product.pattern')} ${selectedPattern} • ${selectedBottom}</strong></p>
    </div>
  `;
}

function renderNn015Selector(product, context) {
  const selectedColor = getSelectedColor(product);
  const selectedSize = selectedColor?.sizeName || nn015SizeOptions[0];
  const selectedShade = selectedColor?.shadeName || nn015ColorOptions[0].name;
  const combinationAvailable = (sizeName, shadeName) => {
    const combination = product.colors.find(color => (
      color.sizeName === sizeName && color.shadeName === shadeName
    ));
    return combination && isColorAvailable(product, combination);
  };

  return `
    <div class="nn013-selector nn015-selector" data-nn015-selector="${product.id}">
      <div class="nn013-selector-group" role="group" aria-label="${t('product.size')} ${product.name}">
        <span>${t('product.size')}</span>
        <div class="nn013-options">
          ${nn015SizeOptions.map(size => `
            <button
              class="nn013-option nn015-size-option${size === selectedSize ? ' selected' : ''}"
              type="button"
              data-id="${product.id}"
              data-context="${context}"
              data-nn015-size="${size}"
              aria-label="${t('product.size')} ${size}"
              aria-pressed="${size === selectedSize ? 'true' : 'false'}"
              ${combinationAvailable(size, selectedShade) ? '' : 'disabled'}
            ><b>${size}</b></button>
          `).join('')}
        </div>
      </div>
      <div class="nn013-selector-group" role="group" aria-label="${t('product.shortsColor')} ${product.name}">
        <span>${t('product.shortsColor')}</span>
        <div class="nn013-options">
          ${nn015ColorOptions.map(shade => `
            <button
              class="nn013-option nn015-color-option${shade.name === selectedShade ? ' selected' : ''}"
              type="button"
              data-id="${product.id}"
              data-context="${context}"
              data-nn015-color="${shade.name}"
              aria-label="${t('product.color')} ${shade.name}"
              aria-pressed="${shade.name === selectedShade ? 'true' : 'false'}"
              ${combinationAvailable(selectedSize, shade.name) ? '' : 'disabled'}
            ><span class="nn013-color-preview" style="background: ${shade.value};"></span><b>${shade.name}</b><span class="nn013-hover-preview" style="background: ${shade.value};" aria-hidden="true"></span></button>
          `).join('')}
        </div>
      </div>
      <p class="nn013-selection">${t('product.selectedCombination')}: <strong>${selectedSize} • ${selectedShade}</strong></p>
    </div>
  `;
}

function renderProductSelector(product, context) {
  if (product.code === 'nn-013') return renderNn013Selector(product, context);
  if (product.code === 'nn-015') return renderNn015Selector(product, context);

  return `
    <div class="color-picker" role="group" aria-label="${t('product.colorAria')} ${product.name}">
      <span>${t('product.color')}</span>
      <div class="color-options">
        ${renderColorSwatches(product, context)}
      </div>
    </div>
  `;
}

function selectNn013Variant(button) {
  const productId = Number(button.dataset.id);
  const product = products.find(item => item.id === productId);
  if (!product || product.code !== 'nn-013') return;

  const current = getSelectedColor(product);
  const patternName = button.dataset.nn013Pattern || current?.patternName || flowerColorOptions[0].name;
  const bottomName = button.dataset.nn013Bottom || current?.bottomName || nn013BottomOptions[0].name;
  const nextIndex = product.colors.findIndex(color => (
    color.patternName === patternName && color.bottomName === bottomName
  ));
  if (nextIndex < 0 || !isColorAvailable(product, product.colors[nextIndex])) return;

  selectedColors.set(productId, nextIndex);
  if (button.dataset.context === 'modal') {
    renderProductDetail(product);
    refreshProductStockDisplays();
  } else {
    renderProducts();
  }
}

function selectNn015Variant(button) {
  const productId = Number(button.dataset.id);
  const product = products.find(item => item.id === productId);
  if (!product || product.code !== 'nn-015') return;

  const current = getSelectedColor(product);
  const sizeName = button.dataset.nn015Size || current?.sizeName || nn015SizeOptions[0];
  const shadeName = button.dataset.nn015Color || current?.shadeName || nn015ColorOptions[0].name;
  const nextIndex = product.colors.findIndex(color => (
    color.sizeName === sizeName && color.shadeName === shadeName
  ));
  if (nextIndex < 0 || !isColorAvailable(product, product.colors[nextIndex])) return;

  selectedColors.set(productId, nextIndex);
  if (button.dataset.context === 'modal') {
    renderProductDetail(product);
    refreshProductStockDisplays();
  } else {
    renderProducts();
  }
}

function addProductToCart(product, feedbackButton) {
  const selectedColor = getSelectedColor(product);
  const feedbackIsInModal = Boolean(feedbackButton?.closest('.product-modal'));

  if (!selectedColor || !isColorAvailable(product, selectedColor)) {
    if (feedbackButton) {
      feedbackButton.textContent = t('product.soldOut');
      window.setTimeout(() => {
        feedbackButton.textContent = t('product.addCart');
      }, 1200);
    }
    return false;
  }

  resetPendingOrderDraft();
  const existingCartItem = findCartItem(product.code, selectedColor.name);
  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    cart.push({ ...product, selectedColor, quantity: 1 });
  }
  renderCart();
  refreshProductStockDisplays();
  if (activeDetailProductId !== null && !feedbackIsInModal) {
    const activeProduct = products.find(item => item.id === activeDetailProductId);
    if (activeProduct) renderProductDetail(activeProduct);
  }

  if (feedbackButton) {
    feedbackButton.textContent = t('product.added');
    feedbackButton.classList.add('added');
    window.setTimeout(() => {
      if (feedbackIsInModal && activeDetailProductId === product.id) {
        renderProductDetail(product);
      } else {
        feedbackButton.textContent = t('product.addCart');
        feedbackButton.classList.remove('added');
      }
    }, 1200);
  }

  return true;
}

function normalizeProduct(row, index) {
  const override = productOverrides[row.code] || {};
  const sourceColors = Array.isArray(row.colors) && row.colors.length > 0
    ? row.colors
    : [{
      key: row.colorKey,
      name: row.colorName,
      nameEN: row.colorNameEN || row.colorNameEn,
      nameZH: row.colorNameZH || row.colorNameZh,
      value: row.colorValue,
      stock: row.stock
    }];

  const colors = typeof override.colors === 'function'
    ? override.colors(sourceColors)
    : sourceColors.length > 0
    ? sourceColors.map(color => ({
      key: color.key,
      name: color.name || color.colorName || 'ไม่ระบุสี',
      nameEN: color.nameEN || color.nameEn || color.colorNameEN || color.colorNameEn,
      nameZH: color.nameZH || color.nameZh || color.colorNameZH || color.colorNameZh,
      value: color.value || color.colorValue || '#edf1ee',
      stock: color.stock === '' || color.stock === undefined ? undefined : Number(color.stock)
    }))
    : [{
      key: row.colorKey,
      name: row.colorName || 'ไม่ระบุสี',
      nameEN: row.colorNameEN || row.colorNameEn,
      nameZH: row.colorNameZH || row.colorNameZh,
      value: row.colorValue || '#edf1ee',
      stock: Number(row.stock)
    }];

  return {
    id: index + 1,
    code: row.code,
    name: override.name || row.name,
    price: Number(row.price) || 0,
    detail: override.detail || row.detail || '',
    image: override.image || row.image || '',
    colors
  };
}

function syncCartItemsWithProducts() {
  cart.forEach(item => {
    const product = getProductByCode(item.code);
    if (!product) return;

    const latestColor = product.colors.find(color => color.name === item.selectedColor.name);
    if (latestColor) {
      item.selectedColor = latestColor;
    }
  });
}

function applySheetProducts(sheetProducts, syncCart = true) {
  if (!Array.isArray(sheetProducts) || sheetProducts.length === 0) return false;

  products = sheetProducts.map(normalizeProduct);
  if (syncCart) syncCartItemsWithProducts();
  return true;
}

async function loadProductsFromSheet() {
  if (!appConfig.appsScriptUrl) return;

  try {
    const response = await fetch(`${appConfig.appsScriptUrl}?action=products`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Products API failed');
    const data = await response.json();
    const sheetProducts = Array.isArray(data.products) ? data.products : [];
    applySheetProducts(sheetProducts);
  } catch (error) {
    console.warn('Using fallback products because Google Sheets data could not be loaded.', error);
  }
}

function renderProducts() {
  productGrid.innerHTML = getSortedProducts().map(product => {
    const stockInfo = getStockStatus(product);
    return `
      <article class="product-card${getProductAvailability(product) ? '' : ' sold-out'}" data-product-id="${product.id}">
        <button class="product-image product-detail-trigger" type="button" data-id="${product.id}" data-detail-label="${t('product.viewDetails')}" aria-label="${t('product.viewDetails')} ${product.name}">
          <img src="${getProductImageUrl(product.image)}" alt="${product.name}" loading="lazy">
        </button>
        <div class="product-meta">
          <div>
            <span class="product-code">${product.code}</span>
            <h3>${product.name}</h3>
            <p>${product.detail}</p>
          </div>
          <strong>${formatter.format(product.price)}</strong>
        </div>
        <div class="stock-meta">
          <p class="stock-status ${stockInfo.state}" data-stock-id="${product.id}" data-stock-state="${stockInfo.state}">${stockInfo.text}</p>
        </div>
        ${renderProductSelector(product, 'card')}
        <button class="button primary add-cart" data-id="${product.id}" ${getProductAvailability(product) ? '' : 'disabled'}>${t('product.addCart')}</button>
      </article>
    `;
  }).join('');
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<p>${t('cart.empty')}</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-row">
        <span>${item.code} • ${item.name} • ${t('cart.colorPrefix')} ${getColorName(item.selectedColor)}</span>
        <div class="cart-row-actions">
          <div class="quantity-control" aria-label="${t('cart.quantity')} ${item.name} ${t('cart.colorPrefix')} ${getColorName(item.selectedColor)}">
            <button type="button" class="quantity-button" data-action="decrease" data-code="${item.code}" data-color="${item.selectedColor.name}" aria-label="${t('cart.decrease')}">−</button>
            <span>${item.quantity}</span>
            <button type="button" class="quantity-button" data-action="increase" data-code="${item.code}" data-color="${item.selectedColor.name}" aria-label="${t('cart.increase')}">+</button>
          </div>
          <strong>${formatter.format(item.price * item.quantity)}</strong>
        </div>
      </div>
    `).join('');
  }

  const subtotal = getCartSubtotal();
  const itemCount = getCartItemCount();
  const shippingInfo = getShippingInfo();
  cartTotal.textContent = formatter.format(subtotal);
  cartShipping.textContent = shippingInfo.label;
  cartGrandTotal.textContent = shippingInfo.grandTotalLabel;
  cartCount.textContent = itemCount;
  if (mobileCartBar && mobileCartCount && mobileCartTotal) {
    const hasItems = itemCount > 0;
    mobileCartCount.textContent = itemCount;
    mobileCartTotal.textContent = formatter.format(subtotal);
    mobileCartBar.hidden = !hasItems;
    mobileCartBar.classList.toggle('has-items', hasItems);
    document.body.classList.toggle('mobile-cart-active', hasItems);
  }
  clearCartButton.disabled = cart.length === 0;
  saveCart();
  renderOrderSummary();
}

function renderProductDetail(product) {
  if (!productModalContent) return;

  const stockInfo = getStockStatus(product);
  productModalContent.innerHTML = `
    <article class="product-detail" data-product-id="${product.id}">
      <div class="product-detail-image">
        <img src="${getProductImageUrl(product.image)}" alt="${product.name}">
      </div>
      <div class="product-detail-info">
        <span class="product-code">${product.code}</span>
        <h3 id="productModalTitle">${product.name}</h3>
        <strong class="product-detail-price">${formatter.format(product.price)}</strong>
        <p>${product.detail}</p>
        <div class="stock-meta detail-stock-meta">
          <p class="stock-status ${stockInfo.state}" data-detail-stock-id="${product.id}" data-stock-state="${stockInfo.state}">
            ${stockInfo.text}
          </p>
        </div>
        ${renderProductSelector(product, 'modal')}
        <button class="button primary modal-add-cart" type="button" data-id="${product.id}" ${getProductAvailability(product) ? '' : 'disabled'}>${t('product.addCart')}</button>
      </div>
    </article>
  `;
}

function openProductDetail(product) {
  activeDetailProductId = product.id;
  renderProductDetail(product);
  productModal.classList.add('open');
  productModal.setAttribute('aria-hidden', 'false');
  if (!swipeHintShown && window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    swipeHintShown = true;
    modalSwipeHint?.classList.add('visible');
    swipeHintTimer = window.setTimeout(() => modalSwipeHint?.classList.remove('visible'), 3200);
  }
  productModal.querySelector('.modal-close')?.focus();
}

function navigateProductDetail(direction) {
  if (!products.length || activeDetailProductId === null) return;
  const sortedProducts = getSortedProducts();
  const currentIndex = sortedProducts.findIndex(product => product.id === activeDetailProductId);
  const nextIndex = (currentIndex + direction + sortedProducts.length) % sortedProducts.length;
  const nextProduct = sortedProducts[nextIndex];
  activeDetailProductId = nextProduct.id;
  renderProductDetail(nextProduct);
  productModalDialog?.scrollTo({ top: 0 });
  productModalContent.classList.remove('swipe-next', 'swipe-previous');
  void productModalContent.offsetWidth;
  productModalContent.classList.add(direction > 0 ? 'swipe-next' : 'swipe-previous');
}

function closeProductDetail() {
  activeDetailProductId = null;
  productModal.classList.remove('open');
  productModal.setAttribute('aria-hidden', 'true');
  productModalContent.innerHTML = '';
  productTouchStart = null;
  if (swipeHintTimer) window.clearTimeout(swipeHintTimer);
  swipeHintTimer = null;
  modalSwipeHint?.classList.remove('visible');
}

function buildOrderSummary() {
  if (cart.length === 0) {
    return t('summary.empty');
  }

  const orderItems = cart.map((item, index) => (
    `${index + 1}. ${item.code} • ${item.name} • ${t('cart.colorPrefix')} ${getColorName(item.selectedColor)} x ${item.quantity} - ${formatter.format(item.price * item.quantity)}`
  )).join('\n');
  const subtotal = getCartSubtotal();
  const shippingInfo = getShippingInfo();

  return [
    'Nunaa.Collection Order',
    `Order ID: ${currentOrderId || t('summary.orderIdPending')}`,
    `${t('summary.pendingExpires')}: ${formatPendingExpiresAt()}`,
    t('summary.pendingNotice'),
    '',
    t('summary.items'),
    orderItems,
    `${t('summary.total')}: ${formatter.format(subtotal)}`,
    `${t('summary.shippingFee')}: ${shippingInfo.label}`,
    `${t('summary.grandTotal')}: ${shippingInfo.grandTotalLabel}`,
    '',
    t('summary.shippingDetails'),
    `${t('summary.name')}: ${customerName.value.trim() || '-'}`,
    `${t('summary.phone')}: ${customerPhone.value.trim() || '-'}`,
    `${t('summary.address')}: ${customerAddress.value.trim() || '-'}`,
    `${t('summary.province')}: ${customerProvince.value.trim() || '-'}`,
    `${t('summary.postal')}: ${customerPostal.value.trim() || '-'}`,
    `${t('summary.note')}: ${customerNote.value.trim() || '-'}`
  ].join('\n');
}

function buildOrderPayload() {
  const items = cart.map(item => ({
    code: item.code,
    name: item.name,
    colorName: item.selectedColor.name,
    price: item.price,
    quantity: item.quantity
  }));

  return {
    clientId,
    website: customerWebsite?.value || '',
    captchaToken: getCaptchaToken(),
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
    subtotal: getCartSubtotal(),
    shippingFee: getShippingInfo().fee,
    total: getShippingInfo().isFixed ? getCartSubtotal() + getShippingInfo().fee : getCartSubtotal(),
    shippingNote: getShippingInfo().isFixed ? '' : getShippingInfo().label,
    pendingExpiresAt: currentPendingExpiresAt,
    summary: buildOrderSummary()
  };
}

async function submitOrderToSheet() {
  if (!appConfig.appsScriptUrl) {
    throw new Error(t('error.saveOrder'));
  }

  await loadProductsFromSheet();
  const stockError = validateCartStockAgainstLatestProducts();
  if (stockError) {
    renderProducts();
    renderCart();
    throw new Error(stockError);
  }

  const response = await fetch(appConfig.appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(buildOrderPayload())
  });
  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(normalizeErrorMessage(data.message || t('error.saveOrder')));
  }

  if (data.orderId) {
    currentOrderId = data.orderId;
    renderOrderSummary();
  }

  if (captchaWidgetId !== null && window.turnstile) window.turnstile.reset(captchaWidgetId);

  return data;
}

async function reportPaymentToSheet(orderId) {
  if (!appConfig.appsScriptUrl) throw new Error(t('error.saveOrder'));

  const response = await fetch(appConfig.appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'reportPayment', orderId, clientId, captchaToken: getCaptchaToken() })
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(normalizeErrorMessage(data.message || t('error.saveOrder')));
  }
  return data;
}

function getCaptchaToken() {
  if (captchaWidgetId === null || !window.turnstile) return '';
  return window.turnstile.getResponse(captchaWidgetId) || '';
}

function setupCaptcha() {
  if (!appConfig.turnstileSiteKey || !captchaContainer) return;
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.addEventListener('load', () => {
    captchaWidgetId = window.turnstile.render(captchaContainer, { sitekey: appConfig.turnstileSiteKey });
  });
  document.head.appendChild(script);
}

function saveActiveOrder(status = 'pending') {
  if (!submittedOrderId) return;
  try {
    localStorage.setItem(ACTIVE_ORDER_STORAGE_KEY, JSON.stringify({
      orderId: submittedOrderId,
      summary: submittedOrderSummary,
      expiresAt: submittedOrderExpiresAt,
      status
    }));
  } catch (error) {
    // Checkout remains usable when storage is unavailable.
  }
}

function restoreActiveOrder() {
  let order;
  try { order = JSON.parse(localStorage.getItem(ACTIVE_ORDER_STORAGE_KEY) || 'null'); } catch (error) { return; }
  if (!order?.orderId || !order.summary) return;
  showPaymentConfirmation(order.orderId, order.summary, order.expiresAt, false);
  orderSummary.textContent = order.summary;
  if (order.status === 'payment_reported') {
    if (countdownTimer) window.clearInterval(countdownTimer);
    countdownTimer = null;
    confirmationCountdown.textContent = t('confirmation.paymentReported');
    paymentConfirmation.classList.add('payment-reported');
    sendInstagramButton.disabled = true;
    saveActiveOrder('payment_reported');
    reportPaymentButton.disabled = true;
  }
}

function renderOrderSummary() {
  orderSummary.textContent = cart.length === 0 && submittedOrderSummary
    ? submittedOrderSummary
    : buildOrderSummary();
}

function normalizeErrorMessage(message) {
  const text = String(message || t('error.saveOrder'));

  if (!text.includes('เธ')) return text;

  const cleanedText = text
    .replaceAll('เธชเธต', 'สี')
    .replaceAll('เน«เธซเธฅเธทเธญ', 'เหลือ')
    .replaceAll('เธ๊เธดเน้เธ้', 'ชิ้น');
  const stockMatch = cleanedText.match(/^(nn-\d+)\s+สี(.+?)\s+เหลือ\s+(\d+)/i);

  if (stockMatch) {
    return t('status.stockUnavailable', {
      item: `${stockMatch[1]} ${t('cart.colorPrefix')} ${stockMatch[2].trim()}`,
      available: Number(stockMatch[3])
    });
  }

  return cleanedText;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall through to the selection-based copy for browsers that block async clipboard.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

function updateConfirmationCountdown() {
  const remainingMs = new Date(submittedOrderExpiresAt).getTime() - Date.now();
  if (!submittedOrderExpiresAt || remainingMs <= 0) {
    confirmationCountdown.textContent = t('confirmation.expired');
    sendInstagramButton.disabled = true;
    reportPaymentButton.disabled = true;
    paymentConfirmation.classList.add('expired');
    if (countdownTimer) window.clearInterval(countdownTimer);
    countdownTimer = null;
    return;
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  confirmationCountdown.textContent = t('confirmation.timeLeft', { time: `${minutes}:${seconds}` });
}

function showPaymentConfirmation(orderId, summaryText, expiresAt, shouldScroll = true) {
  submittedOrderSummary = summaryText;
  submittedOrderId = orderId;
  submittedOrderExpiresAt = expiresAt;
  confirmedOrderId.textContent = orderId;
  paymentConfirmation.hidden = false;
  paymentConfirmation.classList.remove('expired');
  sendInstagramButton.disabled = false;
  reportPaymentButton.disabled = false;
  if (countdownTimer) window.clearInterval(countdownTimer);
  updateConfirmationCountdown();
  countdownTimer = window.setInterval(updateConfirmationCountdown, 1000);
  saveActiveOrder();
  if (shouldScroll) paymentConfirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

productGrid.addEventListener('click', event => {
  const detailButton = event.target.closest('.product-detail-trigger');
  if (detailButton) {
    const product = products.find(item => item.id === Number(detailButton.dataset.id));
    if (product) openProductDetail(product);
    return;
  }

  const nn013Button = event.target.closest('[data-nn013-pattern], [data-nn013-bottom]');
  if (nn013Button) {
    selectNn013Variant(nn013Button);
    return;
  }

  const nn015Button = event.target.closest('[data-nn015-size], [data-nn015-color]');
  if (nn015Button) {
    selectNn015Variant(nn015Button);
    return;
  }

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
  if (product) addProductToCart(product, button);
});

productModal.addEventListener('click', event => {
  const closeControl = event.target.closest('[data-modal-close]');
  if (closeControl) {
    closeProductDetail();
    return;
  }

  const nn013Button = event.target.closest('[data-nn013-pattern], [data-nn013-bottom]');
  if (nn013Button) {
    selectNn013Variant(nn013Button);
    return;
  }

  const nn015Button = event.target.closest('[data-nn015-size], [data-nn015-color]');
  if (nn015Button) {
    selectNn015Variant(nn015Button);
    return;
  }

  const colorButton = event.target.closest('.color-swatch');
  if (colorButton) {
    const productId = Number(colorButton.dataset.id);
    const product = products.find(item => item.id === productId);
    selectedColors.set(productId, Number(colorButton.dataset.colorIndex));
    if (product) renderProductDetail(product);
    refreshProductStockDisplays();
    return;
  }

  const addButton = event.target.closest('.modal-add-cart');
  if (!addButton) return;

  const product = products.find(item => item.id === Number(addButton.dataset.id));
  if (product) addProductToCart(product, addButton);
});

productModalContent.addEventListener('touchstart', event => {
  const target = event.target instanceof Element ? event.target : null;
  const isInteractive = target?.closest('button, a, input, select, textarea, label');
  if (event.touches.length !== 1 || isInteractive) {
    productTouchStart = null;
    return;
  }

  const touch = event.touches[0];
  productTouchStart = {
    x: touch.clientX,
    y: touch.clientY,
    startedAt: Date.now()
  };
}, { passive: true });

function resetProductSwipeDrag() {
  productModalContent.classList.remove('is-dragging');
  productModalContent.style.removeProperty('--swipe-drag-x');
  productModalContent.style.removeProperty('--swipe-drag-opacity');
}

productModalContent.addEventListener('touchmove', event => {
  if (!productTouchStart || event.touches.length !== 1) return;

  const touch = event.touches[0];
  const deltaX = touch.clientX - productTouchStart.x;
  const deltaY = touch.clientY - productTouchStart.y;
  if (Math.abs(deltaX) < 8 || Math.abs(deltaX) <= Math.abs(deltaY)) {
    resetProductSwipeDrag();
    return;
  }

  const dragX = Math.max(-54, Math.min(54, deltaX * .42));
  const dragOpacity = Math.max(.72, 1 - (Math.abs(dragX) / 220));
  productModalContent.style.setProperty('--swipe-drag-x', `${dragX}px`);
  productModalContent.style.setProperty('--swipe-drag-opacity', String(dragOpacity));
  productModalContent.classList.add('is-dragging');
}, { passive: true });

productModalContent.addEventListener('touchend', event => {
  if (!productTouchStart || event.changedTouches.length !== 1) {
    productTouchStart = null;
    resetProductSwipeDrag();
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - productTouchStart.x;
  const deltaY = touch.clientY - productTouchStart.y;
  const duration = Date.now() - productTouchStart.startedAt;
  productTouchStart = null;
  resetProductSwipeDrag();

  const isHorizontalMovement = Math.abs(deltaX) > Math.abs(deltaY) * PRODUCT_SWIPE_DIRECTION_RATIO;
  const hasEnoughDistance = Math.abs(deltaX) >= PRODUCT_SWIPE_MIN_DISTANCE;
  const isQuickFlick = Math.abs(deltaX) >= PRODUCT_SWIPE_FLICK_DISTANCE && duration <= PRODUCT_SWIPE_FLICK_DURATION;
  if (
    !isHorizontalMovement
    || (!hasEnoughDistance && !isQuickFlick)
    || duration > PRODUCT_SWIPE_MAX_DURATION
    || !productModal.classList.contains('open')
  ) return;

  navigateProductDetail(deltaX < 0 ? 1 : -1);
}, { passive: true });

productModalContent.addEventListener('touchcancel', () => {
  productTouchStart = null;
  resetProductSwipeDrag();
}, { passive: true });

modalCloseControls.forEach(control => {
  control.addEventListener('click', closeProductDetail);
});

modalNavigationControls.forEach(control => {
  control.addEventListener('click', () => {
    navigateProductDetail(Number(control.dataset.modalDirection));
  });
});

document.addEventListener('keydown', event => {
  if (!productModal.classList.contains('open')) return;
  if (event.key === 'Escape') {
    closeProductDetail();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    navigateProductDetail(-1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    navigateProductDetail(1);
  }
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('.quantity-button');
  if (!button) return;

  const cartItem = findCartItem(button.dataset.code, button.dataset.color);
  if (!cartItem) return;

  const product = getProductByCode(cartItem.code);
  resetPendingOrderDraft();

  if (button.dataset.action === 'increase') {
    if (product && isColorAvailable(product, cartItem.selectedColor)) {
      cartItem.quantity += 1;
    }
  }

  if (button.dataset.action === 'decrease') {
    cartItem.quantity -= 1;
    if (cartItem.quantity <= 0) {
      const itemIndex = cart.indexOf(cartItem);
      cart.splice(itemIndex, 1);
    }
  }

  renderCart();
  refreshProductStockDisplays();
});

clearCartButton.addEventListener('click', () => {
  if (cart.length === 0) return;
  cart.splice(0, cart.length);
  resetPendingOrderDraft();
  copyStatus.textContent = '';
  renderCart();
  refreshProductStockDisplays();
});

menuButton.addEventListener('click', () => {
  nav.classList.toggle('open');
});

languageButtons.forEach(button => {
  button.addEventListener('click', () => {
    const nextLanguage = button.dataset.lang;
    if (!translations[nextLanguage] || nextLanguage === currentLanguage) return;
    currentLanguage = nextLanguage;
    localStorage.setItem('nunaaLanguage', currentLanguage);
    applyTranslations();
  });
});

productSortSelect?.addEventListener('change', () => {
  currentProductSort = productSortSelect.value;
  localStorage.setItem(PRODUCT_SORT_STORAGE_KEY, currentProductSort);
  renderProducts();
});

checkoutForm.addEventListener('input', () => {
  resetPendingOrderDraft();
  copyStatus.textContent = '';
  renderOrderSummary();
});

checkoutForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (isSubmittingOrder) return;

  if (cart.length === 0) {
    copyStatus.textContent = t('status.emptyCart');
    document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (!currentOrderId) currentOrderId = createOrderId();
  if (!currentPendingExpiresAt) currentPendingExpiresAt = createPendingExpiresAt();
  renderOrderSummary();
  isSubmittingOrder = true;
  reserveOrderButton.disabled = true;
  reserveOrderButton.textContent = t('form.reserving');

  try {
    const orderResult = await submitOrderToSheet();
    const summaryText = orderResult.summary || orderSummary.textContent;
    const confirmedId = orderResult.orderId || currentOrderId;
    const confirmedExpiresAt = orderResult.pendingExpiresAt || currentPendingExpiresAt;
    applySheetProducts(orderResult.products, false);
    cart.length = 0;
    saveCart();
    renderProducts();
    renderCart();
    orderSummary.textContent = summaryText;
    showPaymentConfirmation(confirmedId, summaryText, confirmedExpiresAt);
    copyStatus.textContent = t('status.copySaved', { orderId: confirmedId });
    currentOrderId = '';
    currentPendingExpiresAt = '';
  } catch (error) {
    copyStatus.textContent = t('status.failed', { orderId: currentOrderId, message: error.message });
  } finally {
    isSubmittingOrder = false;
    reserveOrderButton.disabled = false;
    reserveOrderButton.textContent = t('form.reserveOrder');
  }
});

sendInstagramButton.addEventListener('click', async () => {
  if (!submittedOrderSummary || sendInstagramButton.disabled) return;
  const instagramWindow = window.open('', '_blank');
  const copied = await copyTextToClipboard(submittedOrderSummary);
  if (instagramWindow) {
    instagramWindow.opener = null;
    instagramWindow.location.href = 'https://www.instagram.com/Nunaa.collection';
  } else {
    window.location.href = 'https://www.instagram.com/Nunaa.collection';
  }
  copyStatus.textContent = copied ? t('status.orderCopied') : t('status.copyUnavailable');
});

reportPaymentButton.addEventListener('click', async () => {
  if (!submittedOrderId || reportPaymentButton.disabled) return;
  reportPaymentButton.disabled = true;
  reportPaymentButton.textContent = t('form.reportingPayment');

  try {
    const paymentResult = await reportPaymentToSheet(submittedOrderId);
    if (countdownTimer) window.clearInterval(countdownTimer);
    countdownTimer = null;
    confirmationCountdown.textContent = paymentResult.afterHours
      ? t('confirmation.paymentReportedAfterHours', { deadline: formatReviewDueAt(paymentResult.reviewDueAt) })
      : t('confirmation.paymentReported');
    paymentConfirmation.classList.add('payment-reported');
    sendInstagramButton.disabled = true;
    saveActiveOrder('payment_reported');
    copyStatus.textContent = t('status.paymentReported', { orderId: submittedOrderId });
    reportPaymentButton.textContent = t('form.reportPayment');
  } catch (error) {
    reportPaymentButton.disabled = false;
    reportPaymentButton.textContent = t('form.reportPayment');
    copyStatus.textContent = t('status.paymentReportFailed', { message: error.message });
  }
});

copyOrderIdButton.addEventListener('click', async () => {
  if (!confirmedOrderId.textContent) return;
  const copied = await copyTextToClipboard(confirmedOrderId.textContent);
  copyStatus.textContent = copied ? t('status.orderIdCopied') : t('status.copyUnavailable');
});

function updateBackToTopVisibility() {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle('visible', window.scrollY > 520);
}

backToTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

orderStatusForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const orderId = statusOrderId.value.trim().toUpperCase();
  orderStatusResult.textContent = 'กำลังตรวจสอบ…';
  try {
    const url = new URL(appConfig.appsScriptUrl);
    url.searchParams.set('action', 'orderStatus');
    url.searchParams.set('orderId', orderId);
    url.searchParams.set('clientId', clientId);
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || 'ตรวจสอบสถานะไม่สำเร็จ');
    const labels = { pending: 'รอชำระเงิน', payment_reported: 'แจ้งชำระแล้ว—รอตรวจสอบ', paid: 'ยืนยันชำระเงินแล้ว', expired: 'หมดอายุ', cancelled: 'ยกเลิก', payment_rejected: 'ไม่ผ่านการตรวจสอบการชำระเงิน' };
    orderStatusResult.textContent = `${data.orderId}: ${labels[data.status] || data.status}${data.total ? ` • ยอดรวม ฿${data.total}` : ''}`;
  } catch (error) {
    orderStatusResult.textContent = error.message;
  }
});

async function init() {
  if (!translations[currentLanguage]) currentLanguage = 'th';
  if (!['code', 'price-asc', 'price-desc', 'available'].includes(currentProductSort)) {
    currentProductSort = 'code';
  }
  if (productSortSelect) productSortSelect.value = currentProductSort;
  setupCaptcha();
  await loadProductsFromSheet();
  restoreCart();
  applyTranslations();
  restoreActiveOrder();
}

init();
