// Función de Ejecución Inmediata (IIFE): Se ejecuta en cuanto el script es cargado.
(function() {
    'use strict';
    
    // Variables locales para el script de Mis Cursos
    const cards = document.querySelectorAll('.dashboard-card');
    const detallePath = '/pages/Estudiantes/detalles-curso.html'; 

    if (cards.length > 0) {
        cards.forEach((card) => {
            // Asignar estilos y efectos
            card.style.cursor = 'pointer';
            card.style.transition = 'all 0.3s ease';
            
            // Asignar el evento de clic
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (typeof loadView === 'function') {
                    loadView(detallePath);
                } else {
                    console.error('Error: La función loadView no está disponible.');
                }
            });
        });
        console.log("Manejadores de eventos de Mis Cursos asignados.");
    } else {
        // Esta advertencia aparecerá si este script se carga en una vista sin tarjetas
        console.warn("es-mis-cursos.js se ejecutó, pero no encontró tarjetas de curso. Verificar el selector '.dashboard-card'.");
    }
})(); // Ejecutamos la función inmediatamente