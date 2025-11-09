(function() {
    'use strict';

    console.log('👨‍🎓 [ESTUDIANTES] Script cargado');

    const cursosGruposData = [
        {
            id: 1,
            codigo: 'DW-001',
            nombre: 'Desarrollo Web',
            grupos: [
                {
                    id: 1,
                    nombre: 'Grupo A',
                    matriculados: 2,
                    capacidad: 35,
                    cupos: 33,
                    docente: 'Nombre Docente 1',
                    turno: 'Mañana',
                    aula: 'Aula A-101',
                    estudiantes: [
                        { id: 1, matricula: 'EST2025001', nombre: 'Nombre Estudiante 1' },
                        { id: 2, matricula: 'EST2025004', nombre: 'Nombre Estudiante 4' }
                    ]
                },
                {
                    id: 2,
                    nombre: 'Grupo B',
                    matriculados: 3,
                    capacidad: 35,
                    cupos: 32,
                    docente: 'Nombre Docente 2',
                    turno: 'Tarde',
                    aula: 'Aula A-102',
                    estudiantes: [
                        { id: 3, matricula: 'EST2025002', nombre: 'Nombre Estudiante 2' },
                        { id: 4, matricula: 'EST2025003', nombre: 'Nombre Estudiante 3' },
                        { id: 5, matricula: 'EST2025005', nombre: 'Nombre Estudiante 5' }
                    ]
                }
            ]
        },
        {
            id: 2,
            codigo: 'BD-002',
            nombre: 'Base de Datos',
            grupos: [
                {
                    id: 3,
                    nombre: 'Grupo A',
                    matriculados: 2,
                    capacidad: 30,
                    cupos: 28,
                    docente: 'Nombre Docente 3',
                    turno: 'Mañana',
                    aula: 'Lab A-201',
                    estudiantes: [
                        { id: 6, matricula: 'EST2025006', nombre: 'Nombre Estudiante 6' },
                        { id: 7, matricula: 'EST2025007', nombre: 'Nombre Estudiante 7' }
                    ]
                }
            ]
        }
    ];

    // Base de datos de estudiantes disponibles
    const estudiantesDisponibles = [
        { id: 8, matricula: 'EST2025008', nombre: 'Ana María López' },
        { id: 9, matricula: 'EST2025009', nombre: 'Carlos Rodríguez' },
        { id: 10, matricula: 'EST2025010', nombre: 'María Fernández' },
        { id: 11, matricula: 'EST2025011', nombre: 'Juan Pérez' },
        { id: 12, matricula: 'EST2025012', nombre: 'Laura García' }
    ];

    let estudianteSeleccionado = null;
    let grupoSeleccionado = null;

    function init() {
        console.log('🎯 [ESTUDIANTES] Inicializando vista');
        cargarEstudiantes();
        configurarFiltros();
        cargarCursosEnFiltro();
        configurarBusquedaEstudiante();
    }

    function cargarEstudiantes(filtros = {}) {
        const container = document.getElementById('estudiantesListContainer');
        
        if (!container) {
            console.warn('⚠️ [ESTUDIANTES] Contenedor no encontrado');
            return;
        }

        let datosFiltrados = cursosGruposData;

        // Aplicar filtros
        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            datosFiltrados = datosFiltrados.map(curso => {
                const gruposFiltrados = curso.grupos.filter(g => 
                    g.nombre.toLowerCase().includes(busqueda) ||
                    g.estudiantes.some(e => 
                        e.nombre.toLowerCase().includes(busqueda) ||
                        e.matricula.toLowerCase().includes(busqueda)
                    )
                );
                return gruposFiltrados.length > 0 ? { ...curso, grupos: gruposFiltrados } : null;
            }).filter(c => c !== null);
        }

        if (filtros.curso) {
            datosFiltrados = datosFiltrados.filter(c => 
                `${c.codigo} - ${c.nombre}` === filtros.curso
            );
        }

        const html = datosFiltrados.map(curso => `
            <div class="curso-matricula-container">
                <div class="curso-matricula-header">
                    <h6 class="curso-matricula-title">${curso.codigo} - ${curso.nombre}</h6>
                </div>
                
                ${curso.grupos.map(grupo => `
                    <div class="grupo-matricula-item">
                        <div class="grupo-matricula-header">
                            <div class="grupo-info-left">
                                <div class="grupo-icon-matricula">
                                    <i class="bi bi-people-fill"></i>
                                </div>
                                <div>
                                    <h6 class="grupo-nombre-matricula">${grupo.nombre}</h6>
                                    <div>
                                        <span class="badge-matriculados">${grupo.matriculados}/${grupo.capacidad} matriculados</span>
                                        <span class="badge-cupos">${grupo.cupos} cupos</span>
                                    </div>
                                    <div class="grupo-detalles-matricula mt-2">
                                        <span><span class="grupo-detalle-label-mat">Docente:</span> ${grupo.docente}</span>
                                        <span><span class="grupo-detalle-label-mat">Turno:</span> ${grupo.turno}</span>
                                        <span><span class="grupo-detalle-label-mat">Aula:</span> ${grupo.aula}</span>
                                    </div>
                                </div>
                            </div>
                            <button class="btn-matricular-grupo" onclick="abrirModalMatricula(${curso.id}, ${grupo.id}, '${curso.codigo} - ${curso.nombre}', '${grupo.nombre}')">
                                <i class="bi bi-plus-circle"></i>
                                Matricular
                            </button>
                        </div>
                        
                        <div class="estudiantes-section">
                            <p class="estudiantes-section-title">Estudiantes matriculados:</p>
                            ${grupo.estudiantes.length > 0 ? grupo.estudiantes.map(est => `
                                <div class="estudiante-item">
                                    <div class="estudiante-info">
                                        <span class="estudiante-matricula-badge">${est.matricula}</span>
                                        <p class="estudiante-nombre">${est.nombre}</p>
                                    </div>
                                    <button class="btn-retirar" onclick="retirarEstudiante(${grupo.id}, ${est.id})">
                                        Retirar
                                    </button>
                                </div>
                            `).join('') : '<p class="text-muted">No hay estudiantes matriculados</p>'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');

        container.innerHTML = html || '<p class="text-center text-muted py-4">No se encontraron cursos</p>';
        console.log('✅ [ESTUDIANTES] Vista cargada');
    }

    function cargarCursosEnFiltro() {
        const select = document.getElementById('filterCurso');
        if (!select) return;

        const cursos = cursosGruposData.map(c => `${c.codigo} - ${c.nombre}`);
        select.innerHTML = '<option value="">Todos los cursos</option>' + 
            cursos.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    function configurarFiltros() {
        const searchInput = document.getElementById('searchInput');
        const filterCurso = document.getElementById('filterCurso');

        if (searchInput) {
            searchInput.addEventListener('input', aplicarFiltros);
        }
        if (filterCurso) {
            filterCurso.addEventListener('change', aplicarFiltros);
        }
    }

    function aplicarFiltros() {
        const filtros = {
            busqueda: document.getElementById('searchInput')?.value || '',
            curso: document.getElementById('filterCurso')?.value || ''
        };

        cargarEstudiantes(filtros);
    }

    function configurarBusquedaEstudiante() {
        const input = document.getElementById('buscarEstudiante');
        if (!input) return;

        input.addEventListener('input', function(e) {
            const busqueda = e.target.value.toLowerCase();
            
            if (busqueda.length < 2) {
                document.getElementById('resultadosBusqueda').style.display = 'none';
                return;
            }

            const resultados = estudiantesDisponibles.filter(est =>
                est.nombre.toLowerCase().includes(busqueda) ||
                est.matricula.toLowerCase().includes(busqueda)
            );

            mostrarResultadosBusqueda(resultados);
        });
    }

    function mostrarResultadosBusqueda(resultados) {
        const container = document.getElementById('resultadosBusqueda');
        const lista = document.getElementById('listaEstudiantes');

        if (resultados.length === 0) {
            container.style.display = 'none';
            return;
        }

        lista.innerHTML = resultados.map(est => `
            <a href="#" class="list-group-item list-group-item-action list-group-item-estudiante" 
               data-id="${est.id}" data-nombre="${est.nombre}" data-matricula="${est.matricula}">
                <strong>${est.matricula}</strong> - ${est.nombre}
            </a>
        `).join('');

        container.style.display = 'block';

        // Agregar eventos de clic
        lista.querySelectorAll('.list-group-item-estudiante').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                seleccionarEstudiante(
                    this.dataset.id,
                    this.dataset.nombre,
                    this.dataset.matricula
                );
            });
        });
    }

    function seleccionarEstudiante(id, nombre, matricula) {
        estudianteSeleccionado = { id, nombre, matricula };
        
        // Marcar como seleccionado
        document.querySelectorAll('.list-group-item-estudiante').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.classList.add('selected');

        // Habilitar botón de matricular
        document.getElementById('btnConfirmarMatricula').disabled = false;
    }

    // Funciones globales
    window.abrirModalMatricula = function(cursoId, grupoId, cursoNombre, grupoNombre) {
        grupoSeleccionado = { cursoId, grupoId };
        document.getElementById('grupoIdMatricula').value = grupoId;
        document.getElementById('cursoGrupoInfo').value = `${cursoNombre} - ${grupoNombre}`;
        document.getElementById('buscarEstudiante').value = '';
        document.getElementById('resultadosBusqueda').style.display = 'none';
        document.getElementById('btnConfirmarMatricula').disabled = true;
        estudianteSeleccionado = null;

        const modal = new bootstrap.Modal(document.getElementById('modalMatricularEstudiante'));
        modal.show();
    };

    window.confirmarMatricula = function() {
        if (!estudianteSeleccionado || !grupoSeleccionado) {
            alert('Debe seleccionar un estudiante');
            return;
        }

        console.log('💾 Matricular:', estudianteSeleccionado, 'en grupo:', grupoSeleccionado);
        alert(`Estudiante ${estudianteSeleccionado.nombre} matriculado exitosamente`);
        
        bootstrap.Modal.getInstance(document.getElementById('modalMatricularEstudiante')).hide();
        // Aquí recargarías los datos
        setTimeout(() => cargarEstudiantes(), 300);
    };

    window.retirarEstudiante = function(grupoId, estudianteId) {
        if (confirm('¿Está seguro de retirar este estudiante del grupo?')) {
            console.log('🗑️ Retirar estudiante:', estudianteId, 'del grupo:', grupoId);
            alert('Estudiante retirado exitosamente');
            // Aquí recargarías los datos
            setTimeout(() => cargarEstudiantes(), 300);
        }
    };

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [ESTUDIANTES] Script configurado');
})();