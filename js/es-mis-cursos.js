// Función de Ejecución Inmediata (IIFE): Se ejecuta en cuanto el script es cargado.
(function() {
    'use strict';

    // Determina la ruta de detalles según el contexto (Docentes / Estudiantes)
    const getDetallePath = () => {
        const p = window.location.pathname || '';
        if (p.includes('/Docentes/')) return '/pages/Docentes/detalles-curso.html';
        if (p.includes('/Estudiantes/')) return '/pages/Estudiantes/detalles-curso.html';
        return '/pages/Estudiantes/detalles-curso.html';
    };

    // Aplicar estilo SOLO a las tarjetas de cursos dentro de #cursos-list
    const styleCards = (root = document) => {
        root.querySelectorAll('#cursos-list .dashboard-card').forEach(card => {
            card.classList.add('curso-clickable');
        });
    };

    // Estilado inicial
    styleCards();

    // Observar inserciones de tarjetas si se cargan dinámicamente (p. ej. loadView)
    const observeRoot = document.getElementById('main-content') || document.body;
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (node.matches && node.matches('.dashboard-card')) {
                    styleCards(node);
                } else if (node.querySelector && node.querySelector('.dashboard-card')) {
                    styleCards(node);
                }
            }
        }
    });

    observer.observe(observeRoot, { childList: true, subtree: true });

    document.addEventListener('click', function(e) {
        // Si se clickeó un control interactivo, no navegamos
        if (e.target.closest('button, a, input, textarea, select, .btn-action, .btn-subir-material, .btn-icon-action, .btn-link')) {
            return;
        }

        const card = e.target.closest('.dashboard-card');
        if (!card) return;

        // Sólo activar navegación si la tarjeta está dentro del listado de cursos
        if (!card.closest('#cursos-list')) return;

        e.preventDefault();
        const detallePath = getDetallePath();

        if (typeof loadView === 'function') {
            loadView(detallePath);
        } else {
            console.error('es-mis-cursos.js: la función loadView no está disponible.');
        }
    }, false);

})();
