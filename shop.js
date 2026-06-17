// ===== CART =====
let cart = [];

// ===== DOM ELEMENTS =====
const cartBtn       = document.getElementById('cartBtn');
const cartSidebar   = document.getElementById('cartSidebar');
const cartOverlay   = document.getElementById('cartOverlay');
const closeCartBtn  = document.getElementById('closeCart');
const cartBadge     = document.getElementById('cartBadge');
const cartContainer = document.getElementById('cartItemsContainer');
const cartFooter    = document.getElementById('cartFooter');
const cartTotalEl   = document.getElementById('cartTotal');

// ===== CART OPEN/CLOSE =====
cartBtn.addEventListener('click', openCart);

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    renderCart();
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ===== ADD TO CART =====
document.querySelectorAll('.shop-add-cart-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const card    = this.closest('.shop-card');
        const nameEl  = card.querySelector('h4');
        const priceEl = card.querySelector('.text-gold.font-semibold');
        const imgEl   = card.querySelector('.pimg');

        const name  = nameEl  ? nameEl.textContent.trim()  : 'Product';
        const price = priceEl ? priceEl.textContent.trim() : '₹0';
        const img   = imgEl   ? imgEl.src                  : '';

        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.qty += 1;
            showToast('success', 'Cart Updated!', name + ' quantity updated');
        } else {
            cart.push({ id: Date.now(), name, price, img, qty: 1 });
            showToast('success', 'Added to Cart! 🛍️', name);
        }
        updateBadge();
        showFeedback(this);
        openCart();
    });
});

// ===== WISHLIST =====
document.querySelectorAll('.wishlist-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const card = this.closest('.shop-card');
        const name = card.querySelector('h4')?.textContent.trim() || 'Product';
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            this.style.background  = '';
            this.style.color       = '';
            this.style.borderColor = '';
            showToast('info', 'Removed from Wishlist', name);
        } else {
            this.classList.add('active');
            this.style.background  = 'var(--gold)';
            this.style.color       = 'var(--ink)';
            this.style.borderColor = 'var(--gold)';
            showToast('wishlist', 'Added to Wishlist! ❤️', name);
        }
    });
});

// ===== FEEDBACK =====
function showFeedback(btn) {
    const original = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--ink)';
    setTimeout(function() {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
    }, 1200);
}

// ===== RENDER CART =====
function renderCart() {
    cartContainer.innerHTML = '';
    if (!cart || cart.length === 0) {
        cartFooter.style.display = 'none';
        cartContainer.innerHTML = `
            <div class="cart-empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                    <path d="M3.103 6.034h17.794"/>
                    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>
                </svg>
                <p>Your cart is empty</p>
                <p style="font-size:12px;opacity:0.6;">Add some beautiful jewelry!</p>
            </div>`;
        return;
    }
    cartFooter.style.display = 'block';
    let total = 0;
    cart.forEach(function(item) {
        const numPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        total += numPrice * item.qty;
        const el = document.createElement('div');
        el.className = 'cart-item';
        const itemId = Number(item.id);
        el.innerHTML = `
            <img class="cart-item-img"
                src="${item.img}"
                alt="${item.name}"
                onerror="this.src='https://via.placeholder.com/65x65/faf0dc/1a1a1a?text=✦'"/>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${itemId}, -1)">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${itemId}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeItem(${itemId})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
            </button>`;
        cartContainer.appendChild(el);
    });
    cartTotalEl.textContent = '₹' + total.toFixed(2);
}

// ===== QTY CHANGE =====
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateBadge();
    renderCart();
}

// ===== REMOVE =====
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateBadge();
    renderCart();
}

// ===== BADGE =====
function updateBadge() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
}

// ===== FILTER =====
document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        const cards  = document.querySelectorAll('.shop-card');
        let count    = 0;
        cards.forEach(function(card) {
            const cats = card.dataset.category || '';
            if (filter === 'all' || cats.includes(filter)) {
                card.classList.remove('filtered-out');
                count++;
            } else {
                card.classList.add('filtered-out');
            }
        });
        document.getElementById('productCount').textContent = filter === 'all'
            ? 'Showing all 12 products'
            : 'Showing ' + count + ' product' + (count !== 1 ? 's' : '');
    });
});

// ===== SCROLL ANIMATION =====
const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
            setTimeout(function() {
                entry.target.classList.add('visible');
            }, i * 80);
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.shop-card').forEach(function(card) {
    scrollObserver.observe(card);
});

// ===== QUICK VIEW =====
document.querySelectorAll('.quick-view-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card     = this.closest('.shop-card');
        const nameEl   = card.querySelector('h4');
        const priceEl  = card.querySelector('.text-gold.font-semibold');
        const oldPrice = card.querySelector('.line-through');
        const imgEl    = card.querySelector('.pimg');
        const fullImg  = imgEl ? imgEl.src : '';

        document.getElementById('qvImg').src              = fullImg;
        document.getElementById('qvName').textContent     = nameEl   ? nameEl.textContent.trim()   : '';
        document.getElementById('qvPrice').textContent    = priceEl  ? priceEl.textContent.trim()  : '';
        document.getElementById('qvOldPrice').textContent = oldPrice ? oldPrice.textContent.trim() : '';
        document.getElementById('quickViewModal').classList.add('active');
        document.getElementById('quickViewOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// ===== QUICK VIEW CLOSE =====
function closeQV() {
    document.getElementById('quickViewModal').classList.remove('active');
    document.getElementById('quickViewOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('qvClose').addEventListener('click', closeQV);
document.getElementById('quickViewOverlay').addEventListener('click', closeQV);

// ===== QV ADD TO CART =====
document.getElementById('qvAddBtn').addEventListener('click', function() {
    const name  = document.getElementById('qvName').textContent;
    const price = document.getElementById('qvPrice').textContent;
    const img   = document.getElementById('qvImg').src;
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty += 1;
        showToast('success', 'Cart Updated!', name);
    } else {
        cart.push({ id: Date.now(), name, price, img, qty: 1 });
        showToast('success', 'Added to Cart! 🛍️', name);
    }
    updateBadge();
    closeQV();
    openCart();
});

// ===== KEYBOARD ESC =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeCart(); closeQV(); }
});

// ===== TOAST =====
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: '🛍️', wishlist: '❤️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:12px;background:#0a1f12;border:1px solid rgba(212,168,87,0.3);box-shadow:0 8px 32px rgba(0,0,0,0.4);color:#f5e8d3;font-size:13px;min-width:260px;max-width:320px;transform:translateX(120%);opacity:0;transition:all 0.4s cubic-bezier(0.16,1,0.32,1);margin-bottom:8px;';
    toast.innerHTML = `
        <div style="font-size:20px;">${icons[type] || 'ℹ️'}</div>
        <div style="flex:1;">
            <div style="font-weight:600;font-size:13px;margin-bottom:2px;">${title}</div>
            <div style="font-size:11px;opacity:0.6;">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(245,232,211,0.4);cursor:pointer;font-size:16px;">✕</button>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== CHECKOUT =====
function goToCheckout() {
    localStorage.setItem('ashvikaCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// ===== INIT =====
updateBadge();
