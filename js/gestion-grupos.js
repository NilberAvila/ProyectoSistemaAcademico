(function() {
    'use strict';

    console.log('👥 [GRUPOS] Script cargado');

    const gruposData = [
        {
            id: 1,
            curso: 'DW-001 - Desarrollo Web',
            grupos: [
                {
                    id: 1,
                    nombre: 'Grupo A',
                    estado: 'Activo',
                    estudiantes: 32,
                    capacidad: 35,
                    tutor: 'Nombre Tutor 1',
                    turno: 'Mañana',
                    aula: 'Aula A-101',
                    disponibles: 3
                },
                {
                    id: 2,
                    nombre: 'Grupo B',
                    estado: 'Activo',
                    estudiantes: 32,
                    capacidad: 35,
                    tutor: 'Nombre Tutor 1',
                    turno: 'Tarde',
                    aula: 'Aula A-101',
                    disponibles: 3
                }
            ]
        },
        {
            id: 2,
            curso: 'FIS-005 - Física',
            grupos: [
                {
                    id: 3,
                    nombre: 'Grupo A',
                    estado: 'Activo',
                    estudiantes: 28,
                    capacidad: 35,
                    tutor: 'Nombre Tutor 2',
                    turno: 'Mañana',
                    aula: 'Aula B-205',
                    disponibles: 7
                }
            ]
        },
        {
            id: 3,
            curso: 'BD-002 - Base de Datos',
            grupos: [
                {
                    id: 4,
                    nombre: 'Grupo A',
                    estado: 'Activo',
                    estudiantes: 21,
                    capacidad: 30,
                    tutor: 'Nombre Tutor 3',
                    turno: 'Tarde',
                    aula: 'Lab A-102',
                    disponibles: 9
                }
            ]
        }
    ];

    function init() {
        console.log('🎯 [GRUPOS] Inicializando vista');
        cargarGrupos();
        configurarFiltros();
        cargarCursosEnFiltro();
    }

    function cargarGrupos(filtros = {}) {
        const container = document.getElementById('gruposListContainer');
        
        if (!container) {
            console.warn('⚠️ [GRUPOS] Contenedor no encontrado');
            return;
        }

        let datosFiltrados = gruposData;

        // Aplicar filtros
        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            datosFiltrados = datosFiltrados.map(curso => {
                const gruposFiltrados = curso.grupos.filter(g => 
                    g.nombre.toLowerCase().includes(busqueda) ||
                    g.tutor.toLowerCase().includes(busqueda) ||
                    curso.curso.toLowerCase().includes(busqueda)
                );
                return gruposFiltrados.length > 0 ? { ...curso, grupos: gruposFiltrados } : null;
            }).filter(c => c !== null);
        }

        if (filtros.curso) {
            datosFiltrados = datosFiltrados.filter(c => c.curso === filtros.curso);
        }

        if (filtros.estado) {
            datosFiltrados = datosFiltrados.map(curso => {
                const gruposFiltrados = curso.grupos.filter(g => 
                    g.estado.toLowerCase() === filtros.estado.toLowerCase()
                );
                return gruposFiltrados.length > 0 ? { ...curso, grupos: gruposFiltrados } : null;
            }).filter(c => c !== null);
        }

        const html = datosFiltrados.map(curso => `
            <div class="curso-grupos-container">
                <div class="curso-header">
                    <h6 class="curso-title-grupos">
                        ${curso.curso}
                        <span class="grupos-badge">${curso.grupos.length} Grupos</span>
                    </h6>
                </div>
                
                ${curso.grupos.map(grupo => `
                    <div class="grupo-item-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="grupo-header-info flex-grow-1">
                                <div class="grupo-icon-main">
                                    <i class="bi bi-people-fill"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h6 class="grupo-nombre">
                                        ${grupo.nombre}
                                        <span class="grupo-estado-badge">${grupo.estado}</span>
                                        <span class="grupo-estudiantes-badge ms-2">
                                            ${grupo.estudiantes}/${grupo.capacidad} estudiantes
                                        </span>
                                    </h6>
                                    <div class="grupo-detalles mt-2">
                                        <div class="grupo-detalle-item">
                                            <span class="grupo-detalle-label">Tutor</span>
                                            <span class="grupo-detalle-value">${grupo.tutor}</span>
                                        </div>
                                        <div class="grupo-detalle-item">
                                            <span class="grupo-detalle-label">Turno:</span>
                                            <span class="grupo-detalle-value">${grupo.turno}</span>
                                        </div>
                                        <div class="grupo-detalle-item">
                                            <span class="grupo-detalle-label">Aula:</span>
                                            <span class="grupo-detalle-value">${grupo.aula}</span>
                                        </div>
                                        <div class="grupo-detalle-item">
                                            <span class="grupo-detalle-label">Disponibles:</span>
                                            <span class="grupo-detalle-value">${grupo.disponibles} cupos</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="grupo-actions">
                                <button class="btn btn-sm btn-outline-primary" 
                                        onclick="editarGrupo(${grupo.id})" 
                                        title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" 
                                        onclick="eliminarGrupo(${grupo.id})" 
                                        title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');

        container.innerHTML = html || '<p class="text-center text-muted py-4">No se encontraron grupos</p>';
        console.log('✅ [GRUPOS] Grupos cargados');
    }

    function cargarCursosEnFiltro() {
        const select = document.getElementById('filterCurso');
        if (!select) return;

        const cursos = gruposData.map(c => c.curso);
        select.innerHTML = '<option value="">Todos los cursos</option>' + 
            cursos.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    function configurarFiltros() {
        const searchInput = document.getElementById('searchInput');
        const filterCurso = document.getElementById('filterCurso');
        const filterEstado = document.getElementById('filterEstado');

        if (searchInput) {
            searchInput.addEventListener('input', aplicarFiltros);
        }
        if (filterCurso) {
            filterCurso.addEventListener('change', aplicarFiltros);
        }
        if (filterEstado) {
            filterEstado.addEventListener('change', aplicarFiltros);
        }
    }

    function aplicarFiltros() {
        const filtros = {
            busqueda: document.getElementById('searchInput')?.value || '',
            curso: document.getElementById('filterCurso')?.value || '',
            estado: document.getElementById('filterEstado')?.value || ''
        };

        cargarGrupos(filtros);
    }

    // Funciones globales
    window.abrirModalNuevoGrupo = function() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoGrupo'));
        modal.show();
    };

    window.guardarGrupo = function() {
        console.log('💾 Guardar nuevo grupo');
        alert('Funcionalidad en desarrollo');
        bootstrap.Modal.getInstance(document.getElementById('modalNuevoGrupo')).hide();
    };

    window.editarGrupo = function(id) {
        console.log('✏️ Editar grupo:', id);
        const modal = new bootstrap.Modal(document.getElementById('modalEditarGrupo'));
        modal.show();
    };

    window.actualizarGrupo = function() {
        console.log('💾 Actualizar grupo');
        alert('Funcionalidad en desarrollo');
        bootstrap.Modal.getInstance(document.getElementById('modalEditarGrupo')).hide();
    };

    window.eliminarGrupo = function(id) {
        if (confirm('¿Está seguro de eliminar este grupo?')) {
            console.log('🗑️ Eliminar grupo:', id);
            alert('Funcionalidad en desarrollo');
        }
    };

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [GRUPOS] Script configurado');
})();