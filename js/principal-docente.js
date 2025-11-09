(function() {
    'use strict';

    console.log('👨‍🏫 [DOCENTE] Script principal cargado');

    // Datos de clases de hoy
    const clasesHoy = [
        {
            id: 1,
            nombre: 'Razonamiento Matematico - 001',
            horaInicio: '10:00',
            horaFin: '12:00',
            estudiantes: 32
        },
        {
            id: 2,
            nombre: 'Razonamiento Matematico  - 002',
            horaInicio: '14:00',
            horaFin: '16:00',
            estudiantes: 28
        },
        {
            id: 3,
            nombre: 'Matemáticas Avanzadas - 003',
            horaInicio: '16:00',
            horaFin: '18:00',
            estudiantes: 25
        }
    ];

    // Datos de cursos para el select del modal
    const cursosDocente = [
        { id: 1, codigo: '001', nombre: 'Razonamiento Matematico' },
        { id: 2, codigo: '002', nombre: 'Razonamiento Matematico' },
        { id: 3, codigo: '003', nombre: 'Matemáticas Avanzadas' }
    ];

    function init() {
        console.log('🎯 [DOCENTE] Inicializando vista principal');
        cargarClasesHoy();
        cargarCursosModal();
        configurarEventos();
    }

    function cargarClasesHoy() {
        const container = document.querySelector('.classes-list');
        
        if (!container) {
            console.warn('⚠️ [DOCENTE] Contenedor de clases no encontrado');
            return;
        }

        const html = clasesHoy.map(clase => `
            <div class="class-item">
                <div class="class-main">
                    <div class="class-title">${clase.nombre}</div>
                    <div class="class-meta">
                        <span class="time">${clase.horaInicio} - ${clase.horaFin}</span>
                        <span class="students">
                            <i class="bi bi-people"></i> ${clase.estudiantes} estudiantes
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
        console.log('✅ [DOCENTE] Clases cargadas:', clasesHoy.length);
    }

    function cargarCursosModal() {
        const select = document.getElementById('cursoSelect');
        
        if (!select) {
            console.warn('⚠️ [DOCENTE] Select de cursos no encontrado');
            return;
        }

        const optionsHtml = cursosDocente.map(curso => 
            `<option value="${curso.id}">${curso.nombre} - ${curso.codigo}</option>`
        ).join('');

        select.innerHTML = '<option value="">Seleccionar curso...</option>' + optionsHtml;
        console.log('✅ [DOCENTE] Cursos cargados en modal');
    }

    function configurarEventos() {
        // Botón abrir modal
        const btnAbrirModal = document.getElementById('btnAbrirModal');
        if (btnAbrirModal) {
            btnAbrirModal.addEventListener('click', abrirModal);
        }

        // Botones cerrar modal
        const btnCerrarModal = document.getElementById('btnCerrarModal');
        const btnCancelarModal = document.getElementById('btnCancelarModal');
        
        if (btnCerrarModal) {
            btnCerrarModal.addEventListener('click', cerrarModal);
        }
        if (btnCancelarModal) {
            btnCancelarModal.addEventListener('click', cerrarModal);
        }

        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('modalSubirMaterial');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    cerrarModal();
                }
            });
        }

        // Botones de tipo de material
        const tipoMaterialBtns = document.querySelectorAll('.btn-tipo-material');
        tipoMaterialBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                tipoMaterialBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Área de subida de archivos
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (fileUploadArea && fileInput) {
            fileUploadArea.addEventListener('click', function() {
                fileInput.click();
            });

            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const fileName = this.files[0].name;
                    const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2);
                    fileUploadArea.innerHTML = `
                        <p><strong>${fileName}</strong></p>
                        <small>${fileSize} MB</small>
                    `;
                }
            });
        }

        // Botón subir material
        const btnSubirMaterial = document.getElementById('btnSubirMaterial');
        if (btnSubirMaterial) {
            btnSubirMaterial.addEventListener('click', subirMaterial);
        }

        console.log('✅ [DOCENTE] Eventos configurados');
    }

    function abrirModal() {
        const modal = document.getElementById('modalSubirMaterial');
        if (modal) {
            modal.style.display = 'flex';
            limpiarFormularioModal();
            console.log('📂 Modal abierto');
        }
    }

    function cerrarModal() {
        const modal = document.getElementById('modalSubirMaterial');
        if (modal) {
            modal.style.display = 'none';
            console.log('📂 Modal cerrado');
        }
    }

    function limpiarFormularioModal() {
        const cursoSelect = document.getElementById('cursoSelect');
        const tituloInput = document.getElementById('tituloMaterial');
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('fileUploadArea');
        const tipoMaterialBtns = document.querySelectorAll('.btn-tipo-material');
        
        if (cursoSelect) cursoSelect.value = '';
        if (tituloInput) tituloInput.value = '';
        if (fileInput) fileInput.value = '';
        if (uploadArea) {
            uploadArea.innerHTML = `
                <p>Arrastra un archivo o haz clic para seleccionar</p>
                <small>Tamaño máximo: 500 MB</small>
            `;
        }
        
        tipoMaterialBtns.forEach(btn => btn.classList.remove('active'));
        const pdfBtn = document.querySelector('.btn-tipo-material[data-tipo="pdf"]');
        if (pdfBtn) pdfBtn.classList.add('active');
    }

    function subirMaterial() {
        const curso = document.getElementById('cursoSelect').value;
        const titulo = document.getElementById('tituloMaterial').value;
        const fileInput = document.getElementById('fileInput');
        const tipoSeleccionado = document.querySelector('.btn-tipo-material.active')?.dataset.tipo;

        // Validaciones
        if (!curso) {
            alert('Por favor selecciona un curso');
            return;
        }
        if (!titulo.trim()) {
            alert('Por favor ingresa un título');
            return;
        }
        if (!fileInput.files || !fileInput.files[0]) {
            alert('Por favor selecciona un archivo');
            return;
        }

        console.log('📤 Subiendo material:', {
            curso,
            titulo,
            tipo: tipoSeleccionado,
            archivo: fileInput.files[0].name
        });

        // Aquí iría la llamada al backend
        alert('Material subido exitosamente (simulación)');
        cerrarModal();
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    console.log('✅ [DOCENTE] Script configurado');
})();