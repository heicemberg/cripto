// ===================================
// Investment System - Core Logic
// ===================================

// Available Assets Configuration
const AVAILABLE_ASSETS = {
    gold: {
        id: 'gold',
        name: 'Oro y Minerales Preciosos',
        type: 'Metales Preciosos',
        icon: '🪙',
        minInvestment: 0.1,
        expectedReturn: 15,
        duration: 12,
        description: 'Inversión en oro extraído y certificado con respaldo tangible',
        riskLevel: 'Medio'
    },
    oil: {
        id: 'oil',
        name: 'Petróleo y Derivados',
        type: 'Energía',
        icon: '⚡',
        minInvestment: 0.5,
        expectedReturn: 22,
        duration: 18,
        description: 'Participación en pozos activos y operaciones de refinación',
        riskLevel: 'Alto'
    },
    silver: {
        id: 'silver',
        name: 'Plata y Metales Estratégicos',
        type: 'Metales Estratégicos',
        icon: '💎',
        minInvestment: 0.08,
        expectedReturn: 18,
        duration: 12,
        description: 'Inversión en plata, coltán y minerales de alta demanda tecnológica',
        riskLevel: 'Medio-Alto'
    },
    materials: {
        id: 'materials',
        name: 'Materiales Industriales',
        type: 'Commodities',
        icon: '🏭',
        minInvestment: 0.2,
        expectedReturn: 12,
        duration: 24,
        description: 'Hierro, aluminio y materias primas para construcción',
        riskLevel: 'Medio'
    }
};

// Crypto Wallet Addresses (IMPORTANT: Replace with your real addresses)
const WALLET_ADDRESSES = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Example Bitcoin address
    ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example Ethereum address
    USDT: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxbEVA', // Example USDT (TRC20) address
    USDC: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Example USDC (ERC20) address
    BNB: 'bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkf5xdjx9' // Example BNB address
};

// Crypto Configuration
const CRYPTO_CONFIG = {
    BTC: {
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: '₿',
        network: 'Bitcoin Network',
        currentPrice: 45000 // This should be fetched from API
    },
    ETH: {
        name: 'Ethereum',
        symbol: 'ETH',
        icon: 'Ξ',
        network: 'Ethereum (ERC-20)',
        currentPrice: 2400
    },
    USDT: {
        name: 'Tether',
        symbol: 'USDT',
        icon: '₮',
        network: 'Tron (TRC-20)',
        currentPrice: 1
    },
    USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        icon: '$',
        network: 'Ethereum (ERC-20)',
        currentPrice: 1
    },
    BNB: {
        name: 'Binance Coin',
        symbol: 'BNB',
        icon: '🔶',
        network: 'BNB Chain',
        currentPrice: 310
    }
};

// ===================================
// Investment Management
// ===================================

// Create new investment
function createInvestment(userId, investmentData) {
    const investments = JSON.parse(localStorage.getItem('investments') || '[]');

    const newInvestment = {
        id: generateInvestmentId(),
        userId: userId,
        assetId: investmentData.assetId,
        assetName: AVAILABLE_ASSETS[investmentData.assetId].name,
        assetType: AVAILABLE_ASSETS[investmentData.assetId].type,
        amountCrypto: investmentData.amountCrypto,
        cryptoType: investmentData.cryptoType,
        amountUSD: investmentData.amountUSD,
        expectedReturn: AVAILABLE_ASSETS[investmentData.assetId].expectedReturn,
        duration: AVAILABLE_ASSETS[investmentData.assetId].duration,
        status: 'pending', // pending, active, completed
        createdAt: new Date().toISOString(),
        startDate: null,
        endDate: null,
        nextPaymentDate: null,
        monthlyReturn: 0,
        totalReturned: 0,
        paymentHistory: [],
        transactionHash: investmentData.transactionHash || null,
        walletAddress: WALLET_ADDRESSES[investmentData.cryptoType]
    };

    investments.push(newInvestment);
    localStorage.setItem('investments', JSON.stringify(investments));

    return newInvestment;
}

// Get user investments
function getUserInvestments(userId) {
    const investments = JSON.parse(localStorage.getItem('investments') || '[]');
    return investments.filter(inv => inv.userId === userId);
}

// Get all investments (admin)
function getAllInvestments() {
    return JSON.parse(localStorage.getItem('investments') || '[]');
}

// Update investment status
function updateInvestmentStatus(investmentId, status, additionalData = {}) {
    const investments = JSON.parse(localStorage.getItem('investments') || '[]');
    const index = investments.findIndex(inv => inv.id === investmentId);

    if (index !== -1) {
        investments[index].status = status;

        // If activating investment
        if (status === 'active' && !investments[index].startDate) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + investments[index].duration);

            investments[index].startDate = startDate.toISOString();
            investments[index].endDate = endDate.toISOString();

            // Calculate monthly return
            const monthlyReturnRate = investments[index].expectedReturn / 12 / 100;
            investments[index].monthlyReturn = investments[index].amountUSD * monthlyReturnRate;

            // Set next payment date (30 days from start)
            const nextPayment = new Date(startDate);
            nextPayment.setDate(nextPayment.getDate() + 30);
            investments[index].nextPaymentDate = nextPayment.toISOString();
        }

        // Merge additional data
        Object.assign(investments[index], additionalData);

        localStorage.setItem('investments', JSON.stringify(investments));
        return investments[index];
    }

    return null;
}

// Calculate returns for an investment
function calculateReturns(investment) {
    if (investment.status !== 'active') return 0;

    const startDate = new Date(investment.startDate);
    const now = new Date();
    const monthsElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30));

    if (monthsElapsed <= 0) return 0;

    const monthlyReturnRate = investment.expectedReturn / 12 / 100;
    const totalReturn = investment.amountUSD * monthlyReturnRate * monthsElapsed;

    return Math.min(totalReturn, investment.amountUSD * (investment.expectedReturn / 100));
}

// Add payment to investment
function addPayment(investmentId, amount, transactionHash) {
    const investments = JSON.parse(localStorage.getItem('investments') || '[]');
    const index = investments.findIndex(inv => inv.id === investmentId);

    if (index !== -1) {
        const payment = {
            id: generateId(),
            amount: amount,
            date: new Date().toISOString(),
            transactionHash: transactionHash
        };

        investments[index].paymentHistory.push(payment);
        investments[index].totalReturned += amount;

        // Update next payment date
        const nextPayment = new Date();
        nextPayment.setDate(nextPayment.getDate() + 30);
        investments[index].nextPaymentDate = nextPayment.toISOString();

        localStorage.setItem('investments', JSON.stringify(investments));
        return true;
    }

    return false;
}

// ===================================
// Utility Functions
// ===================================

// Generate Investment ID
function generateInvestmentId() {
    return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate generic ID
function generateId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date with time
function formatDateTime(dateString) {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get status text in Spanish
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'active': 'Activa',
        'completed': 'Completada',
        'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
}

// Calculate crypto amount from USD
function calculateCryptoAmount(usdAmount, cryptoSymbol) {
    const price = CRYPTO_CONFIG[cryptoSymbol]?.currentPrice || 1;
    return (usdAmount / price).toFixed(8);
}

// Calculate USD from crypto amount
function calculateUSDAmount(cryptoAmount, cryptoSymbol) {
    const price = CRYPTO_CONFIG[cryptoSymbol]?.currentPrice || 1;
    return cryptoAmount * price;
}

// ===================================
// Portfolio Analytics
// ===================================

function getPortfolioSummary(userId) {
    const investments = getUserInvestments(userId);

    const summary = {
        totalInvested: 0,
        totalReturns: 0,
        activeInvestments: 0,
        pendingInvestments: 0,
        completedInvestments: 0,
        totalValue: 0,
        assetDistribution: {},
        monthlyIncome: 0
    };

    investments.forEach(inv => {
        summary.totalInvested += inv.amountUSD;

        if (inv.status === 'active') {
            summary.activeInvestments++;
            summary.totalReturns += calculateReturns(inv);
            summary.monthlyIncome += inv.monthlyReturn || 0;

            // Asset distribution
            if (!summary.assetDistribution[inv.assetType]) {
                summary.assetDistribution[inv.assetType] = 0;
            }
            summary.assetDistribution[inv.assetType] += inv.amountUSD;
        } else if (inv.status === 'pending') {
            summary.pendingInvestments++;
        } else if (inv.status === 'completed') {
            summary.completedInvestments++;
            summary.totalReturns += inv.totalReturned;
        }
    });

    summary.totalValue = summary.totalInvested + summary.totalReturns;

    return summary;
}

// ===================================
// Demo Data Generator (for testing)
// ===================================

function generateDemoInvestment(userId) {
    const assets = Object.keys(AVAILABLE_ASSETS);
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    const cryptos = Object.keys(CRYPTO_CONFIG);
    const randomCrypto = cryptos[Math.floor(Math.random() * cryptos.length)];

    const usdAmount = (Math.random() * 10000 + 1000).toFixed(2);

    const investment = createInvestment(userId, {
        assetId: randomAsset,
        cryptoType: randomCrypto,
        amountCrypto: calculateCryptoAmount(usdAmount, randomCrypto),
        amountUSD: parseFloat(usdAmount),
        transactionHash: '0x' + Math.random().toString(36).substr(2, 40)
    });

    // Randomly activate some investments
    if (Math.random() > 0.3) {
        updateInvestmentStatus(investment.id, 'active');
    }

    return investment;
}

// ===================================
// Price Fetching (Mock - Replace with real API)
// ===================================

async function updateCryptoPrices() {
    // In production, fetch real prices from CoinGecko, Binance, etc.
    // Example:
    /*
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin&vs_currencies=usd');
        const data = await response.json();

        CRYPTO_CONFIG.BTC.currentPrice = data.bitcoin.usd;
        CRYPTO_CONFIG.ETH.currentPrice = data.ethereum.usd;
        CRYPTO_CONFIG.USDT.currentPrice = data.tether.usd;
        CRYPTO_CONFIG.USDC.currentPrice = data['usd-coin'].usd;
        CRYPTO_CONFIG.BNB.currentPrice = data.binancecoin.usd;
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
    */

    // Mock price updates for demo
    CRYPTO_CONFIG.BTC.currentPrice = 45000 + (Math.random() - 0.5) * 1000;
    CRYPTO_CONFIG.ETH.currentPrice = 2400 + (Math.random() - 0.5) * 100;
    CRYPTO_CONFIG.BNB.currentPrice = 310 + (Math.random() - 0.5) * 10;
}

// Update prices every 5 minutes
setInterval(updateCryptoPrices, 5 * 60 * 1000);

// ===================================
// Admin Functions
// ===================================

function getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function getUserStats() {
    const users = getAllUsers();
    const investments = getAllInvestments();

    return {
        totalUsers: users.length,
        totalInvestments: investments.length,
        totalInvestedUSD: investments.reduce((sum, inv) => sum + inv.amountUSD, 0),
        activeInvestments: investments.filter(inv => inv.status === 'active').length,
        pendingInvestments: investments.filter(inv => inv.status === 'pending').length
    };
}

// ===================================
// Export for use in HTML
// ===================================

console.log('📊 Investment System Loaded');
console.log('Available Assets:', Object.keys(AVAILABLE_ASSETS));
console.log('Supported Cryptos:', Object.keys(CRYPTO_CONFIG));