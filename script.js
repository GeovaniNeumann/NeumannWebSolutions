
        
        // INICIALIZAÇÃO GERAL 
        
        let initialized = false;
        function initializeAll() {
            if (initialized) return;
            initialized = true;
            console.log('Inicializando aplicação...');
           
            initializeMobileMenu();
            initializeSmoothScroll();
            initializeScrollSpy();
            initializeHeaderScroll();
            initializeScrollReveal();
            initializeBackToTop();
            initializeLazyLoading();
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAll);
        } else {
            initializeAll();
        }
        
        
        // MENU HAMBURGUER SIMPLIFICADO
        
        function initializeMobileMenu() {
            const menuToggle = document.getElementById('menuToggle');
            const nav = document.getElementById('nav');
            const mobileOverlay = document.getElementById('mobileOverlay');
            const navLinks = document.querySelectorAll('.nav-link');
            
            if (!menuToggle || !nav || !mobileOverlay) {
                console.warn('Elementos do menu mobile não encontrados');
                return;
            }
            
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
        
        
        // SCROLL SMOOTH E SPY
        
        function initializeSmoothScroll() {
            const anchors = document.querySelectorAll('a[href^="#"]');
           
            anchors.forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    if (this.classList.contains('btn') && this.getAttribute('href') === '#contato') {
                        // Deixa o JS executar o scroll se for um link interno para seção
                    } else if (this.classList.contains('btn') && this.getAttribute('href').startsWith('http')) {
                        return; // Deixa o comportamento padrão para links externos
                    }
                    e.preventDefault();
                   
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const headerHeight = document.getElementById('header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight + 1;
                       
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
        
        // EFEITO DO HEADER AO SCROLL

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
        
        // SCROLL REVEAL ANIMATIONS (IO API)

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
        
        // BOTÃO VOLTAR AO TOPO

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
        
        // LAZY LOADING PARA IMAGENS

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
                // Fallback para navegadores antigos
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                });
            }
        }
