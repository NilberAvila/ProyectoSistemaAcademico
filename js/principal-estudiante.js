(function() {
    'use strict';

    console.log('📚 [PRINCIPAL ESTUDIANTE] Script cargado');

    // Datos de clases de hoy
    const clasesHoy = [
        {
            id: 1,
            curso: 'Matematica',
            codigo: 'MT-001',
            horario: '08:00 - 10:00',
            aula: 'Aula A-101',
            docente: 'Prof. García López',
            estado: 'proxima' // proxima, en-curso, finalizada
        },
        {
            id: 2,
            curso: 'Razonamiento Verbal',
            codigo: 'RV-002',
            horario: '10:30 - 12:30',
            aula: 'Aula B-203',
            docente: 'Prof. María Rodríguez',
            estado: 'en-curso'
        },
        {
            id: 3,
            curso: 'Calculo',
            codigo: 'CA-003',
            horario: '14:00 - 16:00',
            aula: 'Aula C-105',
            docente: 'Prof. Juan Martínez',
            estado: 'proxima'
        }
    ];

    // Datos de actividades recientes
    const actividadesRecientes = [
        {
            id: 1,
            tipo: 'calificacion',
            titulo: 'Calificación publicada',
            descripcion: 'Simulacro 3',
            nota: 205,
            tiempo: 'Hace 2 horas',
            icono: 'bi-star-fill',
            color: 'success'
        },
        {
            id: 2,
            tipo: 'calificacion',
            titulo: 'Calificación publicada',
            descripcion: 'Simulacro 2',
            nota: 180,
            tiempo: 'Hace 5 horas',
            icono: 'bi-star-fill',
            color: 'success'
        },
    ];

    // Función para cargar clases de hoy
    function cargarClasesHoy() {
        const container = document.querySelector('.clases-hoy-container');
        
        if (!container) {
            console.warn('⚠️ Contenedor de clases no encontrado');
            return;
        }

        if (clasesHoy.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    No tienes clases programadas para hoy
                </div>
            `;
            return;
        }

        const html = clasesHoy.map(clase => {
            const estadoBadge = {
                'proxima': '<span class="badge bg-primary">Próxima</span>',
                'en-curso': '<span class="badge bg-success">En Curso</span>',
                'finalizada': '<span class="badge bg-secondary">Finalizada</span>'
            };

            return `
                <div class="clase-card ${clase.estado}">
                    <div class="clase-header">
                        <div class="clase-info">
                            <h6 class="clase-nombre">${clase.curso}</h6>
                            <span class="clase-codigo">${clase.codigo}</span>
                        </div>
                        ${estadoBadge[clase.estado]}
                    </div>
                    <div class="clase-detalles">
                        <div class="detalle-item">
                            <i class="bi bi-clock"></i>
                            <span>${clase.horario}</span>
                        </div>
                        <div class="detalle-item">
                            <i class="bi bi-geo-alt"></i>
                            <span>${clase.aula}</span>
                        </div>
                        <div class="detalle-item">
                            <i class="bi bi-person"></i>
                            <span>${clase.docente}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        console.log('✅ Clases de hoy cargadas:', clasesHoy.length);
    }

    // Función para cargar actividades recientes
    function cargarActividadesRecientes() {
        // Buscar el contenedor correcto - buscar por el h5 con "Actividad Reciente"
        const containers = document.querySelectorAll('.dashboard-card');
        let actividadContainer = null;
        
        containers.forEach(container => {
            const heading = container.querySelector('h5');
            if (heading && heading.textContent.includes('Actividad Reciente')) {
                actividadContainer = container;
            }
        });
        
        if (!actividadContainer) {
            console.warn('⚠️ Contenedor de actividades no encontrado');
            return;
        }

        if (actividadesRecientes.length === 0) {
            actividadContainer.innerHTML += `
                <p class="text-muted text-center">No hay actividades recientes</p>
            `;
            return;
        }

        const html = actividadesRecientes.map(actividad => {
            const notaHTML = actividad.nota 
                ? `<span class="d-block text-${actividad.color} small">${actividad.descripcion} - <strong>Nota: ${actividad.nota}</strong></span>`
                : `<span class="d-block text-muted small">${actividad.descripcion}</span>`;

            return `
                <div class="activity-item mb-3">
                    <div class="d-flex align-items-start">
                        <i class="bi ${actividad.icono} text-${actividad.color} me-2"></i>
                        <div class="flex-grow-1">
                            <span class="d-block fw-bold small">${actividad.titulo}</span>${notaHTML}
                            <span class="d-block text-muted small mt-1">
                                <i class="bi bi-clock-history"></i> ${actividad.tiempo}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Agregar después del h5
        const h5 = actividadContainer.querySelector('h5');
        h5.insertAdjacentHTML('afterend', html);
        
        console.log('✅ Actividades recientes cargadas:', actividadesRecientes.length);
    }

    // Función de inicialización
    function init() {
        console.log('🎬 Inicializando Principal Estudiante...');
        cargarClasesHoy();
        cargarActividadesRecientes();
    }

    // Inicialización cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Si el DOM ya está listo (carga dinámica)
        setTimeout(init, 100);
    }
})();