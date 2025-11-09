(function() {
    'use strict';

    console.log('📚 [CURSOS] Script cargado');

    const cursosData = [
        {
            id: 1,
            codigo: 'DW-001',
            nombre: 'Desarrollo Web',
            descripcion: 'Curso introductorio al desarrollo web con HTML, CSS y JavaScript',
            categoria: 'Desarrollo Web',
            creado: '31/8/2025',
            estado: 'activo'
        },
        {
            id: 2,
            codigo: 'FIS-005',
            nombre: 'Física',
            descripcion: 'Fundamentos de física clásica y moderna',
            categoria: 'Ciencias Exactas',
            creado: '31/8/2025',
            estado: 'activo'
        },
        {
            id: 3,
            codigo: 'BD-002',
            nombre: 'Base de Datos',
            descripcion: 'Diseño e implementación de bases de datos relacionales',
            categoria: 'Desarrollo Web',
            creado: '15/8/2025',
            estado: 'activo'
        },
        {
            id: 4,
            codigo: 'RED-003',
            nombre: 'Redes I',
            descripcion: 'Fundamentos de redes de computadoras',
            categoria: 'Redes',
            creado: '10/8/2025',
            estado: 'inactivo'
        }
    ];

    function init() {
        console.log('🎯 [CURSOS] Inicializando vista');
        cargarCursos();
        configurarFiltros();
    }

    function cargarCursos(filtros = {}) {
        const container = document.getElementById('cursosListContainer');
        
        if (!container) {
            console.warn('⚠️ [CURSOS] Contenedor no encontrado');
            return;
        }

        let cursosFiltrados = cursosData;

        // Aplicar filtros si existen
        if (filtros.busqueda) {
            cursosFiltrados = cursosFiltrados.filter(c => 
                c.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())
            );
        }

        if (filtros.categoria) {
            cursosFiltrados = cursosFiltrados.filter(c => 
                c.categoria === filtros.categoria
            );
        }

        if (filtros.estado) {
            cursosFiltrados = cursosFiltrados.filter(c => 
                c.estado === filtros.estado.toLowerCase()
            );
        }

        const html = cursosFiltrados.map(curso => `
            <div class="curso-item">
                <div class="d-flex gap-3">
                    <div class="curso-icon">
                        <i class="bi bi-book"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 class="curso-title">
                                    ${curso.nombre}
                                    <span class="curso-codigo">${curso.codigo}</span>
                                </h6>
                            </div>
                            <div class="curso-actions">
                                <button class="btn btn-sm btn-outline-primary" 
                                        onclick="editarCurso(${curso.id})" 
                                        title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" 
                                        onclick="eliminarCurso(${curso.id})" 
                                        title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p class="curso-description">${curso.descripcion}</p>
                        <div class="curso-meta">
                            <div class="curso-meta-item">
                                <p class="curso-meta-label mb-0">Categoría:</p>
                                <p class="curso-meta-value mb-0">${curso.categoria}</p>
                            </div>
                            <div class="curso-meta-item">
                                <p class="curso-meta-label mb-0">Creado:</p>
                                <p class="curso-meta-value mb-0">${curso.creado}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html || '<p class="text-center text-muted py-4">No se encontraron cursos</p>';
        console.log('✅ [CURSOS] Cursos cargados:', cursosFiltrados.length);
    }

    function configurarFiltros() {
        const searchInput = document.getElementById('searchInput');
        const filterCategoria = document.getElementById('filterCategoria');
        const filterEstado = document.getElementById('filterEstado');

        if (searchInput) {
            searchInput.addEventListener('input', aplicarFiltros);
        }
        if (filterCategoria) {
            filterCategoria.addEventListener('change', aplicarFiltros);
        }
        if (filterEstado) {
            filterEstado.addEventListener('change', aplicarFiltros);
        }
    }

    function aplicarFiltros() {
        const filtros = {
            busqueda: document.getElementById('searchInput')?.value || '',
            categoria: document.getElementById('filterCategoria')?.value || '',
            estado: document.getElementById('filterEstado')?.value || ''
        };

        cargarCursos(filtros);
    }

    // Funciones globales
    window.abrirModalNuevoCurso = function() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoCurso'));
        modal.show();
    };

    window.guardarCurso = function() {
        alert('Funcionalidad de guardar en desarrollo');
    };

    window.editarCurso = function(id) {
        console.log('✏️ Editar curso:', id);
        alert('Funcionalidad de editar en desarrollo');
    };

    window.eliminarCurso = function(id) {
        if (confirm('¿Está seguro de eliminar este curso?')) {
            console.log('🗑️ Eliminar curso:', id);
            alert('Funcionalidad de eliminar en desarrollo');
        }
    };

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [CURSOS] Script configurado');
})();