document.addEventListener('DOMContentLoaded', () => {

    // --- HERO ANIMATION CONTROLLER ---
    class HeroAnimationController {
        constructor() {
            this.animatedElements = document.querySelectorAll('.hero-animate');
            this.heroSection = document.querySelector('.hero');
            this.hasAnimated = false;
            this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            this.init();
        }
        
        init() {
            if (this.prefersReducedMotion || !("IntersectionObserver" in window)) {
                this.triggerAnimations(true);
                return;
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.triggerAnimations();
                        this.hasAnimated = true;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(this.heroSection);
        }
        
        triggerAnimations(immediate = false) {
            this.animatedElements.forEach(element => {
                const animationType = element.dataset.animation;
                const delay = immediate ? 0 : parseInt(element.dataset.delay, 10) || 0;
                
                setTimeout(() => {
                    const animationClass = `animate-${this.camelToKebab(animationType)}`;
                    element.classList.add(animationClass);
                }, delay);
            });
        }
        
        camelToKebab(str) {
            return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        }
    }

    // --- VIDEO BACKGROUND CONTROLLER ---
    class VideoBackgroundController {
        constructor() {
            this.video = document.querySelector('.hero-video');
            this.image = document.querySelector('.hero-bg');
            this.isMobile = window.innerWidth <= 768;
            this.dataSaver = navigator.connection?.saveData;

            this.init();
        }

        init() {
            if (this.isMobile || this.dataSaver || !this.video) {
                this.useImageBackground();
                return;
            }

            this.setupVideo();
        }

        setupVideo() {
            this.video.addEventListener('loadeddata', () => {
                this.video.style.display = 'block';
                this.image.style.display = 'none';
            });

            this.video.addEventListener('error', (e) => {
                console.warn('Video could not be loaded, falling back to image.', e);
                this.useImageBackground();
            });

            // Set source to start loading
            if (this.video.currentSrc === '') {
                this.video.load();
            }
        }
        
        useImageBackground() {
            this.video.style.display = 'none';
            this.image.style.display = 'block';
        }
    }

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- HEADER SCROLL EFFECT ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- INITIALIZE CONTROLLERS ---
    // --- MOBILE MENU TOGGLE ---
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // --- CTA FORM SUBMISSION ---
    document.querySelector('.cta-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const messageContainer = document.getElementById('form-message');

        // Basic email validation
        if (emailInput.value && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(emailInput.value)) {
            messageContainer.textContent = 'Thank you for signing up!';
            messageContainer.className = 'form-message success';
            this.reset();
        } else {
            messageContainer.textContent = 'Please enter a valid email address.';
            messageContainer.className = 'form-message error';
        }

        setTimeout(() => {
            messageContainer.className = 'form-message';
            messageContainer.textContent = '';
        }, 5000);
    });

    // --- INITIALIZE CONTROLLERS ---
    new HeroAnimationController();
    new VideoBackgroundController();
});