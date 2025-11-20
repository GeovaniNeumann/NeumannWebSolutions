// ================================
// INICIALIZAÇÃO GERAL
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeScrollEffects();
    initializeCardAnimations();
    initializeHeaderScroll();
    initializeNavigation();
    initializeParallax();
    initializeLazyLoading();
    initializeButtonGlow();
    initializeScrollReveal();
});

// ================================
// MENU HAMBURGUER MOBILE
// ================================

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Abrir/fechar menu
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar no overlay
    mobileOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fechar menu ao redimensionar a tela para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ================================
// EFEITOS DE SCROLL
// ================================

function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observar todos os cards de serviço
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Observar seções
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observar elementos de contato
    document.querySelectorAll('.contact-card').forEach(card => {
        observer.observe(card);
    });

    // Observar elementos de features
    document.querySelectorAll('.feature-item').forEach(item => {
        observer.observe(item);
    });
}

// ================================
// ANIMAÇÕES NOS CARDS
// ================================

function initializeCardAnimations() {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach((card, index) => {
        // Adicionar efeito de hover com movimento do mouse
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            }
        });

        // Resetar transformação ao sair do card
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            }
        });

        // Adicionar ripple effect ao clicar
        card.addEventListener('click', function(e) {
            createRipple(e, card);
        });
    });

    // Animação de ripple
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Remover ripple anterior se existir
        const existingRipple = element.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        element.appendChild(ripple);

        // Remover ripple após animação
        setTimeout(() => ripple.remove(), 600);
    }
}

// ================================
// EFEITO DO HEADER AO SCROLL
// ================================

function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Adicionar/remover classe ao scrollar
        if (scrollTop > 50) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 5px 30px rgba(20, 197, 228, 0.1)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.7)';
            header.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// ================================
// NAVEGAÇÃO SUAVE
// ================================

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calcular a posição considerando o header fixo
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                // Scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Adicionar classe ativa ao link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Atualizar link ativo ao scrollar
    window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - headerHeight - 50) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ================================
// PARALLAX EFFECT
// ================================

function initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', function() {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = element.offsetTop;
            const distance = scrollPosition - elementOffset;
            const yPos = distance * 0.5;

            element.style.backgroundPosition = `center ${yPos}px`;
        });
    });
}

// ================================
// LAZY LOADING DE IMAGENS
// ================================

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ================================
// EFEITO DE GLOW NOS BOTÕES
// ================================

function initializeButtonGlow() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            button.style.setProperty('--x', x + 'px');
            button.style.setProperty('--y', y + 'px');
        });
    });
}

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================

function initializeScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const reveal = () => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal();
}

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveLink();
            ticking = false;
        });
        ticking = true;
    }
});

// ================================
// NOTIFICAÇÕES
// ================================

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ================================
// BOTÃO VOLTAR AO TOPO
// ================================

function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Mostrar/ocultar botão baseado no scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll suave ao topo
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// INICIALIZAÇÃO GERAL
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeScrollEffects();
    initializeCardAnimations();
    initializeHeaderScroll();
    initializeNavigation();
    initializeParallax();
    initializeLazyLoading();
    initializeButtonGlow();
    initializeScrollReveal();
    initializeBackToTop(); // ← ADICIONE ESTA LINHA
});

// ================================
// ADICIONAR ESTILOS CSS DINÂMICOS
// ================================

const style = document.createElement('style');
style.textContent = `
    .service-card {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .nav-link.active::after {
        width: 100%;
    }

    .in-view {
        animation: fadeInUp 0.8s ease-out forwards;
    }
`;
document.head.appendChild(style);