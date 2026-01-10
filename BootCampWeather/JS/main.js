const dataByCountry = {
  chile: [
    {
      ciudad: "Arica",
      temp: 18,
      estado: "Nublado",
      icono: "bi-cloud-sun",
      tipo: "p-cloudy",        // clase de fondo (sunny, rain, etc.)
      viento: "10 km/h",
      humedad: "40%",
      lluvia: "2%",
      fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Iquique",
        temp: 20,
        estado: "Parcialmente Nublado",
        icono: "bi-cloud-sun",
        tipo: "p-cloudy",
        viento: "12 km/h",
        humedad: "35%",
        lluvia: "1%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Antofagasta",
        temp: 22,
        estado: "Soleado",
        icono: "bi-sun-fill",
        tipo: "sunny",
        viento: "15 km/h",
        humedad: "25%",
        lluvia: "0%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Copiapo",
        temp: 24,
        estado: "Soleado",
        icono: "bi-sun",
        tipo: "sunny",
        viento: "18 km/h",
        humedad: "20%",
        lluvia: "0%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "La Serena",
        temp: 21,
        estado: "Nublado",
        icono: "bi-cloud",
        tipo: "cloudy",
        viento: "14 km/h",
        humedad: "45%",
        lluvia: "10%",
        fecha: "Lunes 15 Diciembre 2025"
    },

    {
        ciudad: "Valparaíso",
        temp: 19,
        estado: "Lluvioso",
        icono: "bi-cloud-rain-fill",
        tipo: "rain",
        viento: "20 km/h",
        humedad: "70%",
        lluvia: "80%",
        fecha: "Lunes 15 Diciembre 2025"
    },


    {
      ciudad: "Santiago",
      temp: 26,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "sunny",
      viento: "8 km/h",
      humedad: "30%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025"
    },
    // ...más ciudades
  ],

  argentina: [
    {
      ciudad: "Buenos Aires",
      temp: 28,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "sunny",
      viento: "10 km/h",
      humedad: "50%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Córdoba",
        temp: 25,
        estado: "Parcialmente Nublado",
        icono: "bi-cloud-sun",
        tipo: "p-cloudy",
        viento: "12 km/h",
        humedad: "55%",
        lluvia: "5%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Rosario",
        temp: 23,
        estado: "Nublado",
        icono: "bi-cloud",
        tipo: "cloudy",
        viento: "16 km/h",
        humedad: "50%",
        lluvia: "15%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Mendoza",
        temp: 20,
        estado: "Soleado",
        icono: "bi-sun-fill",
        tipo: "sunny",
        viento: "10 km/h",
        humedad: "30%",
        lluvia: "0%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    // mismo formato de objetos
  ],
    peru: [
    {
      ciudad: "Lima",
      temp: 24,
      estado: "Soleado",
      icono: "bi-sun-fill",
      tipo: "sunny",
      viento: "10 km/h",
      humedad: "40%",
      lluvia: "0%",
      fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Arequipa",
        temp: 22,
        estado: "Parcialmente Nublado",
        icono: "bi-cloud-sun",
        tipo: "p-cloudy",
        viento: "12 km/h",
        humedad: "45%",
        lluvia: "5%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Trujillo",
        temp: 26,
        estado: "Soleado",
        icono: "bi-sun-fill",
        tipo: "sunny",
        viento: "8 km/h",
        humedad: "35%",
        lluvia: "0%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    {
        ciudad: "Cusco",
        temp: 18,
        estado: "Nublado",
        icono:"bi-cloud", 
        tipo:"cloudy", 
        viento:"14 km/h", 
        humedad:"60%", 
        lluvia:"20%", 
        fecha:"Lunes 15 Diciembre 2025"
    },
    // mismo formato de objetos
  ],
    colombia : [
    {
      ciudad: "Bogotá",
      temp: 16,
        estado: "Nublado",
        icono: "bi-cloud",
        tipo: "cloudy",
        viento: "10 km/h",
        humedad: "70%",
        lluvia: "30%",
        fecha: "Lunes 15 Diciembre 2025"
    },
    
    ],

};

// 2. Crea UNA tarjeta flip

function createFlipCard(ciudadData) {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4 d-flex justify-content-center";

  col.innerHTML = `
    <div class="flip-card">
      <div class="flip-card-inner">

        <div class="flip-card-front ${ciudadData.tipo}">
          <h2>${ciudadData.ciudad}</h2>
          <p class="display-4">${ciudadData.temp}°C</p>
          <p class="mb-1">
            <i class="bi ${ciudadData.icono} me-2"></i>${ciudadData.estado}
          </p>
          <p class="small">${ciudadData.fecha}</p>
        </div>

        <div class="flip-card-back">
          <h3>Detalles del clima</h3>
          <p>Viento: ${ciudadData.viento}</p>
          <p>Humedad: ${ciudadData.humedad}</p>
          <p>Prob. lluvia: ${ciudadData.lluvia}</p>
        </div>

      </div>
    </div>
  `;

  return col;
}

// 3. Dibuja TODAS las tarjetas de un país
function renderCountry(countryKey) {
  const cardsContainer = document.getElementById("cards-container");
  const ciudades = dataByCountry[countryKey] || [];

  cardsContainer.innerHTML = ""; // limpia

  ciudades.forEach(ciudadData => {
    const card = createFlipCard(ciudadData);
    cardsContainer.appendChild(card);
  });
}



// 4. Conecta dropdown + carga inicial
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("countryDropdown");

  dropdown.addEventListener("click", e => {
    const link = e.target.closest(".dropdown-item");
    if (!link) return;
    e.preventDefault();

    const countryKey = link.dataset.country; // "chile", "argentina"
    renderCountry(countryKey);
  });

  // País por defecto
  renderCountry("chile");
});
