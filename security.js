// ===================================
// SISTEMA DE SEGURIDAD AVANZADO
// ===================================

// ===================================
// 1. Protección contra XSS (Cross-Site Scripting)
// ===================================

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };

    return input.replace(/[&<>"'/]/g, (char) => map[char]);
}

function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

// ===================================
// 2. Validación de Inputs
// ===================================

const InputValidator = {
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    phone: (phone) => {
        const re = /^\+?[\d\s\-()]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    username: (username) => {
        const re = /^[a-zA-Z0-9_]{3,20}$/;
        return re.test(username);
    },

    password: (password) => {
        // Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return re.test(password);
    },

    cryptoAddress: (address, type) => {
        const patterns = {
            BTC: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
            ETH: /^0x[a-fA-F0-9]{40}$/,
            USDT: /^T[a-zA-Z0-9]{33}$/, // TRC20
            USDC: /^0x[a-fA-F0-9]{40}$/, // ERC20
            BNB: /^bnb[a-z0-9]{39}$/
        };
        return patterns[type] ? patterns[type].test(address) : false;
    },

    transactionHash: (hash) => {
        const re = /^(0x)?[a-fA-F0-9]{64}$/;
        return re.test(hash);
    },

    amount: (amount) => {
        return !isNaN(amount) && parseFloat(amount) > 0;
    }
};

// ===================================
// 3. Rate Limiting (Protección contra Fuerza Bruta)
// ===================================

class RateLimiter {
    constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
        this.attempts = new Map();
    }

    checkLimit(identifier) {
        const now = Date.now();
        const userAttempts = this.attempts.get(identifier) || [];

        // Limpiar intentos antiguos
        const recentAttempts = userAttempts.filter(
            timestamp => now - timestamp < this.windowMs
        );

        if (recentAttempts.length >= this.maxAttempts) {
            const oldestAttempt = Math.min(...recentAttempts);
            const timeLeft = this.windowMs - (now - oldestAttempt);
            return {
                allowed: false,
                timeLeft: Math.ceil(timeLeft / 1000 / 60) // minutos
            };
        }

        recentAttempts.push(now);
        this.attempts.set(identifier, recentAttempts);

        return {
            allowed: true,
            remaining: this.maxAttempts - recentAttempts.length
        };
    }

    reset(identifier) {
        this.attempts.delete(identifier);
    }
}

// Instancia global
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 intentos en 15 minutos
const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests por minuto

// ===================================
// 4. Protección CSRF (Cross-Site Request Forgery)
// ===================================

class CSRFProtection {
    static generateToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    static setToken() {
        const token = this.generateToken();
        sessionStorage.setItem('csrf_token', token);
        return token;
    }

    static getToken() {
        let token = sessionStorage.getItem('csrf_token');
        if (!token) {
            token = this.setToken();
        }
        return token;
    }

    static validateToken(token) {
        const storedToken = this.getToken();
        return token === storedToken;
    }
}

// ===================================
// 5. Detección de Bots y Honeypots
// ===================================

class BotDetector {
    static checks = {
        // Honeypot field (invisible para humanos)
        honeypot: false,

        // Tiempo de llenado del formulario
        formFillTime: 0,

        // Mouse movements
        mouseMovements: 0,

        // Keyboard events
        keyboardEvents: 0
    };

    static init() {
        this.startTime = Date.now();

        // Track mouse movements
        document.addEventListener('mousemove', () => {
            this.checks.mouseMovements++;
        });

        // Track keyboard events
        document.addEventListener('keydown', () => {
            this.checks.keyboardEvents++;
        });
    }

    static isLikelyBot() {
        // Honeypot field filled = bot
        if (this.checks.honeypot) return true;

        // Formulario llenado muy rápido (< 2 segundos)
        const fillTime = (Date.now() - this.startTime) / 1000;
        if (fillTime < 2) return true;

        // Sin movimientos de mouse ni teclado = bot
        if (this.checks.mouseMovements === 0 && this.checks.keyboardEvents === 0) {
            return true;
        }

        return false;
    }

    static addHoneypot(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website'; // Campo que humanos no deberían llenar
        honeypot.style.position = 'absolute';
        honeypot.style.left = '-9999px';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';

        honeypot.addEventListener('input', () => {
            this.checks.honeypot = true;
        });

        form.appendChild(honeypot);
    }
}

// ===================================
// 6. Encriptación de Datos Sensibles
// ===================================

class DataEncryption {
    static async generateKey() {
        return await crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    static async encrypt(data, key) {
        const encoded = new TextEncoder().encode(data);
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encoded
        );

        return {
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted))
        };
    }

    static async decrypt(encryptedData, key) {
        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: new Uint8Array(encryptedData.iv)
            },
            key,
            new Uint8Array(encryptedData.data)
        );

        return new TextDecoder().decode(decrypted);
    }
}

// ===================================
// 7. Protección contra Clickjacking
// ===================================

function preventClickjacking() {
    if (window.self !== window.top) {
        // Página está siendo cargada en un iframe
        window.top.location = window.self.location;
    }
}

// ===================================
// 8. Detección de Manipulación de DOM
// ===================================

class DOMIntegrityChecker {
    constructor() {
        this.checksums = new Map();
    }

    calculateChecksum(element) {
        const content = element.outerHTML;
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    registerElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const checksum = this.calculateChecksum(element);
        this.checksums.set(elementId, checksum);
    }

    checkIntegrity(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return false;

        const currentChecksum = this.calculateChecksum(element);
        const originalChecksum = this.checksums.get(elementId);

        return currentChecksum === originalChecksum;
    }
}

// ===================================
// 9. Protección contra Console Tampering
// ===================================

function protectConsole() {
    // Disable console in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
        console.info = function() {};
        console.debug = function() {};
    }
}

// ===================================
// 10. Detección de DevTools
// ===================================

class DevToolsDetector {
    constructor(callback) {
        this.callback = callback;
        this.isOpen = false;
        this.threshold = 160;

        this.check();
        setInterval(() => this.check(), 1000);
    }

    check() {
        const widthThreshold = window.outerWidth - window.innerWidth > this.threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > this.threshold;

        const wasOpen = this.isOpen;
        this.isOpen = widthThreshold || heightThreshold;

        if (!wasOpen && this.isOpen) {
            this.callback(true);
        } else if (wasOpen && !this.isOpen) {
            this.callback(false);
        }
    }
}

// ===================================
// 11. Fingerprinting del Cliente (para tracking)
// ===================================

class ClientFingerprint {
    static async generate() {
        const components = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            colorDepth: screen.colorDepth,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            platform: navigator.platform,
            plugins: Array.from(navigator.plugins).map(p => p.name).join(','),
            canvas: await this.getCanvasFingerprint(),
            webgl: this.getWebGLFingerprint()
        };

        const fingerprint = JSON.stringify(components);
        return this.hashString(fingerprint);
    }

    static async getCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser Fingerprint', 2, 2);

        return canvas.toDataURL();
    }

    static getWebGLFingerprint() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) return 'no-webgl';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return 'no-debug-info';

        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    static hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
}

// ===================================
// 12. Sistema de Logs de Seguridad
// ===================================

class SecurityLogger {
    static logs = [];

    static log(event, details, severity = 'info') {
        const entry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            severity: severity,
            fingerprint: sessionStorage.getItem('fingerprint'),
            userAgent: navigator.userAgent
        };

        this.logs.push(entry);

        // En producción, enviar al backend
        if (severity === 'critical' || severity === 'high') {
            this.sendToBackend(entry);
        }

        // Mantener solo últimos 100 logs
        if (this.logs.length > 100) {
            this.logs.shift();
        }
    }

    static sendToBackend(entry) {
        // TODO: Implementar envío al backend
        console.warn('Security Event:', entry);
    }

    static getLogs() {
        return this.logs;
    }
}

// ===================================
// 13. Protección contra SQL Injection (Client-side validation)
// ===================================

function detectSQLInjection(input) {
    const sqlPatterns = [
        /(\bunion\b.*\bselect\b)/i,
        /(\bselect\b.*\bfrom\b)/i,
        /(\binsert\b.*\binto\b)/i,
        /(\bdelete\b.*\bfrom\b)/i,
        /(\bdrop\b.*\btable\b)/i,
        /(\bupdate\b.*\bset\b)/i,
        /(--|;|\/\*|\*\/)/,
        /(\bor\b.*=.*)/i,
        /(\band\b.*=.*)/i,
        /(1=1|'=')/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
}

// ===================================
// 14. Inicialización de Seguridad
// ===================================

async function initSecurity() {
    console.log('🔒 Initializing Security System...');

    // Prevent clickjacking
    preventClickjacking();

    // Protect console (production only)
    protectConsole();

    // Initialize bot detector
    BotDetector.init();

    // Generate CSRF token
    CSRFProtection.setToken();

    // Generate client fingerprint
    const fingerprint = await ClientFingerprint.generate();
    sessionStorage.setItem('fingerprint', fingerprint);

    // Setup DevTools detector
    new DevToolsDetector((isOpen) => {
        if (isOpen) {
            SecurityLogger.log('devtools_opened', {}, 'medium');
        }
    });

    // Add honeypots to all forms
    document.querySelectorAll('form').forEach(form => {
        if (form.id) {
            BotDetector.addHoneypot(form.id);
        }
    });

    // Monitor critical elements
    const integrityChecker = new DOMIntegrityChecker();
    ['loginForm', 'registerForm', 'investmentForm'].forEach(id => {
        integrityChecker.registerElement(id);
    });

    console.log('✅ Security System Active');
    SecurityLogger.log('security_initialized', { fingerprint }, 'info');
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurity);
} else {
    initSecurity();
}

// ===================================
// Export para uso en otros archivos
// ===================================

window.Security = {
    sanitizeInput,
    sanitizeHTML,
    InputValidator,
    RateLimiter,
    loginRateLimiter,
    apiRateLimiter,
    CSRFProtection,
    BotDetector,
    DataEncryption,
    SecurityLogger,
    detectSQLInjection,
    ClientFingerprint
};

console.log('🛡️ Advanced Security Module Loaded');