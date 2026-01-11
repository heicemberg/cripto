# 🚀 SISTEMA COMPLETO DE INVERSIONES CON CRIPTOMONEDAS

## 📋 DESCRIPCIÓN GENERAL

Sistema completo de gestión de inversiones en activos reales (oro, petróleo, plata, materiales) con pagos en criptomonedas. Incluye:

- ✅ Sistema de registro e inicio de sesión
- ✅ Dashboard de usuario con estadísticas en tiempo real
- ✅ Proceso completo de inversión (selección, pago, confirmación)
- ✅ Pagos con códigos QR para todas las criptomonedas
- ✅ Panel de portafolio con tracking de retornos
- ✅ Panel de administración para gestionar inversiones
- ✅ Cálculo automático de retornos mensuales

---

## 📂 ESTRUCTURA DE ARCHIVOS

```
uyuy/
├── index.html                          # Landing page principal
├── login.html                          # Login/Registro
├── dashboard.html                      # Dashboard del usuario
├── invest.html                         # Proceso de inversión (selección)
├── payment.html                        # Página de pago con QR
├── portfolio.html                      # Portafolio completo
├── admin.html                          # Panel de administración
├── styles.css                          # Estilos de landing page
├── dashboard.css                       # Estilos del sistema
├── auth.js                             # Sistema de autenticación
├── app.js                              # Lógica principal de inversiones
├── script.js                           # Scripts de landing page
├── INSTRUCCIONES.md                    # Guía de landing page
└── SISTEMA-INVERSIONES.md             # Esta documentación
```

---

## 🎯 FLUJO COMPLETO DEL USUARIO

### 1. LANDING PAGE (index.html)
- Usuario llega a la landing page
- Ve información sobre inversiones
- Clic en "Acceder a Plataforma" o "Crear Cuenta"

### 2. REGISTRO/LOGIN (login.html)
- Nuevo usuario: Crea cuenta con email y contraseña
- Usuario existente: Inicia sesión
- Validación automática
- Redirección a dashboard

### 3. DASHBOARD (dashboard.html)
- Ver resumen de inversiones activas
- Capital total invertido
- Retornos generados
- Próximos pagos
- Acceso rápido a nueva inversión

### 4. NUEVA INVERSIÓN (invest.html)

**Paso 1: Seleccionar Activo**
- Oro y Minerales Preciosos
- Petróleo y Derivados
- Plata y Metales Estratégicos
- Materiales Industriales

**Paso 2: Ingresar Monto**
- Seleccionar criptomoneda (BTC, ETH, USDT, USDC, BNB)
- Ingresar cantidad a invertir
- Ver equivalente en USD
- Ver proyección de retornos

**Paso 3: Confirmar**
- Revisar resumen completo
- Aceptar términos
- Proceder al pago

### 5. PAGO CON QR (payment.html)
- Se genera QR code automáticamente
- Dirección de wallet visible
- Botón para copiar dirección
- Instrucciones paso a paso
- Usuario escanea QR desde su wallet
- Envía el monto exacto
- Copia hash de transacción
- Confirma la inversión

### 6. CONFIRMACIÓN
- Inversión queda en estado "Pendiente"
- Aparece en dashboard
- Admin debe activarla manualmente

### 7. PORTAFOLIO (portfolio.html)
- Ver todas las inversiones
- Filtrar por estado
- Ver detalles completos
- Historial de pagos recibidos
- Retornos acumulados

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Características:
- Registro simple (nombre, email, teléfono, contraseña)
- Login con email y contraseña
- Sesión guardada en localStorage
- Redirección automática si ya está logueado
- Protección de rutas (no puedes acceder al dashboard sin login)

### Datos Almacenados:
```javascript
{
  id: "user_123456789_abc123",
  name: "Juan Pérez",
  email: "juan@email.com",
  phone: "+58 412-1234567",
  password: "***", // En producción debe estar hasheada
  registeredAt: "2026-01-11T10:00:00.000Z",
  kycVerified: false,
  role: "user"
}
```

---

## 💰 SISTEMA DE INVERSIONES

### Activos Disponibles:

#### 1. **Oro y Minerales Preciosos** 🪙
- Mínimo: 0.1 BTC
- Retorno: 15% anual
- Duración: 12 meses
- Riesgo: Medio

#### 2. **Petróleo y Derivados** ⚡
- Mínimo: 0.5 BTC
- Retorno: 22% anual
- Duración: 18 meses
- Riesgo: Alto

#### 3. **Plata y Metales Estratégicos** 💎
- Mínimo: 0.08 BTC
- Retorno: 18% anual
- Duración: 12 meses
- Riesgo: Medio-Alto

#### 4. **Materiales Industriales** 🏭
- Mínimo: 0.2 BTC
- Retorno: 12% anual
- Duración: 24 meses
- Riesgo: Medio

### Estructura de una Inversión:

```javascript
{
  id: "inv_123456789_xyz",
  userId: "user_123456789_abc",
  assetId: "gold",
  assetName: "Oro y Minerales Preciosos",
  assetType: "Metales Preciosos",
  amountCrypto: 0.5,
  cryptoType: "BTC",
  amountUSD: 22500,
  expectedReturn: 15, // %
  duration: 12, // meses
  status: "pending", // pending, active, completed
  createdAt: "2026-01-11T10:00:00.000Z",
  startDate: null, // Se llena al activar
  endDate: null,
  nextPaymentDate: null,
  monthlyReturn: 0,
  totalReturned: 0,
  paymentHistory: [],
  transactionHash: "0xabc123...",
  walletAddress: "bc1q..."
}
```

---

## 💳 SISTEMA DE PAGOS CON CRIPTOMONEDAS

### Criptomonedas Soportadas:

| Cripto | Símbolo | Red | Precio Mock |
|--------|---------|-----|-------------|
| Bitcoin | BTC | Bitcoin Network | $45,000 |
| Ethereum | ETH | Ethereum (ERC-20) | $2,400 |
| Tether | USDT | Tron (TRC-20) | $1 |
| USD Coin | USDC | Ethereum (ERC-20) | $1 |
| Binance Coin | BNB | BNB Chain | $310 |

### Direcciones de Wallet:

**⚠️ IMPORTANTE:** Debes configurar tus propias direcciones de wallet reales.

Edita `app.js` línea ~30:

```javascript
const WALLET_ADDRESSES = {
    BTC: 'TU_DIRECCION_BITCOIN_REAL',
    ETH: 'TU_DIRECCION_ETHEREUM_REAL',
    USDT: 'TU_DIRECCION_USDT_TRC20_REAL',
    USDC: 'TU_DIRECCION_USDC_ERC20_REAL',
    BNB: 'TU_DIRECCION_BNB_REAL'
};
```

### Generación de QR Codes:

El sistema usa la librería `qrcode.js` (CDN):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

Genera automáticamente un código QR con la dirección de wallet para que el usuario lo escanee desde su app de criptomonedas.

---

## 📊 CÁLCULO DE RETORNOS

### Fórmula de Retorno Mensual:

```javascript
retornoMensual = montoInvertido * (retornoAnual / 12 / 100)
```

### Ejemplo:
- Inversión: $10,000 USD
- Retorno anual: 15%
- Retorno mensual: $10,000 * (15 / 12 / 100) = $125/mes

### Cálculo de Retornos Acumulados:

```javascript
mesesTranscurridos = Math.floor((hoy - fechaInicio) / (30 días))
retornoAcumulado = retornoMensual * mesesTranscurridos
```

El sistema calcula automáticamente:
- Retornos mensuales
- Retornos acumulados
- Próxima fecha de pago (cada 30 días)
- Progreso de la inversión

---

## 🎛️ PANEL DE ADMINISTRACIÓN

### Acceso:
Visita: `admin.html` directamente

### Funciones Principales:

#### 1. **Estadísticas**
- Total de usuarios registrados
- Total de inversiones
- Capital total bajo gestión
- Inversiones pendientes de activación

#### 2. **Gestión de Inversiones**
- Ver todas las inversiones
- Filtrar por estado (pendiente, activa, completada)
- **Activar inversiones pendientes** (botón ✅)
- Ver detalles completos
- Verificar hash de transacción

#### 3. **Gestión de Usuarios**
- Ver todos los usuarios
- Email y teléfono
- Número de inversiones por usuario
- Capital total invertido por usuario

#### 4. **Configuración**
- Actualizar direcciones de wallet
- Generar datos de prueba
- Limpiar base de datos

### Proceso de Activación de Inversión:

1. Usuario crea inversión y envía pago → Estado: **Pendiente**
2. Admin ve la inversión en panel de admin
3. Admin verifica el hash de transacción en blockchain
4. Admin confirma que el pago fue recibido
5. Admin hace clic en "✅ Activar"
6. Sistema automáticamente:
   - Cambia estado a **Activo**
   - Establece fecha de inicio
   - Calcula fecha de fin
   - Calcula retorno mensual
   - Establece próxima fecha de pago

---

## 💾 ALMACENAMIENTO DE DATOS

### LocalStorage (Actual - Solo para Demo):

El sistema actualmente usa `localStorage` del navegador:

```javascript
localStorage.setItem('users', JSON.stringify([...]));
localStorage.setItem('investments', JSON.stringify([...]));
localStorage.setItem('currentUser', JSON.stringify({...}));
```

**⚠️ LIMITACIONES:**
- Los datos solo existen en el navegador del usuario
- Si borras el cache, pierdes todo
- No es seguro para producción
- No hay sincronización entre dispositivos

### Migrar a Backend Real (Producción):

Para producción, debes implementar:

#### Opción 1: Firebase (Recomendado para empezar)
- Base de datos en tiempo real
- Autenticación incluida
- Hosting gratuito
- Fácil de integrar

#### Opción 2: Backend Node.js + MongoDB
- Mayor control
- Escalable
- Puedes agregar APIs propias

#### Opción 3: Supabase
- PostgreSQL
- API automática
- Auth incluido
- Plan gratuito generoso

**Ejemplo de migración a Firebase:**

```javascript
// Reemplaza localStorage.setItem con:
firebase.database().ref('users/' + userId).set(userData);

// Reemplaza localStorage.getItem con:
firebase.database().ref('users/' + userId).once('value')
  .then(snapshot => {
    const userData = snapshot.val();
  });
```

---

## 🔒 SEGURIDAD Y CONSIDERACIONES

### IMPORTANTE - Para Producción:

#### 1. **Contraseñas**
❌ Actualmente se guardan en texto plano
✅ Usa bcrypt o similar:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

#### 2. **Autenticación**
❌ Sesión en localStorage
✅ Usa JWT (JSON Web Tokens)

#### 3. **Validación de Transacciones**
❌ Usuario puede poner cualquier hash
✅ Implementa verificación en blockchain:
- API de Blockchain.com para BTC
- Etherscan API para ETH
- TronScan API para USDT (TRC20)

#### 4. **HTTPS Obligatorio**
✅ Siempre usa HTTPS
✅ Certificado SSL (Let's Encrypt gratuito)

#### 5. **Validación de Inputs**
✅ Valida todos los inputs del usuario
✅ Protege contra XSS y SQL injection

#### 6. **Rate Limiting**
✅ Limita intentos de login
✅ Previene ataques de fuerza bruta

---

## 🧪 TESTING Y DATOS DE PRUEBA

### Generar Datos de Prueba:

1. Ve a `admin.html`
2. Clic en "Configuración"
3. Clic en "🎲 Generar Datos de Prueba"

Esto crea:
- Usuario demo: `demo@ejemplo.com` / `demo123`
- 3 inversiones de prueba en diferentes estados
- Con diferentes activos y montos

### Probar el Flujo Completo:

1. **Crear usuario nuevo:**
   - Ve a `login.html`
   - Clic en "Regístrate aquí"
   - Llena el formulario
   - Automáticamente inicia sesión

2. **Hacer una inversión:**
   - Dashboard → "Nueva Inversión"
   - Selecciona "Oro y Minerales Preciosos"
   - Ingresa 0.1 BTC
   - Continúa hasta página de pago
   - Copia la dirección de wallet
   - Ingresa un hash de TX fake: `0xabcd1234567890`
   - Confirma inversión

3. **Activar inversión (como admin):**
   - Ve a `admin.html`
   - Clic en "Inversiones"
   - Encuentra la inversión pendiente
   - Clic en "✅ Activar"

4. **Ver portafolio:**
   - Ve a `portfolio.html`
   - Verás tu inversión ahora activa
   - Con retornos calculándose automáticamente

---

## 🎨 PERSONALIZACIÓN

### Cambiar Colores:

Edita `styles.css` líneas 15-30:

```css
:root {
    --primary-gold: #FFD700;  /* Cambia el dorado */
    --accent-blue: #00d4ff;   /* Cambia el azul */
    /* etc... */
}
```

### Cambiar Logo:

Edita todos los archivos HTML y reemplaza:
```html
<div class="dashboard-logo">💰 Cripto Inversiones</div>
```

Por tu logo:
```html
<div class="dashboard-logo">
    <img src="tu-logo.png" alt="Logo" style="height: 40px;">
</div>
```

### Cambiar Activos Disponibles:

Edita `app.js` líneas 10-50:

```javascript
const AVAILABLE_ASSETS = {
    tuActivo: {
        id: 'tuActivo',
        name: 'Tu Activo Personalizado',
        // ... configuración
    }
}
```

### Agregar Más Criptomonedas:

1. Edita `app.js` → `CRYPTO_CONFIG`
2. Agrega tu nueva cripto:
```javascript
DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    icon: '🐕',
    network: 'Dogecoin Network',
    currentPrice: 0.08
}
```

3. Agrega dirección de wallet en `WALLET_ADDRESSES`

---

## 📈 ACTUALIZACIÓN DE PRECIOS

### Precios Mock (Actual):

Los precios están hardcodeados en `app.js`:

```javascript
CRYPTO_CONFIG.BTC.currentPrice = 45000;
```

### Integrar API Real:

Usa CoinGecko API (gratis):

```javascript
async function updateCryptoPrices() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?' +
            'ids=bitcoin,ethereum,tether,usd-coin,binancecoin&vs_currencies=usd'
        );
        const data = await response.json();

        CRYPTO_CONFIG.BTC.currentPrice = data.bitcoin.usd;
        CRYPTO_CONFIG.ETH.currentPrice = data.ethereum.usd;
        CRYPTO_CONFIG.USDT.currentPrice = data.tether.usd;
        CRYPTO_CONFIG.USDC.currentPrice = data['usd-coin'].usd;
        CRYPTO_CONFIG.BNB.currentPrice = data.binancecoin.usd;

        console.log('Prices updated:', data);
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

// Actualizar cada 5 minutos
setInterval(updateCryptoPrices, 5 * 60 * 1000);
updateCryptoPrices(); // Primera vez
```

---

## 🚀 DEPLOYMENT (PUBLICAR)

### Paso 1: Configurar Direcciones de Wallet

**MUY IMPORTANTE:** Antes de publicar, configura tus direcciones reales:

`app.js` línea ~30

### Paso 2: Elegir Hosting

#### Opción A: Netlify (Recomendado)
1. Ve a https://www.netlify.com/
2. Arrastra tu carpeta completa
3. ¡Listo! URL automática

#### Opción B: Vercel
1. Ve a https://vercel.com/
2. Conecta con GitHub
3. Deploy automático

#### Opción C: Hosting tradicional
1. Sube todos los archivos por FTP
2. Asegúrate de subir todos los .html, .css, .js

### Paso 3: Configurar Dominio

1. Compra dominio (Namecheap, GoDaddy, etc.)
2. Apunta los DNS a tu hosting
3. Espera propagación (24-48 horas)

### Paso 4: Configurar HTTPS

- Netlify/Vercel → Automático
- Hosting tradicional → Let's Encrypt (gratis)

---

## 📞 SOPORTE Y NOTIFICACIONES

### Actualizar Información de Contacto:

Edita en **todos** los archivos HTML:

```html
<!-- WhatsApp -->
<a href="https://wa.me/58TUNUMERO">

<!-- Telegram -->
<a href="https://t.me/TUUSUARIO">

<!-- Email -->
<a href="mailto:TU@EMAIL.COM">
```

### Agregar Notificaciones por Email:

Usa un servicio como:
- **SendGrid** (gratis 100 emails/día)
- **Mailgun** (gratis 5,000/mes)
- **Amazon SES**

Ejemplo con SendGrid:

```javascript
async function sendInvestmentNotification(userEmail, investmentData) {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer TU_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            personalizations: [{
                to: [{ email: userEmail }]
            }],
            from: { email: 'noreply@tudominio.com' },
            subject: 'Inversión Confirmada',
            content: [{
                type: 'text/plain',
                value: `Tu inversión de ${investmentData.amount} ha sido confirmada.`
            }]
        })
    });
}
```

---

## 🔧 TROUBLESHOOTING

### Problema: "No se guarda la información"
**Solución:** Verifica que el navegador permite localStorage. En modo incógnito puede estar deshabilitado.

### Problema: "El QR no se genera"
**Solución:** Verifica que la librería qrcode.js se carga correctamente. Revisa la consola del navegador (F12).

### Problema: "Los retornos no se calculan"
**Solución:** Asegúrate de que la inversión está en estado "active". Solo las inversiones activas generan retornos.

### Problema: "No puedo acceder al admin"
**Solución:** `admin.html` no tiene protección actualmente. Accede directamente a la URL. Para producción, agrega autenticación de admin.

### Problema: "Los precios no se actualizan"
**Solución:** Los precios son mock. Implementa la API de CoinGecko (ver sección "Actualización de Precios").

---

## 📋 CHECKLIST PRE-LANZAMIENTO

Antes de lanzar tu plataforma, verifica:

- [ ] Direcciones de wallet configuradas (app.js)
- [ ] Información de contacto actualizada (todos los HTML)
- [ ] Backend real implementado (NO usar localStorage)
- [ ] Contraseñas hasheadas (bcrypt)
- [ ] Verificación de transacciones blockchain
- [ ] HTTPS configurado
- [ ] Términos y condiciones actualizados
- [ ] Política de privacidad
- [ ] Sistema de KYC/AML (si aplica)
- [ ] Consulta legal sobre regulaciones
- [ ] Precios de cripto actualizados con API real
- [ ] Sistema de notificaciones por email
- [ ] Backup de base de datos
- [ ] Testing exhaustivo en móvil y desktop
- [ ] Analytics instalado (Google Analytics, etc.)

---

## 💡 MEJORAS FUTURAS RECOMENDADAS

### Corto Plazo (1-2 semanas):
- [ ] Migrar a Firebase o backend real
- [ ] Implementar verificación de transacciones
- [ ] Agregar 2FA (autenticación de dos factores)
- [ ] Sistema de notificaciones por email
- [ ] Gráficos de rendimiento (Chart.js)

### Mediano Plazo (1-2 meses):
- [ ] KYC automatizado (Onfido, Jumio)
- [ ] Retiros automáticos en cripto
- [ ] App móvil (React Native)
- [ ] Chat de soporte (Intercom, Crisp)
- [ ] Referidos y afiliados

### Largo Plazo (3-6 meses):
- [ ] Trading en tiempo real
- [ ] Staking de criptomonedas
- [ ] Integración con exchanges (Binance, Coinbase)
- [ ] Tokens propios (tokenomics)
- [ ] DAO para gobernanza

---

## 📚 RECURSOS ADICIONALES

### APIs Útiles:
- **CoinGecko:** https://www.coingecko.com/en/api
- **Blockchain.com API:** https://www.blockchain.com/api
- **Etherscan API:** https://etherscan.io/apis
- **TronScan API:** https://tronscan.org/

### Librerías Recomendadas:
- **Chart.js:** Gráficos hermosos
- **Moment.js:** Manejo de fechas
- **Web3.js:** Interactuar con Ethereum
- **Bitcoin-core:** Cliente Bitcoin

### Servicios de Email:
- **SendGrid:** https://sendgrid.com/
- **Mailgun:** https://www.mailgun.com/
- **Amazon SES:** https://aws.amazon.com/ses/

### Backend as a Service:
- **Firebase:** https://firebase.google.com/
- **Supabase:** https://supabase.com/
- **Appwrite:** https://appwrite.io/

---

## 🎓 SOPORTE

### Debugging:

Abre la consola del navegador (F12) para ver:
- Errores de JavaScript
- Estado de localStorage
- Logs del sistema

### Ver datos almacenados:

En la consola:
```javascript
// Ver usuarios
JSON.parse(localStorage.getItem('users'))

// Ver inversiones
JSON.parse(localStorage.getItem('investments'))

// Ver usuario actual
JSON.parse(localStorage.getItem('currentUser'))
```

### Limpiar datos:

```javascript
localStorage.clear()
```

---

## ⚠️ DISCLAIMER LEGAL

Este sistema es una plataforma técnica. Tú eres responsable de:

- Cumplir con leyes locales de valores y financieras
- Obtener licencias necesarias
- Implementar KYC/AML según tu jurisdicción
- Asesoría legal especializada
- Manejo responsable de fondos de clientes
- Seguridad de criptomonedas
- Transparencia en riesgos
- Protección de datos (GDPR, etc.)

---

## 📞 CONTACTO

Para preguntas técnicas sobre el código:
- Revisa esta documentación
- Revisa el código (está comentado)
- Usa la consola del navegador para debug

---

**¡Tu sistema de inversiones está listo para funcionar! 🚀**

Personalízalo, agrégale tu toque y lánzalo al mundo.

*Última actualización: Enero 2026*