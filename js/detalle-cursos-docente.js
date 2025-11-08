(function () {
    'use strict';

    console.log('✅ Script detalle-cursos-docente.js cargado');

    // Funcionalidad de TABS
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            // Evitar duplicar event listeners
            if (btn.dataset._tabHandlerAttached === 'true') return;
            
            btn.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Remover active de todos los botones y contenidos
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Activar el tab seleccionado
                this.classList.add('active');
                const targetContent = document.getElementById(`tab-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
            
            btn.dataset._tabHandlerAttached = 'true';
        });
        
        console.log(`✅ ${tabButtons.length} tabs inicializados`);
    }

    // Funcionalidad de MODAL
    function initModal() {
        // Verificar que las funciones no estén ya definidas globalmente
        if (!window.abrirModal) {
            window.abrirModal = function() {
                const modal = document.getElementById('modalSubirMaterial');
                if (modal) {
                    modal.style.display = 'flex';
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
        const statValue = document.querySelector('.stat-box .stat-value');
        
        if (statValue) {
            statValue.textContent = materialesRestantes;
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