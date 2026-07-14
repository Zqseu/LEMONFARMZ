// Intro screen timer
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
    }, 5000);
});

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

// GAMES
let currentGame = null;
let gameState = {};

function initGame(game) {
    currentGame = game;
    const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    gameContainer.style.display = 'block';
    
    if (game === 'snake') {
        startSnakeGame(ctx, canvas);
    } else if (game === 'spin') {
        startSpinGame(ctx, canvas);
    }
}

function exitGame() {
    document.getElementById('game-container').style.display = 'none';
    currentGame = null;
}

// SNAKE GAME
function startSnakeGame(ctx, canvas) {
    const gridSize = 20;
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 1, dy = 0;
    let score = 0;
    let gameRunning = true;
    
    function drawGame() {
        // Fond
        ctx.fillStyle = '#003d0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grille
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < canvas.width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Serpent
        snake.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillStyle = '#FFFF00';
                ctx.shadowColor = '#00FF41';
                ctx.shadowBlur = 10;
            } else {
                ctx.fillStyle = '#00FF41';
                ctx.shadowColor = 'transparent';
            }
            ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
        });
        
        // Nourriture (citron)
        ctx.fillStyle = '#FFFF00';
        ctx.shadowColor = '#FFFF00';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Score
        ctx.fillStyle = '#00FF41';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Score: ' + score, 10, 20);
    }
    
    function update() {
        if (!gameRunning) return;
        
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Collision murs
        if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
            gameRunning = false;
            alert('Game Over! Score: ' + score);
            localStorage.setItem('snakeRecord', Math.max(score, parseInt(localStorage.getItem('snakeRecord') || 0)));
            document.getElementById('snake-record').textContent = localStorage.getItem('snakeRecord');
            exitGame();
            return;
        }
        
        // Collision avec soi-même
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
            gameRunning = false;
            alert('Game Over! Score: ' + score);
            exitGame();
            return;
        }
        
        snake.unshift(head);
        
        // Manger la nourriture
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
        } else {
            snake.pop();
        }
    }
    
    function gameLoop() {
        update();
        drawGame();
        setTimeout(gameLoop, 100);
    }
    
    // Contrôles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    });
    
    gameLoop();
}

// SPIN GAME
function startSpinGame(ctx, canvas) {
    const prizes = [50, 100, 300, 70, 120, 200, 150, 250];
    let rotation = 0;
    let isSpinning = false;
    let finalPrize = 0;
    
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Roue
        for (let i = 0; i < prizes.length; i++) {
            const angle = (Math.PI * 2 / prizes.length) * i;
            const nextAngle = (Math.PI * 2 / prizes.length) * (i + 1);
            
            ctx.fillStyle = i % 2 === 0 ? '#00FF41' : '#FFFF00';
            ctx.beginPath();
            ctx.arc(0, 0, radius, angle, nextAngle);
            ctx.lineTo(0, 0);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Texte
            const textAngle = angle + (nextAngle - angle) / 2;
            ctx.save();
            ctx.rotate(textAngle);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(prizes[i] + '€', radius - 20, 5);
            ctx.restore();
        }
        
        ctx.restore();
        
        // Pointeur
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.moveTo(centerX, 20);
        ctx.lineTo(centerX - 10, 40);
        ctx.lineTo(centerX + 10, 40);
        ctx.fill();
        ctx.shadowColor = '#FFFF00';
        ctx.shadowBlur = 10;
    }
    
    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        
        const spins = Math.random() * 10 + 5;
        const endRotation = spins * Math.PI * 2 + Math.random() * Math.PI * 2;
        const duration = 3000;
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            rotation = endRotation * progress;
            drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                const prizeIndex = Math.floor((prizes.length - (rotation % (Math.PI * 2)) / (Math.PI * 2 / prizes.length))) % prizes.length;
                finalPrize = prizes[prizeIndex];
                alert('🎉 Vous avez gagné ' + finalPrize + '€!');
                isSpinning = false;
            }
        }
        
        animate();
    }
    
    drawWheel();
    
    canvas.addEventListener('click', spin);
    ctx.fillStyle = '#00FF41';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Clique pour tourner!', canvas.width / 2, canvas.height - 20);
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

// Product Detail Modal
function showProductDetail(productId) {
    const modal = document.getElementById('product-modal');
    const detailDiv = document.getElementById('product-detail');
    
    let detailHTML = '';
    
    if (productId === 'banana-sift') {
        detailHTML = `
            <h2 style="color: #FFFF00; margin-bottom: 15px; text-shadow: 0 0 10px #00FF41;">Olive Sift Banana</h2>
            <div style="background: linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(1, 0, 0, 0.3) 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid #00FF41;">
                <p style="color: var(--text-muted); margin-bottom: 10px;">Catégorie: <span style="color: #00FF41; text-shadow: 0 0 5px #00FF41;">Olive Farm</span></p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <span class="tag">🟢 Banana</span>
                    <span class="tag">🍋 Sift</span>
                </div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid #00FF41; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <h3 style="color: #FFFF00; margin-bottom: 10px; text-shadow: 0 0 5px #00FF41;">Tarifs</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: rgba(0, 255, 65, 0.1); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #00FF41;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">5g</p>
                        <p style="color: #FFFF00; font-weight: bold; text-shadow: 0 0 5px #00FF41;">70€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Olive Sift Banana 5g', 70); closeProductModal();">Ajouter</button>
                    </div>
                    <div style="background: rgba(0, 255, 65, 0.1); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #00FF41;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">10g</p>
                        <p style="color: #FFFF00; font-weight: bold; text-shadow: 0 0 5px #00FF41;">120€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Olive Sift Banana 10g', 120); closeProductModal();">Ajouter</button>
                    </div>
                </div>
                <p style="color: #00FF41; text-align: center; margin-top: 15px; font-weight: bold; text-shadow: 0 0 5px #00FF41;">+ en privé</p>
            </div>
        `;
    } else if (productId === 'lemonhaze') {
        detailHTML = `
            <h2 style="color: #FFFF00; margin-bottom: 15px; text-shadow: 0 0 10px #00FF41;">Jaune Mousseux Lemon Haze</h2>
            <div style="background: linear-gradient(135deg, rgba(255, 255, 0, 0.1) 0%, rgba(0, 255, 65, 0.2) 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid #00FF41;">
                <p style="color: var(--text-muted); margin-bottom: 10px;">Catégorie: <span style="color: #00FF41; text-shadow: 0 0 5px #00FF41;">Jaune Mousseux</span></p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <span class="tag">🍋 Lemon</span>
                    <span class="tag">⚡ Haze</span>
                </div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid #00FF41; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <h3 style="color: #FFFF00; margin-bottom: 10px; text-shadow: 0 0 5px #00FF41;">Tarifs</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div style="background: rgba(0, 255, 65, 0.1); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #00FF41;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">10g</p>
                        <p style="color: #FFFF00; font-weight: bold; text-shadow: 0 0 5px #00FF41;">50€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux Lemon Haze 10g', 50); closeProductModal();">Ajouter</button>
                    </div>
                    <div style="background: rgba(0, 255, 65, 0.1); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #00FF41;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">25g</p>
                        <p style="color: #FFFF00; font-weight: bold; text-shadow: 0 0 5px #00FF41;">100€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux Lemon Haze 25g', 100); closeProductModal();">Ajouter</button>
                    </div>
                </div>
                <div style="background: rgba(0, 255, 65, 0.1); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #00FF41;">
                    <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">100g</p>
                    <p style="color: #FFFF00; font-weight: bold; text-shadow: 0 0 5px #00FF41;">300€</p>
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

console.log('🍋 LEMONFARMZ Mini-App loaded!');
