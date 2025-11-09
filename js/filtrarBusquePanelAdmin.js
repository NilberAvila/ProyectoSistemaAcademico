// ==========================================
// DATOS DE PERSONAL (Simulación)
// ==========================================
const personalData = [
    {
        id: 1,
        nombre: "Juan Pérez García",
        codigo: "DC001",
        rol: "Docente",
        dni: "12345678",
        edad: 30,
        email: "juan.perez@gmail.com",
        telefono: "999 000 111",
        estado: "Activo"
    },
    {
        id: 2,
        nombre: "María López Sánchez",
        codigo: "DC002",
        rol: "Docente",
        dni: "23456789",
        edad: 28,
        email: "maria.lopez@gmail.com",
        telefono: "999 000 222",
        estado: "Activo"
    },
    {
        id: 3,
        nombre: "Carlos Ramírez Torres",
        codigo: "CO001",
        rol: "Coordinador",
        dni: "34567890",
        edad: 35,
        email: "carlos.ramirez@gmail.com",
        telefono: "999 000 333",
        estado: "Activo"
    },
    {
        id: 4,
        nombre: "Ana Martínez Flores",
        codigo: "CO002",
        rol: "Coordinador",
        dni: "45678901",
        edad: 32,
        email: "ana.martinez@gmail.com",
        telefono: "999 000 444",
        estado: "Inactivo"
    },
    {
        id: 5,
        nombre: "Luis González Díaz",
        codigo: "ADM001",
        rol: "Administrativo",
        dni: "56789012",
        edad: 29,
        email: "luis.gonzalez@gmail.com",
        telefono: "999 000 555",
        estado: "Activo"
    },
    {
        id: 6,
        nombre: "Carmen Vega Ríos",
        codigo: "ADM002",
        rol: "Administrativo",
        dni: "67890123",
        edad: 27,
        email: "carmen.vega@gmail.com",
        telefono: "999 000 666",
        estado: "Activo"
    },
    {
        id: 7,
        nombre: "Roberto Silva Mendoza",
        codigo: "DC003",
        rol: "Docente",
        dni: "78901234",
        edad: 33,
        email: "roberto.silva@gmail.com",
        telefono: "999 000 777",
        estado: "Activo"
    },
    {
        id: 8,
        nombre: "Patricia Castro León",
        codigo: "CO003",
        rol: "Coordinador",
        dni: "89012345",
        edad: 31,
        email: "patricia.castro@gmail.com",
        telefono: "999 000 888",
        estado: "Activo"
    }
];

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let filtroRolActivo = "Todos";
let filtroEstadoActivo = "Todos";
let terminoBusqueda = "";

// ==========================================
// FUNCIONES DE RENDERIZADO
// ==========================================

function renderizarPersonal(datos) {
    const container = document.querySelector('.students-list');
    const listaExistente = container.querySelector('.list-header').nextElementSibling;
    
    // Limpiar items existentes (excepto el header)
    while (container.children.length > 1) {
        container.removeChild(container.lastChild);
    }
    
    // Si no hay datos, mostrar mensaje
    if (datos.length === 0) {
        const mensajeVacio = document.createElement('div');
        mensajeVacio.className = 'docente-item';
        mensajeVacio.style.justifyContent = 'center';
        mensajeVacio.style.color = '#6b7280';
        mensajeVacio.innerHTML = '<p>No se encontraron resultados</p>';
        container.appendChild(mensajeVacio);
        actualizarContador(0);
        return;
    }
    
    // Renderizar cada persona
    datos.forEach(persona => {
        const item = crearItemPersonal(persona);
        container.appendChild(item);
    });
    
    actualizarContador(datos.length);
}

function crearItemPersonal(persona) {
    const item = document.createElement('div');
    item.className = 'docente-item';
    
    const badgeColor = obtenerColorRol(persona.rol);
    const estadoClass = persona.estado === "Activo" ? "active" : "";
    
    item.innerHTML = `
        <div class="docente-avatar">
            <i class="bi bi-mortarboard"></i>
        </div>
        <div class="docente-info">
            <div class="docente-name">${persona.nombre}</div>
            <div class="docente-badges">
                <span class="badge-custom badge-blue">${persona.codigo}</span>
                <span class="badge-custom ${badgeColor}">${persona.rol}</span>
            </div>
            <div class="docente-details">
                <span><strong>DNI:</strong> ${persona.dni}</span>
                <span><strong>Edad:</strong> ${persona.edad} años</span>
                <span><i class="bi bi-envelope"></i> ${persona.email}</span>
                <span><i class="bi bi-phone"></i> ${persona.telefono}</span>
            </div>
        </div>
        <div class="docente-actions">
            <button class="action-btn" title="Ver" onclick="verPersonal(${persona.id})">
                <i class="bi bi-eye"></i>
            </button>
            <button class="action-btn ${estadoClass}" title="${persona.estado}">
                ${persona.estado}
            </button>
            <button class="action-btn" title="Editar" onclick="editarPersonal(${persona.id})">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="action-btn" title="Eliminar" onclick="eliminarPersonal(${persona.id})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    return item;
}

function obtenerColorRol(rol) {
    const colores = {
        "Docente": "badge-purple",
        "Coordinador": "badge-purple",
        "Administrativo": "badge-purple"
    };
    return colores[rol] || "badge-purple";
}

// ==========================================
// FUNCIONES DE FILTRADO Y BÚSQUEDA
// ==========================================

function filtrarPersonal() {
    let datosFiltrados = [...personalData];
    
    // Filtrar por rol
    if (filtroRolActivo !== "Todos") {
        datosFiltrados = datosFiltrados.filter(p => p.rol === filtroRolActivo);
    }
    
    // Filtrar por estado
    if (filtroEstadoActivo !== "Todos") {
        datosFiltrados = datosFiltrados.filter(p => p.estado === filtroEstadoActivo);
    }
    
    // Filtrar por búsqueda
    if (terminoBusqueda.trim() !== "") {
        const termino = terminoBusqueda.toLowerCase();
        datosFiltrados = datosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(termino) ||
            p.codigo.toLowerCase().includes(termino) ||
            p.dni.includes(termino) ||
            p.email.toLowerCase().includes(termino)
        );
    }
    
    renderizarPersonal(datosFiltrados);
    actualizarEstadisticas(datosFiltrados);
}

function actualizarContador(cantidad) {
    const contador = document.querySelector('.student-count');
    if (contador) {
        contador.textContent = `${cantidad} ${cantidad === 1 ? 'persona' : 'personas'}`;
    }
}

function actualizarEstadisticas(datos) {
    const total = datos.length;
    const docentes = datos.filter(p => p.rol === "Docente").length;
    const coordinadores = datos.filter(p => p.rol === "Coordinador").length;
    const administrativos = datos.filter(p => p.rol === "Administrativo").length;
    
    // Actualizar cards del dashboard
    const cards = document.querySelectorAll('.dashboard-card .value');
    if (cards.length >= 4) {
        cards[0].textContent = total;
        cards[1].textContent = docentes;
        cards[2].textContent = coordinadores;
        cards[3].textContent = administrativos;
    }
}

// ==========================================
// DROPDOWN DE FILTROS
// ==========================================

function crearDropdownRoles() {
    const btnRoles = document.querySelector('.filter-btn:first-of-type');
    
    // Crear dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'filter-dropdown';
    dropdown.innerHTML = `
        <div class="filter-option" data-rol="Todos">Todos los roles</div>
        <div class="filter-option" data-rol="Docente">Docente</div>
        <div class="filter-option" data-rol="Coordinador">Coordinador</div>
        <div class="filter-option" data-rol="Administrativo">Administrativo</div>
    `;
    
    btnRoles.style.position = 'relative';
    btnRoles.appendChild(dropdown);
    
    // Event listeners para opciones
    dropdown.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            filtroRolActivo = option.dataset.rol;
            btnRoles.innerHTML = `<i class="bi bi-funnel"></i> ${filtroRolActivo === "Todos" ? "Por roles" : filtroRolActivo}`;
            dropdown.classList.remove('show');
            filtrarPersonal();
            
            // Recrear dropdown
            setTimeout(() => crearDropdownRoles(), 100);
        });
    });
    
    // Toggle dropdown
    btnRoles.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
}

function crearDropdownEstados() {
    const btnEstados = document.querySelectorAll('.filter-btn')[1];
    
    // Crear dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'filter-dropdown';
    dropdown.innerHTML = `
        <div class="filter-option" data-estado="Todos">Todos los estados</div>
        <div class="filter-option" data-estado="Activo">Activo</div>
        <div class="filter-option" data-estado="Inactivo">Inactivo</div>
    `;
    
    btnEstados.style.position = 'relative';
    btnEstados.appendChild(dropdown);
    
    // Event listeners para opciones
    dropdown.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            filtroEstadoActivo = option.dataset.estado;
            btnEstados.innerHTML = filtroEstadoActivo === "Todos" ? "Todos los estados" : filtroEstadoActivo;
            dropdown.classList.remove('show');
            filtrarPersonal();
            
            // Recrear dropdown
            setTimeout(() => crearDropdownEstados(), 100);
        });
    });
    
    // Toggle dropdown
    btnEstados.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
}

// ==========================================
// FUNCIONES DE ACCIONES
// ==========================================

function verPersonal(id) {
    const persona = personalData.find(p => p.id === id);
    if (persona) {
        showNotification('info', 'Ver Personal', `Viendo información de ${persona.nombre}`);
    }
}

function editarPersonal(id) {
    const persona = personalData.find(p => p.id === id);
    if (persona) {
        showNotification('info', 'Editar Personal', `Editando a ${persona.nombre}`);
    }
}

function eliminarPersonal(id) {
    const persona = personalData.find(p => p.id === id);
    if (persona && confirm(`¿Estás seguro de eliminar a ${persona.nombre}?`)) {
        const index = personalData.findIndex(p => p.id === id);
        personalData.splice(index, 1);
        filtrarPersonal();
        showNotification('success', 'Personal Eliminado', `${persona.nombre} ha sido eliminado del sistema`);
    }
}

// ==========================================
// MODAL
// ==========================================

function openModal() {
    document.getElementById('modalRegistrar').classList.add('active');
}

function closeModal() {
    document.getElementById('modalRegistrar').classList.remove('active');
    document.getElementById('formRegistrar').reset();
}

function submitForm() {
    const form = document.getElementById('formRegistrar');
    
    if (!form.checkValidity()) {
        showNotification('error', 'Error', 'Por favor complete todos los campos requeridos');
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const nuevoPersonal = {
        id: personalData.length + 1,
        nombre: `${formData.get('nombres')} ${formData.get('apellidos')}`,
        codigo: generarCodigo(),
        rol: "Docente", // Puedes agregar un campo select en el form
        dni: formData.get('dni'),
        edad: calcularEdad(formData.get('fechaNacimiento')),
        email: formData.get('email'),
        telefono: formData.get('celular'),
        estado: "Activo"
    };
    
    personalData.push(nuevoPersonal);
    filtrarPersonal();
    closeModal();
    showNotification('success', 'Personal Registrado', `${nuevoPersonal.nombre} ha sido registrado exitosamente`);
}

function generarCodigo() {
    return `DC${String(personalData.length + 1).padStart(3, '0')}`;
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

// ==========================================
// SISTEMA DE NOTIFICACIONES
// ==========================================

function showNotification(type, title, message) {
    const container = document.getElementById('notificationContainer');
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('closing');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Renderizar personal inicial
    renderizarPersonal(personalData);
    actualizarEstadisticas(personalData);
    
    // Configurar búsqueda
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
        terminoBusqueda = e.target.value;
        filtrarPersonal();
    });
    
    // Crear dropdowns de filtros
    crearDropdownRoles();
    crearDropdownEstados();
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('modalRegistrar').addEventListener('click', (e) => {
        if (e.target.id === 'modalRegistrar') {
            closeModal();
        }
    });
});

// Agregar estilos CSS para los dropdowns
const style = document.createElement('style');
style.textContent = `
.filter-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 180px;
    z-index: 100;
    display: none;
}

.filter-dropdown.show {
    display: block;
}

.filter-option {
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
    transition: all 0.2s;
}

.filter-option:hover {
    background: #f3f4f6;
}

.filter-option:first-child {
    border-radius: 8px 8px 0 0;
}

.filter-option:last-child {
    border-radius: 0 0 8px 8px;
}
`;
document.head.appendChild(style);