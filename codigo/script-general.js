// ===============================
// ========== SCRIPT GENERAL ==========
// ===============================
// Usado en: index.html, habilidades.html, contacto.html

document.addEventListener("DOMContentLoaded", () => {
  marcarPaginaActiva();
  inicializarNavegacionHabilidades();
});

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

function inicializarNavegacionHabilidades() {
  const tarjetasHabilidades = document.querySelectorAll('.habilidad-card');
  tarjetasHabilidades.forEach((tarjeta, indice) => {
    tarjeta.addEventListener('keydown', (evento) => {
      let indiceDestino = indice;
      const columnas = window.innerWidth > 768 ? 4 : (window.innerWidth > 480 ? 3 : 2);
      
      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        indiceDestino = (indice + 1) % tarjetasHabilidades.length;
      }
      else if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        indiceDestino = (indice - 1 + tarjetasHabilidades.length) % tarjetasHabilidades.length;
      }
      else if (evento.key === 'ArrowDown') {
        evento.preventDefault();
        indiceDestino = (indice + columnas) % tarjetasHabilidades.length;
      }
      else if (evento.key === 'ArrowUp') {
        evento.preventDefault();
        indiceDestino = (indice - columnas + tarjetasHabilidades.length) % tarjetasHabilidades.length;
      }
      else if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        tarjeta.style.transform = 'scale(0.95)';
        setTimeout(() => tarjeta.style.transform = '', 150);
      }
      
      if (indiceDestino !== indice) {
        tarjetasHabilidades[indiceDestino].focus();
      }
    });
  });
}
