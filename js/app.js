const monedaUno = document.getElementById("moneda-uno");
const monedaDos = document.getElementById("moneda-dos");
const cantidadUno = document.getElementById("cantidad-uno");
const cantidadDos = document.getElementById("cantidad-dos");
const cambioTexto = document.getElementById("cambio");
const botonCambio = document.getElementById("taza");
const botonLimpiar = document.getElementById("limpiar");

// API key y URL base
const API_KEY = "f6f8b0def6957f9f71481c63";
const URL_BASE = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

// Función para actualizar las tasas de cambio
async function actualizarTasa() {
  const monedaBase = monedaUno.value;
  const monedaObjetivo = monedaDos.value;

  try {
    const respuesta = await fetch(`${URL_BASE}${monedaBase}`);
    if (!respuesta.ok) {
      throw new Error("No se pudo obtener la información de la API");
    }

    const datos = await respuesta.json();
    const tasa = datos.conversion_rates[monedaObjetivo];

    // Mostrar la tasa de cambio en la página
    cambioTexto.innerText = `1 ${monedaBase} = ${tasa.toFixed(2)} ${monedaObjetivo}`;

    // Validar que el valor ingresado en cantidadUno es válido
    const cantidad = parseFloat(cantidadUno.value);
    if (isNaN(cantidad) || cantidad < 0) {
      cantidadDos.value = "";
      cambioTexto.innerText = "Por favor, introduce un número válido en el campo de cantidad.";
      return;
    }

    // Calcular la cantidad convertida
    cantidadDos.value = (cantidad * tasa).toFixed(2);
  } catch (error) {
    // Mostrar error en el texto de la tasa de cambio
    cambioTexto.innerText = "Error al obtener la tasa de cambio. Por favor, intenta de nuevo.";
    console.error(error);
  }
}

// Función para limpiar todos los campos
function limpiarCampos() {
  monedaUno.value = "USD";  // Restablecer moneda base a USD
  monedaDos.value = "EUR";  // Restablecer moneda objetivo a EUR
  cantidadUno.value = "1";  // Restablecer cantidad a 1
  cantidadDos.value = "";   // Limpiar el campo de cantidad convertida
  cambioTexto.innerText = ""; // Limpiar el texto de la tasa de cambio
}

// Event listeners
monedaUno.addEventListener("change", actualizarTasa);
monedaDos.addEventListener("change", actualizarTasa);
cantidadUno.addEventListener("input", actualizarTasa);
botonCambio.addEventListener("click", () => {
  // Intercambiar monedas
  const temporal = monedaUno.value;
  monedaUno.value = monedaDos.value;
  monedaDos.value = temporal;

  actualizarTasa();
});

// Asignar la función de limpiar al botón
botonLimpiar.addEventListener("click", limpiarCampos);

// Inicializar la tasa al cargar la página
actualizarTasa();
