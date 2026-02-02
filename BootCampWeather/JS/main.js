const dataByCountry = {
  chile: [
    {
      ciudad: "Arica",
      temp: 18,
      estado: "Nublado",
      icono: "bi-cloud-sun",
      tipo: "weather-card--cloudy",
      viento: "10 km/h",
      humedad: "40%",
      lluvia: "2%",
      fecha: "Lunes 15 Diciembre 2025",
      pronostico: [
        {
          dia: "Martes",
          tMin: 15,
          tMax: 22,
          estado: "Parcialmente nublado",
          icono: "bi-cloud-sun",
        },
        {
          dia: "Miércoles",
          tMin: 14,
          tMax: 21,
          estado: "Lluvia débil",
          icono: "bi-cloud-rain",
        },
        {
          dia: "Jueves",
          tMin: 13,
          tMax: 20,
          estado: "Despejado",
          icono: "bi-sun",
        },
      ],
    },

    {
      ciudad: "Iquique",
      temp: 20,
      estado: "Parcialmente Nublado",
      icono: "bi-cloud-sun",
      tipo: "weather-card--p-cloudy",
      viento: "12 km/h",
      humedad: "35%",
      lluvia: "1%",
      fecha: "Lunes 15 Diciembre 2025",
      pronostico: [
        {
          dia: "Martes",
          tMin: 16,
          tMax: 23,
          estado: "Parcialmente nublado",
          icono: "bi-cloud-sun",
        },
        {
          dia: "Miércoles",
          tMin: 15,
          tMax: 22,
          estado: "Nublado",
          icono: "bi-cloudy",
        },
        {
          dia: "Jueves",
          tMin: 15,
          tMax: 24,
          estado: "Despejado",
          icono: "bi-sun",
        },
        {
          dia: "Viernes",
          tMin: 18,
          tMax: 26,
          estado: "Despejado",
          icono: "bi-sun",
        },
        {
          dia: "Sabado",
          tMin: 20,
          tMax: 28,
          estado: "Despejado",
          icono: "bi-sun",
        },
      ],
    },

    {
      ciudad: "Antofagasta",
      temp: 22,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "weather-card--sunny",
      viento: "15 km/h",
      humedad: "25%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025",
      pronostico: [
        {
          dia: "Martes",
          tMin: 16,
          tMax: 23,
          estado: "Parcialmente nublado",
          icono: "bi-cloud-sun",
        },
        {
          dia: "Miércoles",
          tMin: 15,
          tMax: 20,
          estado: "Nublado",
          icono: "bi-cloudy",
        },
        {
          dia: "Jueves",
          tMin: 15,
          tMax: 24,
          estado: "Despejado",
          icono: "bi-sun",
        },
      ]
    },
    {
      ciudad: "Copiapo",
      temp: 24,
      estado: "Soleado",
      icono: "bi-sun",
      tipo: "weather-card--sunny",
      viento: "18 km/h",
      humedad: "20%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    {
      ciudad: "La Serena",
      temp: 21,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "14 km/h",
      humedad: "45%",
      lluvia: "10%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Valparaíso",
      temp: 19,
      estado: "Lluvioso",
      icono: "bi-cloud-rain-fill",
      tipo: "weather-card--rain",
      viento: "20 km/h",
      humedad: "70%",
      lluvia: "80%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Santiago",
      temp: 26,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "weather-card--sunny",
      viento: "8 km/h",
      humedad: "30%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Rancagua",
      temp: 25,
      estado: "Parcialmente Nublado",
      icono: "bi-cloud-sun",
      tipo: "weather-card--p-cloudy",
      viento: "10 km/h",
      humedad: "40%",
      lluvia: "5%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    {
      ciudad: "Talca",
      temp: 24,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "12 km/h",
      humedad: "50%",
      lluvia: "15%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Chillán",
      temp: 20,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "14 km/h",
      humedad: "60%",
      lluvia: "20%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Concepción",
      temp: 22,
      estado: "Lluvioso",
      icono: "bi-cloud-rain",
      tipo: "weather-card--rain",
      viento: "18 km/h",
      humedad: "75%",
      lluvia: "70%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Temuco",
      temp: 19,
      estado: "Lluvioso",
      icono: "bi-cloud-rain-fill",
      tipo: "weather-card--rain",
      viento: "20 km/h",
      humedad: "80%",
      lluvia: "85%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Valdivia",
      temp: 18,
      estado: "Tormenta",
      icono: "bi-cloud-lightning-rain",
      tipo: "weather-card--stormy",
      viento: "22 km/h",
      humedad: "85%",
      lluvia: "90%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Puerto Montt",
      temp: 16,
      estado: "Lluvioso",
      icono: "bi-cloud-rain",
      tipo: "weather-card--rain",
      viento: "20 km/h",
      humedad: "85%",
      lluvia: "90%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Coyhaique",
      temp: 14,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "15 km/h",
      humedad: "70%",
      lluvia: "30%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    {
      ciudad: "Punta Arenas",
      temp: 10,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "12 km/h",
      humedad: "65%",
      lluvia: "25%",
      fecha: "Lunes 15 Diciembre 2025",
    },

    // ...más ciudades
  ],

  argentina: [
    {
      ciudad: "Buenos Aires",
      temp: 28,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "weather-card--sunny",
      viento: "10 km/h",
      humedad: "50%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025",
      pronostico: [
        {
          dia: "Martes",
          tMin: 25,
          tMax: 30,
          estado: "Soleado",
          icono: "bi-sun-fill",
        },
        {
          dia: "Miércoles",
          tMin: 23,
          tMax: 28,
          estado: "Soleado",
          icono: "bi-sun-fill",
        },
        {
          dia: "Jueves",
          tMin: 21,
          tMax: 26,
          estado: "Soleado",
          icono: "bi-sun-fill",
        },
        {
          dia: "Viernes",
          tMin: 19,
          tMax: 24,
          estado: "Soleado",
          icono: "bi-sun-fill",
        },
      ],
    },
            
    {
      ciudad: "Córdoba",
      temp: 25,
      estado: "Parcialmente Nublado",
      icono: "bi-cloud-sun",
      tipo: "weather-card--p-cloudy",
      viento: "12 km/h",
      humedad: "55%",
      lluvia: "5%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    {
      ciudad: "Rosario",
      temp: 23,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "16 km/h",
      humedad: "50%",
      lluvia: "15%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    {
      ciudad: "Mendoza",
      temp: 20,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "weather-card--sunny",
      viento: "10 km/h",
      humedad: "30%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    // mismo formato de objetos
  ],
  peru: [
    {
      ciudad: "Lima",
      temp: 24,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "weather-card--sunny",
      viento: "10 km/h",
      humedad: "40%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    {
      ciudad: "Arequipa",
      temp: 22,
      estado: "Parcialmente Nublado",
      icono: "bi-cloud-sun",
      tipo: "weather-card--p-cloudy",
      viento: "12 km/h",
      humedad: "45%",
      lluvia: "5%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    {
      ciudad: "Trujillo",
      temp: 26,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "weather-card--sunny",
      viento: "8 km/h",
      humedad: "35%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    {
      ciudad: "Cusco",
      temp: 18,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "14 km/h",
      humedad: "60%",
      lluvia: "20%",
      fecha: "Lunes 15 Diciembre 2025",
    },
    // mismo formato de objetos
  ],
  colombia: [
    {
      ciudad: "Bogotá",
      temp: 16,
      estado: "Nublado",
      icono: "bi-cloud",
      tipo: "weather-card--cloudy",
      viento: "10 km/h",
      humedad: "70%",
      lluvia: "30%",
      fecha: "Lunes 15 Diciembre 2025",
    },
  ],
};

// 2. Crea UNA tarjeta flip
/*
function createFlipCard(ciudadData) {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4 d-flex justify-content-center";

  col.innerHTML = `
    <div class="flip-card">
      <div class="flip-card__inner">

        <div class="flip-card__front ${ciudadData.tipo}">
          <h2>${ciudadData.ciudad}</h2>
          <p class="display-4">${ciudadData.temp}°C</p>
          <p class="mb-1">
            <i class="bi ${ciudadData.icono} me-2"></i>${ciudadData.estado}
          </p>
          <p class="small">${ciudadData.fecha}</p>
        </div>

        <div class="flip-card__back">
          <h3>Detalles del clima</h3>
          <p>Viento: ${ciudadData.viento}</p>
          <p>Humedad: ${ciudadData.humedad}</p>
          <p>Prob. lluvia: ${ciudadData.lluvia}</p>

            <button
            class="btn-primary rounded btn-block btn btn-sm mt-2 js-detalles-pronostico"
            type="button"
          >
            Ver pronóstico semanal
          </button>

        </div>

      </div>
    </div>
  `;
}*/
function createFlipCard(ciudadData) {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4 d-flex justify-content-center";

  col.innerHTML = `
    <div class="flip-card">
      <div class="flip-card__inner">

        <div class="flip-card__front ${ciudadData.tipo}">
          <h2 class="mt-3 mb-2">${ciudadData.ciudad}</h2>
          <p class="display-4">${ciudadData.temp}°C</p>
          <p class="mb-1">
            <i class="bi ${ciudadData.icono} me-2"></i>${ciudadData.estado}
          </p>
          <p class="small">${ciudadData.fecha}</p>
        </div>

        <div class="flip-card__back">
          <h4 class="mb-2 mt-3">Detalles del clima</h4>
          <p>Viento: ${ciudadData.viento}</p>
          <p>Humedad: ${ciudadData.humedad}</p>
          <p>Prob. lluvia: ${ciudadData.lluvia}</p>

          <button
            class="btn btn-block btn-round btn-outline btn-light mt-2 js-detalles-pronostico"
            type="button">
            <span>Ver pronóstico semanal</span>
          </button>
        </div>

      </div>
    </div>
  `;

  // Antes aquí tenías el alert; ahora va el modal:
  const btnDetalles = col.querySelector(".js-detalles-pronostico");
  if (btnDetalles) {
    btnDetalles.addEventListener("click", () => {
      const pronostico = ciudadData.pronostico || [];

      const modal = document.getElementById("forecast-modal");
      const title = document.getElementById("forecast-title");
      const content = document.getElementById("forecast-content");

      // Título con nombre de ciudad
      title.textContent = `Pronóstico para ${ciudadData.ciudad}`;

      // Construir HTML de la tabla/lista con los días
      if (pronostico.length === 0) {
        content.innerHTML = "<p>No hay pronóstico disponible.</p>";
      } else {
        // === NUEVO: Cálculos de promedios y estado ===
        const tempsMin = pronostico
          .map((dia) => parseFloat(dia.tMin))
          .filter((t) => !isNaN(t));
        const tempsMax = pronostico
          .map((dia) => parseFloat(dia.tMax))
          .filter((t) => !isNaN(t));

        const avgMin =
          tempsMin.length > 0
            ? (tempsMin.reduce((a, b) => a + b, 0) / tempsMin.length).toFixed(1)
            : "N/D";
        const avgMax =
          tempsMax.length > 0
            ? (tempsMax.reduce((a, b) => a + b, 0) / tempsMax.length).toFixed(1)
            : "N/D";

        // Estado más repetido
        // Estado más repetido + su icono
        const estadosCount = {};
        pronostico.forEach((dia) => {
          estadosCount[dia.estado] = (estadosCount[dia.estado] || 0) + 1;
        });
        const masRepetido = Object.entries(estadosCount).sort(
          ([, a], [, b]) => b - a,
        )[0];
        const estadoMasRepetido = masRepetido ? masRepetido[0] : "N/D";

        // Buscar icono del primer día con ese estado
        const diaRepresentativo = pronostico.find(
          (dia) => dia.estado === estadoMasRepetido,
        );
        const iconoMasRepetido = diaRepresentativo
          ? diaRepresentativo.icono
          : "";
        // === FIN NUEVO ===

        let html = "<table class='table table-sm mb-0'>";
        html +=
          "<thead><tr><th>Día</th><th>Mín</th><th>Máx</th><th>Estado</th></tr></thead><tbody>";

        pronostico.forEach((dia) => {
          html += `
          <tr>
            <td>${dia.dia}</td>
            <td>${dia.tMin}°C</td>
            <td>${dia.tMax}°C</td>
            <td><i class="bi ${dia.icono}"></i> ${dia.estado}</td>
          </tr>
        `;
        });

        html += "</tbody></table>";
        html += `<p class='small mt-2'><strong>Resumen semanal</strong>
        <br> T Min Prom: <strong>${avgMin}°C</strong> | T Max Prom: <strong>${avgMax}°C</strong>
<br> Estado: <i class="bi ${iconoMasRepetido}"></i> <strong>${estadoMasRepetido}</strong></p>`;
        // === FIN CAMBIADO ===
        content.innerHTML = html;
      }

      // Mostrar modal
      modal.classList.add("show");
    });
  }

  return col;
}

// 3. Dibuja TODAS las tarjetas de un país
function renderCountry(countryKey) {
  const cardsContainer = document.getElementById("cards-container");
  
  if (!cardsContainer) {return;};


  const ciudades = dataByCountry[countryKey] || [];

  cardsContainer.innerHTML = ""; // limpia

  ciudades.forEach((ciudadData) => {
    const card = createFlipCard(ciudadData);
    cardsContainer.appendChild(card);
  });
}

const forecastModal = document.getElementById("forecast-modal");
const forecastClose = document.getElementById("forecast-close");

if (forecastClose && forecastModal) {
  forecastClose.addEventListener("click", () => {
    forecastModal.classList.remove("show");
  });

  // cerrar al hacer clic fuera de la caja
  forecastModal.addEventListener("click", (e) => {
    if (e.target === forecastModal) {
      forecastModal.classList.remove("show");
    }
  });
}

// 4. Conecta dropdown + carga inicial
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("countryDropdown");

  dropdown.addEventListener("click", (e) => {
    const link = e.target.closest(".dropdown-item");
    if (!link) return;
    e.preventDefault();

    const countryKey = link.dataset.country; // "chile", "argentina"
    renderCountry(countryKey);
  });

  // País por defecto
  renderCountry("chile");
});
