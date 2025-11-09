// Datos de ejemplo (después puedes conectar con API)
const datosSimulados = {
    registrosRecientes: [
        {
            nombre: 'Nombre Estudiante 45',
            tipo: 'estudiante',
            detalle: 'Matemáticas - 001',
            fecha: '20/10/2025'
        },
        {
            nombre: 'Nombre Docente 8',
            tipo: 'docente',
            detalle: 'Física - 005',
            fecha: '20/10/2025'
        },
        {
            nombre: 'Nombre Estudiante 46',
            tipo: 'estudiante',
            detalle: 'Matemáticas Avanzadas - 003',
            fecha: '19/10/2025'
        },
        {
            nombre: 'Nombre Administrativo 3',
            tipo: 'administrativo',
            detalle: '',
            fecha: '18/10/2025'
        }
    ],
    alertas: [
        {
            tipo: 'aviso',
            titulo: 'Curso "Desarrollo Web - 001" alcanzó 91% de capacidad',
            descripcion: '',
            tiempo: 'Hace 2 horas'
        },
        {
            tipo: 'info',
            titulo: '15 nuevos estudiantes registrados esta semana',
            descripcion: '',
            tiempo: 'Hace 5 horas'
        },
        {
            tipo: 'exito',
            titulo: 'Solicitud de nuevo curso pendiente de aprobación',
            descripcion: '',
            tiempo: 'Hace 1 día'
        }
    ]
};

// Cargar registros recientes
function cargarRegistrosRecientes() {
    const container = document.getElementById('registrosRecientes');
    if (!container) return;

    container.innerHTML = datosSimulados.registrosRecientes.map(registro => `
        <div class="activity-item">
            <div class="activity-info">
                <div class="activity-name">${registro.nombre}</div>
                ${registro.detalle ? `<div class="activity-details">${registro.detalle}</div>` : ''}
            </div>
            <span class="activity-badge badge-${registro.tipo}">${registro.tipo}</span>
            <span class="activity-date">${registro.fecha}</span>
        </div>
    `).join('');
}

// Cargar alertas
function cargarAlertas() {
    const container = document.getElementById('alertasSistema');
    if (!container) return;

    const iconos = {
        aviso: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill',
        exito: 'bi-check-circle-fill'
    };

    container.innerHTML = datosSimulados.alertas.map(alerta => `
        <div class="alert-item alert-${alerta.tipo}">
            <i class="bi ${iconos[alerta.tipo]} alert-icon"></i>
            <div class="alert-content">
                <div class="alert-title">${alerta.titulo}</div>
                ${alerta.descripcion ? `<p class="alert-description">${alerta.descripcion}</p>` : ''}
                <div class="alert-time">${alerta.tiempo}</div>
            </div>
        </div>
    `).join('');
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    cargarRegistrosRecientes();
    cargarAlertas();
});