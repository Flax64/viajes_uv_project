const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        header.style.transition = 'all 0.3s ease';
    } else {
        header.classList.remove('scrolled');
    }
});

// Selecciona todos los enlaces que apuntan a un ID interno
const enlacesMenu = document.querySelectorAll('.nav a[href^="#"]');

enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', function (e) {
        e.preventDefault(); // Evita el salto brusco
        const destino = document.querySelector(this.getAttribute('href'));
        if (destino) {
            // Obtenemos la distancia del elemento desde arriba
            const posicionElemento = destino.getBoundingClientRect().top + window.scrollY;
            const compensacionMenu = 95;
            // Hacemos el scroll suave hacia esa nueva posición
            window.scrollTo({
                top: posicionElemento - compensacionMenu,
                behavior: 'smooth'
            });
        }
    });
});

// 1. BASE DE DATOS LOCAL DE LOS VIAJES
const baseDeDatosViajes = {
    viaje1: {
        titulo: "Detalles del Viaje: Cancún",
        imagen: "files/img/viaje1.webp",
        precio: "Total: $X,XXX MXN",
        mensajeWhats: "Hola Viajes UV, quiero reservar el viaje a Cancún",
        incluye: [
            "✈️ Vuelo redondo desde Monterrey/Saltillo.",
            "🏨 Hospedaje por 4 días y 3 noches en Hotel 5 Estrellas.",
            "🍹 Plan Todo Incluido (Desayuno, comida, cena y bebidas).",
            "🚌 Traslados Aeropuerto - Hotel - Aeropuerto."
        ],
        itinerario: `
            <p><strong>Día 1:</strong> Llegada al hotel, check-in y tarde libre en la alberca.</p>
            <p><strong>Día 2:</strong> Tour en catamarán hacia Isla Mujeres.</p>
            <p><strong>Día 3:</strong> Día libre y fiesta de despedida en la noche.</p>
            <p><strong>Día 4:</strong> Check-out y traslado al aeropuerto.</p>
        `
    },
    viaje2: {
        titulo: "Detalles del Viaje: Puerto Vallarta",
        imagen: "files/img/viaje2.webp",
        precio: "Total: $X,XXX MXN",
        mensajeWhats: "Hola Viajes UV, quiero reservar el viaje a Puerto Vallarta",
        incluye: [
            "🚌 Transporte terrestre en autobús de primera clase.",
            "🏨 Hospedaje por 3 días y 2 noches a pie de playa.",
            "🍽️ Desayunos buffet incluidos.",
            "🌊 Recorrido guiado por el malecón."
        ],
        itinerario: `
            <p><strong>Día 1:</strong> Salida por la noche, viaje directo.</p>
            <p><strong>Día 2:</strong> Llegada en la mañana, check-in y tarde libre.</p>
            <p><strong>Día 3:</strong> Visita a Playa Las Ánimas (opcional).</p>
            <p><strong>Día 4:</strong> Check-out a mediodía y regreso.</p>
        `
    },
    viaje3: {
        titulo: "Detalles del Viaje: Riviera Maya",
        imagen: "files/img/viaje3.webp",
        precio: "Total: $X,XXX MXN",
        mensajeWhats: "Hola Viajes UV, quiero reservar el viaje a Riviera Maya",
        incluye: [
            "✈️ Vuelo redondo desde Monterrey/Saltillo.",
            "🏨 Hospedaje por 4 días y 3 noches en Hotel 5 Estrellas.",
            "🍹 Plan Todo Incluido (Desayuno, comida, cena y bebidas).",
            "🚌 Traslados Aeropuerto - Hotel - Aeropuerto."
        ],
        itinerario: `
            <p><strong>Día 1:</strong> Llegada al hotel, check-in y tarde libre en la alberca.</p>
            <p><strong>Día 2:</strong> Tour en catamarán hacia Isla Mujeres.</p>
            <p><strong>Día 3:</strong> Día libre y fiesta de despedida en la noche.</p>
            <p><strong>Día 4:</strong> Check-out y traslado al aeropuerto.</p>
        `
    },
    viaje4: {
        titulo: "Detalles del Viaje: Mazatlán",
        imagen: "files/img/viaje4.webp",
        precio: "Total: $X,XXX MXN",
        mensajeWhats: "Hola Viajes UV, quiero reservar el viaje a Mazatlán",
        incluye: [
            "✈️ Vuelo redondo desde Monterrey/Saltillo.",
            "🏨 Hospedaje por 4 días y 3 noches en Hotel 5 Estrellas.",
            "🍹 Plan Todo Incluido (Desayuno, comida, cena y bebidas).",
            "🚌 Traslados Aeropuerto - Hotel - Aeropuerto."
        ],
        itinerario: `
            <p><strong>Día 1:</strong> Llegada a Mazatlán, check-in y tarde libre en la playa.</p>
            <p><strong>Día 2:</strong> Tour por la ciudad y visita a los principales sitios históricos.</p>
            <p><strong>Día 3:</strong> Día libre para disfrutar de las actividades náuticas.</p>
            <p><strong>Día 4:</strong> Check-out y regreso.</p>
        `
    }
};

// 2. SELECCIÓN DE ELEMENTOS DEL DOM
const modalDetalles = document.getElementById('modal-detalles');
const btnCerrarModal = document.querySelector('.close-modal');

// Elementos a modificar dinámicamente
const modalTitulo = document.querySelector('.modal-title');
const modalImg = document.querySelector('.modal-img');
const modalLista = document.getElementById('modal-lista');
const modalItinerario = document.getElementById('modal-itinerario');
const modalPrecio = document.querySelector('.modal-price');
const modalEnlaceWhats = document.querySelector('.modal-btn');

// 3. LÓGICA PARA ABRIR Y LLENAR EL MODAL
const botonesVerDetalles = document.querySelectorAll('.btn-reservar');

botonesVerDetalles.forEach(boton => {
    boton.addEventListener('click', (e) => {
        // Obtenemos el ID del viaje (cancun o vallarta)
        const idViaje = e.target.getAttribute('data-viaje');
        const datos = baseDeDatosViajes[idViaje];

        // Verificamos que exista información para ese viaje
        if (datos) {
            // Actualizamos textos e imágenes
            modalTitulo.textContent = datos.titulo;
            modalImg.src = datos.imagen;
            modalPrecio.textContent = datos.precio;

            // Actualizamos el enlace de WhatsApp codificando el mensaje para la URL
            modalEnlaceWhats.href = `https://wa.me/528445512379?text=${encodeURIComponent(datos.mensajeWhats)}`;

            // Limpiamos y llenamos la lista de "Qué incluye"
            modalLista.innerHTML = "";
            datos.incluye.forEach(item => {
                modalLista.innerHTML += `<li>${item}</li>`;
            });

            // Llenamos el itinerario usando innerHTML porque contiene etiquetas <p> y <strong>
            modalItinerario.innerHTML = datos.itinerario;
        }

        // Mostramos el modal y bloqueamos el scroll del fondo
        modalDetalles.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// 4. LÓGICA PARA CERRAR EL MODAL
btnCerrarModal.addEventListener('click', cerrarModal);

modalDetalles.addEventListener('click', (e) => {
    if (e.target === modalDetalles) {
        cerrarModal();
    }
});

function cerrarModal() {
    modalDetalles.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// LÓGICA PARA CERRAR EL MODAL REINICIANDO EL SCROLL
const modalBody = document.querySelector('.modal-body');
function cerrarModal() {
    modalDetalles.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        modalBody.scrollTop = 0; // Reinicia el scroll del modal al cerrar
    }, 300); // Espera a que la animación de cierre termine
}

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});