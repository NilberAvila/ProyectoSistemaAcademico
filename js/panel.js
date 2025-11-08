'use strict';

function loadView(viewPath) {
    const mainContent = document.getElementById('main-content');
    
    // Paso 1: Limpiar y eliminar scripts de la vista anterior
    removeViewScripts(); 
    // Paso 2: Obtener y cargar el contenido HTML
    fetch(viewPath)
        .then(response => {
            if (!response.ok) {
                // Si la ruta es incorrecta (404), lanzamos un error
                throw new Error(`HTTP error! status: ${response.status} para ${viewPath}`);
            }
            return response.text();
        })
        .then(html => {
            // Inyectar el HTML en el contenedor principal
            mainContent.innerHTML = html;
            // Paso 3: Cargar el script específico de esta vista
            loadViewScript(viewPath);
        })
        .catch(error => {
            console.error("Error al cargar la vista:", error);
            mainContent.innerHTML = `<p class="alert alert-danger">No se pudo cargar la vista: ${viewPath}</p>`;
        });
}

/**
 * Elimina todos los scripts cargados dinámicamente de vistas previas.
 */
function removeViewScripts() {
    document.querySelectorAll('script[data-view-script="true"]').forEach(script => {
        script.remove();
    });
}

function loadViewScript(viewPath) {
    let scriptName = '';
    if (viewPath.endsWith('Mis-Cursos.html')) {
        scriptName = '/js/es-mis-cursos.js'; 
    } else if (viewPath.endsWith('Mensajeria.html')) {
        scriptName = '/js/mensajeria.js'; // Ejemplo: crea este archivo si lo necesitas
    }
    if (scriptName) {
        const script = document.createElement('script');
        script.src = scriptName;
        script.dataset.viewScript = 'true'; // Etiqueta para limpieza futura
        script.async = true; // Permite que el script se cargue sin bloquear
        
        script.onload = () => console.log(`✅ Script de vista cargado y ejecutado: ${scriptName}`);
        document.body.appendChild(script);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');

    navLinks.forEach(function(link) {
        // Lógica de carga inicial para el enlace 'active'
        if (link.classList.contains('active')) {
             const defaultView = link.getAttribute('data-view');
             if (defaultView) {
                 loadView(defaultView);
             }
        }
        link.addEventListener('click', function(event) {
            event.preventDefault();
            navLinks.forEach(function(nav) {
                nav.classList.remove('active');
            });
            this.classList.add('active');

            // Cargar la nueva vista
            const viewToLoad = this.getAttribute('data-view');
            if (viewToLoad) {
                loadView(viewToLoad); 
            }
        });
    });
});