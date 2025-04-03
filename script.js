document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("filtro");
  const sectores = document.querySelectorAll(".sector");

  // Función para actualizar la visibilidad de los controles del carrusel
  const actualizarControlesCarrusel = (sector) => {
    const simuladoresVisibles = sector.querySelectorAll(".simulador:not([style*='display: none'])").length;
    const controles = sector.querySelector(".carousel-controls");
    if (controles) {
      controles.style.display = simuladoresVisibles > 1 ? "flex" : "none";
    }
  };

  // Inicializar la visibilidad de los controles al cargar la página
  sectores.forEach(sector => actualizarControlesCarrusel(sector));

  // Evento para filtrar simuladores
  input.addEventListener("input", () => {
    const filtro = input.value.toLowerCase().trim();
    const hayFiltro = filtro.length > 0;

    sectores.forEach(sector => {
      const simuladores = sector.querySelectorAll(".simulador");
      let sectorTieneCoincidencias = false;

      simuladores.forEach(simulador => {
        const keywords = simulador.dataset.keywords?.toLowerCase() || "";
        const visible = keywords.includes(filtro);
        simulador.style.display = visible ? "block" : "none";
        if (visible) {
          sectorTieneCoincidencias = true;
        }
      });

      // Mostrar u ocultar el sector basado en coincidencias
      sector.style.display = (hayFiltro && !sectorTieneCoincidencias) ? "none" : "block";

      // Actualizar la visibilidad de los controles del carrusel
      actualizarControlesCarrusel(sector);
    });
  });
});

// CARRUSEL + AUTO-SLIDE + PAUSA SI HAY BÚSQUEDA
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const items = Array.from(track.children).filter(el => el.classList.contains('simulador'));
  const prevBtn = carousel.querySelector('.carousel-btn.left');
  const nextBtn = carousel.querySelector('.carousel-btn.right');
  const indicators = carousel.querySelector('.carousel-indicators');

  let index = 0;
  let autoSlide;
  let isFiltering = false;

  // Crear puntos
  indicators.innerHTML = '';
  items.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    indicators.appendChild(dot);
    dot.addEventListener('click', () => {
      index = i;
      updateCarousel();
      if (!isFiltering) resetInterval();
    });
  });

  const updateCarousel = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    carousel.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + items.length) % items.length;
    updateCarousel();
    if (!isFiltering) resetInterval();
  });

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % items.length;
    updateCarousel();
    if (!isFiltering) resetInterval();
  });

  // Swipe táctil
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - startX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        index = (index - 1 + items.length) % items.length;
      } else {
        index = (index + 1) % items.length;
      }
      updateCarousel();
      if (!isFiltering) resetInterval();
      isDragging = false;
    }
  });

  track.addEventListener('touchend', () => {
    isDragging = false;
  });

  function startAutoSlide() {
    if (items.length > 1) {
      autoSlide = setInterval(() => {
        if (!isFiltering) {
          index = (index + 1) % items.length;
          updateCarousel();
        }
      }, 3000);
    }
  }

  function resetInterval() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  startAutoSlide();

  // Pausar auto-slide durante búsqueda
  const input = document.getElementById('filtro');
  if (input) {
    input.addEventListener('input', () => {
      isFiltering = input.value.trim().length > 0;
      if (isFiltering) {
        clearInterval(autoSlide);
      } else {
        resetInterval();
      }
    });
  }
});

// MENSAJE SI NO HAY SIMULADORES
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const simuladores = track.querySelectorAll('.simulador');

  if (simuladores.length === 0) {
    const mensaje = document.createElement('div');
    mensaje.classList.add('mensaje-vacio');
    mensaje.textContent = '⚠️ Sin actividad actualmente';
    track.appendChild(mensaje);

    const controls = carousel.querySelector('.carousel-controls');
    const indicators = carousel.querySelector('.carousel-indicators');
    if (controls) controls.style.display = 'none';
    if (indicators) indicators.style.display = 'none';
  }
});

// 🌗 MODO CLARO / OSCURO con texto
const toggle = document.getElementById("toggle-theme");
const body = document.body;
const label = document.querySelector(".modo-label");

// Cargar el tema guardado
if (localStorage.getItem("modo") === "oscuro") {
  body.classList.add("dark-mode");
  toggle.checked = true;
  label.textContent = "Modo claro";
} else {
  label.textContent = "Modo oscuro";
}

// Cambiar al hacer clic
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("modo", "oscuro");
    label.textContent = "Modo claro";
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("modo", "claro");
    label.textContent = "Modo oscuro";
  }
});
