(function() {
    'use strict';

    console.log('📚 [CURSOS-AULA] Script cargado');

    // Datos de cursos del docente
    const cursosDocente = [
        {
            id: 1,
            nombre: 'Geometria',
            codigo: 'GE-001',
            estudiantes: 32,
            materiales: 24,
            horario: 'Lun y Mié 10:00-12:00',
            color: 'blue' // azul, rojo, verde, morado
        },
        {
            id: 2,
            nombre: 'Geometria',
            codigo: 'GE-002',
            estudiantes: 28,
            materiales: 18,
            horario: 'Mar y Jue 14:00-16:00',
            color: 'red'
        },
        {
            id: 3,
            nombre: 'Aritemetica',
            codigo: 'AR-003',
            estudiantes: 30,
            materiales: 20,
            horario: 'Lun y Mié 16:00-18:00',
            color: 'blue'
        },
        {
            id: 4,
            nombre: 'Matemáticas Avanzadas',
            codigo: 'MA-004',
            estudiantes: 25,
            materiales: 15,
            horario: 'Vie 10:00-12:00',
            color: 'red'
        },
        {
            id: 5,
            nombre: 'Matemáticas Avanzadas',
            codigo: 'MA-005',
            estudiantes: 20,
            materiales: 12,
            horario: 'Mar y Jue 16:00-18:00',
            color: 'blue'
        },
        {
            id: 6,
            nombre: 'Fisica',
            codigo: 'FI-006',
            estudiantes: 35,
            materiales: 22,
            horario: 'Lun y Vie 14:00-16:00',
            color: 'red'
        }
    ];

    function init() {
        console.log('🎯 [CURSOS-AULA] Inicializando vista de cursos');
        cargarCursos();
    }

    function cargarCursos() {
        const container = document.getElementById('cursos-list');
        
        if (!container) {
            console.warn('⚠️ [CURSOS-AULA] Contenedor no encontrado');
            return;
        }

        if (cursosDocente.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        No tienes cursos asignados en este momento.
                    </div>
                </div>
            `;
            return;
        }

        const html = cursosDocente.map(curso => `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="dashboard-card overflow-hidden curso-card" data-curso-id="${curso.id}">
                    <div class="course-border-top course-border-${curso.color}"></div>
                    <div class="p-3">
                        <h5 class="fw-bold mb-1">${curso.nombre}</h5>
                        <small class="text-muted">${curso.codigo}</small>
                        <div class="d-flex align-items-center text-muted small mb-2 mt-2">
                            <i class="bi bi-people-fill me-2"></i>
                            <span>${curso.estudiantes}</span>
                            <i class="bi bi-list-check ms-3 me-2"></i>
                            <span>${curso.materiales}</span>
                        </div>
                        <div class="d-flex align-items-center text-muted small">
                            <i class="bi bi-clock me-2"></i>
                            <span>${curso.horario}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
        configurarEventosCursos();
        console.log('✅ [CURSOS-AULA] Cursos cargados:', cursosDocente.length);
    }

    function configurarEventosCursos() {
        const cursoCards = document.querySelectorAll('.curso-card');
        
        cursoCards.forEach(card => {
            // Quitar listeners anteriores
            if (card.dataset._handlerAttached) return;
            
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                const cursoId = this.dataset.cursoId;
                navegarADetalleCurso(cursoId);
            });
            
            // Efecto hover
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            card.dataset._handlerAttached = 'true';
        });
    }

    function navegarADetalleCurso(cursoId) {
        const curso = cursosDocente.find(c => c.id == cursoId);
        console.log('📖 Navegando a curso:', curso);
        
        // Guardar el curso seleccionado en localStorage
        localStorage.setItem('cursoSeleccionado', JSON.stringify(curso));
        
        // Navegar a la vista de detalle
        const navLink = document.querySelector('[data-view="/pages/Docentes/detalles-curso.html"]');
        if (navLink) {
            navLink.click();
        }
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [CURSOS-AULA] Script configurado');
})();