/**
 * Lucas India – Global UI System
 * Custom toasts, modals, alerts, confirms
 */

// ================================================================
// TOAST SYSTEM
// ================================================================
const Toast = (() => {
    let container;

    function getContainer() {
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            document.body.appendChild(container);
        }
        return container;
    }

    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };

    function show(message, type = 'info', duration = 4000) {
        const c = getContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.closest('.toast').remove()"><i class="fa-solid fa-xmark"></i></button>
        `;
        c.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
        return toast;
    }

    return {
        success: (msg, dur) => show(msg, 'success', dur),
        error:   (msg, dur) => show(msg, 'error', dur),
        warning: (msg, dur) => show(msg, 'warning', dur),
        info:    (msg, dur) => show(msg, 'info', dur),
    };
})();

// ================================================================
// MODAL ALERT / CONFIRM SYSTEM
// ================================================================
const Modal = (() => {
    const icons = { success: 'fa-check', error: 'fa-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };

    function create({ type = 'info', title, body, confirmText = 'OK', cancelText = null, onConfirm, onCancel }) {
        // Remove existing
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-box" role="dialog" aria-modal="true">
                <div class="modal-icon ${type}"><i class="fa-solid ${icons[type]}"></i></div>
                <div class="modal-title">${title}</div>
                <div class="modal-body">${body}</div>
                <div class="modal-btn-row">
                    ${cancelText ? `<button class="modal-btn secondary" id="modalCancel">${cancelText}</button>` : ''}
                    <button class="modal-btn primary" id="modalConfirm">${confirmText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const close = () => {
            overlay.style.animation = 'none';
            overlay.style.opacity = 0;
            overlay.style.transition = 'opacity 0.2s';
            setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 200);
        };

        overlay.querySelector('#modalConfirm').addEventListener('click', () => {
            close();
            if (onConfirm) onConfirm();
        });

        const cancelBtn = overlay.querySelector('#modalCancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                close();
                if (onCancel) onCancel();
            });
        }

        // ESC to close
        const escHandler = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
        document.addEventListener('keydown', escHandler);

        // Click outside
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    }

    return {
        alert:   (title, body, type, opts) => create({ type: type || 'info', title, body, ...opts }),
        confirm: (title, body, onConfirm, onCancel) => create({ type: 'warning', title, body, confirmText: 'Yes, Confirm', cancelText: 'Cancel', onConfirm, onCancel }),
        success: (title, body, opts) => create({ type: 'success', title, body, ...opts }),
        error:   (title, body, opts) => create({ type: 'error',   title, body, ...opts }),
    };
})();

// ================================================================
// GLOBAL CART STATE (simple in-memory, sessionStorage backed)
// ================================================================
const Cart = (() => {
    const KEY = 'lucasCart';
    let items = [];

    function load() {
        try { items = JSON.parse(sessionStorage.getItem(KEY)) || []; } catch { items = []; }
    }

    function save() { sessionStorage.setItem(KEY, JSON.stringify(items)); updateBadge(); }

    function updateBadge() {
        const count = items.reduce((s, i) => s + i.qty, 0);
        document.querySelectorAll('.cart-badge').forEach(b => {
            b.textContent = count || 0;
            // Force visibility if needed
            b.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    function add(product) {
        const existing = items.find(i => i.id === product.id);
        if (existing) { existing.qty++; }
        else { items.push({ ...product, qty: 1 }); }
        save();
        Toast.success(`<strong>${product.name}</strong> added to cart!`);
    }

    function remove(id) {
        items = items.filter(i => i.id !== id);
        save();
    }

    function clear() { items = []; save(); }
    function getAll() { return [...items]; }
    function getCount() { return items.reduce((s, i) => s + i.qty, 0); }
    function getTotal() { return items.reduce((s, i) => s + (i.price * i.qty), 0); }

    load();
    updateBadge(); // Initial update
    return { add, remove, clear, getAll, getCount, getTotal, load, updateBadge };
})();

// ================================================================
// TESTIMONIAL STATS SLIDER (Auto-Slide)
// ================================================================
function initStatSlider() {
    const stats = document.querySelectorAll('#testiStatBlock .stat-item');
    if (stats.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
        stats[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % stats.length;
        stats[currentIndex].classList.add('active');
    }, 4500); // 4.5 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    initStatSlider();
});
const SkeletonLoader = (() => {
    function init() {
        const images = document.querySelectorAll('img:not(.no-skeleton)');
        images.forEach(img => {
            if (img.complete) return;
            const parent = img.parentElement;
            if (parent && (parent.classList.contains('product-img') || parent.classList.contains('card-img'))) {
                parent.classList.add('skeleton');
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    parent.classList.remove('skeleton');
                    img.style.opacity = '1';
                    img.classList.add('reveal'); // fade in
                });
            }
        });
    }
    return { init };
})();

const ScrollReveal = (() => {
    function init() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        reveals.forEach(el => observer.observe(el));
    }
    return { init };
})();

// ================================================================
// QUICK VIEW SYSTEM
// ================================================================
const QuickView = (() => {
    function open(product) {
        // Close search list if open
        const sResults = document.getElementById('searchResults');
        if (sResults) sResults.style.display = 'none';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay qv-overlay';
        overlay.style.cssText = 'z-index: 99999; display: flex; align-items: center; justify-content: center;';
        overlay.innerHTML = `
            <div class="modal-box quickview-modal-content" style="max-width: 900px; padding: 0; overflow: hidden; display: flex; text-align: left; background: #fff; width: 92%; position: relative; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <button class="close-cart" style="position: absolute; top: 15px; right: 20px; z-index: 100; background: #fff; border: 1px solid #ddd; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" onclick="this.closest('.qv-overlay').remove(); document.body.style.overflow='';">&times;</button>
                <div class="qv-img-area" style="flex: 1.2; background: #f9f9f9; display: flex; align-items: center; justify-content: center; padding: 20px; min-height: 400px;">
                    <img src="${product.img}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; transition: transform 0.3s;" alt="${product.name}" onerror="this.src='logo.jpeg'">
                </div>
                <div class="qv-info-area" style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 0.8rem; color: #c1121f; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">${product.cat || 'Premium Collection'}</div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 12px; line-height: 1.2; color: #1a1a1a;">${product.name}</h2>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #c1121f; margin-bottom: 20px;">${product.price}</div>
                    <p style="color: #666; font-size: 0.9rem; line-height: 1.6; margin-bottom: 25px;">This exquisite piece from Lucas India reflects our commitment to quality and timeless design. Handcrafted using premium grade materials, it’s designed to elevate your living space.</p>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button class="btn-primary" style="flex: 1; min-width: 150px; height: 48px; font-weight: 600; background: #c1121f; color: #fff; border: none; border-radius: 6px; cursor: pointer;" onclick="event.stopPropagation(); LucasCart.add({id:${product.id || Date.now()}, name:'${product.name.replace(/'/g, "\\'")}', price:parseInt('${product.price}'.replace(/[^\d]/g,'')), img:'${product.img}'}); this.closest('.qv-overlay').remove(); document.body.style.overflow='';">Add to Cart</button>
                        <a href="product.html" class="btn-secondary" style="height: 48px; border: 1px solid #ddd; padding: 0 20px; border-radius: 6px; display: flex; align-items: center; text-decoration: none; color: #1a1a1a;">View Details</a>
                    </div>
                </div>
            </div>
            <style>
                @media (max-width: 768px) {
                    .quickview-modal-content { flex-direction: column; max-height: 90vh; overflow-y: auto !important; }
                    .qv-img-area { min-height: 300px; }
                    .qv-info-area { padding: 25px !important; }
                }
            </style>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); document.body.style.overflow=''; } });
    }
    return { open };
})();

// ================================================================
// SHARED NAV INTERACTIONS (runs on every page)
// ================================================================
document.addEventListener('DOMContentLoaded', function () {
    // Init Scroll Reveal
    ScrollReveal.init();
    SkeletonLoader.init();

    // Sticky nav
    let _scrolling = false;
    window.addEventListener('scroll', function () {
        if (!_scrolling) {
            window.requestAnimationFrame(() => {
                const nav = document.getElementById('mainNav');
                const header = document.getElementById('mainHeader');
                if (!nav || !header) { _scrolling = false; return; }
                if (window.scrollY > 150) {
                    if (window.innerWidth > 1024) { nav.classList.add('sticky'); header.classList.remove('sticky-mobile'); }
                    else { nav.classList.remove('sticky'); header.classList.add('sticky-mobile'); }
                } else { nav.classList.remove('sticky'); header.classList.remove('sticky-mobile'); }
                _scrolling = false;
            });
            _scrolling = true;
        }
    });

    // Cart drawer
    const cartBtn     = document.getElementById('cartBtn');
    const sideCart    = document.getElementById('sideCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart   = document.getElementById('closeCart');
    if (cartBtn && sideCart) {
        cartBtn.addEventListener('click', e => { e.preventDefault(); sideCart.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; });
        if (closeCart) closeCart.addEventListener('click', () => { sideCart.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; });
        if (cartOverlay) cartOverlay.addEventListener('click', () => { sideCart.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; });
    }

    // Mobile menu
    const mobileMenuBtn  = document.getElementById('mobileMenuBtn');
    const mainNav        = document.getElementById('mainNav');
    const closeMainNav   = document.getElementById('closeMainNav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', e => { e.preventDefault(); mainNav.classList.add('active'); document.body.style.overflow = 'hidden'; });
        if (closeMainNav) closeMainNav.addEventListener('click', e => { e.preventDefault(); mainNav.classList.remove('active'); document.body.style.overflow = ''; });
    }

    // Back to Top
    const backBtn = document.getElementById('backToTopBtn');
    if (backBtn) {
        window.addEventListener('scroll', () => { if (window.scrollY > 400) backBtn.classList.add('visible'); else backBtn.classList.remove('visible'); });
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});

// Make globally available
window.Toast = Toast;
window.Modal = Modal;
window.LucasCart = Cart;
window.QuickView = QuickView;
