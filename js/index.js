document.addEventListener('DOMContentLoaded', () => {
    // ===========================
    // SLIDER PARA NIVELES
    // ===========================
    const contenedor = document.querySelector('.niveles-contenedor');
    const scrollContainer = document.querySelector('.scroll-container');
    const flechaIzq = document.querySelector('.flecha.izquierda');
    const flechaDer = document.querySelector('.flecha.derecha');

    const cards = scrollContainer.querySelectorAll('.nivel-card');
    const gap = parseInt(window.getComputedStyle(scrollContainer).gap) || 20;
    const cardWidth = cards[0].offsetWidth + gap;

    let scrollPos = 0;

    // función para activar animación de las cards visibles
    function activarVisible() {
        const contenedorLeft = contenedor.scrollLeft;
        const contenedorRight = contenedorLeft + contenedor.clientWidth;

        cards.forEach(card => {
            const cardLeft = card.offsetLeft;
            const cardRight = cardLeft + card.offsetWidth;
            if (cardRight > contenedorLeft && cardLeft < contenedorRight) {
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
            }
        });
    }

    // activamos animación al inicio
    activarVisible();

    flechaDer.addEventListener('click', () => {
        scrollPos += cardWidth;
        const maxScroll = scrollContainer.scrollWidth - contenedor.clientWidth;
        if (scrollPos > maxScroll) scrollPos = maxScroll;
        contenedor.scrollTo({ left: scrollPos, behavior: 'smooth' });

        setTimeout(activarVisible, 300);
    });

    flechaIzq.addEventListener('click', () => {
        scrollPos -= cardWidth;
        if (scrollPos < 0) scrollPos = 0;
        contenedor.scrollTo({ left: scrollPos, behavior: 'smooth' });

        setTimeout(activarVisible, 300);
    });

    // ===========================
    // SLIDER PARA EQUIPO DE TRABAJO
    // ===========================
    const scrollContainerEquipo = document.querySelector('.scroll-container-equipo');
    const flechaIzqEquipo = document.querySelector('.flecha-equipo.izquierda');
    const flechaDerEquipo = document.querySelector('.flecha-equipo.derecha');

    const cardsEquipo = scrollContainerEquipo.querySelectorAll('.equipo-card');
    const gapEquipo = parseInt(window.getComputedStyle(scrollContainerEquipo).gap) || 30;
    const cardWidthEquipo = cardsEquipo[0].offsetWidth + gapEquipo;

    let scrollPosEquipo = 0;

    // función para activar animación de las cards visibles del equipo
    function activarVisibleEquipo() {
        const contenedorLeft = scrollContainerEquipo.scrollLeft;
        const contenedorRight = contenedorLeft + scrollContainerEquipo.clientWidth;

        cardsEquipo.forEach(card => {
            const cardLeft = card.offsetLeft;
            const cardRight = cardLeft + card.offsetWidth;
            if (cardRight > contenedorLeft && cardLeft < contenedorRight) {
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
            }
        });
    }

    // activamos animación al inicio
    activarVisibleEquipo();

    flechaDerEquipo.addEventListener('click', () => {
        scrollPosEquipo += cardWidthEquipo;
        const maxScroll = scrollContainerEquipo.scrollWidth - scrollContainerEquipo.clientWidth;
        if (scrollPosEquipo > maxScroll) scrollPosEquipo = maxScroll;
        scrollContainerEquipo.scrollTo({ left: scrollPosEquipo, behavior: 'smooth' });

        setTimeout(activarVisibleEquipo, 300);
    });

    flechaIzqEquipo.addEventListener('click', () => {
        scrollPosEquipo -= cardWidthEquipo;
        if (scrollPosEquipo < 0) scrollPosEquipo = 0;
        scrollContainerEquipo.scrollTo({ left: scrollPosEquipo, behavior: 'smooth' });

        setTimeout(activarVisibleEquipo, 300);
    });

    // ===========================
    // BOTÓN VER MÁS / VER MENOS PARA TESTIMONIOS
    // ===========================
    const botonVerMas = document.getElementById('ver-mas-btn');
    const testimoniosOcultos = document.querySelectorAll('.testimonio-card.oculto');

    let ocultosMostrados = false;

    botonVerMas.addEventListener('click', () => {
        if (!ocultosMostrados) {
            testimoniosOcultos.forEach(card => card.style.display = 'flex');
            botonVerMas.textContent = 'Ver menos';
            ocultosMostrados = true;
        } else {
            testimoniosOcultos.forEach(card => card.style.display = 'none');
            botonVerMas.textContent = 'Ver más';
            ocultosMostrados = false;
        }
    });

    // ===========================
    // NAVEGACIÓN CON ENLACES ACTIVOS
    // ===========================
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Agregar evento click a cada enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');
        });
    });

    // Detectar scroll para resaltar sección visible
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id], main[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Ajustamos el offset para tener en cuenta el navbar
            if (window.pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});