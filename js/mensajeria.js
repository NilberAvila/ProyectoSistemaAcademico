// /js/mensajeria.js

(function() {
    'use strict';

    console.log('💬 [MENSAJERIA] Script cargado');

    // ===============================================
    // DETECTAR ROL DEL USUARIO
    // ===============================================

    function obtenerRolUsuario() {
        // Detectar por la URL actual
        const path = window.location.pathname;
        if (path.includes('/Docentes/')) {
            return 'docente';
        } else if (path.includes('/Estudiantes/')) {
            return 'estudiante';
        }
        return 'estudiante'; // Por defecto
    }

    const ROL_USUARIO = obtenerRolUsuario();
    console.log('👤 [MENSAJERIA] Rol detectado:', ROL_USUARIO);

    // ===============================================
    // DATOS INICIALES POR ROL
    // ===============================================

    // Conversaciones para DOCENTES
    const conversationsDocente = {
        'chat1': {
            id: 'chat1',
            name: 'Juan Pérez García',
            role: 'Estudiante - Matemática 001',
            lastMessage: 'Profesor, ¿podría explicarme...',
            time: '10:30',
            unread: 2,
            messages: [
                { type: 'received', text: 'Profesor, ¿podría explicarme la tarea 5?', time: '10:25' },
                { type: 'sent', text: 'Claro, ¿qué parte no entiendes?', time: '10:28' },
                { type: 'received', text: 'El ejercicio 3, no comprendo el procedimiento', time: '10:30' }
            ]
        },
        'chat2': {
            id: 'chat2',
            name: 'María López Sánchez',
            role: 'Estudiante - Matemática 002',
            lastMessage: 'Gracias por la explicación',
            time: 'Ayer',
            unread: 0,
            messages: [
                { type: 'received', text: '¿Cuándo es la entrega del proyecto?', time: '09:15' },
                { type: 'sent', text: 'El próximo viernes antes de las 11:59 PM', time: '09:18' },
                { type: 'received', text: 'Gracias por la explicación', time: '09:20' }
            ]
        },
        'chat3': {
            id: 'chat3',
            name: 'Carlos Rodríguez Martínez',
            role: 'Estudiante - Matemática 001',
            lastMessage: '¿Habrá clase mañana?',
            time: 'Hace 2 días',
            unread: 1,
            messages: [
                { type: 'received', text: '¿Habrá clase mañana?', time: '14:30' },
                { type: 'sent', text: 'Sí, la clase será normal', time: '14:45' }
            ]
        }
    };

    // Conversaciones para ESTUDIANTES
    const conversationsEstudiante = {
        'chat1': {
            id: 'chat1',
            name: 'Luis Alfonso Núñez',
            role: 'Docente - Matemática',
            lastMessage: 'El proyecto se ve muy bien...',
            time: '10:30',
            unread: 2,
            messages: [
                { type: 'received', text: 'Claro, sería bueno que leyeras el material que está publicado en el aula virtual', time: '10:25' },
                { type: 'sent', text: 'Perfecto, lo leeré hoy mismo.', time: '10:28' },
                { type: 'received', text: 'Excelente, sigue así 👍', time: '10:30' }
            ]
        },
        'chat2': {
            id: 'chat2',
            name: 'Pancracio Gómez Velásquez',
            role: 'Docente - Geometría',
            lastMessage: 'Recuerda que el examen...',
            time: 'Ayer',
            unread: 1,
            messages: [
                { type: 'received', text: 'Recuerda que el examen es el próximo viernes', time: '09:15' },
                { type: 'sent', text: '¿Qué temas entrarán en el examen?', time: '09:18' },
                { type: 'received', text: 'Los capítulos 1, 2 y 3 del libro principal', time: '09:20' },
                { type: 'sent', text: 'Perfecto, muchas gracias', time: '09:22' }
            ]
        },
        'chat3': {
            id: 'chat3',
            name: 'Ana Fernández Torres',
            role: 'Docente - Aritmética',
            lastMessage: 'La clase de mañana será virtual',
            time: 'Hace 3 días',
            unread: 0,
            messages: [
                { type: 'received', text: 'La clase de mañana será virtual', time: '16:00' },
                { type: 'sent', text: 'Entendido, ¿a qué hora?', time: '16:15' },
                { type: 'received', text: 'A las 10:00 AM por Zoom', time: '16:20' }
            ]
        }
    };

    // Seleccionar conversaciones según el rol
    const conversations = ROL_USUARIO === 'docente' ? conversationsDocente : conversationsEstudiante;

    // Lista de contactos para el modal (también varía por rol)
    const estudiantesParaDocente = [
        { id: 'est1', name: 'Juan Pérez García', course: 'Matemática - 001' },
        { id: 'est2', name: 'María López Sánchez', course: 'Matemática - 002' },
        { id: 'est3', name: 'Carlos Rodríguez Martínez', course: 'Matemática - 001' },
        { id: 'est4', name: 'Ana Fernández Torres', course: 'Matemática - 003' },
        { id: 'est5', name: 'Pedro González Ruiz', course: 'Matemática - 001' },
        { id: 'est6', name: 'Laura Martínez Díaz', course: 'Geometría - 004' },
        { id: 'est7', name: 'David Sánchez López', course: 'Geometría - 002' },
        { id: 'est8', name: 'Isabel Gómez Fernández', course: 'Aritmética - 003' }
    ];

    const docentesParaEstudiante = [
        { id: 'doc1', name: 'Luis Alfonso Núñez', course: 'Docente - Matemática' },
        { id: 'doc2', name: 'Pancracio Gómez Velásquez', course: 'Docente - Geometría' },
        { id: 'doc3', name: 'Ana Fernández Torres', course: 'Docente - Aritmética' },
        { id: 'doc4', name: 'Roberto Silva Mora', course: 'Docente - Física' },
        { id: 'doc5', name: 'Carmen Ruiz Vega', course: 'Docente - Química' }
    ];

    const estudiantes = ROL_USUARIO === 'docente' ? estudiantesParaDocente : docentesParaEstudiante;

    let currentChatId = null;
    let selectedDestinatario = null;

    // ===============================================
    // FUNCIONES DE INICIALIZACIÓN
    // ===============================================

    function init() {
        console.log('🎯 [MENSAJERIA] Inicializando para rol:', ROL_USUARIO);
        actualizarTextoModal();
        cargarListaConversaciones();
        cargarListaEstudiantes();
        configurarEventos();
        
        // Cargar primera conversación por defecto
        const primerChat = Object.keys(conversations)[0];
        if (primerChat) {
            cargarConversacion(primerChat);
        }
    }

    // ===============================================
    // ACTUALIZAR TEXTOS SEGÚN ROL
    // ===============================================

    function actualizarTextoModal() {
        const modalTitle = document.querySelector('.modal-header-nuevo h5');
        const searchPlaceholder = document.getElementById('searchDestinatarios');
        const noResultsText = document.querySelector('.no-results-modal p');

        if (ROL_USUARIO === 'docente') {
            if (modalTitle) modalTitle.textContent = 'Nuevo Mensaje a Estudiante';
            if (searchPlaceholder) searchPlaceholder.placeholder = 'Buscar estudiante...';
            if (noResultsText) noResultsText.textContent = 'No se encontraron estudiantes';
        } else {
            if (modalTitle) modalTitle.textContent = 'Nuevo Mensaje a Docente';
            if (searchPlaceholder) searchPlaceholder.placeholder = 'Buscar docente...';
            if (noResultsText) noResultsText.textContent = 'No se encontraron docentes';
        }
    }

    // ===============================================
    // SIDEBAR: LISTA DE CONVERSACIONES
    // ===============================================

    function cargarListaConversaciones() {
        const isMobile = window.matchMedia("(max-width: 800px)").matches;
        const chatArea = document.querySelector('.chat-area');
        if (isMobile){
            chatArea.style.display = 'none';
        }
        const lista = document.querySelector('.conversations-list');
        if (!lista) return;

        lista.innerHTML = Object.values(conversations).map(conv => `
            <a href="#" class="conversation-item ${conv.id === currentChatId ? 'active' : ''}" data-chat-id="${conv.id}">
                <div class="avatar" data-name="${conv.name}" style="background-color: ${getAvatarColor(conv.name)}">
                    ${getInitials(conv.name)}
                </div>
                <div class="conversation-info">
                    <div class="conversation-header">
                        <h6 class="conversation-name">${conv.name}</h6>
                        <span class="conversation-time">${conv.time}</span>
                    </div>
                    <p class="conversation-subject">${conv.role}</p>
                    <div class="conversation-footer">
                        <span class="conversation-preview">${conv.lastMessage}</span>
                        ${conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : ''}
                    </div>
                </div>
            </a>
        `).join('');

        // Agregar eventos a los items
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const chatId = this.dataset.chatId;
                cargarConversacion(chatId);
                const chatArea = document.querySelector('.chat-area');
                chatArea.style.display = 'flex';
                
                // Marcar como activo
                document.querySelectorAll('.conversation-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Para móviles
                document.querySelector('.messaging-container')?.classList.add('chat-open');
            });
        });

        console.log('✅ [MENSAJERIA] Conversaciones cargadas:', Object.keys(conversations).length, '(Rol:', ROL_USUARIO + ')');
    }

    // ===============================================
    // ÁREA DE CHAT: CARGAR CONVERSACIÓN
    // ===============================================

    function cargarConversacion(chatId) {
        const conversation = conversations[chatId];
        if (!conversation) return;

        currentChatId = chatId;
        // Actualizar header del chat
        const chatHeader = document.querySelector('.chat-header-info');
        if (chatHeader) {
            chatHeader.innerHTML = `
                <h6>${conversation.name}</h6>
                <small>${conversation.role}</small>
            `;
        }

        const chatHeaderAvatar = document.querySelector('.chat-header .avatar');
        if (chatHeaderAvatar) {
            chatHeaderAvatar.textContent = getInitials(conversation.name);
            chatHeaderAvatar.style.backgroundColor = getAvatarColor(conversation.name);
        }

        // Cargar mensajes
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = conversation.messages.map(msg => 
                createMessageHTML(msg, conversation.name)
            ).join('');
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Marcar como leído
        conversation.unread = 0;
        actualizarBadge(chatId);

        console.log('📖 [MENSAJERIA] Conversación cargada:', conversation.name);
    }

    function createMessageHTML(msg, senderName) {
        const avatarHTML = msg.type === 'received' 
            ? `<div class="avatar" style="background-color: ${getAvatarColor(senderName)}">${getInitials(senderName)}</div>`
            : '';

        return `
            <div class="message ${msg.type}">
                ${avatarHTML}
                <div class="message-content">
                    <div class="message-bubble">${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            </div>
        `;
    }

    // ===============================================
    // ENVIAR MENSAJE
    // ===============================================

    function enviarMensaje() {
        const input = document.querySelector('.message-input');
        const text = input.value.trim();

        if (!text || !currentChatId) return;

        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newMessage = {
            type: 'sent',
            text: text,
            time: time
        };

        // Agregar mensaje a la conversación
        conversations[currentChatId].messages.push(newMessage);
        conversations[currentChatId].lastMessage = text.substring(0, 30) + '...';
        conversations[currentChatId].time = time;

        // Actualizar vista
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML += createMessageHTML(newMessage, '');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Actualizar sidebar
        cargarListaConversaciones();
        document.querySelector(`.conversation-item[data-chat-id="${currentChatId}"]`)?.classList.add('active');

        input.value = '';
        console.log('📤 [MENSAJERIA] Mensaje enviado');
    }

    // ===============================================
    // MODAL: NUEVO MENSAJE
    // ===============================================

    function cargarListaEstudiantes() {
        const lista = document.querySelector('.destinatarios-list');
        if (!lista) return;

        lista.innerHTML = estudiantes.map(est => `
            <div class="destinatario-item" data-student-id="${est.id}" data-student-name="${est.name}" data-student-course="${est.course}">
                <div class="avatar" style="background-color: ${getAvatarColor(est.name)}">
                    ${getInitials(est.name)}
                </div>
                <div class="destinatario-info">
                    <h6>${est.name}</h6>
                    <small>${est.course}</small>
                </div>
                <i class="bi bi-check-circle-fill" style="display: none;"></i>
            </div>
        `).join('');

        // Agregar eventos
        document.querySelectorAll('.destinatario-item').forEach(item => {
            item.addEventListener('click', function() {
                // Deseleccionar todos
                document.querySelectorAll('.destinatario-item').forEach(i => {
                    i.classList.remove('selected');
                    i.querySelector('.bi-check-circle-fill').style.display = 'none';
                });

                // Seleccionar este
                this.classList.add('selected');
                this.querySelector('.bi-check-circle-fill').style.display = 'block';

                selectedDestinatario = {
                    id: this.dataset.studentId,
                    name: this.dataset.studentName,
                    role: this.dataset.studentCourse
                };

                document.querySelector('.btn-iniciar').disabled = false;
            });
        });

        const tipoContacto = ROL_USUARIO === 'docente' ? 'Estudiantes' : 'Docentes';
        console.log('✅ [MENSAJERIA]', tipoContacto, 'cargados:', estudiantes.length);
    }

    function abrirModalNuevo() {
        const modal = document.getElementById('modalNuevoMensaje');
        if (modal) {
            modal.style.display = 'flex';
            resetearModal();
        }
    }

    function cerrarModalNuevo() {
        const modal = document.getElementById('modalNuevoMensaje');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function resetearModal() {
        selectedDestinatario = null;
        document.querySelector('.btn-iniciar').disabled = true;
        document.querySelectorAll('.destinatario-item').forEach(item => {
            item.classList.remove('selected');
            item.querySelector('.bi-check-circle-fill').style.display = 'none';
        });
        document.getElementById('searchDestinatarios').value = '';
        document.querySelectorAll('.destinatario-item').forEach(item => item.style.display = 'flex');
    }

    function iniciarNuevaConversacion() {
        if (!selectedDestinatario) return;

        const { id, name, role } = selectedDestinatario;

        // Verificar si ya existe
        if (!conversations[id]) {
            conversations[id] = {
                id: id,
                name: name,
                role: role,
                lastMessage: '¡Inicia una conversación!',
                time: 'Ahora',
                unread: 0,
                messages: []
            };
        }

        // Recargar lista
        cargarListaConversaciones();
        cargarConversacion(id);
        const chatArea = document.querySelector('.chat-area');
        chatArea.style.display = 'flex';
        
        // Marcar como activo
        document.querySelector(`.conversation-item[data-chat-id="${id}"]`)?.classList.add('active');
        
        cerrarModalNuevo();
        document.querySelector('.messaging-container')?.classList.add('chat-open');

        console.log('✨ [MENSAJERIA] Nueva conversación iniciada con:', name);
    }

    // ===============================================
    // BÚSQUEDA Y FILTROS
    // ===============================================

    function configurarBusquedaSidebar() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            const items = document.querySelectorAll('.conversation-item');
            let visibles = 0;

            items.forEach(item => {
                const name = item.querySelector('.conversation-name')?.textContent.toLowerCase() || '';
                const preview = item.querySelector('.conversation-preview')?.textContent.toLowerCase() || '';
                const role = item.querySelector('.conversation-subject')?.textContent.toLowerCase() || '';

                if (name.includes(term) || preview.includes(term) || role.includes(term)) {
                    item.style.display = 'flex';
                    visibles++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Mensaje sin resultados
            let noResults = document.querySelector('.no-results-message');
            if (visibles === 0 && term !== '') {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results-message text-center p-4 text-muted';
                    noResults.innerHTML = '<i class="bi bi-search"></i><br>No se encontraron conversaciones';
                    document.querySelector('.conversations-list').appendChild(noResults);
                }
                noResults.style.display = 'block';
            } else if (noResults) {
                noResults.style.display = 'none';
            }
        });
    }

    function configurarBusquedaModal() {
        const searchInput = document.getElementById('searchDestinatarios');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            const items = document.querySelectorAll('.destinatario-item');
            let visibles = 0;

            items.forEach(item => {
                const name = item.dataset.studentName.toLowerCase();
                const course = item.dataset.studentCourse.toLowerCase();

                if (name.includes(term) || course.includes(term)) {
                    item.style.display = 'flex';
                    visibles++;
                } else {
                    item.style.display = 'none';
                }
            });

            const noResults = document.querySelector('.no-results-modal');
            if (noResults) {
                noResults.style.display = (visibles === 0 && term !== '') ? 'flex' : 'none';
            }
        });
    }

    // ===============================================
    // CONFIGURAR EVENTOS
    // ===============================================

    function configurarEventos() {
        // Botón enviar mensaje
        const btnSend = document.querySelector('.btn-send');
        const messageInput = document.querySelector('.message-input');
        
        if (btnSend) {
            btnSend.addEventListener('click', enviarMensaje);
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    enviarMensaje();
                }
            });
        }

        // Botón nuevo mensaje
        const btnNuevo = document.querySelector('.btn-nuevo');
        if (btnNuevo) {
            btnNuevo.addEventListener('click', abrirModalNuevo);
        }

        // Botones cerrar modal
        const btnCerrarModal = document.querySelector('.btn-close-modal');
        const btnCancelarModal = document.querySelector('.modal-footer-nuevo .btn-cancelar');
        
        if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalNuevo);
        if (btnCancelarModal) btnCancelarModal.addEventListener('click', cerrarModalNuevo);

        // Click fuera del modal
        const modal = document.getElementById('modalNuevoMensaje');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) cerrarModalNuevo();
            });
        }

        // Botón iniciar conversación
        const btnIniciar = document.querySelector('.btn-iniciar');
        if (btnIniciar) {
            btnIniciar.addEventListener('click', iniciarNuevaConversacion);
        }

        // Botón volver (móvil)
        const btnBack = document.querySelector('.btn-back-mobile');
        if (btnBack) {
            btnBack.addEventListener('click', function() {
                document.querySelector('.messaging-container')?.classList.remove('chat-open');
                const chatArea = document.querySelector('.chat-area');
                chatArea.style.display = 'none';
            });
        }

        // Búsquedas
        configurarBusquedaSidebar();
        configurarBusquedaModal();

        console.log('✅ [MENSAJERIA] Eventos configurados');
    }

    // ===============================================
    // FUNCIONES AUXILIARES
    // ===============================================

    function getInitials(name) {
        return name.split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    function getAvatarColor(name) {
        const colors = ['#dc3545', '#17a2b8', '#6c757d', '#ffc107', '#6f42c1', '#28a745', '#fd7e14', '#e83e8c', '#20c997', '#3498db'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    function actualizarBadge(chatId) {
        const item = document.querySelector(`.conversation-item[data-chat-id="${chatId}"]`);
        if (item) {
            const badge = item.querySelector('.unread-badge');
            const unread = conversations[chatId].unread;
            
            if (badge) {
                if (unread > 0) {
                    badge.textContent = unread;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    }

    // ===============================================
    // INICIALIZAR
    // ===============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [MENSAJERIA] Script configurado para rol:', ROL_USUARIO);
})();