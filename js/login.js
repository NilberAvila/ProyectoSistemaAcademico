const estudianteBtn = document.getElementById('btnEstudiante');
const personalBtn = document.getElementById('btnPersonal');
const titulo = document.getElementById('titulo-form');
const subtexto = document.getElementById('subtexto-form');
const btnLogin = document.getElementById('btnLogin');
const inputUsuario = document.getElementById('usuario');
const inputContrasena = document.getElementById('contrasena');

let tipoActual = 'estudiante';

// Usuarios: personal ahora incluye field role (ej. 'docente', 'admin', ...)
const usuarios = {
  estudiante: [
    { usuario: 'alumno1', contrasena: '1234', nombres: 'Juan', apellidos: 'Pérez' },
    { usuario: 'darmon', contrasena: 'abc123', nombres: 'Darmon', apellidos: 'Gómez' }
  ],
  personal: [
    { usuario: 'profe1', contrasena: 'admin123', nombres: 'María', apellidos: 'González', role: 'docente' },
    { usuario: 'admin', contrasena: 'root', nombres: 'Admin', apellidos: 'Sistema', role: 'admin' }
  ]
};

estudianteBtn.addEventListener('click', function() {
  tipoActual = 'estudiante';
  estudianteBtn.classList.add('activo');
  personalBtn.classList.remove('activo');
  titulo.textContent = 'Inicio de Sesión - Estudiante';
  if (subtexto) subtexto.textContent = 'Ingrese su usuario y contraseña de estudiante';
});

personalBtn.addEventListener('click', function() {
  tipoActual = 'personal';
  personalBtn.classList.add('activo');
  estudianteBtn.classList.remove('activo');
  titulo.textContent = 'Inicio de Sesión - Personal';
  if (subtexto) subtexto.textContent = 'Ingrese su usuario y contraseña institucional';
});

btnLogin.addEventListener('click', function() {
  const user = (inputUsuario && inputUsuario.value || '').trim();
  const pass = (inputContrasena && inputContrasena.value || '').trim();

  if (user === '' || pass === '') {
    mostrarAlerta('Por favor, complete todos los campos.', 'info');
    return;
  }

  const lista = usuarios[tipoActual] || [];
  const usuarioObj = lista.find(u => u.usuario === user && u.contrasena === pass);

  if (!usuarioObj) {
    mostrarAlerta('Usuario o contraseña incorrectos', 'error');
    return;
  }

  // Si es personal, requiere role; por ahora solo permitimos acceso a docente al panel-Docentes
  if (tipoActual === 'personal') {
    const role = usuarioObj.role || 'personal';
    if (role !== 'docente') {
      // A futuro mostrar opciones para otros roles; por ahora denegar acceso a panel docente
      mostrarAlerta('Acceso sólo para usuarios con rol Docente. Contacte al administrador.', 'error');
      return;
    }
  }

  // Guardar en sessionStorage
  const authUser = {
    role: usuarioObj.role || tipoActual,
    usuario: usuarioObj.usuario,
    nombres: usuarioObj.nombres || '',
    apellidos: usuarioObj.apellidos || ''
  };
  sessionStorage.setItem('authUser', JSON.stringify(authUser));

  mostrarAlerta('Inicio de sesión exitoso', 'exito');
  setTimeout(() => {
    if (tipoActual === 'estudiante') {
      window.location.href = '../../pages/Estudiantes/panel-Estudiante.html';
    } else {
      // role == 'docente' sólo entra aquí
      window.location.href = '../../pages/Docentes/panel-Docentes.html';
    }
  }, 600);
});

/*ALERTA PERSONALIZADA*/
function mostrarAlerta(mensaje, tipo = 'info') {
  const alerta = document.getElementById('alerta');
  // si no existe el layout de alerta, usar alert() como fallback
  if (!alerta) { alert(mensaje); return; }

  const texto = document.getElementById('alerta-texto') || document.createElement('div');
  texto.id = 'alerta-texto';
  texto.textContent = mensaje;

  // limpiar y mostrar
  alerta.innerHTML = '';
  alerta.appendChild(texto);
  alerta.className = `alerta ${tipo}`;
  alerta.style.display = 'flex';

  setTimeout(() => { alerta.style.display = 'none'; }, 2500);
}

