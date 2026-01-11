// ===================================
// Authentication System
// ===================================

// Check if user is already logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname;

    if (currentUser && (currentPage.includes('login.html') || currentPage.endsWith('/'))) {
        window.location.href = 'dashboard.html';
    }

    if (!currentUser && !currentPage.includes('login.html') && !currentPage.includes('index.html')) {
        window.location.href = 'login.html';
    }

    return currentUser ? JSON.parse(currentUser) : null;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize users database if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Initialize investments if they don't exist
    if (!localStorage.getItem('investments')) {
        localStorage.setItem('investments', JSON.stringify([]));
    }
});

// Show Login Form
function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

// Show Register Form
function showRegister() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Remove password from stored session
        const userSession = { ...user };
        delete userSession.password;

        localStorage.setItem('currentUser', JSON.stringify(userSession));
        showNotification('¡Bienvenido de vuelta!', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification('Email o contraseña incorrectos', 'error');
    }
}

// Handle Registration
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const termsAccepted = document.getElementById('registerTerms').checked;

    // Validation
    if (password !== passwordConfirm) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }

    if (!termsAccepted) {
        showNotification('Debes aceptar los términos y condiciones', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('Este email ya está registrado', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: generateUserId(),
        name,
        email,
        phone,
        password, // In production, this should be hashed!
        registeredAt: new Date().toISOString(),
        kycVerified: false,
        role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showNotification('¡Cuenta creada exitosamente!', 'success');

    // Auto login
    const userSession = { ...newUser };
    delete userSession.password;
    localStorage.setItem('currentUser', JSON.stringify(userSession));

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Sesión cerrada', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Generate User ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get Current User
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Update User Profile
function updateUserProfile(updates) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));

        // Update session
        const updatedSession = { ...users[userIndex] };
        delete updatedSession.password;
        localStorage.setItem('currentUser', JSON.stringify(updatedSession));

        return true;
    }

    return false;
}

// Show Notification
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4444' : '#FFD700'};
        color: #0a0a0a;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);