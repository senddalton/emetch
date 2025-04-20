function contacto() {
    window.open('https://wa.me/+5216183274838?text=Hola,%20me%20gustaría%20contactarlos', '_blank');
}

// Función para manejar carruseles de manera genérica
function setupCarousel(carouselId, prevBtnId, nextBtnId, autoScrollDelay = 8000) {
    const carousel = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const cards = carousel.querySelectorAll('.card');
    let currentIndex = 0;
    let scrollInterval;

    if (!carousel || !prevBtn || !nextBtn || cards.length === 0) return;

    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight);

    function moveCarousel(index) {
        currentIndex = index;
        carousel.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        moveCarousel(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        moveCarousel(currentIndex);
    }

    function startAutoScroll() {
        scrollInterval = setInterval(nextSlide, autoScrollDelay);
    }

    function resetAutoScroll() {
        clearInterval(scrollInterval);
        startAutoScroll();
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoScroll();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoScroll();
    });

    // Interacción con el carrusel
    const pauseAutoScroll = () => clearInterval(scrollInterval);
    const resumeAutoScroll = () => setTimeout(startAutoScroll, autoScrollDelay);

    carousel.addEventListener('mouseenter', pauseAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    carousel.addEventListener('touchstart', pauseAutoScroll);
    carousel.addEventListener('touchend', resumeAutoScroll);

    // Iniciar
    startAutoScroll();
    window.addEventListener('resize', () => moveCarousel(currentIndex));
}

// Función para manejar sliders de galería
function setupGallerySlider() {
    const slider = document.querySelector('.gallery-slider');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const dotsContainer = document.querySelector('.gallery-dots');
    let currentSlide = 0;
    let slideInterval;

    if (!slider || slides.length === 0) return;

    // Crear puntos indicadores
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.gallery-dot');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        showSlide(index);
        resetInterval();
    }

    function startInterval() {
        slideInterval = setInterval(nextSlide, 8000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // Interacción con el slider
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', startInterval);

    // Iniciar
    showSlide(currentSlide);
    startInterval();
}

// Animaciones al hacer scroll
function setupScrollAnimations() {
    const sections = document.querySelectorAll('section, .map-container, .prices, .gallery-section, .buttons');

    if (sections.length === 0) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // observer.unobserve(entry.target); // Opcional
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        sections.forEach(section => observer.observe(section));
    } else {
        // Fallback para navegadores antiguos
        function checkScroll() {
            const triggerPoint = window.innerHeight * 0.85;

            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop < triggerPoint) {
                    section.classList.add('visible');
                }
            });
        }

        window.addEventListener('load', checkScroll);
        window.addEventListener('scroll', checkScroll);
    }
}

document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const pregunta = item.querySelector('.faq-pregunta');
    const toggle = item.querySelector('.faq-toggle');

    pregunta.addEventListener('click', () => {
      // Cierra otras preguntas abiertas
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      // Abre/cierra la pregunta clickeada
      item.classList.toggle('active');
      toggle.textContent = item.classList.contains('active') ? '−' : '+';
    });
  });
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupCarousel('carousel', 'prev-btn', 'next-btn');
    setupGallerySlider();
    setupScrollAnimations();

    // Efecto del logo (si lo necesitas)
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