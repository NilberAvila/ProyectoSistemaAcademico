/* ============================================ */
/* SISTEMA DE NOTIFICACIONES PERSONALIZADAS */
/* ============================================ */

function showNotification(type, title, message, duration = 4000) {
    // Crear el container si no existe
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Definir iconos según el tipo
    const icons = {
        success: '<i class="bi bi-check-circle-fill"></i>',
        error: '<i class="bi bi-x-circle-fill"></i>',
        warning: '<i class="bi bi-exclamation-triangle-fill"></i>',
        info: '<i class="bi bi-info-circle-fill"></i>'
    };

    // Construir el HTML de la notificación
    notification.innerHTML = `
        <div class="notification-icon">
            ${icons[type] || icons.info}
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="bi bi-x"></i>
        </button>
        <div class="notification-progress"></div>
    `;

    // Agregar al container
    container.appendChild(notification);

    // Auto-cerrar después del tiempo especificado
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, duration);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.classList.add('closing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

/* ============================================ */
/* FUNCIONES DEL MODAL */
/* ============================================ */

function openModal() {
    const modal = document.getElementById('modalRegistrar');
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modalRegistrar');
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.getElementById('modalRegistrar').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

/* ============================================ */
/* FUNCIONES DE VALIDACIÓN */
/* ============================================ */

function generarCodigoEstudiante() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EST${year}${randomNum}`;
}

function validarDNI(dni) {
    return /^\d{8}$/.test(dni);
}

function validarCelular(celular) {
    return /^\d{9}$/.test(celular);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================ */
/* ENVIAR FORMULARIO */
/* ============================================ */

function submitForm() {
    const form = document.getElementById('formRegistrar');
    
    // Obtener todos los campos
    const nombres = form.querySelector('[name="nombres"]');
    const apellidos = form.querySelector('[name="apellidos"]');
    const dni = form.querySelector('[name="dni"]');
    const fechaNacimiento = form.querySelector('[name="fechaNacimiento"]');
    const genero = form.querySelector('[name="genero"]');
    const celular = form.querySelector('[name="celular"]');
    const email = form.querySelector('[name="email"]');

    // VALIDACIONES
    
    // 1. Nombres
    if (!nombres.value || nombres.value.trim() === "") {
        showNotification('error', 'Campo requerido', 'Por favor ingresa el nombre del estudiante.');
        nombres.focus();
        return;
    }

    // 2. Apellidos
    if (!apellidos.value || apellidos.value.trim() === "") {
        showNotification('error', 'Campo requerido', 'Por favor ingresa los apellidos del estudiante.');
        apellidos.focus();
        return;
    }

    // 3. DNI
    if (!dni.value || dni.value.trim() === "") {
        showNotification('error', 'Campo requerido', 'Por favor ingresa el DNI del estudiante.');
        dni.focus();
        return;
    }
    
    if (!validarDNI(dni.value)) {
        showNotification('error', 'DNI inválido', 'El DNI debe tener exactamente 8 números.');
        dni.focus();
        return;
    }

    // 4. Fecha de Nacimiento
    if (!fechaNacimiento.value) {
        showNotification('error', 'Campo requerido', 'Por favor selecciona la fecha de nacimiento.');
        fechaNacimiento.focus();
        return;
    }

    const fechaSeleccionada = new Date(fechaNacimiento.value);
    const hoy = new Date();
    
    if (fechaSeleccionada > hoy) {
        showNotification('error', 'Fecha inválida', 'La fecha de nacimiento no puede ser futura.');
        fechaNacimiento.focus();
        return;
    }

    const edad = Math.floor((hoy - fechaSeleccionada) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (edad < 10) {
        showNotification('error', 'Edad inválida', 'El estudiante debe tener al menos 10 años de edad.');
        fechaNacimiento.focus();
        return;
    }

    if (edad > 100) {
        showNotification('warning', 'Verifica la fecha', 'Por favor verifica que la fecha de nacimiento sea correcta.');
        fechaNacimiento.focus();
        return;
    }

    // 5. Género
    if (!genero.value || genero.value === "") {
        showNotification('error', 'Campo requerido', 'Por favor selecciona el género del estudiante.');
        genero.focus();
        return;
    }

    // 6. Celular
    if (!celular.value || celular.value.trim() === "") {
        showNotification('error', 'Campo requerido', 'Por favor ingresa el número de celular.');
        celular.focus();
        return;
    }
    
    if (!validarCelular(celular.value)) {
        showNotification('error', 'Celular inválido', 'El celular debe tener exactamente 9 dígitos.');
        celular.focus();
        return;
    }

    // 7. Email
    if (!email.value || email.value.trim() === "") {
        showNotification('error', 'Campo requerido', 'Por favor ingresa el correo electrónico.');
        email.focus();
        return;
    }
    
    if (!validarEmail(email.value)) {
        showNotification('error', 'Email inválido', 'Por favor ingresa un correo electrónico válido (ejemplo: usuario@correo.com).');
        email.focus();
        return;
    }

    // TODO CORRECTO - REGISTRAR
    const codigoEstudiante = generarCodigoEstudiante();
    const formData = new FormData(form);
    const datosEstudiante = {
        codigo: codigoEstudiante,
        edad: edad,
        fechaRegistro: new Date().toLocaleDateString('es-PE')
    };

    formData.forEach((value, key) => {
        datosEstudiante[key] = value;
    });

    // Notificación de éxito
    showNotification('success', '¡Bien hecho!', 'El estudiante fue registrado correctamente.');
    // Limpiar y cerrar
}

/* ============================================ */
/* VALIDACIÓN */
/* ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    const dniInput = document.querySelector('input[name="dni"]');
    if (dniInput) {
        dniInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 8) {
                this.value = this.value.slice(0, 8);
            }
        });
    }
    
    const celularInput = document.querySelector('input[name="celular"]');
    if (celularInput) {
        celularInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 9) {
                this.value = this.value.slice(0, 9);
            }
        });
    }
    
});