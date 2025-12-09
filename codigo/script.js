// ===============================
// ========== SELECTORES Y UTILIDADES ==========
// ===============================

const seleccionar = (selector) => document.querySelector(selector);
const seleccionarTodos = (selector) => Array.from(document.querySelectorAll(selector));
const normalizarTexto = (texto) => (texto || "").toString().toLowerCase().trim();

function nombreEtiqueta(etiqueta) {
  if (etiqueta === "javascript") return "JavaScript";
  if (etiqueta === "html") return "HTML";
  if (etiqueta === "php") return "PHP";
  if (etiqueta === "laravel") return "Laravel";
  return etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
}

// ===============================
// ========== DATOS DE PROYECTOS ==========
// ===============================

const devChallengeData = [
  {
    titulo: "Lista de Compra",
    descripcion: "Aplicación web para gestionar listas de compra.",
    repositorio: "https://github.com/pabloms05/proyectoListaCompra",
    url: "http://listacompra.duckdns.org"
  }
];

const proyectosData = [
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

function renderizarDevChallenge() {
  const contenedor = document.querySelector('.devchallenge-proyectos');
  if (!contenedor) return;

  try {
    contenedor.innerHTML = devChallengeData.map(proyecto => `
      <article class="devchallenge-item">
        <h3>${proyecto.titulo}</h3>
        <p>${proyecto.descripcion}</p>
        <p>
          <a href="${proyecto.repositorio}" 
             target="_blank" 
             rel="noopener"
             aria-label="Ver código de ${proyecto.titulo} en GitHub">
            Ver código
          </a>
          ${proyecto.url ? `<a href="${proyecto.url}" target="_blank" rel="noopener" aria-label="Ver página en vivo de ${proyecto.titulo}">Ver página</a>` : ''}
        </p>
      </article>
    `).join('');
  } catch (error) {
    console.error('Error al renderizar DevChallenge:', error);
    contenedor.innerHTML = '<p>Error al cargar proyectos destacados</p>';
  }
}

function renderizarProyectos() {
  const contenedor = document.querySelector('.lista-proyectos');
  if (!contenedor) return;

  try {
    contenedor.innerHTML = proyectosData.map(proyecto => `
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
          ${proyecto.url ? `<a href="${proyecto.url}" target="_blank" rel="noopener" aria-label="Ver página en vivo de ${proyecto.titulo}">Ver página</a>` : ''}
        </p>
      </article>
    `).join('');
  } catch (error) {
    console.error('Error al renderizar proyectos:', error);
    contenedor.innerHTML = '<p>Error al cargar proyectos</p>';
  }
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

function obtenerEtiquetas(proyecto) {
  return (proyecto.dataset.lenguajes || "")
    .split(",")
    .map((etiqueta) => normalizarTexto(etiqueta))
    .filter(Boolean);
}

function limpiarFiltros() {
  filtroActivo = null;
  Array.from(contenedorBotones.children).forEach((b) =>
    b.setAttribute("aria-pressed", "false")
  );
  aplicarFiltros();
}

function proyectoCoincide(proyecto) {
  if (!filtroActivo) return true;
  const etiquetas = obtenerEtiquetas(proyecto);
  return etiquetas.includes(filtroActivo);
}

function aplicarFiltros() {
  let proyectosVisibles = 0;
  const coincidencias = [];

  listaProyectos.forEach((proyecto) => {
    if (proyectoCoincide(proyecto)) {
      proyecto.style.display = "";
      proyecto.setAttribute("aria-hidden", "false");
      proyectosVisibles++;
      coincidencias.push(
        proyecto.dataset.titulo || proyecto.querySelector("h3")?.textContent || "sin-titulo"
      );
    } else {
      proyecto.style.display = "none";
      proyecto.setAttribute("aria-hidden", "true");
    }
  });

  if (contadorProyectos) {
    contadorProyectos.textContent = `Mostrando ${proyectosVisibles} proyecto${proyectosVisibles !== 1 ? "s" : ""}`;
  }
}

// ===============================
// ========== INICIALIZACIÓN DOM ==========
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Renderizar DevChallenge y proyectos primero
  renderizarDevChallenge();
  renderizarProyectos();
  
  listaProyectos = seleccionarTodos("article.fila-item");
  contenedorBotones = seleccionar("#botones-lenguaje");
  botonTodos = seleccionar("#limpiar-btn");
  contadorProyectos = seleccionar("#contador");

  // Si no existe el contenedor, salir silenciosamente (no estamos en la página de proyectos)
  if (!contenedorBotones) {
    return;
  }

  // Crea los controles según etiquetas encontradas
  const lenguajes = (() => {
    const conjunto = new Set();
    listaProyectos.forEach((proyecto) => {
      obtenerEtiquetas(proyecto).forEach((etiqueta) => conjunto.add(etiqueta));
    });
    return Array.from(conjunto).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  })();

  contenedorBotones.innerHTML = "";
  lenguajes.forEach((lenguaje) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.dataset.filtro = lenguaje;
    let rutaLogo = "";
    if (lenguaje === "php") rutaLogo = "../imagenes/php.png";
    else if (lenguaje === "javascript") rutaLogo = "../imagenes/javascript.png";
    else if (lenguaje === "html") rutaLogo = "../imagenes/html.png";
    else if (lenguaje === "laravel") rutaLogo = "../imagenes/laravel.png";
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
      Array.from(contenedorBotones.children).forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.filtro === filtroActivo ? "true" : "false");
      });
      aplicarFiltros();
      evento.currentTarget.focus();
    });
    contenedorBotones.appendChild(boton);
  });

  aplicarFiltros();
  if (botonTodos) botonTodos.addEventListener("click", limpiarFiltros);
  
  // Navegación con flechas en botones de filtrado
  const botonesLenguaje = document.querySelectorAll('#botones-lenguaje button');
  botonesLenguaje.forEach((boton, index) => {
    boton.addEventListener('keydown', (e) => {
      let targetIndex = index;
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = (index + 1) % botonesLenguaje.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = (index - 1 + botonesLenguaje.length) % botonesLenguaje.length;
          break;
      }
      if (targetIndex !== index) {
        botonesLenguaje[targetIndex].focus();
      }
    });
  });
  
  // Navegación con flechas en grid de habilidades
  const habilidadesCards = document.querySelectorAll('.habilidad-card');
  habilidadesCards.forEach((card, index) => {
    card.addEventListener('keydown', (e) => {
      let targetIndex = index;
      const columns = window.innerWidth > 768 ? 4 : (window.innerWidth > 480 ? 3 : 2);
      
      switch(e.key) {
        case 'ArrowRight':
          e.preventDefault();
          targetIndex = (index + 1) % habilidadesCards.length;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          targetIndex = (index - 1 + habilidadesCards.length) % habilidadesCards.length;
          break;
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = (index + columns) % habilidadesCards.length;
          break;
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = (index - columns + habilidadesCards.length) % habilidadesCards.length;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          // Tarjeta de habilidad activada
          card.style.transform = 'scale(0.95)';
          setTimeout(() => card.style.transform = '', 150);
          break;
      }
      
      if (targetIndex !== index) {
        habilidadesCards[targetIndex].focus();
      }
    });
  });
  
  // Indicador de página activa en menú
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu li a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
});
