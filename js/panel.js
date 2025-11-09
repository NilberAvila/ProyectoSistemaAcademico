'use strict';

function loadView(viewPath) {
    const mainContent = document.getElementById('main-content');
    
    console.log(`📄 Cargando vista: ${viewPath}`);
    
    fetch(viewPath)
        .then(response => {
            if (!response.ok) {
                // Si la ruta es incorrecta (404), lanzamos un error
                throw new Error(`HTTP error! status: ${response.status} para ${viewPath}`);
            }
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            console.log(`✅ HTML cargado para: ${viewPath}`);
            
            // Cargar el script correspondiente
            loadViewScript(viewPath);
        })
        .catch(error => {
            console.error("❌ Error al cargar la vista:", error);
            mainContent.innerHTML = `<p class="alert alert-danger">No se pudo cargar la vista: ${viewPath}</p>`;
        });
}

function removeViewScripts() {
    const oldScripts = document.querySelectorAll('script[data-view-script]');
    oldScripts.forEach(script => script.remove());
    console.log(`🗑️ Scripts anteriores eliminados: ${oldScripts.length}`);
}

function loadViewScript(viewPath) {
    removeViewScripts();

    const scriptMap = {
        '/pages/Coordinador/Principal.html': '/js/principal-coordinador.js',
        '/pages/Coordinador/gestion-cursos.html': '/js/gestion-cursos.js',
        '/pages/Coordinador/gestion-grupos.html': '/js/gestion-grupos.js',
        '/pages/Coordinador/gestion-estudiantes.html': '/js/gestion-estudiantes.js',
        '/pages/Coordinador/horarios.html': '/js/horarios.js',
        '/pages/Docentes/principal.html': '/js/principal.js',
        '/pages/Docentes/cursos-aula.html': '/js/principal.js',
        '/pages/Docentes/detalles-curso.html': '/js/detalle-cursos-docente.js',
        '/pages/Docentes/Mensajeria.html': '/js/mensajeria.js',
        '/pages/Estudiantes/principal.html': '/js/principal.js',
        '/pages/Estudiantes/Mensajeria.html': '/js/mensajeria.js',
        '/pages/Estudiantes/detalles-curso.html': '/js/detalle-curso.js'
    };

    const scriptPath = scriptMap[viewPath];
    
    if (scriptPath) {
        console.log(`📜 Cargando script: ${scriptPath}`);
        const script = document.createElement('script');
        script.src = scriptPath;
        script.dataset.viewScript = 'true';
        script.onload = () => console.log(`✅ Script cargado: ${scriptPath}`);
        script.onerror = () => console.error(`❌ Error al cargar script: ${scriptPath}`);
        document.body.appendChild(script);
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