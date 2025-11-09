// panel.js
document.addEventListener('DOMContentLoaded', function() {
    
    // Cargar vista inicial
    cargarVista('/pages/Administrador/principalA.html');
    
    // Manejar clicks en el menú
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const viewPath = this.getAttribute('data-view');
            
            // Actualizar active
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Cargar vista
            cargarVista(viewPath);
        });
    });
});

function cargarVista(viewPath) {
    fetch(viewPath)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar la vista');
            return response.text();
        })
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            
            // IMPORTANTE: Llamar la función después de cargar el HTML
            if (viewPath.includes('panelEstadisticas.html')) {
                // Esperar a que el DOM se actualice
                setTimeout(() => {
                    if (typeof cargarEstadisticas === 'function') {
                        cargarEstadisticas();
                    } else {
                        console.error('La función cargarEstadisticas no está definida');
                    }
                }, 200);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('main-content').innerHTML = '<p>Error al cargar el contenido</p>';
        });
}
function cargarEstadisticas() {
    console.log('🔄 Iniciando carga de estadísticas...');
    
    const datos = {
        usuarios: 1332,
        cursos: 42,
        asistencia: 90,
        promedio: 8.4
    };

    function animarNumero(id, valorFinal, duracion = 1500, esPorcentaje = false, esDecimal = false) {
        const elemento = document.getElementById(id);
        if (!elemento) {
            console.error('❌ Elemento no encontrado:', id);
            return;
        }
        
        console.log('✅ Animando:', id);
        
        let inicio = 0;
        const pasos = 60;
        const incremento = valorFinal / pasos;
        let contador = 0;

        const intervalo = setInterval(() => {
            contador++;
            inicio += incremento;
            
            if (contador >= pasos) {
                if (esPorcentaje) {
                    elemento.textContent = valorFinal + '%';
                } else if (esDecimal) {
                    elemento.textContent = valorFinal.toFixed(1);
                } else {
                    elemento.textContent = valorFinal;
                }
                clearInterval(intervalo);
            } else {
                if (esPorcentaje) {
                    elemento.textContent = Math.floor(inicio) + '%';
                } else if (esDecimal) {
                    elemento.textContent = inicio.toFixed(1);
                } else {
                    elemento.textContent = Math.floor(inicio);
                }
            }
        }, duracion / pasos);
    }

    animarNumero("num-usuarios", datos.usuarios);
    animarNumero("num-cursos", datos.cursos);
    animarNumero("num-asistencia", datos.asistencia, 1500, true);
    animarNumero("num-promedio", datos.promedio, 1500, false, true);

    const canvas = document.getElementById('inscripcionesChart');
    
    if (!canvas) {
        console.error('❌ Canvas no encontrado');
        return;
    }

    console.log('✅ Canvas encontrado, creando gráfico...');
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"],
            datasets: [
                {
                    label: "Estudiantes",
                    data: [120, 135, 165, 190, 220, 195, 155, 175, 235, 145],
                    backgroundColor: "#d63447",
                    borderWidth: 0,
                    borderRadius: 3
                },
                {
                    label: "Personal",
                    data: [8, 10, 12, 15, 18, 16, 12, 14, 19, 11],
                    backgroundColor: "#2962ff",
                    borderWidth: 0,
                    borderRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rectRounded',
                        padding: 20,
                        font: {
                            size: 12,
                            family: "'Poppins', sans-serif"
                        },
                        color: '#333'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Poppins', sans-serif"
                    },
                    cornerRadius: 6
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 260,
                    ticks: {
                        stepSize: 65,
                        font: {
                            size: 11,
                            family: "'Poppins', sans-serif"
                        },
                        color: '#6c757d',
                        padding: 8
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.06)',
                        drawBorder: false,
                        lineWidth: 1
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11,
                            family: "'Poppins', sans-serif"
                        },
                        color: '#6c757d',
                        padding: 8
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    border: {
                        display: false
                    }
                }
            },
            barPercentage: 0.8,
            categoryPercentage: 0.9
        }
    });
    
    console.log('✅ Gráfico creado exitosamente');
}