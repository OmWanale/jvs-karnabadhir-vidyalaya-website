/* ========== JVS KARNABADHIR VIDYALAYA - MAIN SCRIPT ========== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========== HERO IMAGE SLIDER ==========
    const heroSlider = (() => {
        const slides = document.querySelectorAll('#heroSlider .slide');
        const dots = document.querySelectorAll('#sliderDots .dot');
        let current = 0;
        let interval;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function next() { goTo(current + 1); }

        function startAuto() {
            interval = setInterval(next, 5000);
        }

        function resetAuto() {
            clearInterval(interval);
            startAuto();
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.dataset.slide, 10));
                resetAuto();
            });
        });

        if (slides.length > 1) startAuto();

        return { goTo, next };
    })();


    // ========== MOBILE NAVIGATION TOGGLE ==========
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });


    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero, .stats-section');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        const scrollY = window.scrollY;

        // Sticky navbar
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Active nav highlighting
        let currentSection = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (scrollY >= top) {
                currentSection = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
        });

        // Back to top visibility
        backToTopBtn.classList.toggle('visible', scrollY > 400);
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    // ========== BACK TO TOP ==========
    const backToTopBtn = document.getElementById('backToTop');

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ========== STAT COUNTER ANIMATION ==========
    const statNumbers = document.querySelectorAll('.stats-card-number[data-target]');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const start = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            }

            requestAnimationFrame(step);
        });
    }

    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);


    // ========== SCROLL REVEAL (AOS) ==========
    const aosObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                aosObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));


    // ========== GALLERY FILTER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const scrollContainer = document.getElementById('galleryScrollContainer');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            galleryItems.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.classList.remove('gallery-hidden');
                    item.classList.add('gallery-visible');
                } else {
                    item.classList.remove('gallery-visible');
                    item.classList.add('gallery-hidden');
                }
            });

            if (scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });


    // ========== LIGHTBOX ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const visibleItems = () => [...galleryItems].filter(i => !i.classList.contains('gallery-hidden'));
    let lightboxIndex = 0;

    function openLightbox(index) {
        const items = visibleItems();
        if (index < 0 || index >= items.length) return;
        lightboxIndex = index;
        const item = items[index];
        const img = item.querySelector('img');
        const overlayH4 = item.querySelector('.gallery-overlay h4');
        const overlayP = item.querySelector('.gallery-overlay p');
        const captionText = (overlayH4 ? overlayH4.textContent : '') +
            (overlayP ? ' — ' + overlayP.textContent : '');
        lightboxImg.src = img.src.replace(/w=400&h=300/, 'w=1200&h=900');
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxNav();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    function lightboxNav(dir) {
        const items = visibleItems();
        const newIndex = lightboxIndex + dir;
        if (newIndex >= 0 && newIndex < items.length) {
            openLightbox(newIndex);
        }
    }

    function updateLightboxNav() {
        const items = visibleItems();
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        if (prevBtn) prevBtn.style.display = lightboxIndex > 0 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = lightboxIndex < items.length - 1 ? 'flex' : 'none';
    }

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => {
            const items = visibleItems();
            openLightbox(items.indexOf(item));
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); lightboxNav(-1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); lightboxNav(1); });

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'ArrowRight') lightboxNav(1);
    });

    // Touch/swipe support for lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) lightboxNav(1);
            else lightboxNav(-1);
        }
    }, { passive: true });


    // ========== CONTACT FORM WITH TOAST POPUP ==========
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toastPopup');

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = contactForm.querySelector('[name="name"]').value.trim();
        const email = contactForm.querySelector('[name="email"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            alert('कृपया आपले नाव प्रविष्ट करा.\nPlease enter your name.');
            contactForm.querySelector('[name="name"]').focus();
            return;
        }

        if (!email || !emailRegex.test(email)) {
            alert('कृपया वैध ईमेल प्रविष्ट करा.\nPlease enter a valid email.');
            contactForm.querySelector('[name="email"]').focus();
            return;
        }

        if (!message) {
            alert('कृपया आपला संदेश लिहा.\nPlease enter your message.');
            contactForm.querySelector('[name="message"]').focus();
            return;
        }

        // Submit to Netlify via fetch (no redirect)
        const formData = new FormData(contactForm);
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            contactForm.reset();
            showToast();
        })
        .catch(() => {
            alert('काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.\nSomething went wrong. Please try again.');
        });
    });


    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Initial scroll check
    onScroll();
});
