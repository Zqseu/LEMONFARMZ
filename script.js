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
        targetPage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close button
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (confirm('Fermer la mini-app?')) {
            window.close();
        }
    });
}

// Start Game
function startGame(game) {
    if (game === 'snake') {
        alert('🐍 Jeu Snake en cours de développement!\n\nScore record: ' + (localStorage.getItem('snakeRecord') || '5'));
    } else if (game === 'neospin') {
        alert('🎡 NeoSpin en cours de développement!');
    }
}

// Add to cart simulation
const addBtns = document.querySelectorAll('.add-btn');
addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.textContent = '✓ Ajouté';
        btn.style.background = 'var(--secondary)';
        setTimeout(() => {
            btn.textContent = 'Ajouter';
            btn.style.background = 'var(--primary)';
        }, 2000);
    });
});

// Initialize
console.log('🍋 Godzilla Farmz Mini-App loaded!');
