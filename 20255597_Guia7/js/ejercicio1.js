// ============================================================
// EJERCICIO COMPLEMENTARIO 1: validar el formulario de ejemplo2.html
// y mostrar la informacion en una tabla dentro del modal (solo funciones DOM)
// ============================================================

// Referencias (las mismas del Ejemplo 3 de la guia)
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];

// CREANDO MODAL CON BOOTSTRAP
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

// CUERPO Y TITULO DEL MODAL
const bodyModal = document.getElementById("idBodyModal");
const tituloModal = document.querySelector("#idModal .modal-title");

// Expresion regular para validar el correo electronico
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ---------- Funciones auxiliares (solo funciones DOM) ----------

// Elimina todos los hijos de un nodo
const limpiarNodo = function (nodo) {
  while (nodo.firstChild) {
    nodo.removeChild(nodo.firstChild);
  }
};

// Reemplaza el texto de un nodo usando createTextNode
const ponerTexto = function (nodo, texto) {
  limpiarNodo(nodo);
  nodo.appendChild(document.createTextNode(texto));
};

// Crea un elemento con texto y clases opcionales
const crearElemento = function (etiqueta, texto, clases) {
  const nodo = document.createElement(etiqueta);
  if (clases) {
    nodo.setAttribute("class", clases);
  }
  if (texto !== undefined) {
    nodo.appendChild(document.createTextNode(texto));
  }
  return nodo;
};

// Obtiene el texto del label asociado a un control
const textoEtiqueta = function (control) {
  if (control.labels && control.labels.length > 0) {
    return control.labels[0].textContent.trim();
  }
  return control.name || control.id;
};

// ---------- Mostrar errores en el modal ----------
const mostrarErrores = function (errores) {
  if (tituloModal) {
    ponerTexto(tituloModal, "Corrija los siguientes errores");
  }
  limpiarNodo(bodyModal);

  const lista = crearElemento("ul", undefined, "text-danger mb-0");
  for (const mensaje of errores) {
    lista.appendChild(crearElemento("li", mensaje));
  }
  bodyModal.appendChild(lista);
  modal.show();
};

// ---------- Mostrar la informacion en una tabla ----------
const mostrarTabla = function (filas) {
  if (tituloModal) {
    ponerTexto(tituloModal, "Informacion registrada");
  }
  limpiarNodo(bodyModal);

  const tabla = crearElemento(
    "table",
    undefined,
    "table table-striped table-bordered"
  );

  // Encabezado
  const thead = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");
  filaEncabezado.appendChild(crearElemento("th", "Campo"));
  filaEncabezado.appendChild(crearElemento("th", "Valor"));
  thead.appendChild(filaEncabezado);
  tabla.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement("tbody");
  for (const [campo, valor] of filas) {
    const fila = document.createElement("tr");
    fila.appendChild(crearElemento("td", campo));
    fila.appendChild(crearElemento("td", valor));
    tbody.appendChild(fila);
  }
  tabla.appendChild(tbody);

  bodyModal.appendChild(tabla);
  modal.show();
};

// ---------- Validacion del formulario ----------
const validarFormulario = function () {
  const errores = [];

  // Referencias a los controles segun su tipo
  const textos = formulario.querySelectorAll('input[type="text"]');
  const fecha = formulario.querySelector('input[type="date"]');
  const correo = formulario.querySelector('input[type="email"]');
  const claves = formulario.querySelectorAll('input[type="password"]');
  const intereses = formulario.querySelectorAll('input[type="checkbox"]');
  const carreras = formulario.querySelectorAll('input[type="radio"]');
  const pais = formulario.querySelector("select");
  const avatar = formulario.querySelector('input[type="file"]');

  // Quitando marcas de errores anteriores
  for (const control of formulario.elements) {
    control.classList.remove("is-invalid");
  }

  const marcar = function (control, mensaje) {
    control.classList.add("is-invalid");
    errores.push(mensaje);
  };

  // a. Campos no vacios (texto, fecha, correo y contraseñas)
  const camposObligatorios = [...textos, fecha, correo, ...claves];
  for (const control of camposObligatorios) {
    if (control.value.trim() === "") {
      marcar(control, `El campo "${textoEtiqueta(control)}" no puede estar vacio`);
    }
  }

  // b. La fecha de nacimiento no puede superar la fecha actual
  if (fecha.value.trim() !== "") {
    const fechaNacimiento = new Date(fecha.value + "T00:00:00");
    if (fechaNacimiento > new Date()) {
      marcar(fecha, "La fecha de nacimiento no puede ser mayor a la fecha actual");
    }
  }

  // c. Correo valido con expresion regular
  if (correo.value.trim() !== "" && !regexCorreo.test(correo.value.trim())) {
    marcar(correo, "El correo electronico no tiene un formato valido");
  }

  // d. Contraseña y repetir contraseña deben ser iguales
  if (
    claves[0].value !== "" &&
    claves[1].value !== "" &&
    claves[0].value !== claves[1].value
  ) {
    marcar(claves[1], "Las contraseñas no coinciden");
  }

  // e. Al menos un interes seleccionado
  const interesesMarcados = [...intereses].filter((c) => c.checked);
  if (interesesMarcados.length === 0) {
    errores.push("Debe seleccionar al menos una opcion en intereses");
  }

  // f. Una carrera seleccionada
  const carreraMarcada = [...carreras].find((r) => r.checked);
  if (!carreraMarcada) {
    errores.push("Debe seleccionar la carrera que estudia");
  }

  // g. Un pais de origen seleccionado
  // (la primera opcion "Seleccione una opcion" no tiene value, por eso se usa el indice)
  if (pais.selectedIndex <= 0) {
    marcar(pais, "Debe seleccionar un pais de origen");
  }

  // Si hay errores se muestran y se detiene el proceso
  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }

  // Si todo es correcto, se arma la tabla con la informacion capturada
  const filas = [];
  for (const texto of textos) {
    filas.push([textoEtiqueta(texto), texto.value.trim()]);
  }
  filas.push([textoEtiqueta(fecha), fecha.value]);
  filas.push([textoEtiqueta(correo), correo.value.trim()]);
  filas.push([textoEtiqueta(claves[0]), "*".repeat(claves[0].value.length)]);
  filas.push([
    "Intereses",
    interesesMarcados.map((c) => textoEtiqueta(c)).join(", "),
  ]);
  filas.push(["Carrera", textoEtiqueta(carreraMarcada)]);
  filas.push(["Pais de origen", pais.options[pais.selectedIndex].text]);
  filas.push([
    "Avatar",
    avatar && avatar.files.length > 0 ? avatar.files[0].name : "Sin archivo",
  ]);

  mostrarTabla(filas);
};

// agregando eventos al boton
button.onclick = (evento) => {
  evento.preventDefault();
  validarFormulario();
};