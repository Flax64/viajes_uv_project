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

// Fecha actual en el pie de pagina
const currentYear = document.getElementById('current-year');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


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
    // Quitar viajes pasado
    datosCentralizados = filtrarViajesPasados(datosCentralizados);
    // Ordenar viajes por fecha
    ordenarViajesPorFecha(datosCentralizados);
    datosCentralizados.forEach((viaje, index) => {
        automatizarEtiquetas(viaje, index);
        const badgeHTML = viaje.badge ? `<span class="badge">${viaje.badge}</span>` : '';
        // Condicional para deshabilitar el botón si el viaje está agotado
        const estadoViaje = verificarDisponibilidad(viaje);
        let textoBoton = 'Ver Detalles';
        if (estadoViaje.agotado) textoBoton = 'Agotado';
        if (viaje.en_progreso) textoBoton = 'Ver Detalles';

        const imgTarjeta = viaje.imagen_tarjeta || viaje.imagen;

        // 2. Sumamos el texto a la variable, NO al DOM
        htmlAcumulado += `
            <article class="trip-card">
                <div class="trip-image" style="background-image: url('${imgTarjeta}');">
                    ${badgeHTML}
                </div>
                <div class="trip-content">
                    <h3>${viaje.nombre}</h3>
                    <p class="date">${viaje.fecha}</p>
                    <p class="description">${viaje.descripcion}</p>
                    <div class="card-footer">
                        <span class="price">Desde $${viaje.precio.toLocaleString()} MXN</span>
                        <!-- Usamos los datos del objeto estadoViaje -->
                        <button class="btn-reservar ${estadoViaje.claseCSS}" data-viaje="${viaje.id}" ${estadoViaje.atributo}>${textoBoton}</button>
                    </div>
                </div>
            </article>
        `;
    });

    // 3. Inyectamos al DOM una sola vez al terminar el ciclo
    contenedorTarjetas.innerHTML = htmlAcumulado;

    asignarEventosModal();
}

// C. Función para ordenar los viajes por fecha (de más cercano a más lejano)
function ordenarViajesPorFecha(viajes) {
    viajes.sort((viajeA, viajeB) => {
        const fechaA = new Date(viajeA.fecha_inicio);
        const fechaB = new Date(viajeB.fecha_inicio);

        // Validar fecha valida y que sea compatible con el tipo de dato Date. Si no es válida, la consideramos como "infinita" para que se vaya al final.
        const isValidaA = isFechaValida(fechaA);
        const isValidaB = isFechaValida(fechaB);

        if (isValidaA && isValidaB) {
            return fechaA - fechaB;
        } else if (isValidaA && !isValidaB) {
            return -1; // viajeA es válido, viajeB no lo es
        } else if (!isValidaA && isValidaB) {
            return 1; // viajeB es válido, viajeA no lo es
        } else {
            return 0; // Ambos son inválidos, mantener el orden original
        }
    });
}

// D. Funcion para validar fechas validas
function isFechaValida(fecha) {
    return fecha instanceof Date && !isNaN(fecha.getTime());
}

// E. Función para validar la cronología de las fechas
function filtrarViajesPasados(viajes) {
    // 1. Obtenemos la fecha exacta del dia de hoy
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    // 2. Retornar los viajes que pasen la prueba
    return viajes.filter(viaje => {
        // Si olvidamos poner la fecha este se omitira
        if (!viaje.fecha_inicio) return true;
        // Convertimos primero la fecha 'yyyy-mm-dd' que es un String a un formato de fecha valido
        const fechaObjeto = new Date(viaje.fecha_inicio);
        // Validamos que sea una fecha valida
        if (isFechaValida(fechaObjeto)) {
            const fechaReferencia = viaje.fecha_fin ? viaje.fecha_fin : viaje.fecha_inicio;
            return fechaReferencia >= todayDate;
        }
        // Si no es una fecha valida lo dejamos pasar para que esta se dibuje   
        return true;
    });
}

// F. Funcion para automatizar etiquetas (badge)
function automatizarEtiquetas(viaje, index) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    const fechaFin = viaje.fecha_fin ? viaje.fecha_fin : viaje.fecha_inicio;

    // 1. Verificamos si está en progreso (solo para la bandera interna)
    if (viaje.fecha_inicio <= todayDate && fechaFin >= todayDate) {
        viaje.en_progreso = true; 
    }
    // PRIORIDAD 1: Si tú escribiste un badge manual en el JSON ("Próximamente", "Agotado", etc.)
    // El sistema se detiene aquí y respeta tu texto.
    if (viaje.badge && viaje.badge.trim() !== "") {
        return; 
    }
    // PRIORIDAD 2: Si no escribiste nada en el JSON, automatizamos.
    if (viaje.en_progreso) {
        viaje.badge = "¡En curso! ✈️"; // Si el viaje es hoy
    } else if (index === 0) {
        viaje.badge = "¡Próximo! 🌴"; // Si es el primero de la lista
    }
}

// G. Funcion para verificar si esta agotado
function verificarDisponibilidad(viaje) {
    // 1. Revisar el texto badge si existe
    const textoBadge = viaje.badge ? viaje.badge.toLowerCase() : "";
    // 2. Verificamos si tiene una palabra clave
    const isAgotado = textoBadge.includes('agotado') ||
                        textoBadge.includes('completo') ||
                        textoBadge.includes('no disponible');
    // 3. Retornamos un objeto con las 3 variables que necesita el HTML    
    return {
        agotado: isAgotado,
        atributo: isAgotado ? 'disabled' : '',
        claseCSS: isAgotado ? 'btn-agotado' : ''
    };
}

// ==========================================
// 3. LÓGICA DE LA VENTANA MODAL
// ==========================================

const modalDetalles = document.getElementById('modal-detalles');
const btnCerrarModal = document.querySelector('.close-modal');
const modalBody = document.querySelector('.modal-body');

// Elementos dinámicos del modal a modificar
const modalTitulo = document.querySelector('.modal-title');
const contenedorMedia = document.getElementById('modal-media');
const modalPrecio = document.querySelector('.modal-price');
const modalEnlaceWhats = document.querySelector('.modal-btn');
const contenedorLugares = document.getElementById('modal-lugares');
const contenedorPagos = document.getElementById('modal-pagos');
const contenedorIncluye = document.getElementById('modal-lista-incluye');
const contenedorItinerario = document.getElementById('modal-itinerario');
const contenedorMensajeFinal = document.getElementById('modal-mensaje-final');

function asignarEventosModal() {
    // Seleccionamos botones que NO estén agotados para no gastar recursos
    const botonesVerDetalles = document.querySelectorAll('.btn-reservar:not(.btn-agotado)');

    botonesVerDetalles.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idViaje = e.target.getAttribute('data-viaje');
            const viaje = datosCentralizados.find(v => v.id === idViaje);

            // --- 1. DATOS BÁSICOS (Título, Precio y WhatsApp) ---
            modalTitulo.textContent = viaje.nombre;
            modalPrecio.textContent = `Desde $${viaje.precio.toLocaleString()} MXN`;
            // Validar si bloqueamos el botón de WhatsApp
            if (viaje.en_progreso || (viaje.badge && viaje.badge.toLowerCase().includes('agotado'))) {
                modalEnlaceWhats.removeAttribute('href');
                modalEnlaceWhats.textContent = "Reservas Cerradas";
                modalEnlaceWhats.style.backgroundColor = "#cccccc"; // Lo pintamos gris
                modalEnlaceWhats.style.cursor = "not-allowed";
            } else {
                // Si todo está normal, restauramos el botón
                modalEnlaceWhats.href = `https://wa.me/528445512379?text=${encodeURIComponent(viaje.mensajeWhats)}`;
                modalEnlaceWhats.textContent = "Reservar por WhatsApp";
                modalEnlaceWhats.style.backgroundColor = ""; // Restaura el color de tu CSS
                modalEnlaceWhats.style.cursor = "pointer";
            }

            // --- 2. MULTIMEDIA (Video vs Imagen Modal) ---
            if (viaje.video && viaje.video !== "") {
                // 1. Si hay video, muestra el video
                contenedorMedia.innerHTML = `
                    <video class="modal-video" controls autoplay muted loop>
                        <source src="${viaje.video}" type="video/mp4">
                    </video>`;
            } else {
                // 2. Si no hay video, buscamos la imagen específica del modal
                // Si por alguna razón no pusiste "imagen_modal", usará la "imagen_tarjeta" de respaldo
                const imgModal = viaje.imagen_modal || viaje.imagen_tarjeta || viaje.imagen;

                contenedorMedia.innerHTML = `<img src="${imgModal}" alt="${viaje.nombre} ${viaje.fecha}" class="modal-video">`;
            }

            // --- 3. QUÉ INCLUYE ---
            if (viaje.incluye) {
                let lista = "<h4>¿Qué incluye el paquete?</h4><ul class='modal-list'>";
                viaje.incluye.forEach(item => lista += `<li>${item}</li>`);
                lista += "</ul>";
                contenedorIncluye.innerHTML = lista;
            } else {
                contenedorIncluye.innerHTML = "";
            }

            // --- 4. ITINERARIO Y/O PLAN DE PAGOS ---
            // Primero vaciamos el contenedor por si tenía datos de otro viaje
            contenedorItinerario.innerHTML = "";

            // Si el viaje tiene un itinerario normal (día 1, día 2, etc.)
            if (viaje.itinerario) {
                contenedorItinerario.innerHTML += `<h4>Itinerario</h4>${viaje.itinerario}`;
            }

            // Si el viaje tiene el nuevo formato de pagos estructurado
            if (viaje.pagos) {
                let htmlPagos = `<h4>Plan de Pagos</h4>`;

                if (viaje.pagos.adultos) {
                    htmlPagos += `<p style="color: var(--primary-blue); font-weight: 600; margin-top: 15px;">👤 ADULTOS (${viaje.pagos.adultos.total})</p>`;
                    htmlPagos += `<p>Separa tu lugar con <strong>${viaje.pagos.adultos.anticipo}</strong></p>`;
                    htmlPagos += `<ul class="modal-list">`;
                    viaje.pagos.adultos.fechas.forEach(fecha => {
                        htmlPagos += `<li>${fecha}</li>`;
                    });
                    htmlPagos += `</ul>`;
                }

                if (viaje.pagos.menores) {
                    htmlPagos += `<p style="color: var(--primary-blue); font-weight: 600; margin-top: 15px;">👧🧒 MENORES 2-12 AÑOS (${viaje.pagos.menores.total})</p>`;
                    htmlPagos += `<p>Separa su lugar con <strong>${viaje.pagos.menores.anticipo}</strong></p>`;
                    htmlPagos += `<ul class="modal-list">`;
                    viaje.pagos.menores.fechas.forEach(fecha => {
                        htmlPagos += `<li>${fecha}</li>`;
                    });
                    htmlPagos += `</ul>`;
                }

                // Usamos += para sumarlo al itinerario (si es que existe)
                contenedorItinerario.innerHTML += htmlPagos;
            }

            // --- 5. LUGARES DISPONIBLES ---
            if (viaje.lugares) {
                contenedorLugares.innerHTML = `<h4>Lugares Disponibles</h4><p>${viaje.lugares}</p>`;
            } else {
                contenedorLugares.innerHTML = '';
            }

            // --- 6. MÉTODOS DE PAGO ---
            if (viaje.metodos_pago) {
                let htmlMetodos = `<h4>Formas de Pago</h4><ul class="modal-list">`;
                viaje.metodos_pago.forEach(metodo => {
                    htmlMetodos += `<li>${metodo}</li>`;
                });
                htmlMetodos += `</ul>`;

                contenedorPagos.innerHTML = htmlMetodos;
            } else {
                contenedorPagos.innerHTML = '';
            }

            // --- 7. MENSAJE FINAL (opcional) ---
            if (viaje.mensaje_final) {
                contenedorMensajeFinal.innerHTML = `<p>${viaje.mensaje_final}</p>`;
            } else {
                contenedorMensajeFinal.innerHTML = '';
            }

            // Mostrar el modal y bloquear scroll
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

    // Forma segura de detener el video SIN marcar error si es una imagen
    const videoActivo = document.querySelector('#modal-media video');
    if (videoActivo) {
        videoActivo.pause();
    }

    setTimeout(() => {
        modalBody.scrollTop = 0;
    }, 300);
}

// ==========================================
// 4. INICIALIZAR LA APLICACIÓN
// ==========================================
cargarViajes();