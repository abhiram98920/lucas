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
        document.querySelectorAll('.badge').forEach(b => b.textContent = count || 0);
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
    return { add, remove, clear, getAll, getCount, getTotal, load };
})();

// ================================================================
// SHARED NAV INTERACTIONS (runs on every page)
// ================================================================
document.addEventListener('DOMContentLoaded', function () {
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
