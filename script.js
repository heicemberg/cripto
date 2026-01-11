// ===================================
// Smooth Scroll for Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// FAQ Accordion
// ===================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// ===================================
// Form Handling & Validation
// ===================================
const leadForm = document.getElementById('leadForm');

if (leadForm) {
    leadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            investment: document.getElementById('investment').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        if (!validateEmail(formData.email)) {
            showNotification('Por favor ingresa un email válido', 'error');
            return;
        }

        if (!document.getElementById('terms').checked) {
            showNotification('Debes aceptar el disclaimer de riesgos para continuar', 'error');
            return;
        }

        // Disable submit button
        const submitButton = leadForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            // IMPORTANTE: Aquí debes configurar tu endpoint
            // Opciones recomendadas:
            // 1. Formspree: https://formspree.io/
            // 2. Google Sheets + Apps Script
            // 3. Tu propio backend
            // 4. EmailJS: https://www.emailjs.com/

            // Ejemplo con Formspree (reemplaza YOUR_FORM_ID):
            // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(formData)
            // });

            // Por ahora, simulamos el envío
            await simulateFormSubmission(formData);

            // Success
            showNotification('¡Consulta enviada! Te contactaremos en las próximas 24 horas.', 'success');
            leadForm.reset();

            // Opcional: Redireccionar a página de gracias
            // setTimeout(() => {
            //     window.location.href = '/gracias.html';
            // }, 2000);

        } catch (error) {
            console.error('Error:', error);
            showNotification('Hubo un error al enviar el formulario. Por favor intenta nuevamente o contáctanos directamente.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// ===================================
// Helper Functions
// ===================================

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simulate form submission (remove this when you have a real endpoint)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Form Data:', data);

        // Store in localStorage for testing
        const submissions = JSON.parse(localStorage.getItem('leadSubmissions') || '[]');
        submissions.push(data);
        localStorage.setItem('leadSubmissions', JSON.stringify(submissions));

        setTimeout(resolve, 1500);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4444' : '#FFD700'};
        color: ${type === 'success' || type === 'error' ? '#0a0a0a' : '#0a0a0a'};
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.asset-card, .difference-card, .process-step, .testimonial-card, .urgency-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// Floating CTA Hide on Scroll to Contact
// ===================================
const floatingCta = document.querySelector('.floating-cta');
const contactSection = document.getElementById('contact');

if (floatingCta && contactSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                floatingCta.style.opacity = '0';
                floatingCta.style.pointerEvents = 'none';
            } else {
                floatingCta.style.opacity = '1';
                floatingCta.style.pointerEvents = 'auto';
            }
        });
    }, { threshold: 0.2 });

    ctaObserver.observe(contactSection);
}

// ===================================
// Add CSS for Notifications Animation
// ===================================
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

// ===================================
// Console Message
// ===================================
console.log('%c💰 Inversiones Cripto Venezuela', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%cIMPORTANTE: Para conectar el formulario a tu sistema:', 'color: #ff4444; font-size: 14px; font-weight: bold;');
console.log('%c1. Configura el endpoint en script.js (línea ~80)', 'color: #00d4ff; font-size: 12px;');
console.log('%c2. Opciones recomendadas: Formspree, EmailJS, Google Sheets, o tu backend', 'color: #00d4ff; font-size: 12px;');
console.log('%c3. Las submisiones de prueba se guardan en localStorage', 'color: #00d4ff; font-size: 12px;');
console.log('%cPara ver submisiones de prueba: localStorage.getItem("leadSubmissions")', 'color: #FFD700; font-size: 12px;');

// ===================================
// Analytics Placeholder
// ===================================
// Aquí puedes agregar tu código de analytics
// Ejemplo: Google Analytics, Facebook Pixel, etc.

// Google Analytics (reemplaza GA_MEASUREMENT_ID)
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
*/

// Facebook Pixel (reemplaza PIXEL_ID)
/*
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');
*/

// Track form submission
function trackFormSubmission() {
    // Google Analytics Event
    // gtag('event', 'form_submission', {
    //     'event_category': 'engagement',
    //     'event_label': 'lead_form'
    // });

    // Facebook Pixel Event
    // fbq('track', 'Lead');

    console.log('Form submission tracked');
}

// ===================================
// Performance Optimizations
// ===================================

// Lazy load images (si agregas imágenes más adelante)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// Debug Helper (remove in production)
// ===================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%c🔧 Debug Mode Active', 'color: #00ff88; font-size: 14px; font-weight: bold;');

    // Add debug panel
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            const submissions = localStorage.getItem('leadSubmissions');
            if (submissions) {
                console.table(JSON.parse(submissions));
            } else {
                console.log('No submissions yet');
            }
        }
    });

    console.log('Tip: Press Ctrl+Shift+D to view all form submissions');
}