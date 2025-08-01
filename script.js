// Configuração global
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    debounceDelay: 100
};

// Utilitários
const utils = {
    // Debounce function para otimizar performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Smooth scroll para links internos
    smoothScroll(target, offset = CONFIG.scrollOffset) {
        const element = document.querySelector(target);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Intersection Observer para animações
    createObserver(callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    },

    // Formatação de números
    formatNumber(num) {
        return new Intl.NumberFormat('pt-BR').format(num);
    },

    // Validação de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// Gerenciamento do Header
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        this.handleScroll();
        window.addEventListener('scroll', utils.debounce(() => this.handleScroll(), CONFIG.debounceDelay));
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Adiciona/remove classe baseada no scroll
        if (currentScrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Hide/show header baseado na direção do scroll
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScrollY = currentScrollY;
    }
}

// Gerenciamento da Navegação
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.highlightActiveSection();
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    utils.smoothScroll(href);
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                // Implementar menu mobile
                console.log('Mobile menu clicked');
            });
        }
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = utils.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveLink(id);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    updateActiveLink(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
}

// Gerenciamento de Animações
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupProgressBars();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
        
        const observer = utils.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const observer = utils.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = utils.formatNumber(Math.floor(current));
        }, 16);
    }

    setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = utils.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        });

        progressBars.forEach(bar => observer.observe(bar));
    }
}

// Gerenciamento de Preços
class PricingManager {
    constructor() {
        this.toggle = document.getElementById('pricing-toggle');
        this.monthlyAmounts = document.querySelectorAll('.amount.monthly');
        this.yearlyAmounts = document.querySelectorAll('.amount.yearly');
        this.init();
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('change', () => this.togglePricing());
        }
    }

    togglePricing() {
        const isYearly = this.toggle.checked;
        
        this.monthlyAmounts.forEach(amount => {
            amount.style.display = isYearly ? 'none' : 'inline';
        });
        
        this.yearlyAmounts.forEach(amount => {
            amount.style.display = isYearly ? 'inline' : 'none';
        });
    }
}

// Gerenciamento de FAQ
class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleFAQ(item));
        });
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Fecha todos os outros itens
        this.faqItems.forEach(faqItem => {
            if (faqItem !== item) {
                faqItem.classList.remove('active');
            }
        });
        
        // Toggle do item atual
        item.classList.toggle('active', !isActive);
    }
}

// Gerenciamento de Formulários
class FormManager {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Validação básica
        if (!this.validateForm(form)) {
            return;
        }
        
        // Simular envio
        this.showLoading(form);
        
        setTimeout(() => {
            this.showSuccess(form);
        }, 2000);
    }

    validateForm(form) {
        const emailInputs = form.querySelectorAll('input[type="email"]');
        let isValid = true;
        
        emailInputs.forEach(input => {
            if (!utils.isValidEmail(input.value)) {
                this.showError(input, 'Por favor, insira um email válido');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });
        
        return isValid;
    }

    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Enviando...';
        }
    }

    showSuccess(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Enviado!';
            submitBtn.style.background = 'var(--accent)';
        }
        
        // Reset após 3 segundos
        setTimeout(() => {
            form.reset();
            if (submitBtn) {
                submitBtn.textContent = 'Começar Grátis';
                submitBtn.style.background = '';
            }
        }, 3000);
    }

    showError(input, message) {
        input.style.borderColor = '#ef4444';
        
        // Remove erro anterior se existir
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Adiciona nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--spacing-xs)';
        
        input.parentNode.appendChild(errorDiv);
    }

    clearError(input) {
        input.style.borderColor = '';
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

// Gerenciamento de Performance
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = utils.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload de fontes críticas
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// Gerenciamento de Analytics (simulado)
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEventTracking();
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            timestamp: new Date().toISOString()
        });
    }

    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.events.push(event);
        console.log('Analytics Event:', event);
        
        // Aqui você enviaria para seu serviço de analytics
        // this.sendToAnalytics(event);
    }

    setupEventTracking() {
        // Track button clicks
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackEvent('button_click', {
                    button_text: btn.textContent.trim(),
                    button_class: btn.className
                });
            });
        });

        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.trackEvent('form_submit', {
                    form_id: form.id || 'unknown'
                });
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', utils.debounce(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', { percent: maxScroll });
                }
            }
        }, 1000));
    }
}

// Inicialização da aplicação
class App {
    constructor() {
        this.managers = {};
        this.init();
    }

    init() {
        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
        } else {
            this.initializeManagers();
        }
    }

    initializeManagers() {
        try {
            this.managers.header = new HeaderManager();
            this.managers.navigation = new NavigationManager();
            this.managers.animation = new AnimationManager();
            this.managers.pricing = new PricingManager();
            this.managers.faq = new FAQManager();
            this.managers.form = new FormManager();
            this.managers.performance = new PerformanceManager();
            this.managers.analytics = new AnalyticsManager();
            
            console.log('NeuralForge App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    // Método público para acessar managers
    getManager(name) {
        return this.managers[name];
    }
}

// Inicializar aplicação
const app = new App();

// Expor globalmente para debug
window.NeuralForgeApp = app;

// Service Worker registration (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Tratamento de erros globais
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Aqui você poderia enviar erros para um serviço de monitoramento
});

// Tratamento de promessas rejeitadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});