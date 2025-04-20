// Función de contacto WhatsApp
function contacto() {
    window.open('https://wa.me/+5216183274838?text=Hola,%20me%20gustaría%20contactarlos', '_blank');
}

// Configuración de carruseles
function setupCarousel(carouselId, prevBtnId, nextBtnId, autoScrollDelay = 8000) {
    const carousel = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    
    if (!carousel || !prevBtn || !nextBtn) {
        console.warn(`Elementos del carrusel ${carouselId} no encontrados`);
        return;
    }

    const cards = carousel.querySelectorAll('.card');
    if (cards.length === 0) {
        console.warn(`No se encontraron cards en el carrusel ${carouselId}`);
        return;
    }

    let currentIndex = 0;
    let scrollInterval;
    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight);

    const moveCarousel = (index) => {
        currentIndex = index;
        carousel.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % cards.length;
        moveCarousel(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        moveCarousel(currentIndex);
    };

    const startAutoScroll = () => {
        scrollInterval = setInterval(nextSlide, autoScrollDelay);
    };

    const resetAutoScroll = () => {
        clearInterval(scrollInterval);
        startAutoScroll();
    };

    // Event listeners mejorados
    const handleInteraction = () => {
        clearInterval(scrollInterval);
        setTimeout(startAutoScroll, autoScrollDelay * 2);
    };

    nextBtn.addEventListener('click', () => {
        nextSlide();
        handleInteraction();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        handleInteraction();
    });

    // Manejo de eventos táctiles y hover
    carousel.addEventListener('mouseenter', () => clearInterval(scrollInterval));
    carousel.addEventListener('mouseleave', startAutoScroll);
    carousel.addEventListener('touchstart', () => clearInterval(scrollInterval), { passive: true });
    carousel.addEventListener('touchend', () => setTimeout(startAutoScroll, autoScrollDelay), { passive: true });

    // Iniciar y manejar resize
    startAutoScroll();
    const handleResize = () => moveCarousel(currentIndex);
    window.addEventListener('resize', handleResize);

    // Limpieza opcional si necesitas destruir el carrusel
    return () => {
        clearInterval(scrollInterval);
        window.removeEventListener('resize', handleResize);
    };
}

// Configuración de galería de imágenes
function setupGallerySlider(containerSelector = '.gallery-slider') {
    const slider = document.querySelector(containerSelector);
    if (!slider) {
        console.warn(`Slider ${containerSelector} no encontrado`);
        return;
    }

    const slides = slider.querySelectorAll('.gallery-slide');
    if (slides.length === 0) {
        console.warn('No se encontraron slides en la galería');
        return;
    }

    const prevBtn = slider.querySelector('.gallery-prev');
    const nextBtn = slider.querySelector('.gallery-next');
    const dotsContainer = slider.querySelector('.gallery-dots');
    
    let currentSlide = 0;
    let slideInterval;

    // Crear puntos indicadores si existe el contenedor
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.gallery-dot') : [];

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    const goToSlide = (index) => {
        showSlide(index);
        resetInterval();
    };

    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 8000);
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    // Event listeners mejorados
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // Interacción con el slider
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', startInterval);

    // Iniciar
    showSlide(currentSlide);
    startInterval();

    // Limpieza opcional
    return () => {
        clearInterval(slideInterval);
    };
}

// Animaciones al hacer scroll
function setupScrollAnimations() {
    const sections = document.querySelectorAll('section, .map-container, .prices, .gallery-section, .buttons');
    if (sections.length === 0) return;

    const handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        sections.forEach(section => observer.observe(section));
    } else {
        // Fallback para navegadores antiguos
        const checkScroll = () => {
            const triggerPoint = window.innerHeight * 0.85;
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop < triggerPoint) {
                    section.classList.add('visible');
                }
            });
        };

        window.addEventListener('load', checkScroll);
        window.addEventListener('scroll', checkScroll);
    }
}

// Configuración de FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const pregunta = item.querySelector('.faq-pregunta');
        if (!pregunta) return;

        const toggle = pregunta.querySelector('.faq-toggle');
        
        pregunta.addEventListener('click', () => {
            // Cierra otras preguntas abiertas
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    if (otherToggle) otherToggle.textContent = '+';
                }
            });

            // Abre/cierra la pregunta clickeada
            item.classList.toggle('active');
            if (toggle) toggle.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });
}

document.querySelectorAll('.faq-item').forEach(item => {
  const pregunta = item.querySelector('.faq-pregunta');
  pregunta.addEventListener('click', () => {
    item.classList.toggle('active');
    const toggle = pregunta.querySelector('.faq-toggle');
    toggle.textContent = item.classList.contains('active') ? '−' : '+';
  });
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar componentes
    setupCarousel('carousel', 'prev-btn', 'next-btn');
    setupGallerySlider();
    setupScrollAnimations();
    setupFAQ();

    // Efecto del logo (opcional)
    const logo = document.querySelector('header img');
    if (logo) {
        logo.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1.08)';
            }, 300);
        });
    }
});