// /js/mensajeria.js

(function() {
    'use strict';

    const conversations = {
        'chat1': {
            name: 'Nombre Chat',
            role: 'Rol',
            messages: [
                // ... (Mantén aquí el array de mensajes de chat1)
                { type: 'received', text: 'Claro, sería bueno que leyeras el material que está publicado en el aula virtual', time: '10:25' },
                { type: 'sent', text: 'Perfecto, lo leeré hoy mismo.', time: '10:28' },
                { type: 'received', text: 'Excelente, sigue así 👍', time: '10:30' }
            ]
        },
        'chat2': {
            name: 'Nombre Chat 2',
            role: 'Rol',
            messages: [
                // ... (Mantén aquí el array de mensajes de chat2)
                { type: 'received', text: 'Recuerda que el examen es el próximo viernes', time: '09:15' },
                { type: 'sent', text: '¿Qué temas entraran en el examen?', time: '09:18' },
                { type: 'received', text: 'Los capítulos 1, 2 y 3 del libro principal', time: '09:20' },
                { type: 'sent', text: 'Perfecto, muchas gracias', time: '09:22' }
            ]
        }
        // Las nuevas conversaciones se añadirán a este objeto
    };

    /** Genera un color consistente basado en el nombre. */
    function getAvatarColor(name) {
        const colors = ['#dc3545', '#17a2b8', '#6c757d', '#ffc107', '#6f42c1', '#28a745', '#fd7e14', '#e83e8c', '#20c997', '#3498db'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    /** Inicializa el color de todos los avatares que aún no tienen. */
    function initializeAvatarColors() {
        document.querySelectorAll('.avatar[data-name]').forEach(avatar => {
            const name = avatar.getAttribute('data-name');
            if (name && !avatar.style.backgroundColor) {
                avatar.style.backgroundColor = getAvatarColor(name);
            }
        });
    }

    // ===============================================
    // 2. FUNCIONES PRINCIPALES DE MENSAJERÍA (loadConversation, createMessageElement, sendMessage)
    // ===============================================

    function loadConversation(chatId) {
        const conversation = conversations[chatId];
        if (!conversation) return;
        
        const chatHeaderInfo = document.querySelector('.chat-header-info');
        if (chatHeaderInfo) {
            chatHeaderInfo.innerHTML = `<h6>${conversation.name}</h6><small>${conversation.role}</small>`;
        }
        
        const chatHeaderAvatar = document.querySelector('.chat-header .avatar');
        if (chatHeaderAvatar) {
            const initials = conversation.name.split(' ').map(word => word[0]).join('').substring(0, 2);
            chatHeaderAvatar.textContent = initials;
            chatHeaderAvatar.setAttribute('data-name', conversation.name);
            chatHeaderAvatar.style.backgroundColor = getAvatarColor(conversation.name);
        }
        
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            
            conversation.messages.forEach(msg => {
                const messageDiv = createMessageElement(msg, conversation.name);
                chatMessages.appendChild(messageDiv);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function createMessageElement(msg, senderName) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;
        
        let avatarHTML = '';
        if (msg.type === 'received') {
            const initials = senderName.split(' ').map(word => word[0]).join('').substring(0, 2);
            avatarHTML = `
                <div class="avatar" data-name="${senderName}" style="background-color: ${getAvatarColor(senderName)}">
                    ${initials}
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            ${avatarHTML}
            <div class="message-content">
                <div class="message-bubble">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `;
        return messageDiv;
    }

    function sendMessage() {
        const messageInput = document.querySelector('.message-input');
        const text = messageInput.value.trim();
        
        if (!text) return;
        
        // Asumiendo que sabes qué chat está activo para añadir el mensaje a 'conversations'
        const activeChat = document.querySelector('.conversation-item.active');
        if (!activeChat) return; 
        const chatId = activeChat.getAttribute('data-chat-id');
        
        const chatMessages = document.querySelector('.chat-messages');
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        
        const newMessage = {
            type: 'sent',
            text: text,
            time: time
        };

        // **AGREGA EL MENSAJE AL OBJETO conversations** (Esto faltaba en la lógica de 'sendMessage')
        if (conversations[chatId]) {
            conversations[chatId].messages.push(newMessage);
        }
        
        const messageElement = createMessageElement(newMessage, '');
        chatMessages.appendChild(messageElement);
        
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // ===============================================
    // 3. FUNCIONES AUXILIARES Y EVENTOS DE SIDEBAR
    // ===============================================
    
    function initializeConversationClicks() {
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.removeEventListener('click', handleConversationClick); 
            item.addEventListener('click', handleConversationClick);
        });
    }

    function handleConversationClick(e) {
        e.preventDefault();
        document.querySelectorAll('.conversation-item').forEach(conv => conv.classList.remove('active'));
        this.classList.add('active');
        const chatId = this.getAttribute('data-chat-id');
        
        loadConversation(chatId);
        
        const messagingContainer = document.querySelector('.messaging-container');
        if (messagingContainer) {
            messagingContainer.classList.add('chat-open');
        }
    }

    function initializeBackButton() {
        const btnBack = document.querySelector('.btn-back-mobile');
        if (btnBack) {
            btnBack.addEventListener('click', function() {
                document.querySelector('.messaging-container')?.classList.remove('chat-open');
            });
        }
    }

    function initializeSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase().trim();
                const conversationItems = document.querySelectorAll('.conversation-item');
                conversationItems.forEach(item => {
                    const name = item.querySelector('.conversation-name')?.textContent.toLowerCase() || '';
                    const preview = item.querySelector('.conversation-preview')?.textContent.toLowerCase() || '';
                    const role = item.querySelector('.conversation-subject')?.textContent.toLowerCase() || '';
                    
                    if (name.includes(searchTerm) || preview.includes(searchTerm) || role.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                const visibleItems = document.querySelectorAll('.conversations-list .conversation-item[style="display: flex"]');
                let noResultsMsg = document.querySelector('.no-results-message');
                
                if (visibleItems.length === 0 && searchTerm !== '') {
                    if (!noResultsMsg) {
                        noResultsMsg = document.createElement('div');
                        noResultsMsg.className = 'no-results-message';
                        noResultsMsg.style.padding = '20px';
                        noResultsMsg.style.textAlign = 'center';
                        noResultsMsg.style.color = '#6c757d';
                        noResultsMsg.innerHTML = '<i class="bi bi-search"></i><br>No se encontraron conversaciones';
                        document.querySelector('.conversations-list').appendChild(noResultsMsg);
                    }
                    noResultsMsg.style.display = 'block';
                } else if (noResultsMsg) {
                    noResultsMsg.style.display = 'none';
                }
            });
        }
    }

    // ===============================================
    // 4. MODAL: NUEVO MENSAJE / SELECCIÓN DE DESTINATARIO
    // ===============================================
    
    const modalNuevoMensaje = document.getElementById('modalNuevoMensaje');
    const btnNuevo = document.querySelector('.btn-nuevo');
    const btnCerrarModal = document.querySelector('.btn-close-modal');
    const btnCancelarModal = document.querySelector('.modal-footer-nuevo .btn-cancelar');

    const destinatarioItems = document.querySelectorAll('.destinatario-item');

    const btnIniciarConversacion = document.querySelector('.btn-iniciar');
    const inputBusquedaDestinatarios = document.getElementById('searchDestinatarios');
    const mensajeSinResultados = document.querySelector('.no-results-modal');

    let destinatarioSeleccionado = null;


    // -------- ABRIR / CERRAR MODAL -------- //

    function abrirModalNuevoMensaje() {
        modalNuevoMensaje.style.display = 'flex';
        resetearEstadoModal();
    }

    function cerrarModalNuevoMensaje() {
        modalNuevoMensaje.style.display = 'none';
        resetearEstadoModal();
    }


    // -------- RESET DEL MODAL -------- //

    function resetearEstadoModal() {
        destinatarioSeleccionado = null;
        btnIniciarConversacion.disabled = true;

        destinatarioItems.forEach(item => item.classList.remove('selected'));

        // Reiniciar búsqueda
        inputBusquedaDestinatarios.value = '';
        destinatarioItems.forEach(item => item.style.display = 'flex');
        mensajeSinResultados.style.display = 'none';
    }


    // -------- SELECCIÓN DE DESTINATARIO -------- //

    function seleccionarDestinatario(event) {
        event.preventDefault();

        destinatarioItems.forEach(item => item.classList.remove('selected'));
        this.classList.add('selected');

        destinatarioSeleccionado = {
            id: this.dataset.studentId,
            name: this.dataset.studentName,
            role: this.dataset.studentCourse
        };

        btnIniciarConversacion.disabled = false;
    }


    // -------- BÚSQUEDA EN LISTA DEL MODAL -------- //

    function filtrarDestinatarios() {
        const termino = inputBusquedaDestinatarios.value.toLowerCase().trim();
        let coincidencias = 0;

        destinatarioItems.forEach(item => {
            const nombre = item.dataset.studentName.toLowerCase();
            const curso = item.dataset.studentCourse.toLowerCase();

            const coincide = nombre.includes(termino) || curso.includes(termino);
            item.style.display = coincide ? 'flex' : 'none';

            if (coincide) coincidencias++;
        });

        mensajeSinResultados.style.display = (coincidencias === 0 && termino !== '') ? 'flex' : 'none';
    }


    // -------- AGREGAR CONVERSACIÓN A LA SIDEBAR (Función reutilizada por iniciarConversacion) -------- //
    
    function agregarConversacionSidebar({ id, name, role }) {
        const lista = document.querySelector('.conversations-list');
        const iniciales = name.split(' ').map(p => p[0]).join('').substring(0, 2);
        const color = getAvatarColor(name);

        const element = document.createElement('a');
        element.href = '#';
        element.className = 'conversation-item';
        element.dataset.chatId = id;

        element.innerHTML = `
            <div class="avatar" data-name="${name}" style="background-color: ${color};">${iniciales}</div>
            <div class="conversation-info">
                <div class="conversation-header">
                    <h6 class="conversation-name">${name}</h6>
                    <span class="conversation-time">Ahora</span>
                </div>
                <p class="conversation-subject">${role}</p>
                <div class="conversation-footer">
                    <span class="conversation-preview">¡Inicia una conversación!</span>
                </div>
            </div>
        `;

        lista.prepend(element);
        initializeConversationClicks(); // Vuelve a inicializar listeners para el nuevo elemento
    }


    // -------- CREAR / ACTIVAR CONVERSACIÓN (Función principal del botón Iniciar) -------- //

    function iniciarConversacion() {
        if (!destinatarioSeleccionado) return;

        const { id, name, role } = destinatarioSeleccionado;

        // 1. Verificar si ya existe conversación. Si no existe, crearla y agregarla al sidebar.
        if (!conversations[id]) {
            conversations[id] = { name, role, messages: [] };
            agregarConversacionSidebar(destinatarioSeleccionado);
        }

        // 2. Cerrar el modal.
        cerrarModalNuevoMensaje();
        
        // 3. Cargar la conversación en el área de chat.
        loadConversation(id);

        // 4. Marcar el ítem en la sidebar como activo.
        document.querySelectorAll('.conversation-item').forEach(c => c.classList.remove('active'));
        document.querySelector(`.conversation-item[data-chat-id="${id}"]`)?.classList.add('active');

        // 5. Asegurar que el área de chat esté visible (especialmente en móvil).
        document.querySelector('.messaging-container')?.classList.add('chat-open');
    }


    // ===============================================
    // 5. INICIALIZACIÓN DE EVENTOS
    // ===============================================

    function initializeModalEvents() {
        // Eventos del Modal
        btnNuevo?.addEventListener('click', abrirModalNuevoMensaje);
        btnCerrarModal?.addEventListener('click', cerrarModalNuevoMensaje);
        btnCancelarModal?.addEventListener('click', cerrarModalNuevoMensaje);

        modalNuevoMensaje?.addEventListener('click', e => {
            // Cierra si se hace clic fuera del modal (en el overlay)
            if (e.target === modalNuevoMensaje) cerrarModalNuevoMensaje();
        });

        destinatarioItems.forEach(item =>
            item.addEventListener('click', seleccionarDestinatario)
        );

        btnIniciarConversacion?.addEventListener('click', iniciarConversacion);
        inputBusquedaDestinatarios?.addEventListener('input', filtrarDestinatarios);
    }
    
    // Función principal de inicialización
    function initializeApp() {
        initializeAvatarColors();
        initializeConversationClicks();
        initializeModalEvents(); // Inicializa los eventos del modal
        
        // Inicialización de la caja de chat
        const messageInput = document.querySelector('.message-input');
        const btnSend = document.querySelector('.btn-send');
        
        if (btnSend && messageInput) {
            btnSend.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        initializeBackButton();
        initializeSearch();
        
        // Carga la conversación activa por defecto
        const activeChat = document.querySelector('.conversation-item.active');
        if (activeChat) {
            loadConversation(activeChat.getAttribute('data-chat-id'));
        }
    }

    initializeApp();

})();