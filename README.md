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

---

# Documentación Estructural: `index.html` (Proyecto Viajes UV)

## Descripción General
El archivo `index.html` sirve como el punto de entrada principal (entry point) y el esqueleto base para la aplicación web "Viajes UV". Está diseñado bajo una arquitectura de "Frontend Estático con Inyección Dinámica", donde la estructura principal está predefinida, pero el contenido de los viajes y los modales se genera en tiempo de ejecución a través de JavaScript y un archivo JSON.

---

## 1. Configuración del Documento (`<head>`)
Contiene los metadatos esenciales, enlaces a recursos externos y configuraciones de optimización (WPO).

*   **Meta Viewport:** Configurado para diseño responsivo (`width=device-width, initial-scale=1.0`).
*   **Favicon:** Implementación optimizada usando formato WebP (`type="image/webp"`) apuntando a `files/img/logo_viajes_uv.webp`.
*   **Tipografías (Google Fonts):** Precarga (`preconnect`) e importación de la fuente principal `Edu NSW ACT Cursive`.
*   **Hoja de Estilos:** Enlace al archivo principal de diseño modular `css/main_style.css`.

---

## 2. Componentes Principales de la Interfaz (`<body>`)

### A. Encabezado de Navegación (`<header class="header">`)
Barra de navegación principal que soporta efectos de scroll y comportamiento *sticky/relative* según el dispositivo.
*   **Logo:** Utiliza el atributo `loading="lazy"` para optimizar la carga inicial.
*   **Menú (`<nav>`):** Contiene enlaces con anclas (`#inicio`, `#viajes`) para desplazamiento suave (Smooth Scroll) gestionado por JS, y un enlace externo directo a WhatsApp.

### B. Banner Principal (`<section class="hero">`)
Sección de impacto visual que recibe al usuario. Diseñada para alojar una imagen de fondo de alta calidad gestionada a través de CSS con un filtro oscurecedor (overlay) para garantizar la legibilidad del texto.

### C. Contenedor de Datos Dinámicos (`<main id="viajes">`)
El núcleo de la aplicación donde se renderizan los destinos turísticos.
*   **Punto de Inyección:** El `<div id="contenedor-tarjetas">` actúa como un contenedor vacío. Es el objetivo principal donde el script `main.js` inyecta las etiquetas `<article class="trip-card">` generadas a partir de la lectura del archivo `viajes.json`.

---

## 3. Sistema de Ventana Modal (`#modal-detalles`)
Componente oculto por defecto que actúa como una capa superpuesta (`overlay`) para mostrar información detallada de un viaje específico sin abandonar la página principal.

*   **Reproductor Multimedia:** Utiliza una etiqueta `<video class="modal-video" controls preload="metadata">`. El atributo `preload="metadata"` optimiza el rendimiento al descargar solo los datos básicos del video hasta que el usuario decida reproducirlo.
*   **Listas Dinámicas:** Contiene contenedores vacíos (`#modal-lista` y `#modal-itinerario`) que esperan la inserción estructurada de datos (etiquetas `<li>` y `<p>`) desde el script.
*   **Llamado a la Acción (CTA):** El botón de reserva (`.modal-btn`) tiene un atributo temporal `href="#"`. La URL final, que incluye la API de WhatsApp con el texto codificado (`encodeURIComponent`), es asignada dinámicamente por JavaScript en el momento del clic.

---

## 4. Diccionario de Nodos (DOM Bindings para JavaScript)
Tabla de referencia rápida de los identificadores (`id`) y clases (`class`) utilizados por `main.js` para manipular el DOM:

| Elemento / Nodo | Selector (ID/Class) | Función en la Lógica (JS) |
| :--- | :--- | :--- |
| **Punto de Inyección Grid** | `#contenedor-tarjetas` | Recibe el HTML concatenado de todas las tarjetas de viaje. |
| **Capa Overlay del Modal** | `#modal-detalles` | Controla la visibilidad (añadiendo/removiendo la clase `active`). |
| **Botón de Cierre** | `.close-modal` | Dispara el evento para ocultar el modal y pausar el video. |
| **Título del Modal** | `.modal-title` | Actualiza el destino seleccionado (Ej. "Detalles del Viaje: Cancún"). |
| **Reproductor de Video** | `.modal-video` | Actualiza el atributo `src` y recibe la instrucción `.pause()`. |
| **Lista de Inclusiones** | `#modal-lista` | Recibe el mapeo del array `incluye` del JSON. |
| **Itinerario** | `#modal-itinerario` | Recibe el mapeo estructurado del array `itinerario`. |
| **Precio Total** | `.modal-price` | Renderiza el costo numérico formateado (`toLocaleString`). |
| **Botón WhatsApp** | `.modal-btn` | Actualiza el atributo `href` con la URL generada. |
| **Cuerpo del Modal** | `.modal-body` | Utilizado para reiniciar el scroll (`scrollTop = 0`) al cerrar. |

---

## 5. Scripts Secundarios
El documento finaliza con la importación del controlador lógico principal `<script src="js/main.js"></script>`, posicionado estratégicamente antes del cierre del `</body>` para evitar bloqueos en el renderizado inicial de la interfaz (Render-Blocking Resources).

---

# Documentación Estructural: `css/main_style.css` (Proyecto Viajes UV)

## Descripción General
El archivo `main_style.css` contiene todo el diseño visual, la tematización y el comportamiento responsivo de la aplicación "Viajes UV". Está construido utilizando CSS puro (Vanilla CSS) bajo una arquitectura modular, haciendo uso extensivo de **Flexbox**, **CSS Grid** y **Custom Properties (Variables)** para mantener un código limpio, escalable y fácil de mantener.

---

## 1. Tematización y Variables Globales (`:root`)
El diseño utiliza variables CSS para definir la paleta de colores corporativa. Esto permite cambiar todo el esquema de color de la aplicación modificando un solo bloque de código.

*   `--primary-blue` (`#02092c`): Azul marino profundo utilizado en títulos y el encabezado para transmitir confianza y profesionalismo.
*   `--light-blue-bg` (`#e3f2fd`): Fondo general de la página que da un aspecto limpio y fresco.
*   `--accent-cyan` (`#3fa9f5`): Color de acción (Call to Action) utilizado en botones, fechas y detalles para atraer la vista del usuario.
*   `--white`, `--text-dark`, `--text-gray`: Escala de grises para fondos de tarjetas y tipografía, garantizando un alto contraste (Accesibilidad web).

> **Tipografías:** Se importan de Google Fonts. `Poppins` (geométrica y moderna) para textos generales y lectura, y `Caveat` (estilo cursivo/handwritten) exclusivamente para el logo.

---

## 2. Componentes UI (User Interface)

### A. Encabezado y Navegación (`.header`, `.nav`)
*   **Posicionamiento:** Utiliza `position: fixed;` con un alto índice de profundidad (`z-index: 1000`) para mantenerse siempre visible.
*   **Efecto Scroll:** Al hacer scroll, JavaScript añade la clase `.scrolled`, la cual reduce el padding y ajusta la sombra (`box-shadow`) mediante una transición suave para optimizar el espacio visual.

### B. Banner Principal (`.hero`)
*   **Fondo Avanzado:** Aplica un `linear-gradient` semitransparente por encima de la imagen de fondo (`url(...)`). Este overlay oscuro garantiza que el título blanco tenga una legibilidad perfecta (AA Contrast) sin importar qué tan brillante sea la fotografía.
*   **Alineación:** Flexbox centra el contenido absoluta y dinámicamente en los ejes X e Y.

### C. Tarjetas de Viaje (`.trip-card`)
*   **Grid System:** El contenedor padre (`.trips-grid`) utiliza `display: grid;` con `grid-template-columns: repeat(2, 1fr);` para crear una cuadrícula perfecta de 2 columnas en pantallas grandes.
*   **Efectos Hover:** Las tarjetas cuentan con transformaciones en el eje Y (`translateY(-8px)`) y un aumento en la difusión de la sombra para crear un efecto de flotación táctil e interactivo.
*   **Imágenes:** Se controlan mediante `background-size: cover;` en un `div` de altura fija (280px), evitando que fotos de diferentes proporciones rompan el diseño de la tarjeta.

### D. Ventana Modal (`.modal-box`, `.modal-overlay`)
*   **Transiciones de Estado:** Utiliza `opacity` y `visibility` en lugar de `display: none;` para permitir animaciones de entrada fluidas al añadir la clase `.active`.
*   **Reproductor de Video (`.modal-video`):** Altura fijada a 300px con `object-fit: cover` para emular el comportamiento de un banner cinematográfico, rellenando el marco sin distorsionar la imagen.

---

## 3. Estrategia de Responsividad (Media Queries)
El código CSS adapta la interfaz a cualquier dispositivo interceptando dos puntos de quiebre (breakpoints) críticos:

### `@media (max-width: 768px)` (Celulares en Vertical / Portrait)
Reestructura el diseño para pantallas angostas.
*   **Header:** Cambia de `row` a `column`, apilando el logo y el menú.
*   **Grid:** Cambia a `grid-template-columns: 1fr;` para mostrar una sola tarjeta por fila.
*   **Modal:** El botón de reserva ocupa el 100% del ancho (`width: 100%`) para facilitar el toque (Touch Target), y el video adopta una relación de aspecto dinámica (`aspect-ratio: 16/9`).

### `@media (max-width: 950px) and (orientation: landscape)` (Celulares en Horizontal)
Diseñado específicamente para mitigar la falta de altura cuando un usuario gira su dispositivo.
*   **Header Desanclado:** Cambia el menú de `fixed` a `relative`, permitiendo que desaparezca al hacer scroll para liberar el 100% de la pantalla.
*   **Optimización del Modal:** Reduce los márgenes (`padding`), limita la altura del video a `150px` (desactivando el 16:9), y devuelve el botón y el precio a una misma línea (`flex-direction: row`) para evitar el aplastamiento del contenido vertical.

---

# Documentación Estructural: `js/main.js` (Proyecto Viajes UV)

## Descripción General
El archivo `main.js` es el controlador lógico de la aplicación (Controlador en el patrón MVC). Está escrito en Vanilla JavaScript (ES6+) y se encarga de cuatro tareas fundamentales: gestionar los efectos visuales de la interfaz, consumir el archivo de datos JSON de forma asíncrona, renderizar el DOM optimizando el rendimiento, y controlar el estado y comportamiento de la ventana modal.

---

## 1. Efectos de Interfaz (UI & UX)
Mejora la experiencia del usuario gestionando el comportamiento del scroll y la navegación.

*   **Restauración Manual de Scroll:** Intercepta la API `history.scrollRestoration` para forzar a la página a cargar siempre desde la parte superior (inicio) tras un refresco, evitando que el navegador recuerde posiciones extrañas.
*   **Header Dinámico:** Un `EventListener` en el objeto `window` detecta cuando el usuario baja más de 50px (`scrollY > 50`) y añade la clase `.scrolled` al encabezado para hacerlo más compacto y aplicar una sombra.
*   **Smooth Scroll Dinámico:** Intercepta los clics en los enlaces de ancla (`href^="#"`). 
    *   *Optimización:* Utiliza `getBoundingClientRect()` y `offsetHeight` para calcular dinámicamente la altura exacta del menú en tiempo real (vital para diferenciar el menú de PC vs. el menú alto de celular).
    *   Aplica `window.scrollTo` con comportamiento `smooth` y una compensación de `+ 15px` para que el título de la sección respire y no quede tapado.

---

## 2. Lógica de Datos y Renderizado (JSON)
Separa los datos del diseño, permitiendo escalabilidad sin necesidad de tocar el HTML.

*   **Variable Global (`datosCentralizados`):** Actúa como la "memoria RAM" de la aplicación, guardando el JSON temporalmente para no tener que hacer múltiples peticiones de red (fetches) cuando el usuario abre diferentes modales.
*   **`cargarViajes()` (Async/Await):** Utiliza la API `fetch` para llamar al archivo local `./data/viajes.json`. Incluye un bloque `try/catch` para interceptar errores de red o servidor y renderizar un mensaje de error amigable en el DOM.
*   **`renderizarTarjetas()` (WPO - Web Performance Optimization):** 
    *   Evita el *Reflow* y *Repaint* excesivo del navegador. En lugar de inyectar cada tarjeta una por una en el DOM dentro del ciclo `forEach`, concatena todo el código en una variable de texto (`htmlAcumulado`).
    *   Realiza una única inyección al `innerHTML` del contenedor principal, mejorando drásticamente el rendimiento en dispositivos móviles.
    *   Condiciona la creación de elementos secundarios (ej. la etiqueta `badge`) verificando su existencia en el objeto JSON.

---

## 3. Lógica de la Ventana Modal
Controla la inyección de datos detallados, la interacción multimedia y la generación de llamadas a la acción (CTA).

*   **Delegación y Binding (`asignarEventosModal`):** Se ejecuta *después* de renderizar las tarjetas para asegurar que los botones `.btn-reservar` existan en el DOM.
*   **Inyección de Datos (Búsqueda por ID):** Cuando el usuario da clic a un botón, se extrae su atributo `data-viaje` y se utiliza la función `.find()` para localizar ese ID exacto dentro del array `datosCentralizados`.
*   **Formateo Dinámico:**
    *   **Arrays a Listas:** Recorre los arrays de `incluye` e `itinerario` para construir listas HTML (`<li>` y `<p>`).
    *   **Bold Inteligente (Split):** Utiliza `.split(": ")` en el itinerario para separar palabras como "Día 1:" y envolverlas automáticamente en etiquetas `<strong>`.
    *   **Formato de Moneda:** Aplica `.toLocaleString()` a los números enteros para añadir comas (ej. de `8500` a `8,500`).
*   **Generador de URLs para WhatsApp:** Construye la URL de la API de WhatsApp de forma dinámica, aplicando `encodeURIComponent()` al texto del JSON para convertir los espacios y caracteres especiales en formato seguro para URLs (ej. `%20`).
*   **Gestión del Estado del Modal (`cerrarModal`):** 
    *   Detiene cualquier video en reproducción mediante `modalVideo.pause()` para evitar que el audio siga sonando en segundo plano.
    *   Reactiva el scroll de la página web (`overflow = 'auto'`).
    *   Utiliza un `setTimeout` de 300ms (sincronizado con la transición CSS) para regresar el scroll del cuerpo del modal a la parte superior (`scrollTop = 0`), preparándolo para la próxima vez que se abra.

---

## 4. Inicialización
*   **`cargarViajes()`:** Única llamada en el nivel raíz del script que actúa como el gatillo (trigger) para desencadenar todo el flujo de carga, renderizado y asignación de eventos en cuanto el archivo JS es leído por el navegador.