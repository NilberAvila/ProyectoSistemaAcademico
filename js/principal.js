function abrirModal() {
            document.getElementById('modalSubirMaterial').classList.add('show');
        }

        function cerrarModal() {
            document.getElementById('modalSubirMaterial').classList.remove('show');
        }

        // Cerrar modal al hacer clic fuera
        document.getElementById('modalSubirMaterial').addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });

        // Manejo de botones de tipo de material
        document.querySelectorAll('.btn-tipo-material').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.btn-tipo-material').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Manejo de archivo seleccionado
        document.getElementById('fileInput').addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                document.querySelector('.file-upload-area p').textContent = `Archivo seleccionado: ${fileName}`;
            }
        });