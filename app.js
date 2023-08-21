function formatoConPuntos(valor) {
    let [entera, decimal] = valor.split(".");
    entera = entera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return entera + "." + (decimal || "00");
}

function mostrarError(input, mensaje) {
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.textContent = mensaje;
    input.classList.add("campo-error");
}

function limpiarError(input) {
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.textContent = "";
    input.classList.remove("campo-error");
}

function validarCampo(input, condicion, mensajeError) {
    if (condicion) {
        mostrarError(input, mensajeError);
        return false;
    } else {
        limpiarError(input);
        return true;
    }
}

function calcularCuotas() {
    let principalInput = document.getElementById('principal');
    let cuotasInput = document.getElementById('cuotas');
    let tasaInteresInput = document.getElementById('tasaInteres');
    let tipoInteresSelect = document.getElementById('tipoInteres');
    let resultadoDiv = document.getElementById('resultado');

    let esValido = true;

    let principal = BigInt(Math.round(parseFloat(principalInput.value) * 100));
    if (isNaN(principalInput.value) || principalInput.value === "") {
        mostrarError(principalInput, "Ingresa un monto válido.");
        esValido = false;
    } else {
        limpiarError(principalInput);
    }

    let numCuotas = parseInt(cuotasInput.value);
    if (numCuotas < 1 || isNaN(numCuotas)) {
        mostrarError(cuotasInput, "El número de cuotas debe ser mayor a 0.");
        esValido = false;
    } else {
        limpiarError(cuotasInput);
    }

    let tasaInteres = parseFloat(tasaInteresInput.value);
    if (tasaInteres < 0.1 || isNaN(tasaInteres)) {
        mostrarError(tasaInteresInput, "La tasa de interés debe ser mayor o igual a 0.1.");
        esValido = false;
    } else {
        limpiarError(tasaInteresInput);
    }

    if (!esValido) return;

    let tipoInteres = tipoInteresSelect.value;
    if (tipoInteres === "anual") {
        tasaInteres /= 12;
    }
    tasaInteres /= 100;

    let resultadoHTML = '';
    let precioProducto = Number(principal) / 100;
    resultadoHTML += `Precio del producto: ${formatoConPuntos(precioProducto.toFixed(2))}<br>`;

    let totalIntereses = BigInt(0);
    for (let i = 0; i < numCuotas; i++) {
        let interesActual = BigInt(Math.round(Number(principal) * tasaInteres));
        totalIntereses += interesActual;
        let cuotaSinInteres = principal / BigInt(numCuotas - i);
        let cuotaTotal = cuotaSinInteres + interesActual;

        resultadoHTML += `Cuota ${i + 1}: ${formatoConPuntos((Number(cuotaTotal) / 100).toFixed(2))} (Interés: ${formatoConPuntos((Number(interesActual) / 100).toFixed(2))})<br>`;
        principal -= cuotaSinInteres;
    }

    let precioConIntereses = precioProducto + Number(totalIntereses) / 100;
    resultadoHTML += `Interés total pagado: ${formatoConPuntos((Number(totalIntereses) / 100).toFixed(2))}<br>`;
    resultadoHTML += `Precio total con intereses: ${formatoConPuntos(precioConIntereses.toFixed(2))}`;
    resultadoDiv.innerHTML = resultadoHTML;
}