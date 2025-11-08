// Referencias a los botones y textos
const estudianteBtn = document.getElementById('btnEstudiante');
const personalBtn = document.getElementById('btnPersonal');
const titulo = document.getElementById('titulo-form');
const subtexto = document.getElementById('subtexto-form');

// Al hacer clic en "Estudiante"
estudianteBtn.addEventListener('click', function() {
  estudianteBtn.classList.add('activo');
  personalBtn.classList.remove('activo');
  titulo.textContent = 'Inicio de Sesión - Estudiante';
  subtexto.textContent = 'Ingrese su usuario y contraseña de estudiante';
})

// Al hacer clic en "Personal"
personalBtn.addEventListener('click', function() {
  personalBtn.classList.add('activo');
  estudianteBtn.classList.remove('activo');
  titulo.textContent = 'Inicio de Sesión - Personal';
  subtexto.textContent = 'Ingrese su usuario y contraseña institucional';
})