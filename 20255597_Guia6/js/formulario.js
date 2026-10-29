// ============================================================
// Guía 6 - Parte II, Ejemplo 4: Formulario de pacientes
// Incluye: botones Editar/Eliminar y persistencia con LocalStorage
// ============================================================

// Accediendo a los elementos HTML
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

// Componente modal
const idModal = document.getElementById("idModal");

// ------------------------------------------------------------
// LocalStorage
// ------------------------------------------------------------

// Claves con las que se guardan los datos en LocalStorage
const CLAVE_PACIENTES = "guia6_pacientes";
const CLAVE_PAISES = "guia6_paises";

// Lee un arreglo guardado; si no existe o está dañado, devuelve []
const leerLista = (clave) => {
  try {
    const datos = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
};

// Guarda un arreglo como texto JSON
const guardarLista = (clave, lista) => {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch (error) {
    console.error("No se pudo guardar en LocalStorage:", error);
  }
};

// Arreglos globales: arrancan con lo que haya guardado
let arrayPaciente = leerLista(CLAVE_PACIENTES);
let paisesExtra = leerLista(CLAVE_PAISES);

// ------------------------------------------------------------
// Modo edición
// ------------------------------------------------------------

// null = modo registro; un número = índice del paciente que se está editando
let indiceEdicion = null;

// Contenido del botón principal según el modo
const htmlBotonGuardar = `<i class="bi bi-person-plus-fill"></i> Guardar Datos`;
const htmlBotonActualizar = `<i class="bi bi-check-circle-fill"></i> Actualizar datos`;

// Vuelve al modo registro
const salirModoEdicion = () => {
  indiceEdicion = null;
  buttonAgregarPaciente.innerHTML = htmlBotonGuardar;
};

/*
Función para limpiar el formulario siempre que se cargue la página
o cuando se presione el botón limpiar del formulario
*/
const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  salirModoEdicion();
  inputNombre.focus();
};

// ------------------------------------------------------------
// Registrar / actualizar pacientes
// ------------------------------------------------------------

/*
Función para validar el ingreso del paciente.
Sirve tanto para registrar uno nuevo como para actualizar uno existente.
*/
const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    const datos = new Array(
      nombre,
      apellido,
      fechaNacimiento,
      sexo,
      labelPais,
      direccion
    );
    const estabaEditando = indiceEdicion !== null;

    if (estabaEditando) {
      // Reemplazamos los datos del paciente en su misma posición
      arrayPaciente[indiceEdicion] = datos;
      mensaje.innerHTML = "Paciente actualizado correctamente";
    } else {
      // Agregando información al arreglo paciente
      arrayPaciente.push(datos);
      mensaje.innerHTML = "Se ha registrado un nuevo paciente";
    }
    guardarLista(CLAVE_PACIENTES, arrayPaciente);
    // Llamando al componente de Bootstrap
    toast.show();

    // Limpiando formulario (también sale del modo edición)
    limpiarForm();

    // Si se editó, refrescamos la tabla que el usuario está viendo
    if (estabaEditando) imprimirPacientes();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

// ------------------------------------------------------------
// Mostrar pacientes
// ------------------------------------------------------------

// Función que imprime la ficha de los pacientes registrados
function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element, indice) => {
    $fila += `<tr>
      <td scope="row" class="text-center fw-bold">${contador}</td>
      <td>${element[0]}</td>
      <td>${element[1]}</td>
      <td>${element[2]}</td>
      <td>${element[3]}</td>
      <td>${element[4]}</td>
      <td>${element[5]}</td>
      <td>
        <button type="button" class="btn btn-primary" title="Editar"
          data-accion="editar" data-indice="${indice}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button type="button" class="btn btn-danger" title="Eliminar"
          data-accion="eliminar" data-indice="${indice}">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </td>
    </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  const contenedor = document.getElementById("idTablaPacientes");

  // Si no quedan pacientes, volvemos al mensaje inicial
  if (arrayPaciente.length === 0) {
    contenedor.innerHTML = "Ninguno";
    return;
  }

  let $table = `<div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
      <tr>
        <th scope="col" class="text-center" style="width:5%">#</th>
        <th scope="col" class="text-center" style="width:15%">Nombre</th>
        <th scope="col" class="text-center" style="width:15%">Apellido</th>
        <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
        <th scope="col" class="text-center" style="width:10%">Sexo</th>
        <th scope="col" class="text-center" style="width:10%">Pais</th>
        <th scope="col" class="text-center" style="width:25%">Dirección</th>
        <th scope="col" class="text-center" style="width:10%">Opciones</th>
      </tr>
      ${imprimirFilas()}
    </table>
  </div>`;
  contenedor.innerHTML = $table;
};

// ------------------------------------------------------------
// Editar y eliminar
// ------------------------------------------------------------

// Carga los datos del paciente en el formulario para modificarlos
const editarPaciente = (indice) => {
  const p = arrayPaciente[indice];

  inputNombre.value = p[0];
  inputApellido.value = p[1];
  inputFechaNacimiento.value = p[2];
  inputRdMasculino.checked = p[3] === "Hombre";
  inputRdFemenino.checked = p[3] === "Mujer";

  // El país se guardó como texto, así que buscamos el option con ese texto
  const opcion = Array.from(cmbPais.options).find((o) => o.text === p[4]);
  cmbPais.selectedIndex = opcion ? opcion.index : 0;

  inputDireccion.value = p[5];

  // Activamos el modo edición y cambiamos el texto del botón
  indiceEdicion = indice;
  buttonAgregarPaciente.innerHTML = htmlBotonActualizar;

  inputNombre.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Elimina al paciente previa confirmación
const eliminarPaciente = (indice) => {
  const p = arrayPaciente[indice];

  if (confirm(`¿Desea eliminar al paciente ${p[0]} ${p[1]}?`)) {
    arrayPaciente.splice(indice, 1);
    guardarLista(CLAVE_PACIENTES, arrayPaciente);

    // Si había una edición en curso, los índices cambiaron: la cancelamos
    if (indiceEdicion !== null) limpiarForm();

    imprimirPacientes();
    mensaje.innerHTML = "Paciente eliminado correctamente";
    toast.show();
  }
};

// Un solo listener para todos los botones de la tabla (delegación de eventos)
document.getElementById("idTablaPacientes").addEventListener("click", (e) => {
  // closest() sirve aunque se haga clic sobre el ícono <i> dentro del botón
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;

  const indice = parseInt(boton.dataset.indice);
  if (boton.dataset.accion === "editar") editarPaciente(indice);
  else if (boton.dataset.accion === "eliminar") eliminarPaciente(indice);
});

// ------------------------------------------------------------
// Países
// ------------------------------------------------------------

// Crea un <option> y lo agrega al select de países
const crearOptionPais = (nombre) => {
  let option = document.createElement("option");
  option.textContent = nombre;
  option.value = cmbPais.children.length; // siguiente número disponible
  cmbPais.appendChild(option);
};

// Restauramos los países agregados en visitas anteriores
paisesExtra.forEach((nombre) => crearOptionPais(nombre));

const addPais = () => {
  let paisNew = inputNombrePais.value.trim();

  if (paisNew != "") {
    crearOptionPais(paisNew);
    paisesExtra.push(paisNew);
    guardarLista(CLAVE_PAISES, paisesExtra);

    mensaje.innerHTML = "País agregado correctamente";
    toast.show();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

// ------------------------------------------------------------
// Eventos
// ------------------------------------------------------------

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

// Se agrega el focus en el campo nombre país del modal
idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

// ------------------------------------------------------------
// Al cargar la página
// ------------------------------------------------------------
limpiarForm();
imprimirPacientes(); // muestra los pacientes guardados (o "Ninguno")