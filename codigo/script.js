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

function renderizarProyectos() {
  const contenedor = document.querySelector('.lista-proyectos');
  if (!contenedor) return;

  contenedor.innerHTML = proyectosData.map(proyecto => `
    <article class="fila-item" 
             data-lenguajes="${proyecto.lenguajes.join(',')}" 
             data-titulo="${proyecto.titulo}">
      <h3>${proyecto.titulo}</h3>
      <p>${proyecto.descripcion}</p>
      <p>
        <a href="${proyecto.repositorio}" 
           target="_blank" 
           rel="noopener">
          Ver código
        </a>
      </p>
    </article>
  `).join('');
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

  console.log("Filtro activo:", filtroActivo, "Proyectos visibles:", proyectosVisibles, coincidencias);
}

// ===============================
// ========== INICIALIZACIÓN DOM ==========
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Renderizar proyectos primero
  renderizarProyectos();
  
  listaProyectos = seleccionarTodos("article.fila-item");
  contenedorBotones = seleccionar("#botones-lenguaje");
  botonTodos = seleccionar("#limpiar-btn");
  contadorProyectos = seleccionar("#contador");

  if (!contenedorBotones) {
    console.error("No existe el contenedor de botones #botones-lenguaje");
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
});

// ===============================
// ========== SLIDER HABILIDADES ==========
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const sliderHabilidades = seleccionar(".habilidades-slider");
  if (!sliderHabilidades) return;
  const listaHabilidades = sliderHabilidades.querySelector(".habilidades-lista");
  const botonAnterior = sliderHabilidades.querySelector(".habilidades-prev");
  const botonSiguiente = sliderHabilidades.querySelector(".habilidades-next");
  const elementos = listaHabilidades.querySelectorAll("li");
  const cantidadVisible = 3;
  let indice = 0;

  function actualizarSlider() {
    const anchoElemento = elementos[0].offsetWidth + 24;
    listaHabilidades.style.transform = `translateX(-${indice * anchoElemento}px)`;
    elementos.forEach((elemento, i) => {
      elemento.classList.remove("habilidad-activa", "habilidad-lateral");
      if (i === indice + 1) {
        elemento.classList.add("habilidad-activa");
      } else if (i === indice || i === indice + 2) {
        elemento.classList.add("habilidad-lateral");
      }
    });
  }

  function animarDesplazamiento(direccion, callback) {
    const claseAnimacion = direccion === "izquierda" ? "slide-left" : "slide-right";
    listaHabilidades.classList.add(claseAnimacion);
    setTimeout(() => {
      if (typeof callback === "function") callback();
      listaHabilidades.classList.remove(claseAnimacion);
    }, 350);
  }

  botonAnterior.addEventListener("click", () => {
    if (elementos.length <= cantidadVisible) {
      indice = 0;
      actualizarSlider();
      return;
    }
    const indiceAnterior = indice;
    indice = (indice - 1 + (elementos.length - cantidadVisible + 1)) % (elementos.length - cantidadVisible + 1);
    if (indiceAnterior === 0 && indice === elementos.length - cantidadVisible) {
      animarDesplazamiento("izquierda", actualizarSlider);
    } else {
      actualizarSlider();
    }
  });

  botonSiguiente.addEventListener("click", () => {
    if (elementos.length <= cantidadVisible) {
      indice = 0;
      actualizarSlider();
      return;
    }
    const indiceAnterior = indice;
    indice = (indice + 1) % (elementos.length - cantidadVisible + 1);
    if (indiceAnterior === elementos.length - cantidadVisible && indice === 0) {
      animarDesplazamiento("derecha", actualizarSlider);
    } else {
      actualizarSlider();
    }
  });

  actualizarSlider();
  window.addEventListener("resize", actualizarSlider);
});
