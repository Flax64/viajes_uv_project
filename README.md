# ✈️ Proyecto: Viajes UV

Esta es una página web publicitaria para viajes uv.

## 📁 Estructura del Proyecto

A continuación se presenta la estructura del proyecto:

```text
viajes_uv_project/
├── css/
│   └── main_style.css              # Estilos generales y diseño responsivo para PC
├── files/
│   ├── img/
│   │   └── logo_viajes_uv.webp     # Logotipo oficial de la empresa
│   │   └── viaje.webp              # Imagen o imagenes de los viajes o destinos
│   ├── video/                      
│   |   └── video.mp4               # Videos publicitarios de los destinos
├── js/
│   └── main.js                     # Lógica interactiva del sitio web
├── index.html                      # Página de inicio del sitio
└── README.md                       # Documentación del proyecto
```

# Documentación Técnica: Interfaz de Usuario "Viajes UV"

## 1. Descripción General
El archivo `index.html` define la estructura principal de una *Landing Page* (página de aterrizaje) publicitaria para **"Viajes UV"**, una agencia enfocada en viajes grupales a la playa. La interfaz consta de un sistema de navegación estático, un banner de bienvenida, una cuadrícula dinámica de productos (viajes) y una ventana modal interactiva para la visualización de detalles.

## 2. Estructura del Documento (DOM)

### 2.1. Cabecera (`<head>`)
Contiene los metadatos y enlaces a recursos externos necesarios para el renderizado inicial:
* **Meta etiquetas:** Configuración de caracteres (`UTF-8`) y *viewport* para asegurar la responsividad en dispositivos móviles.
* **Tipografía:** Preconexión e importación de la fuente "Edu NSW ACT Cursive" desde Google Fonts.
* **Hojas de Estilo:** Enlace al archivo principal de estilos (`css/main_style.css`).

### 2.2. Cuerpo del Documento (`<body>`)
Identificado con el atributo `id="inicio"` para funcionar como ancla superior del sistema de desplazamiento suave (*smooth scroll*). Se divide en cuatro componentes lógicos principales:

#### A. Barra de Navegación (`<header class="header">`)
* **Contenedor del Logo (`.logo-container`):** Agrupa la imagen del logotipo (`.logo-img`) optimizada en formato WebP y el nombre de la empresa (`.logo-text`).
* **Menú de Navegación (`<nav>`):** Contiene enlaces internos (Inicio y Viajes Disponibles) y un enlace externo hacia la API de WhatsApp para contacto directo (`target="_blank"` para no abandonar la página web).

#### B. Banner Principal (`<section class="hero">`)
* Sección de impacto visual diseñada para captar la atención del usuario inmediatamente. Contiene el título principal de la campaña (h2) y una breve descripción de los servicios.

#### C. Catálogo de Viajes (`<main id="viajes">`)
* **Contenedor Grid (`.trips-grid`):** Un contenedor diseñado para mostrar tarjetas en un formato de cuadrícula (2x2 en escritorio y 1 columna en móvil).
* **Tarjetas de Producto (`<article class="trip-card">`):** Etiquetas semánticas `<article>` que representan de forma independiente cada paquete de viaje. Cada tarjeta contiene:
  * **Imagen (`.trip-image`):** Contenedor div que maneja la imagen de fondo mediante clases CSS (`.viaje1`, `.viaje2`, etc.). Incluye una etiqueta *badge* opcional para destacar ofertas ("¡Próximo!").
  * **Contenido (`.trip-content`):** Muestra el título, fecha, descripción corta y precio del paquete.
  * **Botón de Acción (`.btn-reservar`):** Implementa el atributo personalizado `data-viaje="viajeX"`. Este atributo es crucial, ya que actúa como llave primaria para que el motor de JavaScript identifique qué información extraer de la base de datos local y renderizar en el modal.

#### D. Ventana Modal de Detalles (`<div id="modal-detalles">`)
Estructura flotante y oculta por defecto (controlada vía CSS y manipulada por JavaScript) diseñada para mostrar la información completa de un viaje sin necesidad de recargar la página. Se divide en:
* **Header (`.modal-header`):** Título dinámico y botón de cierre (`.close-modal`).
* **Body (`.modal-body`):** Área con desplazamiento vertical (*scroll*) independiente. Contiene nodos HTML vacíos o marcadores (`#modal-lista` y `#modal-itinerario`) que esperan ser inyectados dinámicamente con información por el script de JS.
* **Footer (`.modal-footer`):** Muestra el precio total dinámico y el botón final de conversión (Enlace dinámico hacia WhatsApp con mensaje pre-rellenado).

### 2.3. Scripts de Interactividad
* `<script src="js/main.js"></script>`: Importación del archivo lógico al final del cuerpo del documento. Se coloca aquí para garantizar que todo el árbol DOM esté completamente cargado y renderizado antes de que JavaScript intente acceder a los elementos (evitando errores de nodos nulos).

## 3. Buenas Prácticas de Ingeniería Web Implementadas
1. **HTML5 Semántico:** Uso correcto de etiquetas como `<header>`, `<nav>`, `<main>`, `<section>` y `<article>`, lo cual mejora la accesibilidad (lectores de pantalla) y el posicionamiento SEO.
2. **Arquitectura Modular:** Separación clara de responsabilidades (HTML para estructura, CSS para presentación, JS para lógica).
3. **Data Attributes:** Uso de `data-viaje` en lugar de IDs rígidos o manipulación directa del DOM basada en textos, permitiendo una arquitectura de "plantilla única" para el modal.
4. **Optimización de Recursos:** Implementación de imágenes en formato `.webp` para reducir los tiempos de carga y consumo de ancho de banda.