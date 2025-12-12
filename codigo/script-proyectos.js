// ===============================
// ========== UTILIDADES ==========
// ===============================

const seleccionar = (selector) => document.querySelector(selector);
const seleccionarTodos = (selector) => document.querySelectorAll(selector);
const normalizarTexto = (texto) => (texto || "").toString().toLowerCase().trim();

function nombreEtiqueta(etiqueta) {
  if (etiqueta === "javascript") {
    return "JavaScript";
  } else if (etiqueta === "html") {
    return "HTML";
  } else if (etiqueta === "php") {
    return "PHP";
  } else if (etiqueta === "laravel") {
    return "Laravel";
  } else {
    return etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
  }
}

// ===============================
// ========== DATOS DE PROYECTOS ==========
// ===============================

const datosProyectos = [
  {
    titulo: "AriaBootstrap - Página Portátiles",
    descripcion: "Página Venta Portátiles.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/AriaBootstrap-Pagina-Portatiles"
  },
  {
    titulo: "Projecte UF4 - Llista de tasques",
    descripcion: "Página de Listado de Tareas.",
    lenguajes: ["javascript"],
    repositorio: "https://github.com/alejandro240/Projecte-UF4-Llista-de-tasques"
  },
  {
    titulo: "Horoscopo Laravel",
    descripcion: "Página Horoscopo (Laravel).",
    lenguajes: ["laravel"],
    repositorio: "https://github.com/alejandro240/Horoscopo-Laravel"
  },
  {
    titulo: "Cataas PHP Laravel",
    descripcion: "Página de gatitos (Cataas) en Laravel.",
    lenguajes: ["laravel"],
    repositorio: "https://github.com/alejandro240/Cataas-PHP-Laravel"
  },
  {
    titulo: "PaginaColoresAccesible",
    descripcion: "Página de Colores Accesible.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/PaginaColoresAccesible"
  },
  {
    titulo: "PaginaAccesibleARIA",
    descripcion: "Página Accesible con ARIA.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/PaginaAccesibleARIA"
  },
  {
    titulo: "PaginaAccesible",
    descripcion: "Página Accesible.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/PaginaAccesible"
  },
  {
    titulo: "PaginaMultimedia",
    descripcion: "Página Multimedia.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/PaginaMultimedia"
  },
  {
    titulo: "Manipulacion de video",
    descripcion: "Página de Video.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/Manipulacion-de-video"
  },
  {
    titulo: "AA - Gestor de Categorias",
    descripcion: "Página de gestor de Heroes.",
    lenguajes: ["php"],
    repositorio: "https://github.com/alejandro240/AA-Gestor-de-Categorias"
  },
  {
    titulo: "Motosierra.arg",
    descripcion: "Página de la Motosierra.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/Motosierra.arg"
  },
  {
    titulo: "AnimacionesSvg",
    descripcion: "Página con Animaciones SVG.",
    lenguajes: ["html"],
    repositorio: "https://github.com/alejandro240/AnimacionesSvg"
  }
];

// ===============================
// ========== RENDERIZAR PROYECTOS ==========
// ===============================

function renderizarProyectos() {
  const contenedor = document.querySelector('.lista-proyectos');

  // Recorrer todos los proyectos y convertirlos en HTML
  contenedor.innerHTML = datosProyectos.map(proyecto => {
    let enlaceUrl = '';
    // Si el proyecto tiene una URL de página en vivo, crear el enlace
    if (proyecto.url) {
      enlaceUrl = `<a href="${proyecto.url}" target="_blank" rel="noopener" aria-label="Ver página en vivo de ${proyecto.titulo}">Ver página</a>`;
    }
    
    // Devolver el HTML de cada proyecto
    return `
      <article class="fila-item" 
               data-lenguajes="${proyecto.lenguajes.join(',')}" 
               data-titulo="${proyecto.titulo}">
        <h3>${proyecto.titulo}</h3>
        <p>${proyecto.descripcion}</p>
        <p>
          <a href="${proyecto.repositorio}" 
             target="_blank" 
             rel="noopener"
             aria-label="Ver código de ${proyecto.titulo} en GitHub">
            Ver código
          </a>
          ${enlaceUrl}
        </p>
      </article>
    `;
  }).join('');
}

// ===============================
// ========== ESTADO GLOBAL ==========
// ===============================

let listaProyectos = [];
let contenedorBotones;
let botonTodos;
let contadorProyectos;
let filtroActivo = null;

// ===============================
// ========== FUNCIONES DE FILTRADO ==========
// ===============================

// Extrae y normaliza los lenguajes de un proyecto desde su atributo data-lenguajes
function obtenerEtiquetas(proyecto) {
  return (proyecto.dataset.lenguajes || "")
    .split(",")
    .map((etiqueta) => normalizarTexto(etiqueta))
    .filter(etiqueta => {
      // Si la etiqueta tiene contenido, incluirla en el resultado
      if (etiqueta) {
        return true;
      // Si la etiqueta está vacía, excluirla del resultado
      } else {
        return false;
      }
    });
}

// Resetea el filtro activo y marca todos los botones como no presionados
function limpiarFiltros() {
  // Eliminar el filtro activo
  filtroActivo = null;
  // Recorrer todos los botones de lenguaje
  for (let i = 0; i < contenedorBotones.children.length; i++) {
    // Marcar cada botón como no presionado
    contenedorBotones.children[i].setAttribute("aria-pressed", "false");
  }
  // Aplicar los filtros (mostrará todos los proyectos)
  aplicarFiltros();
}

// Verifica si un proyecto coincide con el filtro activo
function proyectoCoincide(proyecto) {
  // Si no hay filtro activo, todos los proyectos coinciden
  if (!filtroActivo) {
    return true;
  // Si hay un filtro activo, verificar si el proyecto tiene ese lenguaje
  } else {
    const etiquetas = obtenerEtiquetas(proyecto);
    return etiquetas.includes(filtroActivo);
  }
}

// Muestra u oculta proyectos según el filtro activo y actualiza el contador
function aplicarFiltros() {
  let proyectosVisibles = 0;

  // Recorrer todos los proyectos
  listaProyectos.forEach((proyecto) => {
    // Si el proyecto coincide con el filtro
    if (proyectoCoincide(proyecto)) {
      // Mostrar el proyecto
      proyecto.style.display = "";
      proyecto.setAttribute("aria-hidden", "false");
      proyectosVisibles++;
    // Si el proyecto no coincide con el filtro
    } else {
      // Ocultar el proyecto
      proyecto.style.display = "none";
      proyecto.setAttribute("aria-hidden", "true");
    }
  });

  // Si existe el elemento contador de proyectos
  if (contadorProyectos) {
    let textoProyectos = "proyecto";
    // Si hay más de un proyecto o ninguno, usar plural
    if (proyectosVisibles !== 1) {
      textoProyectos = "proyectos";
    }
    // Actualizar el texto del contador
    contadorProyectos.textContent = `Mostrando ${proyectosVisibles} ${textoProyectos}`;
  }
}

// ===============================
// ========== INICIALIZACIÓN ==========
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  renderizarProyectos();
  
  listaProyectos = seleccionarTodos("article.fila-item");
  contenedorBotones = seleccionar("#botones-lenguaje");
  botonTodos = seleccionar("#limpiar-btn");
  contadorProyectos = seleccionar("#contador");

  // Obtener una lista única de todos los lenguajes usados en los proyectos
  const lenguajes = (() => {
    const unicos = [];
    // Recorrer todos los proyectos
    listaProyectos.forEach((proyecto) => {
      // Recorrer todas las etiquetas de cada proyecto
      obtenerEtiquetas(proyecto).forEach((etiqueta) => {
        // Si la etiqueta no está en la lista de únicos, agregarla
        if (!unicos.includes(etiqueta)) {
          unicos.push(etiqueta);
        }
      });
    });
    // Ordenar alfabéticamente los lenguajes
    return unicos.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  })();

  // Limpiar el contenedor de botones
  contenedorBotones.innerHTML = "";
  // Recorrer cada lenguaje para crear su botón
  lenguajes.forEach((lenguaje) => {
    // Crear un nuevo botón
    const boton = document.createElement("button");
    boton.type = "button";
    boton.dataset.filtro = lenguaje;
    
    let rutaLogo = "";
    // Determinar la ruta del logo según el lenguaje
    if (lenguaje === "php") {
      rutaLogo = "../imagenes/php.png";
    } else if (lenguaje === "javascript") {
      rutaLogo = "../imagenes/javascript.png";
    } else if (lenguaje === "html") {
      rutaLogo = "../imagenes/html.png";
    } else if (lenguaje === "laravel") {
      rutaLogo = "../imagenes/laravel.png";
    }
    
    // Si se encontró una ruta de logo, crear la imagen
    if (rutaLogo) {
      const img = document.createElement("img");
      img.src = rutaLogo;
      img.alt = `Logo ${nombreEtiqueta(lenguaje)}`;
      img.className = "logo-lenguaje";
      boton.appendChild(img);
    }
    
    // Marcar el botón como no presionado inicialmente
    boton.setAttribute("aria-pressed", "false");
    
    // Agregar evento de clic al botón
    boton.addEventListener("click", (evento) => {
      // Establecer el filtro activo al lenguaje del botón clickeado
      filtroActivo = evento.currentTarget.dataset.filtro;
      // Recorrer todos los botones de lenguaje
      for (let i = 0; i < contenedorBotones.children.length; i++) {
        // Si el botón corresponde al filtro activo, marcarlo como presionado
        if (contenedorBotones.children[i].dataset.filtro === filtroActivo) {
          contenedorBotones.children[i].setAttribute("aria-pressed", "true");
        // Si el botón no corresponde al filtro activo, marcarlo como no presionado
        } else {
          contenedorBotones.children[i].setAttribute("aria-pressed", "false");
        }
      }
      // Aplicar los filtros para mostrar solo los proyectos del lenguaje seleccionado
      aplicarFiltros();
      // Enfocar el botón clickeado
      evento.currentTarget.focus();
    });
    
    // Agregar el botón al contenedor
    contenedorBotones.appendChild(boton);
  });

  // Aplicar filtros para mostrar el contador inicial
  aplicarFiltros();
  
  // Si existe el botón "Todos", agregar evento para limpiar filtros
  if (botonTodos) {
    botonTodos.addEventListener("click", limpiarFiltros);
  }
  
  // Inicializar la navegación con teclado entre botones
  inicializarNavegacionTeclado();
  // Marcar la página actual en el menú de navegación
  marcarPaginaActiva();
});

// ===============================
// ========== FUNCIONES AUXILIARES ==========
// ===============================

function inicializarNavegacionTeclado() {
  const botonesLenguaje = document.querySelectorAll('#botones-lenguaje button');
  // Recorrer cada botón de lenguaje
  botonesLenguaje.forEach((boton, indice) => {
    // Agregar evento para navegación con teclado
    boton.addEventListener('keydown', (evento) => {
      let indiceDestino = indice;
      
      // Si se presiona flecha derecha o abajo, ir al siguiente botón
      if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
        evento.preventDefault();
        indiceDestino = (indice + 1) % botonesLenguaje.length;
      }
      // Si se presiona flecha izquierda o arriba, ir al botón anterior
      else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
        evento.preventDefault();
        indiceDestino = (indice - 1 + botonesLenguaje.length) % botonesLenguaje.length;
      }
      
      // Si cambió el índice, enfocar el nuevo botón
      if (indiceDestino !== indice) {
        botonesLenguaje[indiceDestino].focus();
      }
    });
  });
}

function marcarPaginaActiva() {
  // Obtener el nombre del archivo actual de la URL
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  // Recorrer todos los enlaces del menú
  document.querySelectorAll('.menu li a').forEach(enlace => {
    const paginaEnlace = enlace.getAttribute('href');
    // Si el enlace corresponde a la página actual
    if (paginaEnlace === paginaActual) {
      // Agregar clase 'active' al enlace
      enlace.classList.add('active');
      // Marcar el enlace como página actual para accesibilidad
      enlace.setAttribute('aria-current', 'page');
    }
  });
}
