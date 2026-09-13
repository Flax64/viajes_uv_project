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

