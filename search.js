/**
 * Lucas India – Global Live Search
 * Works on index.html, products.html, and product.html
 */

const LUCAS_PRODUCTS = [
    { id: 1,  name: 'Handcrafted Teak Vase Set',       cat: 'Home Decor',       price: '₹12,499', img: 'images/WhatsApp Image 2026-03-26 at 21.15.52.jpeg',    url: 'product.html' },
    { id: 2,  name: 'Luxury Wooden Deer Sculptures',   cat: 'Carvings',          price: '₹28,999', img: 'images/WhatsApp Image 2026-03-26 at 21.15.53.jpeg',    url: 'product.html' },
    { id: 3,  name: 'Intricate Wall Carving Art',      cat: 'Wall Decor',        price: '₹18,500', img: 'images/WhatsApp Image 2026-03-26 at 21.16.11.jpeg',    url: 'product.html' },
    { id: 4,  name: 'Rustic Wooden Dining Table',      cat: 'Living Area',       price: '₹45,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.13.jpeg',    url: 'product.html' },
    { id: 5,  name: 'Spiritual Collection Set',        cat: 'Sculptures',        price: '₹22,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.21.jpeg',    url: 'product.html' },
    { id: 6,  name: 'Royal Carved Panel',              cat: 'Exotic Carvings',   price: '₹65,000', img: 'images/WhatsApp Image 2026-03-26 at 21.15.35.jpeg',    url: 'product.html' },
    { id: 7,  name: 'Classic Velvet Couch',            cat: 'Living Room',       price: '₹35,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.25.jpeg',    url: 'product.html' },
    { id: 8,  name: 'Hand-Carved Wooden Figurine',     cat: 'Sculptures',        price: '₹9,500',  img: 'images/WhatsApp Image 2026-03-26 at 21.16.17.jpeg',    url: 'product.html' },
    { id: 9,  name: 'Artisan Wooden Bowl Set',         cat: 'Kitchen',           price: '₹7,200',  img: 'images/WhatsApp Image 2026-03-26 at 21.16.22.jpeg',    url: 'product.html' },
    { id: 10, name: 'Hand-Carved Wooden Chest',        cat: 'Storage',           price: '₹38,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.24.jpeg',    url: 'product.html' },
    { id: 11, name: 'Traditional Carved Panel',        cat: 'Wall Art',          price: '₹16,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.19.jpeg',    url: 'product.html' },
    { id: 12, name: 'Carved Wooden Frame',             cat: 'Home Decor',        price: '₹25,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.16.jpeg',    url: 'product.html' },
    { id: 13, name: 'Sheesham King Bed Frame',         cat: 'Bedroom',           price: '₹55,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.23.jpeg',    url: 'product.html' },
    { id: 14, name: 'Teak Dining Chair Set',           cat: 'Dining',            price: '₹14,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.26.jpeg',    url: 'product.html' },
    { id: 15, name: 'Decorative Wooden Tray',          cat: 'Home Decor',        price: '₹8,500',  img: 'images/WhatsApp Image 2026-03-26 at 21.16.27.jpeg',    url: 'product.html' },
    { id: 16, name: 'Royal Hand-Carved Jesus Panel',   cat: 'Exotic Carvings',   price: '₹42,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.20.jpeg',    url: 'product.html' },
    { id: 17, name: 'Wooden Candle Holder Set',        cat: 'Home Decor',        price: '₹5,500',  img: 'images/WhatsApp Image 2026-03-26 at 21.15.55.jpeg',    url: 'product.html' },
    { id: 18, name: 'Mini Carved Decorative Door',     cat: 'Carvings',          price: '₹12,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.12.jpeg',    url: 'product.html' },
    { id: 19, name: 'Premium Teak Wardrobe',           cat: 'Bedroom',           price: '₹85,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.13 (1).jpeg',url: 'product.html' },
    { id: 20, name: 'Wooden Wall Clock',               cat: 'Wall Decor',        price: '₹6,800',  img: 'images/WhatsApp Image 2026-03-26 at 21.16.18.jpeg',    url: 'product.html' },
    { id: 21, name: 'Hand-Painted Wooden Cabinet',     cat: 'Living Room',       price: '₹32,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.15.jpeg',    url: 'product.html' },
    { id: 22, name: 'Rosewood Coffee Table',           cat: 'Living Room',       price: '₹28,000', img: 'images/WhatsApp Image 2026-03-26 at 21.16.14.jpeg',    url: 'product.html' },
    { id: 23, name: 'Kerala Mural Wood Panel',         cat: 'Wall Art',          price: '₹19,500', img: 'images/WhatsApp Image 2026-03-26 at 21.16.11 (1).jpeg',url: 'product.html' },
    { id: 24, name: 'Sandalwood Pooja Mandir',         cat: 'Spiritual',         price: '₹48,000', img: 'images/WhatsApp Image 2026-03-26 at 21.15.57.jpeg',    url: 'product.html' },
];

function initSearch() {
    // Find all search bars on the page
    const searchBars = document.querySelectorAll('.search-bar');

    searchBars.forEach(searchBar => {
        const input = searchBar.querySelector('input');
        const searchBtn = searchBar.querySelector('button');
        if (!input) return;

        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'search-results-dropdown';
        searchBar.appendChild(dropdown);

        let debounceTimer;

        // Live search as user types
        input.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = this.value.trim().toLowerCase();
                if (query.length < 2) {
                    dropdown.classList.remove('visible');
                    return;
                }
                showResults(query, dropdown);
            }, 200);
        });

        // Focus show (if already has text)
        input.addEventListener('focus', function () {
            const query = this.value.trim().toLowerCase();
            if (query.length >= 2) showResults(query, dropdown);
        });

        // Hide on blur (with small delay for click to fire)
        input.addEventListener('blur', () => {
            setTimeout(() => dropdown.classList.remove('visible'), 200);
        });

        // Search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const query = input.value.trim().toLowerCase();
                if (query.length >= 2) {
                    window.location.href = 'products.html?search=' + encodeURIComponent(query);
                }
            });
        }

        // Enter key
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const query = this.value.trim().toLowerCase();
                if (query.length >= 2) {
                    dropdown.classList.remove('visible');
                    window.location.href = 'products.html?search=' + encodeURIComponent(query);
                }
            }
        });
    });

    // Close dropdown on outside click
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-bar')) {
            document.querySelectorAll('.search-results-dropdown').forEach(d => d.classList.remove('visible'));
        }
    });
}

function showResults(query, dropdown) {
    const matches = LUCAS_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.cat.toLowerCase().includes(query)
    ).slice(0, 6); // max 6 results

    if (matches.length === 0) {
        dropdown.innerHTML = `
            <div class="search-no-results">
                <i class="fa-regular fa-face-sad-tear"></i>
                No products found for "<strong>${escHtml(query)}</strong>".<br>
                <small>Try "teak", "carving", "bedroom"…</small>
            </div>`;
        dropdown.classList.add('visible');
        return;
    }

    let html = `<div class="search-results-header">Showing ${matches.length} results for "${escHtml(query)}"</div>`;

    matches.forEach(p => {
        html += `
        <a href="${p.url}" class="search-result-item">
            <img class="search-result-img" src="${p.img}" alt="${escHtml(p.name)}" loading="lazy" decoding="async">
            <div class="search-result-info">
                <div class="result-name">${highlight(p.name, query)}</div>
                <div class="result-cat">${p.cat}</div>
                <div class="result-price">${p.price}</div>
            </div>
        </a>`;
    });

    html += `<div class="search-results-footer">
        <a href="products.html?search=${encodeURIComponent(query)}">See all results for "${escHtml(query)}" →</a>
    </div>`;

    dropdown.innerHTML = html;
    dropdown.classList.add('visible');
}

function highlight(text, query) {
    const regex = new RegExp(`(${escRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(193,18,31,0.15); color:var(--accent-color); border-radius:3px; padding:0 2px;">$1</mark>');
}

function escHtml(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function escRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
