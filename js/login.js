const estudianteBtn = document.getElementById('btnEstudiante');
const personalBtn = document.getElementById('btnPersonal');
const titulo = document.getElementById('titulo-form');
const subtexto = document.getElementById('subtexto-form');
const btnLogin = document.getElementById('btnLogin');
const inputUsuario = document.getElementById('usuario');
const inputContrasena = document.getElementById('contrasena');

let tipoActual = 'estudiante';

const usuarios = {
  estudiante: [
    { usuario: 'alumno1', contrasena: '1234' },
    { usuario: 'darmon', contrasena: 'abc123' }
  ],
  personal: [
    { usuario: 'profe1', contrasena: 'admin123' },
    { usuario: 'admin', contrasena: 'root' }
  ]
};

estudianteBtn.addEventListener('click', function() {
  tipoActual = 'estudiante';
  estudianteBtn.classList.add('activo');
  personalBtn.classList.remove('activo');
  titulo.textContent = 'Inicio de Sesión - Estudiante';
  subtexto.textContent = 'Ingrese su usuario y contraseña de estudiante';
});

personalBtn.addEventListener('click', function() {
  tipoActual = 'personal';
  personalBtn.classList.add('activo');
  estudianteBtn.classList.remove('activo');
  titulo.textContent = 'Inicio de Sesión - Personal';
  subtexto.textContent = 'Ingrese su usuario y contraseña institucional';
});

btnLogin.addEventListener('click', function() {
  const user = inputUsuario.value.trim();
  const pass = inputContrasena.value.trim();

  if (user === '' || pass === '') {
    mostrarAlerta('Por favor, complete todos los campos.', 'info');
    return;
  }

  const lista = usuarios[tipoActual];
  const existe = lista.find(u => u.usuario === user && u.contrasena === pass);

  if (existe) {
    mostrarAlerta('Inicio de sesión exitoso', 'exito');
    setTimeout(() => {
      if (tipoActual === 'estudiante') {
        window.location.href = '../../pages/Estudiantes/panel-Estudiante.html';
      } else {
        window.location.href = '../../pages/Personal/panel.html';
      }
    }, 1500);
  } else {
    mostrarAlerta('Usuario o contraseña incorrectos', 'error');
  }
});

/*ALERTA PERSONALIZADA*/
  function mostrarAlerta(mensaje, tipo = 'info') {
  const alerta = document.getElementById('alerta');
  const texto = document.getElementById('alerta-texto');
  const icono = document.getElementById('alerta-icono');

  texto.textContent = mensaje;

  alerta.className = `alerta ${tipo}`;
  alerta.style.display = 'flex';

  // Se oculta automáticamente después de 2.5 segundos
  setTimeout(() => {
    alerta.style.display = 'none';
  }, 2500);
}

