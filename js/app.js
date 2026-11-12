// Telegram WebApp Initialization
const tg = window.Telegram?.WebApp;
if (tg) {
  try {
    tg.ready();
    tg.expand();
    if (tg.setHeaderColor) tg.setHeaderColor('#ffffff');
    if (tg.setBackgroundColor) tg.setBackgroundColor('#fff5f7');
    if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
  } catch (e) {
    console.log("Telegram WebApp init notice:", e);
  }
}

// App State Helpers: Support Dynamic Products & Config from Admin
function getEffectiveProducts() {
  const custom = localStorage.getItem('sreyleak_custom_products');
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch(e) {}
  }
  return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
}

function getEffectiveConfig() {
  const custom = localStorage.getItem('sreyleak_custom_config');
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (parsed && typeof parsed === 'object') return { ...STORE_CONFIG, ...parsed };
    } catch(e) {}
  }
  return typeof STORE_CONFIG !== 'undefined' ? STORE_CONFIG : {};
}

// App State
let state = {
  currentCategory: 'all',
  searchQuery: '',
  cart: [], // [{ product, qty }]
  deliveryType: 'phnompenh', // 'phnompenh' or 'province'
  paymentMethod: 'cod', // 'cod' or 'khqr'
  selectedProduct: null
};

// LocalStorage Persistence for Cart
const CART_STORAGE_KEY = 'sreyleak_cart_v1';
function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const allProducts = getEffectiveProducts();
      // Map with actual product reference
      state.cart = parsed.map(item => {
        const prod = allProducts.find(p => p.id === item.id);
        return prod ? { product: prod, qty: item.qty } : null;
      }).filter(Boolean);
    }
  } catch (e) {
    state.cart = [];
  }
}

function saveCart() {
  try {
    const data = state.cart.map(item => ({ id: item.product.id, qty: item.qty }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

// Format Currency
function formatUSD(val) {
  return `$${Number(val).toFixed(2)}`;
}

function formatKHR(val) {
  return `${Number(val).toLocaleString()} ៛`;
}

// Haptic feedback helper
function triggerHaptic(type = 'light') {
  if (tg?.HapticFeedback) {
    try {
      if (type === 'light' || type === 'medium' || type === 'heavy') {
        tg.HapticFeedback.impactOccurred(type);
      } else if (type === 'success') {
        tg.HapticFeedback.notificationOccurred('success');
      }
    } catch (e) {}
  }
}

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const categoryTabs = document.querySelectorAll('.category-tab');
const cartCountBadges = document.querySelectorAll('.cart-count');
const cartFloatingBar = document.getElementById('cart-floating-bar');
const cartBarTotal = document.getElementById('cart-bar-total');
const cartBarTotalKHR = document.getElementById('cart-bar-total-khr');

// Modals
const cartModal = document.getElementById('cart-modal');
const cartSheet = document.getElementById('cart-sheet');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartDeliveryEl = document.getElementById('cart-delivery');
const cartGrandTotalEl = document.getElementById('cart-grand-total');
const cartGrandTotalKHREl = document.getElementById('cart-grand-total-khr');
const emptyCartView = document.getElementById('empty-cart-view');
const cartContent = document.getElementById('cart-content');

const productModal = document.getElementById('product-modal');
const productModalContent = document.getElementById('product-modal-content');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutSheet = document.getElementById('checkout-sheet');
const orderSuccessModal = document.getElementById('order-success-modal');

// Toast Notification
function showToast(message, icon = '🛍️') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<span class="text-xl">${icon}</span> <span>${message}</span>`;
  toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
  }, 2200);
}

// Render Products
function renderProducts() {
  const currentCfg = getEffectiveConfig();
  let list = getEffectiveProducts();

  // Category filter
  if (state.currentCategory !== 'all') {
    list = list.filter(p => p.category === state.currentCategory);
  }

  // Search filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-span-2 py-16 text-center">
        <div class="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
          🔍
        </div>
        <p class="text-gray-600 font-medium">រកមិនឃើញទំនិញដែលអ្នកចង់បានទេ!</p>
        <p class="text-xs text-gray-400 mt-1">សូមសាកល្បងស្វែងរកពាក្យផ្សេង ឬរើសតាមប្រភេទ</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = list.map(p => {
    const badgeHTML = p.badge ? `
      <span class="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
        ${p.badge}
      </span>
    ` : '';

    const oldPriceHTML = p.oldPriceUSD ? `
      <span class="text-xs text-gray-400 line-through mr-1">${formatUSD(p.oldPriceUSD)}</span>
    ` : '';

    return `
      <div class="product-card rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group cursor-pointer" onclick="openProductDetail('${p.id}')">
        <!-- Thumbnail & Badge -->
        <div class="relative bg-rose-50 aspect-square overflow-hidden">
          <img 
            src="${p.image}" 
            alt="${p.name}" 
            loading="lazy" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          ${badgeHTML}
          <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[11px] font-semibold text-rose-600 flex items-center gap-1 shadow-sm">
            ⭐ ${p.rating}
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-3 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] text-rose-500 font-medium mb-0.5 flex items-center justify-between">
              <span>${p.categoryName}</span>
              <span class="text-gray-400">${p.size}</span>
            </div>
            <h3 class="text-xs font-semibold text-gray-800 line-clamp-2 leading-relaxed mb-1">
              ${p.name}
            </h3>
          </div>

          <div class="mt-2 pt-2 border-t border-rose-50">
            <div class="flex items-baseline gap-1">
              ${oldPriceHTML}
              <span class="text-base font-bold text-rose-600">${formatUSD(p.priceUSD)}</span>
            </div>
            <div class="text-[11px] text-gray-500 font-medium">
              ${formatKHR(p.priceKHR)}
            </div>

            <!-- Add Button -->
            <button 
              type="button" 
              onclick="event.stopPropagation(); addToCart('${p.id}');"
              class="w-full mt-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-transparent py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <span>+</span>
              <span>ដាក់កន្ត្រក</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Add to Cart
function addToCart(productId, qty = 1) {
  const prod = getEffectiveProducts().find(p => p.id === productId);
  if (!prod) return;

  const existing = state.cart.find(item => item.product.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ product: prod, qty: qty });
  }

  saveCart();
  updateCartUI();
  triggerHaptic('medium');
  showToast(`បានដាក់ "${prod.name.substring(0, 20)}..." ចូលកន្ត្រក`);
}

// Update Cart UI
function updateCartUI() {
  const cfg = getEffectiveConfig();
  const exchangeRate = cfg.exchangeRateKHR || 4000;
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.product.priceUSD * item.qty), 0);
  const subtotalKHR = subtotalUSD * exchangeRate;

  // Badges
  cartCountBadges.forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  // Floating Bar
  if (totalCount > 0) {
    cartFloatingBar.classList.remove('translate-y-32', 'opacity-0');
    cartFloatingBar.classList.add('translate-y-0', 'opacity-100');
    cartBarTotal.textContent = formatUSD(subtotalUSD);
    cartBarTotalKHR.textContent = `(${formatKHR(subtotalKHR)})`;
  } else {
    cartFloatingBar.classList.add('translate-y-32', 'opacity-0');
    cartFloatingBar.classList.remove('translate-y-0', 'opacity-100');
  }

  // Cart Drawer Content
  if (state.cart.length === 0) {
    emptyCartView.classList.remove('hidden');
    cartContent.classList.add('hidden');
  } else {
    emptyCartView.classList.add('hidden');
    cartContent.classList.remove('hidden');

    cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="flex items-center gap-3 p-3 bg-white border border-rose-100 rounded-2xl shadow-sm">
        <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 rounded-xl object-cover border border-rose-50 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-semibold text-gray-800 truncate">${item.product.name}</h4>
          <div class="text-[11px] text-gray-500 mt-0.5">${item.product.size}</div>
          <div class="text-xs font-bold text-rose-600 mt-1">
            ${formatUSD(item.product.priceUSD)} <span class="text-[10px] text-gray-400 font-normal">(${formatKHR(item.product.priceKHR || (item.product.priceUSD * exchangeRate))})</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="changeQty('${item.product.id}', -1)" class="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold hover:bg-rose-200 active:scale-90">-</button>
          <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
          <button onclick="changeQty('${item.product.id}', 1)" class="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold hover:bg-rose-700 active:scale-90">+</button>
        </div>
      </div>
    `).join('');

    const deliveryFees = cfg.deliveryFees || { phnompenh: 1.5, province: 2.5 };
    const deliveryFee = deliveryFees[state.deliveryType] || 0;
    const grandTotalUSD = subtotalUSD + deliveryFee;
    const grandTotalKHR = grandTotalUSD * exchangeRate;

    cartSubtotalEl.textContent = formatUSD(subtotalUSD);
    cartDeliveryEl.textContent = formatUSD(deliveryFee);
    cartGrandTotalEl.textContent = formatUSD(grandTotalUSD);
    cartGrandTotalKHREl.textContent = `(${formatKHR(grandTotalKHR)})`;
  }
}

// Change Quantity
function changeQty(productId, delta) {
  const itemIndex = state.cart.findIndex(i => i.product.id === productId);
  if (itemIndex > -1) {
    state.cart[itemIndex].qty += delta;
    if (state.cart[itemIndex].qty <= 0) {
      state.cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartUI();
    triggerHaptic('light');
  }
}

// Open/Close Cart Modal
function openCart() {
  triggerHaptic('light');
  updateCartUI();
  cartModal.classList.remove('hidden');
  setTimeout(() => {
    cartSheet.classList.remove('closed');
    cartSheet.classList.add('open');
  }, 10);
}

function closeCart() {
  cartSheet.classList.remove('open');
  cartSheet.classList.add('closed');
  setTimeout(() => {
    cartModal.classList.add('hidden');
  }, 300);
}

// Delivery Type Change
function setDeliveryType(type) {
  state.deliveryType = type;
  document.querySelectorAll('.delivery-pill').forEach(btn => {
    if (btn.dataset.type === type) {
      btn.classList.add('border-rose-600', 'bg-rose-50', 'text-rose-600');
      btn.classList.remove('border-gray-200', 'text-gray-600');
    } else {
      btn.classList.remove('border-rose-600', 'bg-rose-50', 'text-rose-600');
      btn.classList.add('border-gray-200', 'text-gray-600');
    }
  });
  updateCartUI();
}

// Product Detail Modal
function openProductDetail(productId) {
  const p = getEffectiveProducts().find(item => item.id === productId);
  if (!p) return;
  state.selectedProduct = p;
  triggerHaptic('light');

  const benefitsHTML = p.benefits.map(b => `
    <li class="flex items-start gap-2 text-xs text-gray-600">
      <span class="text-rose-500 font-bold mt-0.5">✓</span>
      <span>${b}</span>
    </li>
  `).join('');

  productModalContent.innerHTML = `
    <div class="relative bg-rose-50 aspect-video rounded-t-3xl overflow-hidden">
      <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
      <button onclick="closeProductDetail()" class="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full text-gray-700 flex items-center justify-center font-bold text-lg shadow-sm">✕</button>
      ${p.badge ? `<span class="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">${p.badge}</span>` : ''}
    </div>

    <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <div class="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
          <span>${p.categoryName}</span>
          <span class="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">${p.size}</span>
        </div>
        <h2 class="text-base font-bold text-gray-800 leading-snug">${p.name}</h2>
        
        <div class="flex items-center gap-2 mt-2">
          <span class="text-lg font-bold text-rose-600">${formatUSD(p.priceUSD)}</span>
          ${p.oldPriceUSD ? `<span class="text-xs text-gray-400 line-through">${formatUSD(p.oldPriceUSD)}</span>` : ''}
          <span class="text-xs text-gray-500 font-medium">(${formatKHR(p.priceKHR)})</span>
          <div class="ml-auto flex items-center gap-1 text-xs text-yellow-500 font-bold">
            ⭐ ${p.rating} <span class="text-gray-400 font-normal">(${p.reviews} វាយតម្លៃ)</span>
          </div>
        </div>
      </div>

      <div class="bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
        <h3 class="text-xs font-bold text-gray-800 mb-1">📝 ការពិពណ៌នា:</h3>
        <p class="text-xs text-gray-600 leading-relaxed">${p.description}</p>
      </div>

      <div>
        <h3 class="text-xs font-bold text-gray-800 mb-2">✨ អត្ថប្រយោជន៍ចម្បង:</h3>
        <ul class="space-y-1.5 bg-white p-3 rounded-2xl border border-rose-100">
          ${benefitsHTML}
        </ul>
      </div>

      <div>
        <h3 class="text-xs font-bold text-gray-800 mb-1">🧴 របៀបប្រើប្រាស់:</h3>
        <p class="text-xs text-gray-600 bg-white p-3 rounded-2xl border border-rose-100 leading-relaxed">${p.usage}</p>
      </div>
    </div>

    <div class="p-3 border-t border-rose-100 bg-white rounded-b-3xl">
      <button 
        onclick="addToCart('${p.id}'); closeProductDetail();"
        class="w-full glow-btn text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
      >
        <span>🛒</span>
        <span>ដាក់កន្ត្រកទំនិញ (${formatUSD(p.priceUSD)})</span>
      </button>
    </div>
  `;

  productModal.classList.remove('hidden');
}

function closeProductDetail() {
  productModal.classList.add('hidden');
}

// Checkout Flow
function openCheckout() {
  if (state.cart.length === 0) return;
  closeCart();
  triggerHaptic('light');

  const cfg = getEffectiveConfig();
  const exchangeRate = cfg.exchangeRateKHR || 4000;
  const deliveryFees = cfg.deliveryFees || { phnompenh: 1.5, province: 2.5 };

  const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.product.priceUSD * item.qty), 0);
  const deliveryFee = deliveryFees[state.deliveryType] || 0;
  const grandTotalUSD = subtotalUSD + deliveryFee;
  const grandTotalKHR = grandTotalUSD * exchangeRate;

  document.getElementById('checkout-items-summary').innerHTML = state.cart.map(i => `
    <div class="flex justify-between text-xs py-1 border-b border-rose-50">
      <span class="text-gray-700 truncate pr-2">${i.product.name} <b class="text-rose-600">x${i.qty}</b></span>
      <span class="font-semibold text-gray-800">${formatUSD(i.product.priceUSD * i.qty)}</span>
    </div>
  `).join('');

  document.getElementById('checkout-grand-total').textContent = `${formatUSD(grandTotalUSD)} (${formatKHR(grandTotalKHR)})`;

  checkoutModal.classList.remove('hidden');
  setTimeout(() => {
    checkoutSheet.classList.remove('closed');
    checkoutSheet.classList.add('open');
  }, 10);
}

function closeCheckout() {
  checkoutSheet.classList.remove('open');
  checkoutSheet.classList.add('closed');
  setTimeout(() => {
    checkoutModal.classList.add('hidden');
  }, 300);
}

// Set Payment Method
function setPaymentMethod(method) {
  state.paymentMethod = method;
  const codRadio = document.getElementById('payment-cod');
  const khqrRadio = document.getElementById('payment-khqr');
  const khqrPreview = document.getElementById('khqr-preview');

  if (method === 'cod') {
    codRadio.checked = true;
    khqrPreview.classList.add('hidden');
  } else {
    khqrRadio.checked = true;
    khqrPreview.classList.remove('hidden');
  }
}

// Handle Order Submission
let lastOrderData = null;

function submitOrder(e) {
  e.preventDefault();

  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const location = document.getElementById('cust-location').value.trim();
  const notes = document.getElementById('cust-notes').value.trim();

  if (!name || !phone || !location) {
    alert("សូមបំពេញ ឈ្មោះ, លេខទូរស័ព្ទ និងអាសយដ្ឋានដឹកជញ្ជូន!");
    return;
  }

  const cfg = getEffectiveConfig();
  const exchangeRate = cfg.exchangeRateKHR || 4000;
  const deliveryFees = cfg.deliveryFees || { phnompenh: 1.5, province: 2.5 };

  const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.product.priceUSD * item.qty), 0);
  const deliveryFee = deliveryFees[state.deliveryType] || 0;
  const grandTotalUSD = subtotalUSD + deliveryFee;
  const grandTotalKHR = grandTotalUSD * exchangeRate;
  const orderId = 'SL-' + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleString('km-KH');

  const orderData = {
    orderId,
    date: dateStr,
    customer: { name, phone, location, notes },
    deliveryType: state.deliveryType === 'phnompenh' ? 'ភ្នំពេញ (Phnom Penh)' : 'តាមបណ្តាខេត្ត (Provinces)',
    deliveryFeeUSD: deliveryFee,
    paymentMethod: state.paymentMethod === 'cod' 
      ? 'ទូទាត់ពេលទទួលទំនិញ (Cash on Delivery)' 
      : 'ABA PAY / KHQR (https://link.payway.com.kh/ABAPAYRz567848B)',
    abaPayLink: state.paymentMethod === 'khqr' ? (cfg.abaPayLink || 'https://link.payway.com.kh/ABAPAYRz567848B') : null,
    items: state.cart.map(i => ({
      id: i.product.id,
      name: i.product.name,
      categoryName: i.product.categoryName || '',
      size: i.product.size || '',
      image: i.product.image || '',
      qty: i.qty,
      priceUSD: i.product.priceUSD,
      priceKHR: i.product.priceKHR || (i.product.priceUSD * exchangeRate),
      totalUSD: i.product.priceUSD * i.qty
    })),
    subtotalUSD,
    grandTotalUSD,
    grandTotalKHR
  };

  lastOrderData = orderData;
  triggerHaptic('success');

  // Format Receipt text for Telegram
  const orderText = generateTelegramOrderMessage(orderData);

  // If inside Telegram WebApp, send data back to the bot
  if (tg && tg.sendData) {
    try {
      tg.sendData(JSON.stringify(orderData));
    } catch (err) {
      console.log("tg.sendData err:", err);
    }
  }

  // Clear Cart
  state.cart = [];
  saveCart();
  updateCartUI();

  // Show Success Modal
  closeCheckout();
  showOrderSuccessModal(orderData, orderText);
}

// Generate Formatted Telegram Order Text
function generateTelegramOrderMessage(order) {
  const itemsText = order.items.map((it, idx) => 
    `  ${idx + 1}. ${it.name} ${it.size ? `(${it.size})` : ''}\n     ចំនួន: ${it.qty} x $${it.priceUSD.toFixed(2)} = $${it.totalUSD.toFixed(2)}` +
    (it.image ? `\n     🖼️ រូបភាព: ${it.image}` : '')
  ).join('\n\n');

  return `🌸 ការបញ្ជាទិញថ្មីពីហាង ស្រីល័ក្ខ 🌸
-----------------------------------
🔖 លេខកូដបញ្ជាទិញ: ${order.orderId}
📅 កាលបរិច្ឆេទ: ${order.date}

👤 អតិថិជន: ${order.customer.name}
📞 លេខទូរស័ព្ទ: ${order.customer.phone}
📍 អាសយដ្ឋានដឹក: ${order.customer.location} (${order.deliveryType})
${order.customer.notes ? `📝 ចំណាំ: ${order.customer.notes}\n` : ''}
-----------------------------------
🛍️ បញ្ជីទំនិញគ្រឿងក្រអូប:
${itemsText}

🚚 ថ្លៃដឹកជញ្ជូន: $${order.deliveryFeeUSD.toFixed(2)}
💵 សរុបទឹកប្រាក់: $${order.grandTotalUSD.toFixed(2)} (${order.grandTotalKHR.toLocaleString()} ៛)
💳 វិធីទូទាត់: ${order.paymentMethod}
${order.abaPayLink ? `📲 Link បង់ប្រាក់ ABA PAY: ${order.abaPayLink}\n` : ''}-----------------------------------
សូមអរគុណដែលបានជឿទុកចិត្តលើ ស្រីល័ក្ខ គ្រឿងក្រអូប! ✨
📞 ទំនាក់ទំនង: 0962364475`;
}

// Show Order Success Modal
function showOrderSuccessModal(order, orderText) {
  document.getElementById('success-order-id').textContent = order.orderId;
  document.getElementById('success-order-total').textContent = `${formatUSD(order.grandTotalUSD)} (${formatKHR(order.grandTotalKHR)})`;
  
  // Show ABA Direct Pay Button if user selected ABA PAY / KHQR
  const abaPayBtn = document.getElementById('btn-pay-aba-success');
  if (abaPayBtn) {
    if (order.abaPayLink) {
      abaPayBtn.href = order.abaPayLink;
      abaPayBtn.classList.remove('hidden');
    } else {
      abaPayBtn.classList.add('hidden');
    }
  }

  const encodedText = encodeURIComponent(orderText);
  
  const tgDirectBtn = document.getElementById('btn-send-tg');
  tgDirectBtn.onclick = () => {
    // Open Telegram share/chat with prefilled text
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/+855962364475')}&text=${encodedText}`;
    window.open(tgUrl, '_blank');
  };

  const tgChatBtn = document.getElementById('btn-chat-seller');
  tgChatBtn.onclick = () => {
    window.open(`https://t.me/+855962364475`, '_blank');
  };

  const copyBtn = document.getElementById('btn-copy-order');
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(orderText).then(() => {
      showToast("បានចម្លងវិក្កយបត្ររួចរាល់! អ្នកអាច Paste ផ្ញើក្នុង Telegram បាន", "📋");
    }).catch(() => {
      alert(orderText);
    });
  };

  orderSuccessModal.classList.remove('hidden');
}

function closeOrderSuccessModal() {
  orderSuccessModal.classList.add('hidden');
}

// Event Listeners Setup
function setupEventListeners() {
  // Category tabs
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentCategory = tab.dataset.category;
      triggerHaptic('light');
      renderProducts();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Delivery options
  document.querySelectorAll('.delivery-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      setDeliveryType(btn.dataset.type);
    });
  });

  // Payment radio change
  const codRadio = document.getElementById('payment-cod');
  const khqrRadio = document.getElementById('payment-khqr');
  if (codRadio) codRadio.addEventListener('change', () => setPaymentMethod('cod'));
  if (khqrRadio) khqrRadio.addEventListener('change', () => setPaymentMethod('khqr'));

  // Checkout form
  const form = document.getElementById('checkout-form');
  if (form) form.addEventListener('submit', submitOrder);
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderProducts();
  updateCartUI();
  setupEventListeners();
});

