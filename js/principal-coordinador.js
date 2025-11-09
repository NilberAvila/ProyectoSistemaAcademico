(function() {
    'use strict';

    console.log('🚀 [COORDINADOR] Script cargado');

    // Datos de grupos
    const gruposData = [
        { id: 1, nombre: 'Grupo A', inscritos: 32, capacidad: 35, porcentaje: 91 },
        { id: 2, nombre: 'Grupo B', inscritos: 32, capacidad: 35, porcentaje: 91 },
        { id: 3, nombre: 'Grupo C', inscritos: 28, capacidad: 35, porcentaje: 80 },
        { id: 4, nombre: 'Grupo D', inscritos: 15, capacidad: 35, porcentaje: 43 }
    ];

    const cursosData = [
        {
            id: 1,
            nombre: 'Programación Web',
            docente: 'Juan Pérez',
            estudiantes: 32,
            horario: 'Lun-Mié 8:00-10:00',
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Base de Datos',
            docente: 'María García',
            estudiantes: 28,
            horario: 'Mar-Jue 10:00-12:00',
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Redes I',
            docente: 'Carlos López',
            estudiantes: 25,
            horario: 'Mié-Vie 14:00-16:00',
            estado: 'Activo'
        }
    ];

    function init() {
        console.log('🎯 [COORDINADOR] Inicializando vista');
        
        cargarEstadisticas();
        cargarGrupos();
        cargarCursos();
    }

    function cargarEstadisticas() {
        console.log('📊 [COORDINADOR] Cargando estadísticas');
        animarContador('cursosActivos', 24);
        animarContador('docentesAsignados', 18);
        animarContador('estudiantesInscritos', 342);
        animarContador('horariosConfigurados', 48);
    }

    function animarContador(id, valorFinal) {
        const elemento = document.getElementById(id);
        if (!elemento) {
            console.warn(`⚠️ [COORDINADOR] No se encontró: #${id}`);
            return;
        }

        let valorActual = 0;
        const duracion = 1500;
        const incremento = valorFinal / (duracion / 16);

        const animacion = setInterval(() => {
            valorActual += incremento;
            if (valorActual >= valorFinal) {
                elemento.textContent = valorFinal;
                clearInterval(animacion);
            } else {
                elemento.textContent = Math.floor(valorActual);
            }
        }, 16);
    }

    function cargarGrupos() {
        console.log('👥 [COORDINADOR] Cargando grupos');
        
        const container = document.getElementById('gruposContainer');
        
        if (!container) {
            console.warn('⚠️ [COORDINADOR] Contenedor de grupos no encontrado');
            return;
        }

        const html = gruposData.map(grupo => `
            <div class="grupo-item">
                <div class="grupo-header">
                    <h6 class="grupo-nombre">${grupo.nombre}</h6>
                    <span class="ocupacion-badge">
                        ${grupo.porcentaje}% ocupado
                    </span>
                </div>
                <p class="grupo-info">${grupo.inscritos} / ${grupo.capacidad} estudiantes</p>
                <div class="progress-bar-custom">
                    <div class="progress-fill" style="width: ${grupo.porcentaje}%"></div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
        console.log('✅ [COORDINADOR] Grupos cargados correctamente');
    }

    function cargarCursos() {
        console.log('📚 [COORDINADOR] Cargando cursos');
        const tbody = document.getElementById('cursosTable');
        
        if (!tbody) {
            console.warn('⚠️ [COORDINADOR] Tabla de cursos no encontrada');
            return;
        }

        tbody.innerHTML = cursosData.map(curso => `
            <tr>
                <td><strong>${curso.nombre}</strong></td>
                <td>${curso.docente}</td>
                <td><span class="badge bg-secondary">${curso.estudiantes}</span></td>
                <td>${curso.horario}</td>
                <td><span class="badge bg-success">${curso.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        console.log('✅ [COORDINADOR] Cursos cargados correctamente');
    }

    // Escuchar cuando se carga una nueva vista
    document.addEventListener('viewLoaded', function(e) {
        const viewPath = e.detail.viewPath;
        console.log('📢 [COORDINADOR] Vista cargada:', viewPath);
        
        // Solo reiniciar si es una vista del coordinador
        if (viewPath && viewPath.includes('/Coordinador/')) {
            console.log('🔄 [COORDINADOR] Reinicializando...');
            setTimeout(init, 100);
        }
    });

    // Inicialización al cargar el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [COORDINADOR] Script configurado');
})();