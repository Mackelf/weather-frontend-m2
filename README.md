# Weather Frontend M2

Proyecto de portafolio del Bootcamp **Desarrollo de Aplicaciones Front-End Trainee**.  
Aplicación web que muestra pronósticos del clima usando tarjetas interactivas y un modelo de estilos basado en **Sass + BEM**.

Repositorio:  
https://github.com/Mackelf/weather-frontend-m2.git

---

## Estructura general

- `index.html`: página principal (Home).
- `pronosticos.html`: vista de pronósticos con tarjetas de clima (accesible desde el navbar).
- Otros archivos HTML: pruebas y ejercicios de código asociados al bootcamp.

La hoja de estilos principal compilada es `css/style.css`, generada a partir del archivo `scss/main.scss`.

---

## Modelo Sass (7-1)

El proyecto utiliza una estructura Sass tipo 7-1, organizada de la siguiente forma:

```text
SCSS/
├── main.scss              // Archivo principal (compila a css/style.css)
├── abstracts/
│   ├── _variables.scss    // Colores, tipografías, espaciados, etc.
│   └── _mixins.scss       // Mixins reutilizables
├── base/
│   └── _reset.scss        // Estilos base / reset
├── components/
│   ├── _flip-card.scss    // Componente de tarjetas giratorias
│   ├── _weather-icons.scss// Iconos y estados del clima
│   └── _popover.scss      // Estilos del pop-up / modal de pronóstico semanal
├── layout/
│   ├── _header.scss       // Navbar y cabecera
│   └── _cards-grid.scss   // Grid de tarjetas de clima
└── utils/
    └── _typography.scss   // Utilidades tipográficas
Las clases siguen la convención BEM para bloques, elementos y modificadores (.flip-card__front, .weather-card--sunny, etc.).

Lógica de pronósticos (JavaScript)
En la página Pronósticos se carga, por defecto, una serie de tarjetas de clima para varias ciudades.
La navegación permite cambiar de país mediante el selector “Escoge tu país” del navbar.

Los datos se modelan en arreglos/objetos agrupados por país (dataByCountry), que incluyen: ciudad, temperatura actual, estado, icono, viento, humedad, probabilidad de lluvia y fecha.

un arreglo de pronostico semanal por ciudad (días siguientes con T° mínima, T° máxima y estado).

Una función recorre estos arreglos para generar dinámicamente las flip cards en el DOM.

Flip cards y detalles del clima
Cada ciudad se renderiza como una flip card:

Cara frontal: ciudad, temperatura principal, estado e icono, fecha.

Cara trasera: detalles adicionales (viento, humedad, probabilidad de lluvia) y un botón “Ver pronóstico semanal”.

Al pulsar el botón:

Se abre un pop-up/modal que muestra una tabla con el pronóstico de la semana (día, T° mínima, T° máxima y estado).

Se ejecutan funciones que calculan:

promedio de temperaturas.

estado del tiempo más frecuente durante la semana.

Cambios relevantes (02/02/2026)
Implementación de la estructura Sass 7-1 con parciales para layout y componentes.

Integración de metodología BEM en clases de tarjetas, iconos y modal.

Inclusión de datos de clima organizados por país y ciudad en estructuras JavaScript.

Renderizado dinámico de tarjetas de clima mediante funciones que recorren los arreglos.

Implementación de:

tarjetas flip para mostrar más detalles de cada ciudad,

modal/popover para el pronóstico semanal,

funciones auxiliares para cálculo de promedios de temperatura y detección del estado climático más repetido.
