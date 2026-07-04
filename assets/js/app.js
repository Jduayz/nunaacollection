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
    code: 'nn-019',
    name: 'Spaghetti crop top',
    price: 320,
    detail: 'Flowers collection • Top',
    colors: getColors(colorSets.flowerPattern),
    image: 'assets/images/products/nn-019-020-flower-set.jpeg'
  },
  {
    id: 20,
    code: 'nn-020',
    name: 'Shorts',
    price: 320,
    detail: 'Flowers collection • Shorts',
    colors: getColors(colorSets.flowerPattern),
    image: 'assets/images/products/nn-019-020-flower-set.jpeg'
  },
  {
    id: 21,
    code: 'nn-021',
    name: 'Puff Sleeve',
    price: 320,
    detail: 'Flowers collection • Top',
    colors: getColors(colorSets.flowerPattern),
    image: 'assets/images/products/nn-021-022-flower-set.jpeg'
  },
  {
    id: 22,
    code: 'nn-022',
    name: 'Skirt',
    price: 320,
    detail: 'Flowers collection • Skirt',
    colors: getColors(colorSets.flowerPattern),
    image: 'assets/images/products/nn-021-022-flower-set.jpeg'
  },
  {
    id: 23,
    code: 'nn-023',
    name: 'Cupcake top linen fabric',
    price: 350,
    detail: 'Linen • Chest 24"-36"',
    colors: getColors(colorSets.linenPattern),
    image: 'assets/images/products/nn-023-cupcake-top-linen.jpeg'
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
    colors: getColors(colorSets.linenPattern),
    image: 'assets/images/products/nn-026-long-sleeve-crop-top-linen.jpeg'
  },
  {
    id: 27,
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
const EMS_FLAT_RATE = 60;
const EMS_FLAT_RATE_MAX_ITEMS = 10;
const PENDING_ORDER_EXPIRY_MINUTES = 15;
let currentOrderId = '';
let currentPendingExpiresAt = '';

const productGrid = document.querySelector('#productGrid');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const cartShipping = document.querySelector('#cartShipping');
const cartGrandTotal = document.querySelector('#cartGrandTotal');
const cartCount = document.querySelector('#cartCount');
const clearCartButton = document.querySelector('#clearCartButton');
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
const languageButtons = document.querySelectorAll('.language-button');

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
    'hero.eyebrow': 'Everyday Look • Chiang Mai Local Fabric',
    'hero.title': 'เสื้อผ้าใส่สบายที่แมตช์ได้ทุกคอลเลคชั่น',
    'hero.body': 'Nunaa.Collection ออกแบบเสื้อผ้าเรียบง่ายสำหรับทุกวัน ใช้ผ้าท้องถิ่นจากเชียงใหม่ ใส่แล้วสบาย ดูแลง่าย และอยู่กับตู้เสื้อผ้าได้นาน',
    'hero.shopButton': 'ดูสินค้า',
    'hero.cardLabel': 'Handmade',
    'hero.cardTitle': 'piece by piece',
    'hero.cardText': 'soft textures • timeless palette • local story',
    'about.eyebrow': 'About Us',
    'about.title': 'จุดเริ่มต้นจากงานฝีมือของคุณแม่และลูกสาว',
    'about.bodyOne': 'จุดเริ่มต้นเกิดจากคุณแม่ที่ชอบทำงานฝีมือและลูกสาวที่นำงานฝีมือของคุณแม่มาต่อยอดและสร้างสรรค์เป็นงาน ผ่านลวดลายบนกระเป๋าผ้าฝ้ายธรรมชาติที่ออกแบบร่วมกันกับคุณแม่ โดยเน้นไปที่รูปดอกไม้ต่าง ๆ โดยงานออกแบบทั้งหมดจะถูกวาดโดยไหมปักผ้า เส้นด้าย บนผืนผ้าสีขาว ทั้ง 2 มิติ และ 3 มิติ',
    'about.bodyTwo': 'งานเสื้อผ้าที่ออกแบบโดยลูกสาวและตัดเย็บทั้งหมดโดยคุณแม่ ทำควบคู่ไปกับกระเป๋าและเครื่องประดับคอเลกชันดอกไม้ เน้นไปที่ผ้าฝ้ายธรรมชาติ ผ้าลินิน เน้นงานออกแบบที่สวมใส่สบายและมีความน่ารัก โดยแนวคิดในการออกแบบคือ เสื้อผ้าสไตล์น่ารัก ๆ ที่คุณแม่อยากให้ลูกสาวได้ใส่',
    'shop.eyebrow': 'New Collection',
    'shop.title': 'สินค้าพร้อมสั่งซื้อ',
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
    'order.stepFour': 'ร้านยืนยันชำระเงินและอัปเดต stock',
    'form.title': 'ข้อมูลจัดส่ง',
    'form.subtitle': 'กรอกรายละเอียดสำหรับจัดส่งสินค้า',
    'form.name': 'ชื่อ-นามสกุล',
    'form.phone': 'เบอร์ติดต่อ',
    'form.address': 'ที่อยู่จัดส่ง',
    'form.province': 'จังหวัด',
    'form.postal': 'รหัสไปรษณีย์',
    'form.note': 'หมายเหตุ',
    'form.copyOrder': 'คัดลอกออเดอร์',
    'form.sendInstagram': 'ส่งทาง Instagram',
    'summary.title': 'สรุปออเดอร์',
    'summary.empty': 'เลือกสินค้าในตะกร้าเพื่อสร้างสรุปออเดอร์',
    'payment.title': 'ชำระเงินผ่าน QR',
    'payment.body': 'สแกน QR เพื่อชำระเงิน แล้วส่งสลิปพร้อมสรุปออเดอร์ให้ร้านทาง Instagram ระบบจะบันทึกออเดอร์เป็น pending ก่อน',
    'payment.notice': 'ออเดอร์ pending จะหมดอายุใน 15 นาที และออเดอร์จะถูกจองหลังร้านยืนยันเท่านั้น',
    'payment.qrAlt': 'Nunaa.Collection payment QR code',
    'contact.eyebrow': 'Contact',
    'contact.title': 'คุยกับร้าน',
    'contact.body': 'สำหรับสอบถามสินค้า แจ้งชำระเงิน หรือเช็กออเดอร์ ติดต่อผ่าน Instagram ได้เลย',
    'footer.tagline': 'Everyday look, handmade piece by piece.',
    'product.color': 'สี',
    'product.colorAria': 'เลือกสี',
    'product.addCart': 'เพิ่มลงตะกร้า',
    'product.added': 'เพิ่มแล้ว',
    'product.soldOut': 'สินค้าหมด',
    'product.ready': 'พร้อมสั่งซื้อ',
    'product.remaining': 'เหลือ {count} ชิ้น',
    'cart.empty': 'ยังไม่มีสินค้าในตะกร้า',
    'cart.colorPrefix': 'สี',
    'cart.quantity': 'จำนวน',
    'cart.decrease': 'ลดจำนวน',
    'cart.increase': 'เพิ่มจำนวน',
    'summary.orderIdPending': 'จะสร้างเมื่อกดคัดลอกออเดอร์',
    'summary.items': 'รายการสินค้า',
    'summary.pendingExpires': 'ออเดอร์ pending หมดอายุ',
    'summary.pendingNotice': 'ออเดอร์จะถูกจองหลังร้านยืนยันเท่านั้น',
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
    'status.copySaved': 'สร้าง {orderId} เป็น pending และคัดลอกออเดอร์แล้ว กรุณาส่งสลิปภายใน 15 นาที ออเดอร์จะถูกจองหลังร้านยืนยันเท่านั้น',
    'status.savedNoCopy': 'สร้าง {orderId} เป็น pending แล้ว กรุณาส่งสลิปภายใน 15 นาที แต่ browser ไม่อนุญาตให้คัดลอกอัตโนมัติ กรุณาเลือกข้อความสรุปออเดอร์แล้วคัดลอกเอง',
    'status.copySaveFailed': 'คัดลอกออเดอร์แล้ว แต่ยังบันทึก {orderId} ไม่สำเร็จ: {message}',
    'status.failed': 'สร้าง {orderId} แล้ว แต่ยังบันทึก/คัดลอกไม่สำเร็จ: {message}',
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
    'hero.eyebrow': 'Everyday Look • Chiang Mai Local Fabric',
    'hero.title': 'Comfortable pieces made to match every collection',
    'hero.body': 'Nunaa.Collection designs simple everyday clothing with local fabrics from Chiang Mai. Each piece is comfortable, easy to style, easy to care for, and made to stay in your wardrobe.',
    'hero.shopButton': 'Shop now',
    'hero.cardLabel': 'Handmade',
    'hero.cardTitle': 'piece by piece',
    'hero.cardText': 'soft textures • timeless palette • local story',
    'about.eyebrow': 'About Us',
    'about.title': 'A mother and daughter story in handmade craft',
    'about.bodyOne': 'Nunaa.Collection began with a mother who loves handmade work and a daughter who helped turn that craft into thoughtful designs. Their early pieces focused on natural cotton bags decorated with floral embroidery, drawn with thread on white fabric in both two- and three-dimensional details.',
    'about.bodyTwo': 'Today the clothing is designed by the daughter and sewn by the mother, alongside bags and accessories from the floral collection. The pieces focus on natural cotton and linen, comfortable shapes, and a sweet feeling inspired by clothes a mother would love her daughter to wear.',
    'shop.eyebrow': 'New Collection',
    'shop.title': 'Ready-to-order pieces',
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
    'order.stepFour': 'The shop confirms payment and updates stock.',
    'form.title': 'Shipping details',
    'form.subtitle': 'Enter the details for delivery.',
    'form.name': 'Full name',
    'form.phone': 'Phone number',
    'form.address': 'Shipping address',
    'form.province': 'Province',
    'form.postal': 'Postal code',
    'form.note': 'Note',
    'form.copyOrder': 'Copy order',
    'form.sendInstagram': 'Send via Instagram',
    'summary.title': 'Order summary',
    'summary.empty': 'Add items to your cart to create an order summary.',
    'payment.title': 'Pay by QR',
    'payment.body': 'Scan the QR to pay, then send the payment slip with your order summary to the shop via Instagram. The order will be saved as pending first.',
    'payment.notice': 'Pending orders expire in 15 minutes. Items are reserved only after the shop confirms your order.',
    'payment.qrAlt': 'Nunaa.Collection payment QR code',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Talk to the shop',
    'contact.body': 'For product questions, payment slips, or order checks, contact us on Instagram.',
    'footer.tagline': 'Everyday look, handmade piece by piece.',
    'product.color': 'Color',
    'product.colorAria': 'Choose color',
    'product.addCart': 'Add to cart',
    'product.added': 'Added',
    'product.soldOut': 'Sold out',
    'product.ready': 'Ready to order',
    'product.remaining': '{count} left',
    'cart.empty': 'Your cart is empty.',
    'cart.colorPrefix': 'Color',
    'cart.quantity': 'Quantity',
    'cart.decrease': 'Decrease quantity',
    'cart.increase': 'Increase quantity',
    'summary.orderIdPending': 'created when you copy the order',
    'summary.items': 'Items',
    'summary.pendingExpires': 'Pending order expires',
    'summary.pendingNotice': 'Items are reserved only after the shop confirms your order.',
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
    'status.copySaved': 'Created {orderId} as pending and copied the order. Please send the payment slip within 15 minutes. Items are reserved only after the shop confirms your order.',
    'status.savedNoCopy': 'Created {orderId} as pending. Please send the payment slip within 15 minutes, but the browser did not allow automatic copy. Please select and copy the order summary manually.',
    'status.copySaveFailed': 'The order was copied, but {orderId} could not be saved: {message}',
    'status.failed': 'Created {orderId}, but saving/copying failed: {message}',
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
    'hero.eyebrow': '日常穿搭 • 清迈本地布料',
    'hero.title': '舒适好搭的日常服饰',
    'hero.body': 'Nunaa.Collection 以清迈本地布料设计简约日常服饰。每一件都舒适、好搭、容易保养，也适合长久留在衣柜里。',
    'hero.shopButton': '查看商品',
    'hero.cardLabel': '手工制作',
    'hero.cardTitle': '一件一件完成',
    'hero.cardText': '柔软质感 • 耐看色调 • 在地故事',
    'about.eyebrow': '关于我们',
    'about.title': '来自母女手作的开始',
    'about.bodyOne': 'Nunaa.Collection 的起点，是一位热爱手作的母亲，以及把妈妈的手艺延伸成设计的女儿。最初的作品以天然棉布包为主，并用刺绣线在白色布面上描绘花朵，呈现平面与立体的细节。',
    'about.bodyTwo': '现在，服装由女儿设计、母亲亲手缝制，同时也延续花朵系列的包款与配饰。作品以天然棉与亚麻为主，强调舒适版型和可爱的气质，灵感来自妈妈想让女儿穿上的温柔衣服。',
    'shop.eyebrow': '新品系列',
    'shop.title': '可订购商品',
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
    'order.stepFour': '店铺确认付款并更新库存。',
    'form.title': '收件资料',
    'form.subtitle': '填写配送所需资料。',
    'form.name': '姓名',
    'form.phone': '联系电话',
    'form.address': '收件地址',
    'form.province': '省 / 府',
    'form.postal': '邮政编码',
    'form.note': '备注',
    'form.copyOrder': '复制订单',
    'form.sendInstagram': '通过 Instagram 发送',
    'summary.title': '订单摘要',
    'summary.empty': '请先将商品加入购物车以生成订单摘要。',
    'payment.title': 'QR 付款',
    'payment.body': '扫描 QR 付款后，请将付款凭证和订单摘要通过 Instagram 发给店铺。订单会先保存为待确认状态。',
    'payment.notice': '待确认订单会在 15 分钟后过期。商品只会在店铺确认后才会被预留。',
    'payment.qrAlt': 'Nunaa.Collection 付款 QR 码',
    'contact.eyebrow': '联系',
    'contact.title': '联系店铺',
    'contact.body': '如需询问商品、发送付款凭证或查询订单，请通过 Instagram 联系我们。',
    'footer.tagline': '日常穿搭，一件一件手工制作。',
    'product.color': '颜色',
    'product.colorAria': '选择颜色',
    'product.addCart': '加入购物车',
    'product.added': '已加入',
    'product.soldOut': '售罄',
    'product.ready': '可订购',
    'product.remaining': '剩余 {count} 件',
    'cart.empty': '购物车还是空的。',
    'cart.colorPrefix': '颜色',
    'cart.quantity': '数量',
    'cart.decrease': '减少数量',
    'cart.increase': '增加数量',
    'summary.orderIdPending': '复制订单时生成',
    'summary.items': '商品列表',
    'summary.pendingExpires': '待确认订单过期时间',
    'summary.pendingNotice': '商品只会在店铺确认后才会被预留。',
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
    'status.copySaved': '已建立 {orderId} 为待确认订单，并复制订单内容。请在 15 分钟内发送付款凭证。商品只会在店铺确认后才会被预留。',
    'status.savedNoCopy': '已建立 {orderId} 为待确认订单，请在 15 分钟内发送付款凭证。但浏览器不允许自动复制，请手动选择并复制订单摘要。',
    'status.copySaveFailed': '订单已复制，但 {orderId} 尚未保存成功：{message}',
    'status.failed': '已建立 {orderId}，但保存/复制失败：{message}',
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

function formatStockText(product) {
  const selectedColor = getSelectedColor(product);
  if (!isStockManaged(selectedColor)) return t('product.ready');
  const remaining = getRemainingStock(product, selectedColor);
  return remaining > 0 ? t('product.remaining', { count: remaining }) : t('product.soldOut');
}

function findCartItem(code, colorName) {
  return cart.find(item => item.code === code && item.selectedColor.name === colorName);
}

function getProductByCode(code) {
  return products.find(product => product.code === code);
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
    if (stockStatus) stockStatus.textContent = formatStockText(product);

    card.querySelectorAll('.color-swatch').forEach(swatch => {
      const color = product.colors[Number(swatch.dataset.colorIndex)];
      swatch.disabled = !isColorAvailable(product, color);
    });

    const addButton = card.querySelector('.add-cart');
    if (addButton) addButton.disabled = !getProductAvailability(product);
    card.classList.toggle('sold-out', !getProductAvailability(product));
  });
}

function normalizeProduct(row, index) {
  const colors = Array.isArray(row.colors) && row.colors.length > 0
    ? row.colors.map(color => ({
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
    <article class="product-card${getProductAvailability(product) ? '' : ' sold-out'}" data-product-id="${product.id}">
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
      <div class="color-picker" role="group" aria-label="${t('product.colorAria')} ${product.name}">
        <span>${t('product.color')}</span>
        <div class="color-options">
          ${product.colors.map((color, index) => `
            <button
              class="color-swatch${index === (selectedColors.get(product.id) || 0) ? ' selected' : ''}"
              type="button"
              data-id="${product.id}"
              data-color-index="${index}"
              aria-label="${product.name} ${t('cart.colorPrefix')} ${getColorName(color)}"
              aria-pressed="${index === (selectedColors.get(product.id) || 0) ? 'true' : 'false'}"
              title="${getColorName(color)}"
              ${isColorAvailable(product, color) ? '' : 'disabled'}
            >
              <span style="background: ${color.value};"></span>
            </button>
          `).join('')}
        </div>
      </div>
      <button class="button primary add-cart" data-id="${product.id}" ${getProductAvailability(product) ? '' : 'disabled'}>${t('product.addCart')}</button>
    </article>
  `).join('');
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
  clearCartButton.disabled = cart.length === 0;
  renderOrderSummary();
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
    reserveAfterConfirmationOnly: true,
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
    throw new Error(data.message || t('error.saveOrder'));
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
    button.textContent = t('product.soldOut');
    window.setTimeout(() => {
      button.textContent = t('product.addCart');
    }, 1200);
    return;
  }

  const existingCartItem = findCartItem(product.code, selectedColor.name);
  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    cart.push({ ...product, selectedColor, quantity: 1 });
  }
  renderCart();
  refreshProductStockDisplays();

  button.textContent = t('product.added');
  button.classList.add('added');
  window.setTimeout(() => {
    button.textContent = t('product.addCart');
    button.classList.remove('added');
  }, 1200);

  const card = button.closest('.product-card');
  const stockStatus = card.querySelector('[data-stock-id]');
  if (stockStatus) stockStatus.textContent = formatStockText(product);
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('.quantity-button');
  if (!button) return;

  const cartItem = findCartItem(button.dataset.code, button.dataset.color);
  if (!cartItem) return;

  const product = getProductByCode(cartItem.code);

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
  currentOrderId = '';
  currentPendingExpiresAt = '';
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

checkoutForm.addEventListener('input', () => {
  copyStatus.textContent = '';
  renderOrderSummary();
});

checkoutForm.addEventListener('submit', async event => {
  event.preventDefault();

  if (cart.length === 0) {
    copyStatus.textContent = t('status.emptyCart');
    document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  currentOrderId = createOrderId();
  currentPendingExpiresAt = createPendingExpiresAt();
  renderOrderSummary();
  const summaryText = orderSummary.textContent;
  const copied = await copyTextToClipboard(summaryText);

  try {
    await submitOrderToSheet();
    copyStatus.textContent = copied
      ? t('status.copySaved', { orderId: currentOrderId })
      : t('status.savedNoCopy', { orderId: currentOrderId });
  } catch (error) {
    copyStatus.textContent = copied
      ? t('status.copySaveFailed', { orderId: currentOrderId, message: error.message })
      : t('status.failed', { orderId: currentOrderId, message: error.message });
  }
});

async function init() {
  if (!translations[currentLanguage]) currentLanguage = 'th';
  await loadProductsFromSheet();
  applyTranslations();
}

init();
