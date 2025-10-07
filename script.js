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
    if (lenguaje === "php") rutaLogo = "php.png";
    else if (lenguaje === "javascript") rutaLogo = "javascript.png";
    else if (lenguaje === "html") rutaLogo = "html.png";
    else if (lenguaje === "laravel") rutaLogo = "laravel.png";
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
