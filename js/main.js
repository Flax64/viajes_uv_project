// Selecciona el encabezado
const header = document.querySelector('.header');

// Escucha el evento de scroll en la ventana
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // Cuando bajas más de 50px
        header.style.padding = '10px 50px';
        header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        header.style.transition = 'all 0.3s ease';
    } else {
        // Cuando estás hasta arriba
        header.style.padding = '15px 50px';
        header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
    }
});

// Selecciona todos los enlaces que apuntan a un ID interno
const enlacesMenu = document.querySelectorAll('.nav a[href^="#"]');

enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', function (e) {
        e.preventDefault(); // Evita el salto brusco
        
        const destino = document.querySelector(this.getAttribute('href'));
        if (destino) {
            destino.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// SELECCIÓN DE ELEMENTOS PARA EL MODAL
const modalDetalles = document.getElementById('modal-detalles');
const botonesVerDetalles = document.querySelectorAll('.btn-reservar'); // Los botones de tus tarjetas
const btnCerrarModal = document.querySelector('.close-modal');

// ABRIR EL MODAL: Recorre todos los botones "Ver Detalles" y les agrega el evento
botonesVerDetalles.forEach(boton => {
    boton.addEventListener('click', () => {
        modalDetalles.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });
});

// CERRAR EL MODAL CON LA 'X'
btnCerrarModal.addEventListener('click', () => {
    modalDetalles.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// CERRAR EL MODAL HACIENDO CLIC AFUERA DE LA CAJA BLANCA
modalDetalles.addEventListener('click', (e) => {
    if (e.target === modalDetalles) {
        modalDetalles.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});