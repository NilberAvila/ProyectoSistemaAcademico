// /js/detalle-curso.js
// Función de Ejecución Inmediata (IIFE)
(function() {
    'use strict';
    
    // 1. Variables locales para la gestión de pestañas
    const tabButtons = document.querySelectorAll('.tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');

    console.log("✅ Script de detalle-curso.js iniciado.");

    // 2. Definir la función para manejar el cambio de pestaña (visibilidad y estado 'active')
    function activateTab(targetId) {
        // Desactivar todos los botones y ocultar todos los contenidos
        tabButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });

        tabContents.forEach(content => {
            content.setAttribute('hidden', '');
        });

        // Activar el botón seleccionado
        const activeTabButton = document.querySelector(`.tabs .tab[data-target="${targetId}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
            activeTabButton.setAttribute('aria-selected', 'true');
        }

        // Mostrar el contenido correspondiente
        const activeTabContent = document.querySelector(`.tab-content[data-tab="${targetId}"]`);
        if (activeTabContent) {
            activeTabContent.removeAttribute('hidden');
        }
    }

    // 3. Asignar el evento 'click' a cada botón de pestaña
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                activateTab(targetId);
            });
        });

        console.log("Manejadores de eventos de pestañas (Materiales/Evaluaciones) asignados.");
        
        // 4. Inicializar la vista asegurando que la pestaña activa sea visible
        const initialActiveTab = document.querySelector('.tabs .tab.active');
        if (initialActiveTab) {
             const targetId = initialActiveTab.getAttribute('data-target');
             // Usamos un pequeño timeout para asegurar que el DOM se haya renderizado 
             // completamente tras el innerHTML de loadView, aunque no suele ser estrictamente necesario.
             setTimeout(() => activateTab(targetId), 0); 
        }
    } else {
         console.warn("detalle-curso.js se ejecutó, pero no encontró botones de pestaña. Verificar el selector '.tabs .tab'.");
    }

})(); // Ejecutamos la función inmediatamente