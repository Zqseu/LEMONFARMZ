// Telegram Web App Init
if (window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.ready();
    
    const user = webApp.initDataUnsafe?.user;
    if (user) {
        const username = user.username || `#${user.id}#`;
        document.getElementById('telegram-user').textContent = `#${username}#`;
    }
}

// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const pageId = button.getAttribute('data-page');
        showPage(pageId);
        
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Close button
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.close();
        }
    });
}

// Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    alert('✅ Produit ajouté au panier!');
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartEmptyDiv = document.getElementById('cart-empty');
    const cartTotalDiv = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '';
        cartEmptyDiv.style.display = 'block';
        cartTotalDiv.style.display = 'none';
    } else {
        cartEmptyDiv.style.display = 'none';
        cartTotalDiv.style.display = 'block';
        
        cartItemsDiv.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantité: 1</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="cart-item-price">${item.price}€</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">✕</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('total-price').textContent = `${total}€`;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Start Game
function startGame(game) {
    if (game === 'snake') {
        alert('🐍 Jeu Snake en cours de développement!\n\nScore record: ' + (localStorage.getItem('snakeRecord') || '5'));
    } else if (game === 'neospin') {
        alert('🎡 NeoSpin en cours de développement!');
    }
}

// Product Detail Modal
function showProductDetail(productId) {
    const modal = document.getElementById('product-modal');
    const detailDiv = document.getElementById('product-detail');
    
    let detailHTML = '';
    
    if (productId === 'banana-sift') {
        detailHTML = `
            <h2 style="color: var(--primary); margin-bottom: 15px;">Olive Sift Banana</h2>
            <div style="background: linear-gradient(135deg, rgba(255, 214, 10, 0.1) 0%, rgba(1, 0, 0, 0.3) 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <p style="color: var(--text-muted); margin-bottom: 10px;">Catégorie: <span style="color: var(--primary);">Olive Farm</span></p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <span class="tag">🟡 Jaune</span>
                    <span class="tag">🍌 Banana</span>
                </div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--primary); border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <h3 style="color: var(--primary); margin-bottom: 10px;">Tarifs</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">5g</p>
                        <p style="color: var(--primary); font-weight: bold;">70€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Olive Sift Banana 5g', 70); closeProductModal();">Ajouter</button>
                    </div>
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">10g</p>
                        <p style="color: var(--primary); font-weight: bold;">120€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Olive Sift Banana 10g', 120); closeProductModal();">Ajouter</button>
                    </div>
                </div>
                <p style="color: var(--secondary); text-align: center; margin-top: 15px; font-weight: bold;">+ en privé</p>
            </div>
        `;
    } else if (productId === 'lemonhaze') {
        detailHTML = `
            <h2 style="color: var(--primary); margin-bottom: 15px;">Jaune Mousseux Lemon Haze</h2>
            <div style="background: linear-gradient(135deg, rgba(255, 255, 0, 0.1) 0%, rgba(255, 102, 0, 0.2) 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <p style="color: var(--text-muted); margin-bottom: 10px;">Catégorie: <span style="color: var(--primary);">Jaune Mousseux</span></p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <span class="tag">🍋 Lemon</span>
                    <span class="tag">⚡ Haze</span>
                </div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--primary); border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <h3 style="color: var(--primary); margin-bottom: 10px;">Tarifs</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">10g</p>
                        <p style="color: var(--primary); font-weight: bold;">50€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux Lemon Haze 10g', 50); closeProductModal();">Ajouter</button>
                    </div>
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">25g</p>
                        <p style="color: var(--primary); font-weight: bold;">100€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux Lemon Haze 25g', 100); closeProductModal();">Ajouter</button>
                    </div>
                </div>
                <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                    <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">100g</p>
                    <p style="color: var(--primary); font-weight: bold;">300€</p>
                    <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux Lemon Haze 100g', 300); closeProductModal();">Ajouter</button>
                </div>
            </div>
        `;
    }
    
    detailDiv.innerHTML = detailHTML;
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

// Close modal on background click
document.getElementById('product-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
        closeProductModal();
    }
});

// Initialize cart on page load
updateCart();

console.log('🍋 Godzilla Farmz Mini-App loaded!');
