// ==========================================
// 1. EFECTOS DE INTERFAZ (HEADER Y SCROLL)
// ==========================================

// Forzar inicio al recargar la página
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Efecto Scroll del Encabezado
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        header.style.transition = 'all 0.3s ease';
    } else {
        header.classList.remove('scrolled');
    }
});

// Desplazamiento suave para enlaces del menú
const enlacesMenu = document.querySelectorAll('.nav a[href^="#"]');
enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', function (e) {
        e.preventDefault(); 
        const destino = document.querySelector(this.getAttribute('href'));
        if (destino) {
            const posicionElemento = destino.getBoundingClientRect().top + window.scrollY;
            const alturaMenu = document.querySelector('.header').offsetHeight;
            const compensacionMenu = alturaMenu + 15; 
            window.scrollTo({
                top: posicionElemento - compensacionMenu,
                behavior: 'smooth'
            });
        }
    });
});


// ==========================================
// 2. LÓGICA DE DATOS Y RENDERIZADO (JSON)
// ==========================================

const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
let datosCentralizados = []; // Variable global para guardar los datos del JSON

// A. Función para obtener los datos
async function cargarViajes() {
    try {
        const respuesta = await fetch('./data/viajes.json');
        datosCentralizados = await respuesta.json();
        renderizarTarjetas();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
        contenedorTarjetas.innerHTML = "<p style='text-align:center;'>Hubo un error al cargar los viajes. Verifica tu conexión o el servidor local.</p>";
    }
}

// B. Función para dibujar las tarjetas en el HTML
function renderizarTarjetas() {
    // 1. Creamos una variable vacía para almacenar todo el texto HTML
    let htmlAcumulado = ''; 

    datosCentralizados.forEach(viaje => {
        const badgeHTML = viaje.badge ? `<span class="badge">${viaje.badge}</span>` : '';
        
        // Condicional para deshabilitar el botón si el viaje está agotado
        const isAgotado = (viaje.badge && viaje.badge.toLowerCase().includes('agotado')) || (viaje.badge && viaje.badge.toLowerCase().includes('completo')) 
        || (viaje.badge && viaje.badge.toLowerCase().includes('no disponible'));
        // Atributos del botón
        const atributoDisabled = isAgotado ? 'disabled' : '';
        const claseAgotado = isAgotado ? 'btn-agotado' : '';
        const textoBoton = isAgotado ? 'Agotado' : 'Ver Detalles';

        // 2. Sumamos el texto a la variable, NO al DOM
        htmlAcumulado += `
            <article class="trip-card">
                <div class="trip-image" style="background-image: url('${viaje.imagen}');">
                    ${badgeHTML}
                </div>
                <div class="trip-content">
                    <h3>${viaje.nombre}</h3>
                    <p class="date">${viaje.fecha}</p>
                    <p class="description">${viaje.descripcion}</p>
                    <div class="card-footer">
                        <span class="price">Desde $${viaje.precio.toLocaleString()} MXN</span>
                        <button class="btn-reservar ${claseAgotado}" data-viaje="${viaje.id}" ${atributoDisabled}>${textoBoton}</button>
                    </div>
                </div>
            </article>
        `;
    });

    // 3. Inyectamos al DOM una sola vez al terminar el ciclo
    contenedorTarjetas.innerHTML = htmlAcumulado;

    asignarEventosModal();
}

// ==========================================
// 3. LÓGICA DE LA VENTANA MODAL
// ==========================================

const modalDetalles = document.getElementById('modal-detalles');
const btnCerrarModal = document.querySelector('.close-modal');
const modalBody = document.querySelector('.modal-body');

// Elementos dinámicos del modal
const modalTitulo = document.querySelector('.modal-title');
const modalVideo = document.querySelector('.modal-video');
const modalLista = document.getElementById('modal-lista');
const modalItinerario = document.getElementById('modal-itinerario');
const modalPrecio = document.querySelector('.modal-price');
const modalEnlaceWhats = document.querySelector('.modal-btn');

function asignarEventosModal() {
    const botonesVerDetalles = document.querySelectorAll('.btn-reservar');

    botonesVerDetalles.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idViaje = e.target.getAttribute('data-viaje');
            
            // BUSCAMOS EL VIAJE EN EL JSON CARGADO
            const datos = datosCentralizados.find(viaje => viaje.id === idViaje);

            if (datos) {
                modalTitulo.textContent = `Detalles del Viaje: ${datos.nombre}`;
                modalVideo.src = datos.video;
                modalPrecio.textContent = `Total: $${datos.precio.toLocaleString()} MXN`;
                
                modalEnlaceWhats.href = `https://wa.me/528445512379?text=${encodeURIComponent(datos.mensajeWhats)}`;

                // Limpiamos y llenamos la lista de "Qué incluye"
                modalLista.innerHTML = "";
                datos.incluye.forEach(item => {
                    modalLista.innerHTML += `<li>${item}</li>`;
                });

                // Limpiamos y llenamos el itinerario (Tu JSON lo tiene como arreglo de strings)
                modalItinerario.innerHTML = "";
                datos.itinerario.forEach(dia => {
                    // Formatea "Día X:" en negritas usando split
                    const partes = dia.split(": ");
                    if(partes.length > 1) {
                         modalItinerario.innerHTML += `<p><strong>${partes[0]}:</strong> ${partes[1]}</p>`;
                    } else {
                         modalItinerario.innerHTML += `<p>${dia}</p>`;
                    }
                });
            }

            // Mostrar el modal
            modalDetalles.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });
}

// Lógica para cerrar el modal
btnCerrarModal.addEventListener('click', cerrarModal);

modalDetalles.addEventListener('click', (e) => {
    if (e.target === modalDetalles) {
        cerrarModal();
    }
});

function cerrarModal() {
    modalDetalles.classList.remove('active');
    document.body.style.overflow = 'auto';
    modalVideo.pause();
    setTimeout(() => {
        modalBody.scrollTop = 0;
    }, 300);
}

// ==========================================
// 4. INICIALIZAR LA APLICACIÓN
// ==========================================
cargarViajes();