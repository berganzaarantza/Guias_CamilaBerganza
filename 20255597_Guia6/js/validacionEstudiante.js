// ============================================================
// Ejercicio complementario 3: validación con expresiones regulares
// Ficha de estudiante
// ============================================================

/*
Cada campo tiene:
  - regex:   expresión regular que valida el FORMATO
  - mensaje: texto que se muestra si el formato no coincide
  - extra:   (opcional) validación adicional que una regex no puede hacer
             (devuelve un mensaje de error, o "" si todo está bien)
*/

// Valida que la fecha dd/mm/aaaa exista de verdad (no 30/02) y no sea futura
const validarFechaReal = (valor) => {
  const [dia, mes, anio] = valor.split("/").map(Number);
  const fecha = new Date(anio, mes - 1, dia);

  // Si el día no existe, JavaScript "corrige" la fecha (30/02 -> 02/03)
  const existe =
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia;

  if (!existe) return "Esa fecha no existe en el calendario.";
  if (anio < 1900) return "El año debe ser 1900 o posterior.";
  if (fecha > new Date()) return "La fecha de nacimiento no puede ser futura.";
  return "";
};

const validarRangoEdad = (valor) => {
  const edad = parseInt(valor);
  return edad >= 1 && edad <= 120 ? "" : "La edad debe estar entre 1 y 120.";
};

const reglas = {
  // Dos letras y tres números. Ejemplo: AB001
  idTxtCarnet: {
    regex: /^[A-Za-z]{2}\d{3}$/,
    mensaje: "Formato inválido. Use dos letras y tres números. Ejemplo: AB001",
  },

  // Al menos dos palabras (nombre y apellido), solo letras y espacios simples
  idTxtNombre: {
    regex: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/,
    mensaje:
      "Escriba nombre y apellido usando solo letras y un espacio entre palabras (sin números ni caracteres especiales).",
  },

  // 8 dígitos, guion, 1 dígito. Ejemplo: 01234567-8
  idTxtDui: {
    regex: /^\d{8}-\d$/,
    mensaje: "Formato inválido. Use ########-#. Ejemplo: 01234567-8",
  },

  // 4 dígitos - 6 dígitos - 3 dígitos - 1 dígito. Ejemplo: 0614-120395-101-3
  idTxtNit: {
    regex: /^\d{4}-\d{6}-\d{3}-\d$/,
    mensaje: "Formato inválido. Use ####-######-###-#. Ejemplo: 0614-120395-101-3",
  },

  // dd/mm/aaaa con día 01-31 y mes 01-12 (la existencia real se revisa en "extra")
  idTxtFecha: {
    regex: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    mensaje: "Formato inválido. Use día/mes/año (dd/mm/aaaa). Ejemplo: 15/08/2003",
    extra: validarFechaReal,
  },

  // usuario@dominio.ext
  idTxtCorreo: {
    regex: /^[\w.%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
    mensaje: "Correo inválido. Ejemplo: nombre@dominio.com",
  },

  // Solo dígitos (de 1 a 3)
  idTxtEdad: {
    regex: /^\d{1,3}$/,
    mensaje: "La edad debe contener solo números.",
    extra: validarRangoEdad,
  },
};

// Valida un campo, pinta el resultado y devuelve true/false
const validarCampo = (id) => {
  const input = document.getElementById(id);
  const regla = reglas[id];
  const valor = input.value.trim();
  let error = "";

  if (valor === "") {
    error = "Este campo es obligatorio.";
  } else if (!regla.regex.test(valor)) {
    error = regla.mensaje;
  } else if (regla.extra) {
    error = regla.extra(valor);
  }

  input.classList.toggle("is-invalid", error !== "");
  input.classList.toggle("is-valid", error === "");
  input.parentElement.querySelector(".invalid-feedback").textContent = error;

  return error === "";
};

const contenedorResultado = document.getElementById("idResultado");

// Validación en tiempo real: al salir del campo, y luego mientras se corrige
Object.keys(reglas).forEach((id) => {
  const input = document.getElementById(id);

  input.addEventListener("blur", () => validarCampo(id));
  input.addEventListener("input", () => {
    // Solo revalida si el campo ya fue evaluado (evita errores al empezar a escribir)
    if (
      input.classList.contains("is-invalid") ||
      input.classList.contains("is-valid")
    ) {
      validarCampo(id);
    }
  });
});

// Botón Validar: revisa TODOS los campos
document.getElementById("idBtnValidar").addEventListener("click", () => {
  // map (y no every) para que se evalúen y pinten todos los campos
  const resultados = Object.keys(reglas).map((id) => validarCampo(id));
  const errores = resultados.filter((ok) => !ok).length;

  if (errores === 0) {
    contenedorResultado.innerHTML = `<div class="alert alert-success mb-0" role="alert">
      <i class="bi bi-check-circle-fill"></i> Todos los datos son válidos. La ficha puede registrarse.
    </div>`;
  } else {
    contenedorResultado.innerHTML = `<div class="alert alert-danger mb-0" role="alert">
      <i class="bi bi-exclamation-triangle-fill"></i> Hay ${errores} campo(s) con errores. Revise los mensajes en rojo.
    </div>`;
    // Llevamos el foco al primer campo con error
    document.querySelector(".is-invalid").focus();
  }
});

// Botón Limpiar
document.getElementById("idBtnLimpiar").addEventListener("click", () => {
  document.getElementById("idFormEstudiante").reset();
  Object.keys(reglas).forEach((id) => {
    const input = document.getElementById(id);
    input.classList.remove("is-valid", "is-invalid");
    input.parentElement.querySelector(".invalid-feedback").textContent = "";
  });
  contenedorResultado.innerHTML = "";
  document.getElementById("idTxtCarnet").focus();
});