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

  contenedor.innerHTML = datosProyectos.map(proyecto => {
    let enlaceUrl = '';
    if (proyecto.url) {
      enlaceUrl = `<a href="${proyecto.url}" target="_blank" rel="noopener" aria-label="Ver página en vivo de ${proyecto.titulo}">Ver página</a>`;
    }
    
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
      if (etiqueta) {
        return true;
      } else {
        return false;
      }
    });
}

// Resetea el filtro activo y marca todos los botones como no presionados
function limpiarFiltros() {
  filtroActivo = null;
  [...contenedorBotones.children].forEach((b) =>
    b.setAttribute("aria-pressed", "false")
  );
  aplicarFiltros();
}

// Verifica si un proyecto coincide con el filtro activo
function proyectoCoincide(proyecto) {
  if (!filtroActivo) {
    return true;
  } else {
    const etiquetas = obtenerEtiquetas(proyecto);
    return etiquetas.includes(filtroActivo);
  }
}

// Muestra u oculta proyectos según el filtro activo y actualiza el contador
function aplicarFiltros() {
  let proyectosVisibles = 0;

  listaProyectos.forEach((proyecto) => {
    if (proyectoCoincide(proyecto)) {
      proyecto.style.display = "";
      proyecto.setAttribute("aria-hidden", "false");
      proyectosVisibles++;
    } else {
      proyecto.style.display = "none";
      proyecto.setAttribute("aria-hidden", "true");
    }
  });

  if (contadorProyectos) {
    let textoProyectos = "proyecto";
    if (proyectosVisibles !== 1) {
      textoProyectos = "proyectos";
    }
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

  const lenguajes = (() => {
    const unicos = [];
    listaProyectos.forEach((proyecto) => {
      obtenerEtiquetas(proyecto).forEach((etiqueta) => {
        if (!unicos.includes(etiqueta)) {
          unicos.push(etiqueta);
        }
      });
    });
    return unicos.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  })();

  contenedorBotones.innerHTML = "";
  lenguajes.forEach((lenguaje) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.dataset.filtro = lenguaje;
    
    let rutaLogo = "";
    if (lenguaje === "php") {
      rutaLogo = "../imagenes/php.png";
    } else if (lenguaje === "javascript") {
      rutaLogo = "../imagenes/javascript.png";
    } else if (lenguaje === "html") {
      rutaLogo = "../imagenes/html.png";
    } else if (lenguaje === "laravel") {
      rutaLogo = "../imagenes/laravel.png";
    }
    
    if (rutaLogo) {
      const img = document.createElement("img");
      img.src = rutaLogo;
      img.alt = `Logo ${nombreEtiqueta(lenguaje)}`;
      img.className = "logo-lenguaje";
      boton.appendChild(img);
    }
    
    boton.setAttribute("aria-pressed", "false");
    
    boton.addEventListener("click", (evento) => {
      filtroActivo = evento.currentTarget.dataset.filtro;
      [...contenedorBotones.children].forEach((b) => {
        if (b.dataset.filtro === filtroActivo) {
          b.setAttribute("aria-pressed", "true");
        } else {
          b.setAttribute("aria-pressed", "false");
        }
      });
      aplicarFiltros();
      evento.currentTarget.focus();
    });
    
    contenedorBotones.appendChild(boton);
  });

  aplicarFiltros();
  
  if (botonTodos) {
    botonTodos.addEventListener("click", limpiarFiltros);
  }
  
  inicializarNavegacionTeclado();
  marcarPaginaActiva();
});

// ===============================
// ========== FUNCIONES AUXILIARES ==========
// ===============================

function inicializarNavegacionTeclado() {
  const botonesLenguaje = document.querySelectorAll('#botones-lenguaje button');
  botonesLenguaje.forEach((boton, indice) => {
    boton.addEventListener('keydown', (evento) => {
      let indiceDestino = indice;
      
      if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
        evento.preventDefault();
        indiceDestino = (indice + 1) % botonesLenguaje.length;
      }
      else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
        evento.preventDefault();
        indiceDestino = (indice - 1 + botonesLenguaje.length) % botonesLenguaje.length;
      }
      
      if (indiceDestino !== indice) {
        botonesLenguaje[indiceDestino].focus();
      }
    });
  });
}

function marcarPaginaActiva() {
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu li a').forEach(enlace => {
    const paginaEnlace = enlace.getAttribute('href');
    if (paginaEnlace === paginaActual) {
      enlace.classList.add('active');
      enlace.setAttribute('aria-current', 'page');
    }
  });
}
