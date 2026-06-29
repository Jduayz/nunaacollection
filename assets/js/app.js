const products = [
  {
    id: 1,
    code: 'nn-001',
    name: 'Pumpkins crop top',
    price: 250,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-001-pumpkins-crop-top.jpeg'
  },
  {
    id: 2,
    code: 'nn-002',
    name: 'Nunaa crop top',
    price: 250,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-002-nunaa-crop-top.jpeg'
  },
  {
    id: 3,
    code: 'nn-003',
    name: 'Spaghetti strap top',
    price: 250,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-003-spaghetti-strap-top.jpeg'
  },
  {
    id: 4,
    code: 'nn-004',
    name: 'Spaghetti crop top',
    price: 250,
    detail: 'Cotton • Chest 26"-36"',
    image: 'assets/images/products/nn-004-spaghetti-crop-top.jpeg'
  },
  {
    id: 5,
    code: 'nn-005',
    name: 'Spaghetti crop top linen fabric',
    price: 290,
    detail: 'Linen • Chest 26"-36"',
    image: 'assets/images/products/nn-005-spaghetti-crop-top-linen.jpeg'
  },
  {
    id: 6,
    code: 'nn-006',
    name: 'Nunaa crop top with ribbon',
    price: 290,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-006-ribbon-crop-top.jpeg'
  },
  {
    id: 7,
    code: 'nn-007',
    name: 'Smock tube top with straps',
    price: 290,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-007-smock-tube-top.jpeg'
  },
  {
    id: 8,
    code: 'nn-008',
    name: 'Pretzel top',
    price: 290,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-008-pretzel-top.jpeg'
  },
  {
    id: 9,
    code: 'nn-009',
    name: 'Pretzel top',
    price: 290,
    detail: 'Cotton • Chest 26"-36"',
    image: 'assets/images/products/nn-009-pretzel-top.jpeg'
  },
  {
    id: 10,
    code: 'nn-010',
    name: 'Chinese collar shirt',
    price: 290,
    detail: 'Cotton • Chest 26"-36"',
    image: 'assets/images/products/nn-010-chinese-collar-shirt.jpeg'
  },
  {
    id: 11,
    code: 'nn-011',
    name: 'Cupcake top',
    price: 290,
    detail: 'Cotton • Chest 28"-36"',
    image: 'assets/images/products/nn-011-cupcake-top.jpeg'
  },
  {
    id: 12,
    code: 'nn-012',
    name: 'Puff Sleeve',
    price: 290,
    detail: 'Cotton • Chest 26"-36"',
    image: 'assets/images/products/nn-012-puff-sleeve.jpeg'
  },
  {
    id: 13,
    code: 'nn-013',
    name: 'Smock tube top with straps',
    price: 290,
    detail: 'Cotton + salou cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-013-smock-tube-flower.jpeg'
  },
  {
    id: 14,
    code: 'nn-014',
    name: 'Nunaa mini skirt',
    price: 290,
    detail: 'Cotton • Waist 24"-36"',
    image: 'assets/images/products/nn-014-nunaa-mini-skirt.jpeg'
  },
  {
    id: 15,
    code: 'nn-015',
    name: 'Nunaa shorts',
    price: 290,
    detail: 'Cotton • S/M size',
    image: 'assets/images/products/nn-015-nunaa-shorts.jpeg'
  },
  {
    id: 16,
    code: 'nn-016',
    name: 'Button crop top',
    price: 320,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-016-button-crop-top.jpeg'
  },
  {
    id: 17,
    code: 'nn-017',
    name: 'Nunaa vest',
    price: 320,
    detail: 'Cotton • Chest 36"',
    image: 'assets/images/products/nn-017-nunaa-vest.jpeg'
  },
  {
    id: 18,
    code: 'nn-018',
    name: 'Smock tube top with straps',
    price: 320,
    detail: 'Cotton with linen • Chest 24"-36"',
    image: 'assets/images/products/nn-018-smock-tube-basic-stripes.jpeg'
  },
  {
    id: 19,
    code: 'nn-019 + nn-020',
    name: 'Spaghetti crop top + Shorts',
    price: 640,
    detail: 'Flowers collection • Set',
    image: 'assets/images/products/nn-019-020-flower-set.jpeg'
  },
  {
    id: 20,
    code: 'nn-021 + nn-022',
    name: 'Puff Sleeve + Skirt',
    price: 640,
    detail: 'Flowers collection • Set',
    image: 'assets/images/products/nn-021-022-flower-set.jpeg'
  },
  {
    id: 21,
    code: 'nn-023',
    name: 'Cupcake top linen fabric',
    price: 350,
    detail: 'Linen • Chest 24"-36"',
    image: 'assets/images/products/nn-023-cupcake-top-linen.jpeg'
  },
  {
    id: 22,
    code: 'nn-024',
    name: 'Long sleeve candy collection',
    price: 350,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-024-long-sleeve-candy.jpeg'
  },
  {
    id: 23,
    code: 'nn-025',
    name: 'Long sleeve crop top cotton',
    price: 350,
    detail: 'Cotton • Chest 24"-36"',
    image: 'assets/images/products/nn-025-long-sleeve-crop-top-cotton.jpeg'
  },
  {
    id: 24,
    code: 'nn-026',
    name: 'Long sleeve crop top linen',
    price: 420,
    detail: 'Linen • Chest 24"-36"',
    image: 'assets/images/products/nn-026-long-sleeve-crop-top-linen.jpeg'
  },
  {
    id: 25,
    code: 'nn-027',
    name: 'Nunaa cotton coat',
    price: 420,
    detail: 'Cotton • Chest 40"',
    image: 'assets/images/products/nn-027-nunaa-cotton-coat.jpeg'
  }
];

const cart = [];
const formatter = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 });

const productGrid = document.querySelector('#productGrid');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card">
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
      <button class="button primary add-cart" data-id="${product.id}">เพิ่มลงตะกร้า</button>
    </article>
  `).join('');
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>ยังไม่มีสินค้าในตะกร้า</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-row">
        <span>${item.code} • ${item.name}</span>
        <strong>${formatter.format(item.price)}</strong>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatter.format(total);
}

productGrid.addEventListener('click', event => {
  const button = event.target.closest('.add-cart');
  if (!button) return;
  const product = products.find(item => item.id === Number(button.dataset.id));
  cart.push(product);
  renderCart();
  document.querySelector('#cart').scrollIntoView({ behavior: 'smooth' });
});

menuButton.addEventListener('click', () => {
  nav.classList.toggle('open');
});

renderProducts();
renderCart();
