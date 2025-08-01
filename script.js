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

// Demo Functionality
class DemoManager {
    constructor() {
        this.currentDemo = 'text-analysis';
        this.init();
    }

    init() {
        this.setupDemoTabs();
        this.setupDemoContent();
    }

    setupDemoTabs() {
        const demoTabs = document.querySelectorAll('.demo-tab');
        demoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const demoType = tab.getAttribute('data-demo');
                this.switchDemo(demoType);
            });
        });
    }

    switchDemo(demoType) {
        // Update tabs
        document.querySelectorAll('.demo-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-demo="${demoType}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.demo-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(demoType).classList.add('active');

        this.currentDemo = demoType;
    }

    setupDemoContent() {
        // Pre-fill some example content
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.value = 'Nossa empresa teve um crescimento excepcional este trimestre, com vendas aumentando 45% e satisfação do cliente atingindo 98%. A equipe está motivada e os novos produtos foram muito bem recebidos pelo mercado.';
        }
    }
}

// Demo Functions (Global scope for onclick handlers)
function analyzeText() {
    const textInput = document.getElementById('text-input');
    const resultsContainer = document.getElementById('analysis-results');
    const analyzeBtn = document.querySelector('#text-analysis .demo-analyze-btn');
    
    if (!textInput.value.trim()) {
        alert('Por favor, insira algum texto para análise.');
        return;
    }

    // Show loading state
    showLoading(analyzeBtn);
    resultsContainer.innerHTML = '<div class="typing-indicator">Analisando texto com IA</div>';

    // Simulate API call
    setTimeout(() => {
        const results = generateTextAnalysis(textInput.value);
        displayTextResults(results, resultsContainer);
        hideLoading(analyzeBtn);
    }, 2000);
}

function analyzeData() {
    const resultsContainer = document.getElementById('insights-results');
    const analyzeBtn = document.querySelector('#data-insights .demo-analyze-btn');
    
    // Show loading state
    showLoading(analyzeBtn);
    resultsContainer.innerHTML = '<div class="typing-indicator">Gerando insights dos dados</div>';

    // Simulate API call
    setTimeout(() => {
        const insights = generateDataInsights();
        displayDataResults(insights, resultsContainer);
        hideLoading(analyzeBtn);
    }, 2500);
}

function generateContent() {
    const promptInput = document.getElementById('content-prompt');
    const resultsContainer = document.getElementById('content-results');
    const analyzeBtn = document.querySelector('#content-generation .demo-analyze-btn');
    
    if (!promptInput.value.trim()) {
        alert('Por favor, descreva o tipo de conteúdo que você quer gerar.');
        return;
    }

    // Show loading state
    showLoading(analyzeBtn);
    resultsContainer.innerHTML = '<div class="typing-indicator">Gerando conteúdo personalizado</div>';

    // Simulate API call
    setTimeout(() => {
        const content = generateAIContent(promptInput.value);
        displayContentResults(content, resultsContainer);
        hideLoading(analyzeBtn);
    }, 3000);
}

function setPrompt(prompt) {
    const promptInput = document.getElementById('content-prompt');
    promptInput.value = prompt;
    promptInput.focus();
}

function showLoading(button) {
    button.classList.add('loading');
    const spinner = button.querySelector('.fa-spin');
    const text = button.querySelector('span');
    
    if (spinner) spinner.style.display = 'inline-block';
    if (text) text.textContent = 'Processando...';
    
    button.disabled = true;
}

function hideLoading(button) {
    button.classList.remove('loading');
    const spinner = button.querySelector('.fa-spin');
    const text = button.querySelector('span');
    
    if (spinner) spinner.style.display = 'none';
    if (text) {
        const originalTexts = {
            'text-analysis': 'Analisar com IA',
            'data-insights': 'Gerar Insights',
            'content-generation': 'Gerar Conteúdo'
        };
        
        // Find which demo this button belongs to
        const demoContent = button.closest('.demo-content');
        const demoId = demoContent ? demoContent.id : 'text-analysis';
        text.textContent = originalTexts[demoId] || 'Analisar';
    }
    
    button.disabled = false;
}

function generateTextAnalysis(text) {
    // Simulate AI analysis
    const wordCount = text.split(' ').length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.length > 0).length;
    const avgWordsPerSentence = Math.round(wordCount / sentenceCount);
    
    // Simple sentiment analysis simulation
    const positiveWords = ['crescimento', 'excepcional', 'aumentando', 'satisfação', 'motivada', 'bem', 'sucesso'];
    const negativeWords = ['problema', 'queda', 'ruim', 'dificuldade', 'prejuízo', 'falha'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        if (text.toLowerCase().includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (text.toLowerCase().includes(word)) negativeCount++;
    });
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    return {
        sentiment,
        wordCount,
        sentenceCount,
        avgWordsPerSentence,
        readabilityScore: Math.floor(Math.random() * 30) + 70,
        keyTopics: ['Crescimento', 'Vendas', 'Satisfação do Cliente', 'Equipe'],
        confidence: Math.floor(Math.random() * 20) + 80
    };
}

function generateDataInsights() {
    return {
        trends: [
            {
                title: 'Crescimento Consistente',
                description: 'Vendas cresceram 24.8% no período analisado, indicando tendência positiva sustentável.',
                impact: 'Alto',
                confidence: 94
            },
            {
                title: 'Melhoria na Satisfação',
                description: 'Satisfação do cliente aumentou 11.9%, correlacionando com o crescimento de vendas.',
                impact: 'Médio',
                confidence: 87
            }
        ],
        predictions: [
            {
                metric: 'Vendas Abril',
                value: 'R$ 168.000',
                confidence: 91
            },
            {
                metric: 'Novos Clientes',
                value: '680',
                confidence: 85
            }
        ],
        recommendations: [
            'Investir em marketing para sustentar o crescimento',
            'Expandir equipe de atendimento ao cliente',
            'Desenvolver programa de fidelidade'
        ]
    };
}

function generateAIContent(prompt) {
    // Simulate different types of content based on prompt
    const contentTemplates = {
        email: {
            subject: 'Novidades Incríveis Chegando!',
            body: `Prezado(a) Cliente,

Esperamos que esteja bem! Temos o prazer de anunciar o lançamento do nosso mais novo produto, desenvolvido especialmente pensando em suas necessidades.

🚀 **Principais benefícios:**
• Interface intuitiva e moderna
• Performance 3x mais rápida
• Integração com suas ferramentas favoritas
• Suporte 24/7 especializado

Estamos oferecendo 30% de desconto para os primeiros 100 clientes. 

Não perca esta oportunidade única!

Atenciosamente,
Equipe NeuralForge`
        },
        product: {
            title: 'FitAI - Seu Personal Trainer Inteligente',
            description: `Revolucione seus treinos com inteligência artificial! O FitAI é o aplicativo que se adapta ao seu ritmo, criando planos personalizados que evoluem com você.

✨ **Recursos Principais:**
• Planos de treino adaptativos baseados em IA
• Análise em tempo real da sua performance
• Nutrição personalizada com IA
• Comunidade motivacional integrada
• Acompanhamento de progresso inteligente

Transforme seu corpo e mente com a tecnologia mais avançada do mercado. Baixe agora e comece sua jornada fitness inteligente!`
        },
        linkedin: {
            post: `🤖 A Revolução da IA está apenas começando!

Nos últimos meses, temos visto avanços extraordinários em inteligência artificial que estão redefinindo como trabalhamos, criamos e inovamos.

💡 **Principais tendências que estou observando:**

🔹 IA Generativa democratizando a criação de conteúdo
🔹 Automação inteligente transformando processos empresariais  
🔹 Personalização em massa se tornando realidade
🔹 Ética em IA ganhando importância estratégica

A questão não é mais "se" a IA vai impactar seu negócio, mas "quando" e "como" você vai se adaptar.

🚀 **Minha dica:** Comece pequeno, experimente, aprenda e escale. A IA não substitui a criatividade humana - ela a amplifica!

O que vocês acham? Como a IA está transformando seu setor?

#InteligenciaArtificial #Inovacao #Tecnologia #Futuro`
        }
    };

    // Determine content type based on prompt
    let contentType = 'product';
    if (prompt.toLowerCase().includes('email')) contentType = 'email';
    else if (prompt.toLowerCase().includes('linkedin') || prompt.toLowerCase().includes('post')) contentType = 'linkedin';

    return contentTemplates[contentType];
}

function displayTextResults(results, container) {
    const sentimentClass = `sentiment-${results.sentiment}`;
    const sentimentText = {
        positive: 'Positivo 😊',
        negative: 'Negativo 😔',
        neutral: 'Neutro 😐'
    };

    container.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <i class="fas fa-heart"></i>
                Análise de Sentimento
            </div>
            <div class="result-content">
                <span class="${sentimentClass}">
                    <strong>${sentimentText[results.sentiment]}</strong>
                </span>
                <p>Confiança: ${results.confidence}%</p>
            </div>
        </div>
        
        <div class="result-card">
            <div class="result-header">
                <i class="fas fa-chart-bar"></i>
                Estatísticas do Texto
            </div>
            <div class="metrics-grid">
                <div class="metric-card">
                    <span class="metric-value">${results.wordCount}</span>
                    <span class="metric-label">Palavras</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${results.sentenceCount}</span>
                    <span class="metric-label">Frases</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${results.avgWordsPerSentence}</span>
                    <span class="metric-label">Palavras/Frase</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${results.readabilityScore}</span>
                    <span class="metric-label">Legibilidade</span>
                </div>
            </div>
        </div>
        
        <div class="result-card">
            <div class="result-header">
                <i class="fas fa-tags"></i>
                Tópicos Identificados
            </div>
            <div class="result-content">
                ${results.keyTopics.map(topic => `<span style="background: var(--primary); color: white; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px;">${topic}</span>`).join('')}
            </div>
        </div>
    `;
}

function displayDataResults(insights, container) {
    container.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <i class="fas fa-trending-up"></i>
                Tendências Identificadas
            </div>
            <div class="result-content">
                ${insights.trends.map(trend => `
                    <div style="margin-bottom: 16px; padding: 12px; background: var(--surface); border-radius: 8px;">
                        <strong>${trend.title}</strong>
                        <p style="margin: 8px 0; color: var(--text-secondary);">${trend.description}</p>
                        <div style="display: flex; gap: 16px; font-size: 12px;">
                            <span>Impacto: <strong>${trend.impact}</strong></span>
                            <span>Confiança: <strong>${trend.confidence}%</strong></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="result-card">
            <div class="result-header">
                <i class="fas fa-crystal-ball"></i>
                Previsões para Próximo Mês
            </div>
            <div class="metrics-grid">
                ${insights.predictions.map(pred => `
                    <div class="metric-card">
                        <span class="metric-value">${pred.value}</span>
                        <span class="metric-label">${pred.metric}</span>
                        <div style="font-size: 10px; color: var(--text-secondary); margin-top: 4px;">
                            ${pred.confidence}% confiança
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="result-card">
            <div class="result-header">
                <i class="fas fa-lightbulb"></i>
                Recomendações Estratégicas
            </div>
            <div class="result-content">
                <ul style="margin: 0; padding-left: 20px;">
                    ${insights.recommendations.map(rec => `<li style="margin-bottom: 8px; color: var(--text-secondary);">${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function displayContentResults(content, container) {
    if (content.subject) {
        // Email format
        container.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <i class="fas fa-envelope"></i>
                    Email Gerado
                </div>
                <div class="result-content">
                    <div style="margin-bottom: 16px;">
                        <strong>Assunto:</strong> ${content.subject}
                    </div>
                    <div style="white-space: pre-line; line-height: 1.6;">
                        ${content.body}
                    </div>
                </div>
            </div>
        `;
    } else if (content.title) {
        // Product description format
        container.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <i class="fas fa-mobile-alt"></i>
                    Descrição de Produto
                </div>
                <div class="result-content">
                    <h4 style="color: var(--primary); margin-bottom: 16px;">${content.title}</h4>
                    <div style="white-space: pre-line; line-height: 1.6;">
                        ${content.description}
                    </div>
                </div>
            </div>
        `;
    } else {
        // LinkedIn post format
        container.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <i class="fab fa-linkedin"></i>
                    Post para LinkedIn
                </div>
                <div class="result-content">
                    <div style="white-space: pre-line; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                        ${content.post}
                    </div>
                </div>
            </div>
        `;
    }
}

function scrollToSection(selector) {
    utils.smoothScroll(selector);
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
            this.managers.demo = new DemoManager();
            
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