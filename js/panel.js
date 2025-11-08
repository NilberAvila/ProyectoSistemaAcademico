'use strict';

function loadView(viewPath) {
    const mainContent = document.getElementById('main-content');
    
    console.log(`📄 Cargando vista: ${viewPath}`);
    
    // Paso 1: Limpiar y eliminar scripts de la vista anterior
    removeViewScripts(); 
    
    // Paso 2: Obtener y cargar el contenido HTML
    fetch(viewPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} para ${viewPath}`);
            }
            return response.text();
        })
        .then(html => {
            // Inyectar el HTML en el contenedor principal
            mainContent.innerHTML = html;
            console.log(`✅ HTML cargado para: ${viewPath}`);
            
            // Paso 3: Esperar un momento antes de cargar el script
            setTimeout(() => {
                loadViewScript(viewPath);
            }, 50);
        })
        .catch(error => {
            console.error("❌ Error al cargar la vista:", error);
            mainContent.innerHTML = `<p class="alert alert-danger">No se pudo cargar la vista: ${viewPath}</p>`;
        });
}

/**
 * Elimina todos los scripts cargados dinámicamente de vistas previas.
 */
function removeViewScripts() {
    const scripts = document.querySelectorAll('script[data-view-script="true"]');
    console.log(`🗑️ Eliminando ${scripts.length} scripts de vistas anteriores`);
    scripts.forEach(script => {
        script.remove();
    });
}

/**
 * Carga el script JavaScript específico según la vista
 */
function loadViewScript(viewPath) {
    let scriptName = '';
    
    console.log(`🔍 Analizando ruta para script: ${viewPath}`);
    
    // Normalizar la ruta para comparación
    const normalizedPath = viewPath.toLowerCase();
    
    // Mapeo de vistas a sus scripts correspondientes
    if (normalizedPath.includes('mis-cursos')) {
        scriptName = '/js/es-mis-cursos.js'; 
    } else if (normalizedPath.includes('mensajeria')) {
        scriptName = '/js/mensajeria.js';
    } else if (normalizedPath.includes('detalle') && normalizedPath.includes('curso')) {
        // Para cualquier vista de detalle de curso (docente o estudiante)
        scriptName = '/js/detalle-cursos-docente.js';
    } else if (normalizedPath.includes('principal')) {
        scriptName = '/js/principal.js';
    } else if (normalizedPath.includes('cursos-aula')) {
        // Si tienes un script específico para la lista de cursos
        // scriptName = '/js/cursos-aula.js';
        console.log('ℹ️ Vista de cursos-aula (sin script específico)');
    }
    
    if (scriptName) {
        console.log(`📦 Intentando cargar script: ${scriptName}`);
        
        const script = document.createElement('script');
        script.src = scriptName;
        script.dataset.viewScript = 'true';
        script.async = false;
        
        script.onload = () => {
            console.log(`✅ Script cargado exitosamente: ${scriptName}`);
        };
        
        script.onerror = () => {
            console.error(`❌ Error 404: No se encontró el archivo ${scriptName}`);
            console.error(`   Verifica que el archivo exista en la ruta correcta`);
        };
        
        document.body.appendChild(script);
    } else {
        console.log(`ℹ️ No hay script específico configurado para: ${viewPath}`);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log('🚀 Panel.js inicializado');
    
    const navLinks = document.querySelectorAll('.sidebar .nav-link');

    navLinks.forEach(function(link) {
        // Lógica de carga inicial para el enlace 'active'
        if (link.classList.contains('active')) {
            const defaultView = link.getAttribute('data-view');
            if (defaultView) {
                console.log(`🏠 Cargando vista inicial: ${defaultView}`);
                loadView(defaultView);
            }
        }
        
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remover clase active de todos los enlaces
            navLinks.forEach(function(nav) {
                nav.classList.remove('active');
            });
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');

            // Cargar la nueva vista
            const viewToLoad = this.getAttribute('data-view');
            if (viewToLoad) {
                loadView(viewToLoad); 
            }
        });
    });
});