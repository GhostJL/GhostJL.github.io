document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navOverlay = document.getElementById('nav-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    function openMenu() {
        navMenu.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Cerrar menú');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Abrir menú');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        isOpen ? closeMenu() : openMenu();
    });

    mobileMenuClose.addEventListener('click', closeMenu);
    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Dark Mode Logic
    const themeToggle = document.getElementById('theme-toggle');
    const iconSun = themeToggle.querySelector('.icon-sun');
    const iconMoon = themeToggle.querySelector('.icon-moon');

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';

        if (currentTheme === 'light' || !currentTheme) {
            newTheme = 'dark';
            iconSun.style.display = 'none';
            iconMoon.style.display = 'block';
        } else {
            newTheme = 'light';
            iconSun.style.display = 'block';
            iconMoon.style.display = 'none';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in');
    animatedElements.forEach(el => observer.observe(el));

    // Decrypt obfuscated information to protect against scrapers/spiders
    // Decodes path only when clicked/hovered/focused for download buttons
    document.querySelectorAll('.secure-link').forEach(el => {
        const encoded = el.getAttribute('data-secure-path');
        if (encoded) {
            const decryptPath = () => {
                const decoded = atob(encoded);
                if (el.getAttribute('href') !== decoded) {
                    el.setAttribute('href', decoded);
                }
            };
            el.addEventListener('pointerenter', decryptPath, { once: true });
            el.addEventListener('focus', decryptPath, { once: true });
            el.addEventListener('click', decryptPath);
        }
    });

    // Decodes email address and turns it into a clickable link
    document.querySelectorAll('.secure-email').forEach(el => {
        const encoded = el.getAttribute('data-secure-email');
        if (encoded) {
            const email = atob(encoded);
            el.innerHTML = '';
            const link = document.createElement('a');
            link.href = 'mailto:' + email;
            link.textContent = email;
            link.style.color = 'inherit';
            link.style.textDecoration = 'none';
            link.addEventListener('mouseenter', () => link.style.textDecoration = 'underline');
            link.addEventListener('mouseleave', () => link.style.textDecoration = 'none');
            el.appendChild(link);
        }
    });

    // Decodes phone number and turns it into a clickable link
    document.querySelectorAll('.secure-phone').forEach(el => {
        const encoded = el.getAttribute('data-secure-phone');
        if (encoded) {
            const phone = atob(encoded);
            el.innerHTML = '';
            const link = document.createElement('a');
            link.href = 'tel:' + phone.replace(/\s+/g, '');
            link.textContent = phone;
            link.style.color = 'inherit';
            link.style.textDecoration = 'none';
            link.addEventListener('mouseenter', () => link.style.textDecoration = 'underline');
            link.addEventListener('mouseleave', () => link.style.textDecoration = 'none');
            el.appendChild(link);
        }
    });

    // --- Gallery Lightbox Logic ---
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImg = document.getElementById('gallery-image');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryCounter = document.getElementById('gallery-counter');
    const galleryDotsContainer = document.getElementById('gallery-dots');
    const closeBtn = document.querySelector('.gallery-close');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const overlay = document.querySelector('.gallery-overlay');

    let currentImages = [];
    let currentIndex = 0;
    let currentProjectTitle = "";

    function openGallery(images, index, title) {
        currentImages = images;
        currentIndex = index;
        currentProjectTitle = title;
        updateGalleryImage();
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        galleryModal.setAttribute('aria-hidden', 'false');
    }

    function closeGallery() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
        galleryModal.setAttribute('aria-hidden', 'true');
    }

    function updateGalleryImage() {
        if (currentImages.length === 0) return;
        
        galleryImg.style.opacity = 0;
        setTimeout(() => {
            galleryImg.src = currentImages[currentIndex];
            galleryImg.style.opacity = 1;
        }, 150);

        galleryTitle.textContent = currentProjectTitle;
        galleryCounter.textContent = `${currentIndex + 1} de ${currentImages.length}`;

        if (currentImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            galleryDotsContainer.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            galleryDotsContainer.style.display = 'flex';
            updateDots();
        }
    }

    function updateDots() {
        galleryDotsContainer.innerHTML = '';
        currentImages.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateGalleryImage();
            });
            galleryDotsContainer.appendChild(dot);
        });
    }

    function nextImage() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateGalleryImage();
    }

    function prevImage() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateGalleryImage();
    }

    // Attach click events to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        const imageContainer = card.querySelector('.project-image-container');
        if (!imageContainer) return;

        imageContainer.addEventListener('click', (e) => {
            const galleryData = card.getAttribute('data-gallery');
            const title = card.getAttribute('data-title') || 'Proyecto';
            
            if (galleryData) {
                const images = galleryData.split(',').map(img => img.trim());
                openGallery(images, 0, title);
            }
        });
    });

    closeBtn.addEventListener('click', closeGallery);
    overlay.addEventListener('click', closeGallery);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeGallery();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    });

    // Touch Swipe support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    galleryModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            nextImage();
        }
        if (touchEndX > touchStartX + threshold) {
            prevImage();
        }
    }
});
