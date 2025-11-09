console.log('🔥 SCRIPT DETALLE-CURSO INICIADO');

(function() {
    'use strict';

    let cursoActual = null;
    let archivoSeleccionado = null;
    let contadorIdMaterial = 100;

    let materialesPorCurso = {
        1: [
            { id: 1, tipo: 'PDF', nombre: 'Iniciación a la matemática universitaria', fecha: '30/9/2025', tamano: '2.5 MB' },
            { id: 2, tipo: 'PDF', nombre: 'Manual para la Matemática Universitaria', fecha: '30/9/2025', tamano: '2.5 MB' },
            { id: 3, tipo: 'VIDEO', nombre: 'Introducción al Desarrollo Web', fecha: '28/9/2025', tamano: '45 MB' }
        ],
        2: [
            { id: 4, tipo: 'PDF', nombre: 'Programación Orientada a Objetos', fecha: '25/9/2025', tamano: '3.2 MB' },
            { id: 5, tipo: 'WORD', nombre: 'Ejercicios de Práctica', fecha: '24/9/2025', tamano: '1.8 MB' }
        ]
    };

    const estudiantesPorCurso = {
        1: [
            { id: 1, nombre: 'Juan Pérez García', codigo: '2021001', email: 'juan.perez@mail.com', asistencia: 95, promedio: 85 },
            { id: 2, nombre: 'María López Sánchez', codigo: '2021002', email: 'maria.lopez@mail.com', asistencia: 92, promedio: 88 }
        ],
        2: [
            { id: 3, nombre: 'Carlos Rodríguez', codigo: '2021003', email: 'carlos.rodriguez@mail.com', asistencia: 88, promedio: 82 }
        ]
    };

    const inicializar = () => {
        console.log('✅ Inicializando detalle-curso...');
        
        if (!document.getElementById('materialesList')) {
            console.log('⏳ Esperando DOM...');
            setTimeout(inicializar, 200);
            return;
        }

        cargarCursoDesdeStorage();
        configurarTabsPersonalizados();
        configurarEventos(); // ✅ Esto ahora incluye los botones de subir material
        configurarModalSubirMaterial();
    };

    function cargarCursoDesdeStorage() {
        const cursoStr = localStorage.getItem('cursoSeleccionado');
        
        if (cursoStr) {
            cursoActual = JSON.parse(cursoStr);
            console.log('📚 Curso cargado:', cursoActual);
            mostrarInformacionCurso();
            cargarMateriales();
        } else {
            console.warn('⚠️ No hay curso seleccionado');
        }
    }

    function mostrarInformacionCurso() {
        if (!cursoActual) return;

        const elementos = {
            'cursoTitulo': `${cursoActual.nombre} - ${cursoActual.codigo}`,
            'cursoEstudiantes': cursoActual.estudiantes,
            'cursoHorario': cursoActual.horario,
            'cursoCodigo': cursoActual.codigo,
            'cursoPromedio': Math.floor(Math.random() * 50) + 50,
            'cursoAsistencia': `${Math.floor(Math.random() * 20) + 80}%`
        };

        Object.entries(elementos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.textContent = valor;
        });

        actualizarContadorMateriales();
    }

    function actualizarContadorMateriales() {
        const materiales = materialesPorCurso[cursoActual?.id] || [];
        const contador = document.getElementById('cursoMateriales');
        if (contador) contador.textContent = materiales.length;
    }

    function configurarTabsPersonalizados() {
        const tabButtons = document.querySelectorAll('.custom-tab');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.tab-content-item').forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetContent = document.getElementById(`tab-${targetTab}`);
                if (targetContent) targetContent.classList.add('active');
                
                if (targetTab === 'estudiantes') {
                    cargarEstudiantes();
                } else if (targetTab === 'materiales') {
                    cargarMateriales();
                }
            });
        });
        
        console.log('✅ Tabs configurados');
    }

    // ✅ ESTA ES LA FUNCIÓN CLAVE - Movida y mejorada
    function configurarEventos() {
        console.log('⚙️ Configurando eventos generales...');
        
        // Botón volver
        const btnVolver = document.getElementById('btnVolverCursos');
        if (btnVolver) {
            btnVolver.addEventListener('click', function() {
                const navLink = document.querySelector('[data-view="/pages/Docentes/cursos-aula.html"]');
                if (navLink) navLink.click();
            });
            console.log('✅ Botón volver configurado');
        }

        // ⚠️ IMPORTANTE: Los botones de subir material deben configurarse AQUÍ
        const btnSubirMaterial = document.getElementById('btnSubirMaterial');
        if (btnSubirMaterial) {
            console.log('✅ Botón subir material encontrado');
            btnSubirMaterial.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 Click en subir material');
                abrirModalSubir();
            });
        } else {
            console.warn('⚠️ Botón subir material NO encontrado');
        }
        
        // Este botón solo aparece cuando no hay materiales
        const btnSubirPrimerMaterial = document.getElementById('btnSubirPrimerMaterial');
        if (btnSubirPrimerMaterial) {
            console.log('✅ Botón subir primer material encontrado');
            btnSubirPrimerMaterial.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 Click en subir primer material');
                abrirModalSubir();
            });
        }

        // Buscador de estudiantes
        const searchInput = document.getElementById('searchEstudiante');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                filtrarEstudiantes(e.target.value);
            });
        }
    }

    function abrirModalSubir() {
        console.log('🚀 Abriendo modal subir material...');
        
        const modalElement = document.getElementById('modalSubirMaterial');
        
        if (!modalElement) {
            console.error('❌ Modal NO existe en el DOM');
            alert('Error: El formulario de subida no está disponible');
            return;
        }
        
        console.log('✅ Modal encontrado en el DOM');
        
        // Rellenar nombre del curso
        const nombreCursoModal = document.getElementById('nombreCursoModal');
        if (nombreCursoModal && cursoActual) {
            nombreCursoModal.value = `${cursoActual.nombre} - ${cursoActual.codigo}`;
            console.log('✅ Nombre del curso establecido');
        }

        // Abrir modal manualmente (método más confiable)
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        modalElement.setAttribute('aria-modal', 'true');
        modalElement.setAttribute('role', 'dialog');
        modalElement.removeAttribute('aria-hidden');
        
        // Crear backdrop
        let backdrop = document.getElementById('modalBackdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'modalBackdrop';
            document.body.appendChild(backdrop);
        }
        
        // Añadir clase al body
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '0px';
        
        console.log('✅ Modal abierto correctamente');
    }

    function cerrarModalManual() {
        console.log('🔒 Cerrando modal...');
        
        const modalElement = document.getElementById('modalSubirMaterial');
        const backdrop = document.getElementById('modalBackdrop');
        
        if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
            modalElement.removeAttribute('role');
        }
        
        if (backdrop) {
            backdrop.remove();
        }
        
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Limpiar formulario
        limpiarFormularioModal();
        
        console.log('✅ Modal cerrado correctamente');
    }

    function configurarModalSubirMaterial() {
        console.log('🎬 Configurando funcionalidad del modal...');
        
        const uploadArea = document.getElementById('uploadArea');
        const archivoInput = document.getElementById('archivoMaterial');
        const btnConfirmarSubir = document.getElementById('btnConfirmarSubir');
        const btnRemoverArchivo = document.getElementById('btnRemoverArchivo');
        const modalElement = document.getElementById('modalSubirMaterial');

        if (!uploadArea || !archivoInput || !modalElement) {
            console.error('❌ Elementos del modal no encontrados');
            return;
        }

        // Click en área de subida
        uploadArea.addEventListener('click', function(e) {
            if (!e.target.closest('#btnRemoverArchivo')) {
                archivoInput.click();
            }
        });

        // Drag & Drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                manejarArchivoSeleccionado(files[0]);
            }
        });

        // Selección de archivo
        archivoInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                manejarArchivoSeleccionado(e.target.files[0]);
            }
        });

        // Remover archivo
        if (btnRemoverArchivo) {
            btnRemoverArchivo.addEventListener('click', (e) => {
                e.stopPropagation();
                limpiarArchivoSeleccionado();
            });
        }

        // Confirmar subida
        if (btnConfirmarSubir) {
            btnConfirmarSubir.addEventListener('click', confirmarSubidaMaterial);
        }

        // ⚠️ IMPORTANTE: Configurar botones de cerrar
        const btnsCerrar = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
        btnsCerrar.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                cerrarModalManual();
            });
        });

        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalElement.classList.contains('show')) {
                cerrarModalManual();
            }
        });

        // Cerrar al hacer clic en el backdrop
        document.addEventListener('click', function(e) {
            const backdrop = document.getElementById('modalBackdrop');
            if (e.target === backdrop) {
                cerrarModalManual();
            }
        });

        console.log('✅ Modal configurado completamente');
    }

    function manejarArchivoSeleccionado(file) {
        const maxSize = 524288000; // 500 MB
        if (file.size > maxSize) {
            mostrarNotificacion('El archivo excede el tamaño máximo de 500 MB', 'error');
            return;
        }

        archivoSeleccionado = file;

        document.querySelector('.upload-placeholder').classList.add('d-none');
        const uploadPreview = document.getElementById('uploadPreview');
        uploadPreview.classList.remove('d-none');

        document.getElementById('nombreArchivo').textContent = file.name;
        document.getElementById('tamanoArchivo').textContent = formatearTamano(file.size);

        console.log('📎 Archivo seleccionado:', file.name, formatearTamano(file.size));
    }

    function limpiarArchivoSeleccionado() {
        archivoSeleccionado = null;
        document.getElementById('archivoMaterial').value = '';
        
        document.querySelector('.upload-placeholder').classList.remove('d-none');
        document.getElementById('uploadPreview').classList.add('d-none');
    }

    function limpiarFormularioModal() {
        const tituloInput = document.getElementById('tituloMaterial');
        const tipoPDF = document.getElementById('tipoPDF');
        
        if (tituloInput) tituloInput.value = '';
        if (tipoPDF) tipoPDF.checked = true;
        
        limpiarArchivoSeleccionado();
    }

    function confirmarSubidaMaterial() {
        const titulo = document.getElementById('tituloMaterial').value.trim();
        const tipoSeleccionado = document.querySelector('input[name="tipoMaterial"]:checked');

        if (!titulo) {
            mostrarNotificacion('Por favor ingresa un título para el material', 'warning');
            return;
        }

        if (!archivoSeleccionado) {
            mostrarNotificacion('Por favor selecciona un archivo', 'warning');
            return;
        }

        const nuevoMaterial = {
            id: ++contadorIdMaterial,
            tipo: tipoSeleccionado.value,
            nombre: titulo,
            fecha: obtenerFechaActual(),
            tamano: formatearTamano(archivoSeleccionado.size)
        };

        if (!materialesPorCurso[cursoActual.id]) {
            materialesPorCurso[cursoActual.id] = [];
        }
        materialesPorCurso[cursoActual.id].push(nuevoMaterial);

        console.log('✅ Material agregado:', nuevoMaterial);

        // Cerrar modal
        cerrarModalManual();

        // Recargar lista
        cargarMateriales();
        
        // Notificación
        mostrarNotificacion(`Material "${titulo}" subido exitosamente`, 'success');
    }

    function formatearTamano(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    function obtenerFechaActual() {
        const fecha = new Date();
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    }

    function cargarMateriales() {
        console.log('📦 Cargando materiales...');
        
        const materialesList = document.getElementById('materialesList');
        const noMaterialesMsg = document.getElementById('noMaterialesMsg');
        
        if (!materialesList || !noMaterialesMsg) {
            console.error('❌ Elementos no encontrados');
            return;
        }

        const materiales = materialesPorCurso[cursoActual.id] || [];

        if (materiales.length === 0) {
            materialesList.innerHTML = '';
            noMaterialesMsg.classList.remove('d-none');
            
            // ⚠️ RECONFIGURAR el botón que aparece cuando no hay materiales
            setTimeout(() => {
                const btnSubirPrimerMaterial = document.getElementById('btnSubirPrimerMaterial');
                if (btnSubirPrimerMaterial) {
                    btnSubirPrimerMaterial.addEventListener('click', function(e) {
                        e.preventDefault();
                        abrirModalSubir();
                    });
                }
            }, 100);
            
            actualizarContadorMateriales();
            return;
        }

        noMaterialesMsg.classList.add('d-none');
        
        materialesList.innerHTML = materiales.map(material => `
            <div class="col-md-6" id="material-${material.id}">
                <div class="dashboard-card p-3 material-card">
                    <div class="d-flex align-items-start">
                        <div class="material-icon material-${material.tipo.toLowerCase()}">
                            <i class="bi ${getTipoIcon(material.tipo)}"></i>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <div class="mb-2">
                                <span class="badge bg-${getTipoBadgeColor(material.tipo)}">${material.tipo}</span>
                                <span class="badge bg-secondary ms-1">${material.tamano}</span>
                            </div>
                            <h6 class="mb-2 text-uppercase">${material.nombre}</h6>
                            <small class="text-muted">Subido: ${material.fecha}</small>
                            <div class="mt-3 d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary btn-descargar" data-id="${material.id}">
                                    <i class="bi bi-download"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${material.id}" data-nombre="${material.nombre}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const id = parseInt(this.getAttribute('data-id'));
                const nombre = this.getAttribute('data-nombre');
                eliminarMaterial(id, nombre);
            });
        });

        document.querySelectorAll('.btn-descargar').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const id = parseInt(this.getAttribute('data-id'));
                descargarMaterial(id);
            });
        });

        console.log('✅ Materiales cargados:', materiales.length);
        actualizarContadorMateriales();
    }

    function getTipoIcon(tipo) {
        const icons = {
            'PDF': 'bi-file-pdf',
            'VIDEO': 'bi-play-circle',
            'WORD': 'bi-file-word',
            'PPT': 'bi-file-ppt',
            'EXCEL': 'bi-file-excel'
        };
        return icons[tipo] || 'bi-file-earmark';
    }

    function getTipoBadgeColor(tipo) {
        const colors = {
            'PDF': 'danger',
            'VIDEO': 'primary',
            'WORD': 'info',
            'PPT': 'warning',
            'EXCEL': 'success'
        };
        return colors[tipo] || 'secondary';
    }

    function cargarEstudiantes() {
        const estudiantesList = document.getElementById('estudiantesList');
        const estudiantes = estudiantesPorCurso[cursoActual.id] || [];

        if (estudiantes.length === 0) {
            estudiantesList.innerHTML = '<div class="col-12 text-center py-5 text-muted">No hay estudiantes matriculados</div>';
            return;
        }

        estudiantesList.innerHTML = estudiantes.map(est => `
            <div class="col-12">
                <div class="dashboard-card p-3 estudiante-card">
                    <div class="d-flex align-items-center">
                        <div class="avatar-sm me-3" style="background-color: #dc3545">
                            ${est.nombre.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div class="flex-grow-1">
                            <span class="fw-semibold d-block">${est.nombre}</span>
                            <small class="text-muted">${est.codigo} • ${est.email}</small>
                        </div>
                        <div class="d-flex gap-3">
                            <div class="text-center">
                                <small class="text-muted d-block">Asistencia</small>
                                <span class="badge bg-success px-3 py-2">${est.asistencia}%</span>
                            </div>
                            <div class="text-center">
                                <small class="text-muted d-block">Promedio</small>
                                <span class="badge bg-success px-3 py-2">${est.promedio}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function filtrarEstudiantes(termino) {
        const cards = document.querySelectorAll('.estudiante-card');
        const term = termino.toLowerCase().trim();

        cards.forEach(card => {
            const texto = card.textContent.toLowerCase();
            card.parentElement.style.display = texto.includes(term) ? '' : 'none';
        });
    }

    function descargarMaterial(id) {
        console.log('📥 Descargando material:', id);
        mostrarNotificacion('Descargando material...', 'info');
    }

    function eliminarMaterial(id, nombreMaterial) {
        if (confirm(`¿Eliminar "${nombreMaterial}"?`)) {
            const materialCard = document.getElementById(`material-${id}`);
            
            if (materialCard) {
                materialCard.style.transition = 'all 0.3s';
                materialCard.style.opacity = '0';
                
                setTimeout(() => {
                    const materiales = materialesPorCurso[cursoActual.id];
                    const index = materiales.findIndex(m => m.id === id);
                    
                    if (index !== -1) {
                        materiales.splice(index, 1);
                    }
                    
                    cargarMateriales();
                    mostrarNotificacion('Material eliminado exitosamente', 'success');
                }, 300);
            }
        }
    }

    function mostrarNotificacion(mensaje, tipo) {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        };
        
        const iconClass = {
            'success': 'bi-check-circle-fill',
            'error': 'bi-x-circle-fill',
            'warning': 'bi-exclamation-triangle-fill',
            'info': 'bi-info-circle-fill'
        };
        
        const notificacion = document.createElement('div');
        notificacion.className = `alert ${alertClass[tipo]} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        notificacion.style.zIndex = '9999';
        notificacion.style.minWidth = '300px';
        notificacion.innerHTML = `
            <i class="bi ${iconClass[tipo]} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    // INICIAR
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

})();

console.log('🏁 SCRIPT DETALLE-CURSO CARGADO');