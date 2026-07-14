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
let gameRunning = false;

function initGame(game) {
    currentGame = game;
    const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    gameContainer.style.display = 'block';
    gameRunning = true;
    
    if (game === 'flappy') {
        startFlappyGame(ctx, canvas);
    } else if (game === 'tap') {
        startTapGame(ctx, canvas);
    }
}

function exitGame() {
    document.getElementById('game-container').style.display = 'none';
    gameRunning = false;
    currentGame = null;
}

// FLAPPY LEMON GAME
function startFlappyGame(ctx, canvas) {
    let bird = { x: 50, y: canvas.height / 2, width: 30, height: 30, velocity: 0 };
    let gravity = 0.5;
    let jump = -12;
    let gameOver = false;
    let score = 0;
    let pipes = [];
    let frameCount = 0;
    
    function drawBird() {
        ctx.fillStyle = '#FFFF00';
        ctx.shadowColor = '#FFD60A';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(bird.x, bird.y, bird.width / 2, bird.height / 2, bird.velocity * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // Yeux
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(bird.x + 8, bird.y - 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
    }
    
    function drawPipes() {
        pipes.forEach(pipe => {
            // Tuyau du haut
            ctx.fillStyle = '#333';
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
            
            // Tuyau du bas
            ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);
            
            // Bordure
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x, 0, pipe.width, pipe.top);
            ctx.strokeRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);
        });
    }
    
    function updateGame() {
        bird.velocity += gravity;
        bird.y += bird.velocity;
        
        // Collision avec sol/plafond
        if (bird.y + bird.height / 2 > canvas.height || bird.y - bird.height / 2 < 0) {
            gameOver = true;
        }
        
        frameCount++;
        if (frameCount % 90 === 0) {
            let gap = 120;
            let top = Math.random() * (canvas.height - gap - 100) + 50;
            pipes.push({ x: canvas.width, width: 80, top: top, gap: gap });
        }
        
        pipes = pipes.filter(pipe => pipe.x > -pipe.width);
        
        pipes.forEach(pipe => {
            pipe.x -= 6;
            
            // Collision
            if (bird.x + bird.width / 2 > pipe.x && bird.x - bird.width / 2 < pipe.x + pipe.width) {
                if (bird.y - bird.height / 2 < pipe.top || bird.y + bird.height / 2 > pipe.top + pipe.gap) {
                    gameOver = true;
                }
            }
            
            // Score
            if (pipe.x === bird.x) {
                score++;
            }
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawBird();
        drawPipes();
        
        // Score
        ctx.fillStyle = '#FFFF00';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(score, canvas.width / 2 - 10, 40);
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFFF00';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '20px Arial';
            ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
            ctx.textAlign = 'left';
        }
    }
    
    function gameLoop() {
        if (gameRunning && !gameOver) {
            updateGame();
        }
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    // Controls
    canvas.addEventListener('click', () => {
        if (gameRunning && !gameOver) {
            bird.velocity = jump;
        } else if (gameRunning && gameOver) {
            startFlappyGame(ctx, canvas);
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (gameRunning && !gameOver) bird.velocity = jump;
            else if (gameRunning && gameOver) startFlappyGame(ctx, canvas);
        }
    });
    
    gameLoop();
}

// TAP TAP GAME
function startTapGame(ctx, canvas) {
    let score = 0;
    let gameOver = false;
    let timeLeft = 30;
    let lemons = [];
    let startTime = Date.now();
    
    function createLemon() {
        if (lemons.length < 5 && Math.random() < 0.1) {
            lemons.push({
                x: Math.random() * (canvas.width - 60) + 30,
                y: Math.random() * (canvas.height - 60) + 30,
                size: 30,
                active: true
            });
        }
    }
    
    function drawLemons() {
        lemons.forEach(lemon => {
            if (lemon.active) {
                ctx.fillStyle = '#FFFF00';
                ctx.shadowColor = '#FFD60A';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(lemon.x, lemon.y, lemon.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Feuille
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.ellipse(lemon.x + 20, lemon.y - 20, 10, 15, -0.5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.shadowColor = 'transparent';
            }
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        createLemon();
        drawLemons();
        
        // UI
        ctx.fillStyle = '#FFFF00';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('Score: ' + score, 20, 40);
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Temps: ' + Math.max(0, timeLeft), canvas.width - 150, 40);
        
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFFF00';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TEMPS ÉCOULÉ!', canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '24px Arial';
            ctx.fillText('Score Final: ' + score, canvas.width / 2, canvas.height / 2 + 30);
            ctx.textAlign = 'left';
        }
    }
    
    function update() {
        const elapsed = (Date.now() - startTime) / 1000;
        timeLeft = 30 - Math.floor(elapsed);
        
        if (timeLeft <= 0) {
            gameOver = true;
            localStorage.setItem('tapRecord', Math.max(score, parseInt(localStorage.getItem('tapRecord') || 0)));
            document.getElementById('tap-record').textContent = localStorage.getItem('tapRecord');
        }
        
        lemons = lemons.filter(l => l.active);
    }
    
    function gameLoop() {
        update();
        draw();
        if (gameRunning && !gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    canvas.addEventListener('click', (e) => {
        if (!gameOver) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            lemons.forEach(lemon => {
                if (lemon.active) {
                    const distance = Math.hypot(x - lemon.x, y - lemon.y);
                    if (distance < lemon.size) {
                        lemon.active = false;
                        score++;
                    }
                }
            });
        }
    });
    
    gameLoop();
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
    
    if (productId === 'olive') {
        detailHTML = `
            <h2 style="color: #FFD60A; margin-bottom: 15px;">Olive Farm</h2>
            <div style="background: linear-gradient(135deg, rgba(255, 214, 10, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <p style="color: var(--text-muted); margin-bottom: 10px;">Catégorie: <span style="color: #FFD60A;">Olive</span></p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <span class="tag">🟢 Olive</span>
                </div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid #FFD60A; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <h3 style="color: #FFD60A; margin-bottom: 10px;">Tarifs</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">5g</p>
                        <p style="color: #FFD60A; font-weight: bold;">60€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Olive Farm 5g', 60); closeProductModal();">Ajouter</button>
                    </div>
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">10g</p>
                        <p style="color: #FFD60A; font-weight: bold;">110€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Olive Farm 10g', 110); closeProductModal();">Ajouter</button>
                    </div>
                </div>
                <p style="color: #FFD60A; text-align: center; margin-top: 15px; font-weight: bold;">+ en privé</p>
            </div>
        `;
    } else if (productId === 'jaune') {
        detailHTML = `
            <h2 style="color: #FFD60A; margin-bottom: 15px;">Jaune Mousseux</h2>
            <div style="background: linear-gradient(135deg, rgba(255, 214, 10, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <p style="color: var(--text-muted); margin-bottom: 10px;">Catégorie: <span style="color: #FFD60A;">Jaune Mousseux</span></p>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <span class="tag">💛 Jaune</span>
                </div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid #FFD60A; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                <h3 style="color: #FFD60A; margin-bottom: 10px;">Tarifs</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">10g</p>
                        <p style="color: #FFD60A; font-weight: bold;">50€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux 10g', 50); closeProductModal();">Ajouter</button>
                    </div>
                    <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">25g</p>
                        <p style="color: #FFD60A; font-weight: bold;">100€</p>
                        <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux 25g', 100); closeProductModal();">Ajouter</button>
                    </div>
                </div>
                <div style="background: rgba(255, 214, 10, 0.1); padding: 10px; border-radius: 8px; text-align: center;">
                    <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">100g</p>
                    <p style="color: #FFD60A; font-weight: bold;">300€</p>
                    <button class="add-to-cart-btn" onclick="addToCart('Jaune Mousseux 100g', 300); closeProductModal();">Ajouter</button>
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
