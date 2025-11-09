(function() {
    'use strict';

    console.log('🕐 [HORARIOS] Script cargado');

    const horariosData = [
        {
            id: 1,
            curso: 'Desarrollo Web',
            codigo: 'DW-001',
            docente: 'Nombre Docente 1',
            aula: 'Aula A-101',
            dia: 'Miércoles',
            turno: 'Mañana',
            duracion: '2 horas',
            horaInicio: '08:00',
            horaFin: '10:00'
        },
        {
            id: 2,
            curso: 'Desarrollo Web',
            codigo: 'DW-001',
            docente: 'Nombre Docente 2',
            aula: 'Aula A-101',
            dia: 'Miércoles',
            turno: 'Mañana',
            duracion: '2 horas',
            horaInicio: '10:00',
            horaFin: '12:00'
        },
        {
            id: 3,
            curso: 'Base de Datos',
            codigo: 'BD-002',
            docente: 'Nombre Docente 3',
            aula: 'Lab A-201',
            dia: 'Lunes',
            turno: 'Tarde',
            duracion: '2 horas',
            horaInicio: '14:00',
            horaFin: '16:00'
        },
        {
            id: 4,
            curso: 'Física',
            codigo: 'FIS-005',
            docente: 'Nombre Docente 1',
            aula: 'Aula B-305',
            dia: 'Martes',
            turno: 'Mañana',
            duracion: '3 horas',
            horaInicio: '08:00',
            horaFin: '11:00'
        },
        {
            id: 5,
            curso: 'Redes I',
            codigo: 'RED-003',
            docente: 'Nombre Docente 2',
            aula: 'Lab B-102',
            dia: 'Jueves',
            turno: 'Tarde',
            duracion: '2 horas',
            horaInicio: '15:00',
            horaFin: '17:00'
        },
        {
            id: 6,
            curso: 'Programación Avanzada',
            codigo: 'PA-004',
            docente: 'Nombre Docente 3',
            aula: 'Aula C-201',
            dia: 'Viernes',
            turno: 'Mañana',
            duracion: '2 horas',
            horaInicio: '09:00',
            horaFin: '11:00'
        }
    ];

    function init() {
        console.log('🎯 [HORARIOS] Inicializando vista');
        cargarHorarios();
        configurarSelectCurso();
    }

    function cargarHorarios() {
        const container = document.getElementById('horariosListContainer');
        
        if (!container) {
            console.warn('⚠️ [HORARIOS] Contenedor no encontrado');
            return;
        }

        const html = horariosData.map(horario => `
            <div class="horario-item">
                <div class="horario-content">
                    <div class="horario-icon">
                        <i class="bi bi-person-workspace"></i>
                    </div>
                    
                    <div class="horario-info">
                        <div class="horario-header">
                            <h6 class="horario-title">${horario.curso}</h6>
                            <span class="horario-codigo-badge">${horario.codigo}</span>
                            <span class="horario-dia-badge">${horario.dia}</span>
                        </div>
                        
                        <div class="horario-detalles">
                            <div class="horario-detalle-item">
                                <span class="horario-detalle-label">Docente:</span>
                                <span class="horario-detalle-value">${horario.docente}</span>
                            </div>
                            <div class="horario-detalle-item">
                                <span class="horario-detalle-label">Turno:</span>
                                <span class="horario-detalle-value">${horario.turno}</span>
                            </div>
                            <div class="horario-detalle-item">
                                <span class="horario-detalle-label">Aula:</span>
                                <span class="horario-detalle-value">${horario.aula}</span>
                            </div>
                            <div class="horario-detalle-item">
                                <span class="horario-detalle-label">Duración:</span>
                                <span class="horario-detalle-value">${horario.duracion}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="horario-actions">
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="editarHorario(${horario.id})" 
                                title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="eliminarHorario(${horario.id})" 
                                title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
        console.log('✅ [HORARIOS] Horarios cargados:', horariosData.length);
    }

    function configurarSelectCurso() {
        const selectCurso = document.getElementById('selectCurso');
        const selectGrupo = document.getElementById('selectGrupo');
        
        if (!selectCurso || !selectGrupo) return;

        selectCurso.addEventListener('change', function() {
            if (this.value) {
                // Simular carga de grupos según el curso
                selectGrupo.innerHTML = `
                    <option value="">Seleccionar grupo...</option>
                    <option>Grupo A</option>
                    <option>Grupo B</option>
                    <option>Grupo C</option>
                `;
                selectGrupo.disabled = false;
            } else {
                selectGrupo.innerHTML = '<option value="">Seleccionar grupo...</option>';
                selectGrupo.disabled = true;
            }
        });
    }

    // Funciones globales
    window.abrirModalNuevoHorario = function() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoHorario'));
        document.getElementById('formNuevoHorario').reset();
        document.getElementById('selectGrupo').disabled = true;
        modal.show();
    };

    window.guardarHorario = function() {
        const form = document.getElementById('formNuevoHorario');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        console.log('💾 Guardar nuevo horario');
        alert('Horario guardado exitosamente');
        
        bootstrap.Modal.getInstance(document.getElementById('modalNuevoHorario')).hide();
        setTimeout(() => cargarHorarios(), 300);
    };

    window.editarHorario = function(id) {
        const horario = horariosData.find(h => h.id === id);
        
        if (!horario) {
            console.error('❌ Horario no encontrado:', id);
            return;
        }

        console.log('✏️ Editar horario:', id);
        
        // Llenar el formulario
        document.getElementById('editHorarioId').value = horario.id;
        document.getElementById('editCurso').value = `${horario.codigo} - ${horario.curso}`;
        document.getElementById('editDocente').value = horario.docente;
        document.getElementById('editAula').value = horario.aula;
        document.getElementById('editDia').value = horario.dia;
        document.getElementById('editTurno').value = horario.turno;
        document.getElementById('editDuracion').value = parseInt(horario.duracion);

        const modal = new bootstrap.Modal(document.getElementById('modalEditarHorario'));
        modal.show();
    };

    window.actualizarHorario = function() {
        const id = document.getElementById('editHorarioId').value;
        console.log('💾 Actualizar horario:', id);
        
        alert('Horario actualizado exitosamente');
        
        bootstrap.Modal.getInstance(document.getElementById('modalEditarHorario')).hide();
        setTimeout(() => cargarHorarios(), 300);
    };

    window.eliminarHorario = function(id) {
        if (confirm('¿Está seguro de eliminar este horario?')) {
            console.log('🗑️ Eliminar horario:', id);
            alert('Horario eliminado exitosamente');
            setTimeout(() => cargarHorarios(), 300);
        }
    };

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [HORARIOS] Script configurado');
})();