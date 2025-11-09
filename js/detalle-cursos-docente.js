// ...existing code...
(function () {
    'use strict';

    console.log('✅ detalle-curso.js cargado (gestión de pestañas)');

    function findTargetKey(btn) {
        return btn.getAttribute('data-target') || btn.getAttribute('data-tab') || btn.dataset.tab;
    }

    function findContentForKey(key) {
        if (!key) return null;
        // soporta varios formatos usados en las vistas:
        // - <div class="tab-content" data-tab="materials">
        // - <div id="tab-materiales">  (docente)
        // - <div class="tab-content" id="materials">
        // - <div id="materials">
        return document.querySelector(`.tab-content[data-tab="${key}"]`)
            || document.querySelector(`#tab-${key}`)
            || document.querySelector(`.tab-content#${key}`)
            || document.querySelector(`#${key}`);
    }

    // Funcionalidad de MODAL
    function initModal() {
        // Verificar que las funciones no estén ya definidas globalmente
        if (!window.abrirModal) {
            window.abrirModal = function() {
                const modal = document.getElementById('modalSubirMaterial');
                if (modal) {
                    modal.style.display = 'flex';
                    limpiarFormularioModal();
                    console.log('📂 Modal abierto');
                }
            };
        }

        if (!window.cerrarModal) {
            window.cerrarModal = function() {
                const modal = document.getElementById('modalSubirMaterial');
                if (modal) {
                    modal.style.display = 'none';
                    console.log('📂 Modal cerrado');
                }
            };
        }

        if (!window.subirMaterial) {
            window.subirMaterial = function() {
                agregarNuevoMaterial();
            };
        }

        // Botones de tipo de material
        const tipoMaterialBtns = document.querySelectorAll('.btn-tipo-material');
        tipoMaterialBtns.forEach(btn => {
            if (btn.dataset._tipoHandlerAttached === 'true') return;
            
            btn.addEventListener('click', function() {
                tipoMaterialBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
            
            btn.dataset._tipoHandlerAttached = 'true';
        });

        // Input de archivo
        const fileInput = document.getElementById('fileInput');
        if (fileInput && !fileInput.dataset._fileHandlerAttached) {
            fileInput.addEventListener('change', function() {
                const fileName = this.files[0]?.name;
                const uploadArea = document.querySelector('.file-upload-area p');
                if (fileName && uploadArea) {
                    uploadArea.textContent = `Archivo seleccionado: ${fileName}`;
                }
            });
            fileInput.dataset._fileHandlerAttached = 'true';
        }
        
        console.log('✅ Modal inicializado');
    }

    // Función para limpiar el formulario del modal
    function limpiarFormularioModal() {
        const tituloInput = document.querySelector('#modalSubirMaterial .input-custom');
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.querySelector('.file-upload-area p');
        const tipoMaterialBtns = document.querySelectorAll('.btn-tipo-material');
        
        if (tituloInput) tituloInput.value = '';
        if (fileInput) fileInput.value = '';
        if (uploadArea) uploadArea.textContent = 'Arrastra un archivo o haz clic para seleccionar';
        
        tipoMaterialBtns.forEach(btn => btn.classList.remove('active'));
        const pdfBtn = document.querySelector('.btn-tipo-material[data-tipo="pdf"]');
        if (pdfBtn) pdfBtn.classList.add('active');
    }

    // Función para agregar nuevo material
    function agregarNuevoMaterial() {
        const tituloInput = document.querySelector('#modalSubirMaterial .input-custom');
        const fileInput = document.getElementById('fileInput');
        const tipoSeleccionado = document.querySelector('.btn-tipo-material.active');
        
        // Validaciones
        if (!tituloInput || !tituloInput.value.trim()) {
            alert('⚠️ Por favor, ingresa un título para el material');
            return;
        }
        
        if (!fileInput || !fileInput.files[0]) {
            alert('⚠️ Por favor, selecciona un archivo');
            return;
        }
        
        if (!tipoSeleccionado) {
            alert('⚠️ Por favor, selecciona un tipo de material');
            return;
        }
        
        // Obtener datos
        const titulo = tituloInput.value.trim();
        const archivo = fileInput.files[0];
        const tipo = tipoSeleccionado.dataset.tipo.toUpperCase();
        const tamañoMB = (archivo.size / (1024 * 1024)).toFixed(1);
        
        // Obtener fecha actual
        const fecha = new Date();
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        
        // Obtener clase de badge según el tipo
        const badgeClass = `badge-${tipo.toLowerCase()}`;
        
        // Crear la nueva card de material
        const materialesGrid = document.querySelector('.materiales-grid');
        
        // Verificar si existe el mensaje de "sin materiales" y eliminarlo
        const mensajeVacio = materialesGrid.querySelector('div[style*="grid-column"]');
        if (mensajeVacio) {
            mensajeVacio.remove();
        }
        
        // Crear el HTML de la nueva card
        const nuevaMaterialCard = document.createElement('div');
        nuevaMaterialCard.className = 'material-card';
        nuevaMaterialCard.style.opacity = '0';
        nuevaMaterialCard.style.transform = 'scale(0.9)';
        nuevaMaterialCard.innerHTML = `
            <div class="material-info">
                <i class="bi bi-file-earmark-text material-icon"></i>
                <div class="material-details">
                    <div class="material-meta">
                        <span class="${badgeClass}">${tipo}</span>
                        <span class="material-size">${tamañoMB} MB</span>
                    </div>
                    <h4 class="material-name">${titulo}</h4>
                    <p class="material-date">Subido: ${fechaFormateada}</p>
                </div>
            </div>
            <div class="material-actions">
                <button class="btn-icon-action" title="Descargar">
                    <i class="bi bi-download"></i>
                </button>
                <button class="btn-icon-action btn-delete" title="Eliminar">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `;
        
        // Agregar al grid
        materialesGrid.appendChild(nuevaMaterialCard);
        
        // Animación de entrada
        setTimeout(() => {
            nuevaMaterialCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            nuevaMaterialCard.style.opacity = '1';
            nuevaMaterialCard.style.transform = 'scale(1)';
        }, 10);
        
        // Reinicializar los botones de eliminar para incluir el nuevo
        initDeleteButtons();
        
        // Actualizar contador
        actualizarContadorMateriales();
        
        // Cerrar modal
        cerrarModal();
        
        console.log(`✅ Material "${titulo}" agregado exitosamente`);
        
        // Mostrar notificación de éxito
        mostrarNotificacion('✅ Material subido exitosamente', 'success');
    }

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo = 'success') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }

    // Funcionalidad de ELIMINACIÓN de materiales
    function initDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        
        console.log(`🔍 Buscando botones de eliminar... Encontrados: ${deleteButtons.length}`);
        
        deleteButtons.forEach((btn, index) => {
            // Evitar duplicar event listeners
            if (btn.dataset._deleteHandlerAttached === 'true') {
                console.log(`⚠️ Botón ${index + 1} ya tiene listener asignado`);
                return;
            }
            
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🗑️ Click en botón eliminar');
                
                const materialCard = this.closest('.material-card');
                
                if (!materialCard) {
                    console.error('❌ No se encontró material-card');
                    return;
                }
                
                const materialName = materialCard.querySelector('.material-name');
                const nombreMaterial = materialName ? materialName.textContent.trim() : 'este material';
                
                console.log(`📋 Material a eliminar: "${nombreMaterial}"`);
                
                // Confirmar eliminación
                if (confirm(`¿Estás seguro de que deseas eliminar "${nombreMaterial}"?`)) {
                    console.log('✅ Usuario confirmó eliminación');
                    
                    // Animación de salida
                    materialCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    materialCard.style.opacity = '0';
                    materialCard.style.transform = 'scale(0.9)';
                    
                    // Eliminar después de la animación
                    setTimeout(() => {
                        materialCard.remove();
                        console.log('🗑️ Material eliminado del DOM');
                        actualizarContadorMateriales();
                        verificarMaterialesVacios();
                        mostrarNotificacion('🗑️ Material eliminado', 'success');
                    }, 300);
                } else {
                    console.log('❌ Usuario canceló eliminación');
                }
            });
            
            btn.dataset._deleteHandlerAttached = 'true';
            console.log(`✅ Listener asignado al botón ${index + 1}`);
        });
        
        console.log(`✅ ${deleteButtons.length} botones de eliminar inicializados`);
    }

    function actualizarContadorMateriales() {
        const materialesRestantes = document.querySelectorAll('.material-card').length;
        const statValues = document.querySelectorAll('.stat-box .stat-value');
        
        // El segundo stat-box es el de materiales
        if (statValues.length >= 2) {
            statValues[1].textContent = materialesRestantes;
            console.log(`📊 Contador actualizado: ${materialesRestantes} materiales`);
        }
    }

    function verificarMaterialesVacios() {
        const materialesGrid = document.querySelector('.materiales-grid');
        const materialesRestantes = document.querySelectorAll('.material-card').length;
        
        if (materialesRestantes === 0 && materialesGrid) {
            materialesGrid.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #6c757d; grid-column: 1 / -1;">
                    <i class="bi bi-folder2-open" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No hay materiales disponibles</p>
                    <p style="font-size: 0.9rem;">Haz clic en "Subir Material" para agregar contenido al curso</p>
                </div>
            `;
            console.log('📭 Mensaje de materiales vacíos mostrado');
        }
    }

    // Añadir estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Inicialización principal
    function init() {
        console.log('🚀 Inicializando funcionalidades de detalle-curso...');
        
        // Pequeño delay para asegurar que el DOM esté completamente renderizado
        setTimeout(() => {
            initTabs();
            initModal();
            initDeleteButtons();
            console.log('✅ Todas las funcionalidades inicializadas');
        }, 100);
    }

    // Ejecutar inmediatamente si el DOM ya está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // El DOM ya está listo, ejecutar inmediatamente
        init();
    }

})();