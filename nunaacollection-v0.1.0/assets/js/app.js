const products = [
  { id: 1, name: 'Soft Linen Top', price: 350, detail: 'Local fabric • Everyday fit' },
  { id: 2, name: 'Everyday Wrap Skirt', price: 420, detail: 'Mix & match collection' },
  { id: 3, name: 'Chiang Mai Easy Set', price: 690, detail: 'Comfortable two-piece' }
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
      <div class="product-image">Nunaa</div>
      <div class="product-meta">
        <div>
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
        <span>${item.name}</span>
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
