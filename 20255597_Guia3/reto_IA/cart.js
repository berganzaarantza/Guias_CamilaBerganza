// Base de datos de productos simulada
const productsDB = [
  { id: 1, name: "Hidrolavadora · 2 baterías", price: 16.50, img: "https://www.accesorioseconomicos.com/products/hidrolavadora.jpg" },
  { id: 2, name: "Silla ergonómica", price: 45.00, img: "https://www.accesorioseconomicos.com/products/catalogo/silla-ergonomica.jpeg" },
  { id: 3, name: "Canopie importado 3 × 3 m", price: 55.00, img: "https://www.accesorioseconomicos.com/products/catalogo/canopie-3x3.png" },
  { id: 4, name: "Extintor ABC · 10 lb", price: 18.00, img: "https://www.accesorioseconomicos.com/products/catalogo/extintores-certificados.jpg" }
];

// INICIALIZAR CARRITO DESDE LOCALSTORAGE
let cart = JSON.parse(localStorage.getItem('miCarritoAccesorios')) || [];

const cartBadge = document.getElementById('cart-badge');
const container = document.getElementById('cart-items-container');
const footer = document.getElementById('cart-footer');
const subtotalText = document.getElementById('cart-subtotal');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');

function saveCart() {
  localStorage.setItem('miCarritoAccesorios', JSON.stringify(cart));
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if(cartBadge) cartBadge.textContent = totalItems;

  if(!container) return; // Validación de seguridad

  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding: 64px 20px; color: var(--color-muted-gray);">Tu pedido está vacío.<br>Agrega productos del catálogo.</div>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const product = productsDB.find(p => p.id === item.id);
    if (!product) return;
    
    subtotal += product.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${product.img}" alt="${product.name}">
        <div class="info">
          <div class="name">${product.name}</div>
          <div class="cart-actions">
            <span class="price">$${product.price.toFixed(2)}</span>
            <div class="qty-editor">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <button class="remove-btn" onclick="removeItem(${item.id})">Eliminar todo</button>
        </div>
      </div>
    `;
  });

  if(subtotalText) subtotalText.textContent = `$${subtotal.toFixed(2)}`;
}

function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) existingItem.qty++;
  else cart.push({ id: id, qty: 1 });
  
  saveCart(); 
  renderCart();
  showToast("Producto agregado");
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
      showToast("Producto eliminado");
    }
    saveCart(); 
    renderCart();
  }
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart(); 
  renderCart();
  showToast("Producto eliminado");
}

function showToast(message) {
  if(!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Eventos de botones del catálogo
document.querySelectorAll('.add-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    addToCart(productId);
  });
});

// Evento de procesar compra por WhatsApp
if(sendWhatsappBtn) {
  sendWhatsappBtn.addEventListener('click', () => {
    const name = document.getElementById('custName').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!name || !address) {
      alert("Por favor, llena tu nombre y dirección para procesar el envío.");
      return;
    }

    let text = `¡Hola! Soy ${name}. Quiero hacer el siguiente pedido para entregar en: ${address}\n\n`;
    let subtotal = 0;

    cart.forEach(item => {
      const product = productsDB.find(p => p.id === item.id);
      if(product) {
        const itemTotal = product.price * item.qty;
        subtotal += itemTotal;
        text += `- ${product.name} (x${item.qty}) - $${itemTotal.toFixed(2)}\n`;
      }
    });

    const total = subtotal + 3.50;
    text += `\nSubtotal: $${subtotal.toFixed(2)}`;
    text += `\nEnvío nacional: $3.50`;
    text += `\n*Total a pagar: $${total.toFixed(2)}*`;

    const whatsappUrl = `https://wa.me/50364549310?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  });
}

// Render automático al cargar cualquiera de las 3 páginas
renderCart();