/* ===========================================================
   Accesorios Económicos — Carrito compartido entre páginas
   Se usa en pagina_inicio.html, nosotros.html y faq.html
   =========================================================== */

const PRODUCTS = [
  {id:1, name:"Hidrolavadora · 2 baterías", price:16.50, cat:"Herramientas", badge:"Oferta", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/5066148e1d5d8148950a239f30273864.jpg"},
  {id:2, name:"Silla ergonómica", price:45.00, cat:"Oficina", badge:"Nuevo", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/0db6856348ed558d3ca9a9bb31731547.png"},
  {id:3, name:"Canopie importado 3 × 3 m", price:55.00, cat:"Hogar", badge:"", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/52d091f57ded1ee9a60f4ba314a6cc28.png"},
  {id:4, name:"Extintor ABC · 10 lb", price:18.00, cat:"Vehículo", badge:"Recomendado", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/30f140148ebc305c9bd9a43e72ad9094.png"},
  {id:5, name:"Taladro inalámbrico · 2 baterías", price:20.00, cat:"Herramientas", badge:"", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/ac264883b9168589b889fc16c3bcf429.jpg"},
  {id:6, name:"Compresor de pintura eléctrico", price:22.50, cat:"Herramientas", badge:"Nuevo", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/3ebb043a626e3beb7c23b8d30c016b78.jpg"},
  {id:7, name:"Set de ollas · 13 piezas", price:20.00, cat:"Hogar", badge:"Nuevo", img:"https://images.hostinger.com/5bb00f30-06d4-41c6-be32-b44226d50cb5.png"},
  {id:8, name:"Cámara Wi-Fi", price:13.00, cat:"Tecnología", badge:"", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/4517974062053b7a88d59dc9d274e378.jpg"},
  {id:9, name:"Silla gamer · con apoyapiés", price:75.00, cat:"Oficina", badge:"", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/3b14fe32e798cebfb234c58e0a5a0537.jpg"},
  {id:10, name:"Podadora inalámbrica", price:25.00, cat:"Herramientas", badge:"Oferta", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/31202c4e4c556f5d22c410414bf736e3.jpg"},
  {id:11, name:"Horno 3 en 1", price:30.00, cat:"Hogar", badge:"Nuevo", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/e5e63a4bea28f7ed30004282037a0009.jpg"},
  {id:12, name:"Mini set de cubos · 10 piezas", price:5.00, cat:"Herramientas", badge:"", img:"https://horizons-cdn.hostinger.com/ceccc142-b4d5-4623-afc3-0d39b8f200d4/ccb36ca3d05327b1a0ce55876d6c5c33.jpg"},
];

const CART_KEY = "ae_cart";

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function totalItems(cart){ return cart.reduce((s,c)=>s+c.qty,0); }

function addToCart(id){
  const cart = getCart();
  const existing = cart.find(c=>c.id===id);
  if(existing){ existing.qty += 1; } else { cart.push({id, qty:1}); }
  saveCart(cart);
  updateCartUI();
  const product = PRODUCTS.find(p=>p.id===id);
  if(product) showToast(`"${product.name}" agregado a tu pedido`);
}
function removeFromCart(id){
  saveCart(getCart().filter(c=>c.id !== id));
  updateCartUI();
}

/* ---------- Drawer UI (presente en las 3 páginas) ---------- */
function updateCartUI(){
  const cart = getCart();
  const countEl = document.getElementById('cartCount');
  if(countEl) countEl.textContent = totalItems(cart);

  const body = document.getElementById('drawerBody');
  const empty = document.getElementById('cartEmpty');
  const foot = document.getElementById('drawerFoot');
  if(!body) return;

  if(cart.length === 0){
    body.innerHTML = "";
    if(empty) body.appendChild(empty);
    if(foot) foot.style.display = "none";
    return;
  }
  body.innerHTML = "";
  let subtotal = 0;
  cart.forEach(c=>{
    const p = PRODUCTS.find(pp=>pp.id===c.id);
    if(!p) return;
    subtotal += p.price * c.qty;
    const row = document.createElement('div');
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="price">$${p.price.toFixed(2)} × ${c.qty}</div>
        <button class="remove" data-id="${p.id}">Quitar</button>
      </div>`;
    body.appendChild(row);
  });
  if(foot){
    foot.style.display = "block";
    const subtotalEl = document.getElementById('subtotalValue');
    if(subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }
  if(typeof validateForm === "function") validateForm();
}

function showToast(text){
  const toast = document.getElementById('toast');
  if(!toast) return;
  document.getElementById('toastText').textContent = text;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=> toast.classList.remove('show'), 2600);
}

function closeDrawer(){
  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  if(overlay) overlay.classList.remove('open');
  if(drawer) drawer.classList.remove('open');
}

function initDrawer(){
  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  const cartBtn = document.getElementById('cartBtn');
  const closeBtn = document.getElementById('drawerClose');
  if(cartBtn) cartBtn.addEventListener('click', ()=>{
    if(overlay) overlay.classList.add('open');
    if(drawer) drawer.classList.add('open');
  });
  if(closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if(overlay) overlay.addEventListener('click', closeDrawer);
  const body = document.getElementById('drawerBody');
  if(body) body.addEventListener('click', e=>{
    if(!e.target.classList.contains('remove')) return;
    removeFromCart(parseInt(e.target.dataset.id));
  });
}

/* ---------- Formulario de checkout (drawer) ---------- */
function validateForm(){
  const phoneInput = document.getElementById('custPhone');
  const nameInput = document.getElementById('custName');
  const sendBtn = document.getElementById('sendBtn');
  const phoneHint = document.getElementById('phoneHint');
  if(!phoneInput || !nameInput || !sendBtn) return;
  const phoneOk = /^[0-9]{8}$/.test(phoneInput.value);
  const nameOk = nameInput.value.trim().length > 0;
  if(phoneInput.value.length > 0 && !phoneOk){
    phoneInput.classList.add('invalid');
    if(phoneHint){ phoneHint.textContent = "Ingresá un número válido de 8 dígitos."; phoneHint.classList.add('error'); }
  } else {
    phoneInput.classList.remove('invalid');
    if(phoneHint){ phoneHint.textContent = "8 dígitos, solo números."; phoneHint.classList.remove('error'); }
  }
  sendBtn.disabled = !(phoneOk && nameOk && getCart().length > 0);
}

function initCheckoutForm(){
  const phoneInput = document.getElementById('custPhone');
  const nameInput = document.getElementById('custName');
  const sendBtn = document.getElementById('sendBtn');
  if(!phoneInput || !nameInput || !sendBtn) return;

  phoneInput.addEventListener('input', ()=>{
    phoneInput.value = phoneInput.value.replace(/\D/g,'').slice(0,8);
    validateForm();
  });
  nameInput.addEventListener('input', validateForm);

  sendBtn.addEventListener('click', ()=>{
    if(sendBtn.disabled) return;
    const cart = getCart();
    let msg = `¡Hola! Soy ${nameInput.value.trim()} (tel. ${phoneInput.value}). Quiero hacer este pedido:%0A`;
    let subtotal = 0;
    cart.forEach(c=>{
      const p = PRODUCTS.find(pp=>pp.id===c.id);
      if(!p) return;
      subtotal += p.price * c.qty;
      msg += `- ${p.name} x${c.qty} ($${(p.price*c.qty).toFixed(2)})%0A`;
    });
    msg += `Subtotal: $${subtotal.toFixed(2)} + envío $3.50`;
    window.open(`https://wa.me/50364549310?text=${msg}`, '_blank');
  });
}

/* ---------- Búsqueda: en páginas sin catálogo, redirige al inicio ---------- */
function initSearchRedirect(){
  const input = document.getElementById('searchInput');
  const submit = document.querySelector('.search-submit');
  if(!input || document.getElementById('productGrid')) return; // el inicio maneja su propia búsqueda
  const go = ()=>{
    const q = encodeURIComponent(input.value.trim());
    window.location.href = `pagina_inicio.html${q ? '?buscar=' + q : ''}#catalogo`;
  };
  input.addEventListener('keydown', e=>{ if(e.key === 'Enter'){ e.preventDefault(); go(); } });
  if(submit) submit.addEventListener('click', go);
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateCartUI();
  initDrawer();
  initCheckoutForm();
  initSearchRedirect();
});
