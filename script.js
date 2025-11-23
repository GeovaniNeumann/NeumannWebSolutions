// ================================
// INICIALIZAÇÃO GERAL
// ================================
let initialized = false;

function initializeAll() {
    if (initialized) return;
    initialized = true;
    console.log('Inicializando aplicação...');
   
    // Prevenir scroll horizontal imediatamente
    preventHorizontalScroll();
    
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeScrollSpy();
    initializeHeaderScroll();
    initializeScrollReveal();
    initializeBackToTop();
    initializeLazyLoading();
    initializeContactForm();
    
    // Verificação final de overflow
    setTimeout(checkAndFixOverflow, 2000);
}

// Verificar se o DOM está carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

// ================================
// CORREÇÃO AGESSIVA PARA SCROLL HORIZONTAL
// ================================
function preventHorizontalScroll() {
    // Método mais agressivo para prevenir scroll horizontal
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
    document.documentElement.style.maxWidth = '100vw';
    
    // Adicionar estilo CSS via JavaScript para garantir
    const antiScrollStyle = document.createElement('style');
    antiScrollStyle.textContent = `
        * {
            max-width: 100vw !important;
        }
        html, body {
            overflow-x: hidden !important;
            width: 100% !important;
            position: relative !important;
        }
        body {
            max-width: 100vw !important;
        }
    `;
    document.head.appendChild(antiScrollStyle);
}

function checkAndFixOverflow() {
    const checkOverflow = () => {
        const bodyWidth = document.body.scrollWidth;
        const viewportWidth = window.innerWidth;
        const overflow = bodyWidth - viewportWidth;
        
        if (overflow > 0) {
            console.log(`Overflow detectado: ${overflow}px - Aplicando correções...`);
            
            // Métodos progressivos para eliminar overflow
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.right > viewportWidth) {
                    el.style.maxWidth = '100%';
                    el.style.boxSizing = 'border-box';
                }
            });
            
            // Forçar redimensionamento
            document.body.style.width = '100vw';
            document.documentElement.style.width = '100vw';
        } else {
            console.log('Sem overflow detectado ✓');
        }
    };
    
    // Verificar múltiplas vezes
    checkOverflow();
    setTimeout(checkOverflow, 500);
    setTimeout(checkOverflow, 1000);
    
    // Verificar em redimensionamento
    window.addEventListener('resize', checkOverflow);
}

// ================================
// MENU HAMBURGUER
// ================================
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !nav || !mobileOverlay) return;
    
    const toggleMenu = () => {
        const isActive = nav.classList.contains('active');
       
        if (isActive) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            menuToggle.classList.add('active');
            nav.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

// ================================
// SCROLL SMOOTH E SPY
// ================================
function initializeSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
   
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('http')) return;
            
            e.preventDefault();
           
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
               
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-nav-target]');
    const headerHeight = document.getElementById('header').offsetHeight;
   
    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
           
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// ================================
// EFEITO DO HEADER AO SCROLL
// ================================
function initializeHeaderScroll() {
    const header = document.getElementById('header');
   
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================
function initializeScrollReveal() {
    const reveals = document.querySelectorAll('[class*="reveal-"]');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
               
                if (element.classList.contains('reveal-fade-up')) {
                    element.classList.add('animate-fade-up');
                } else if (element.classList.contains('reveal-slide-left')) {
                    element.classList.add('animate-slide-left');
                } else if (element.classList.contains('reveal-slide-right')) {
                    element.classList.add('animate-slide-right');
                }
               
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}

// ================================
// BOTÃO VOLTAR AO TOPO
// ================================
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
   
    const handleBackToTopScroll = () => {
        if (window.scrollY > 400) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
   
    window.addEventListener('scroll', handleBackToTopScroll);
   
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
   
    handleBackToTopScroll();
}

// ================================
// LAZY LOADING PARA IMAGENS
// ================================
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ================================
// FORMULÁRIO DE CONTATO
// ================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const mensagem = document.getElementById('mensagem').value;
            
            if (!nome || !email || !mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const numeroWhatsApp = '5541997552818';
            let textoMensagem = `Olá! Gostaria de solicitar um orçamento.\n\n`;
            textoMensagem += `*Nome:* ${nome}\n`;
            textoMensagem += `*E-mail:* ${email}\n`;
            if (telefone) textoMensagem += `*Telefone:* ${telefone}\n`;
            textoMensagem += `*Mensagem:* ${mensagem}\n\n`;
            textoMensagem += `Aguardo seu retorno!`;
            
            const mensagemCodificada = encodeURIComponent(textoMensagem);
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecionando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                window.open(urlWhatsApp, '_blank');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

console.log('JavaScript inicializado com sucesso!');