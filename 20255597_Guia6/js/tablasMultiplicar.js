// Accedemos al contenedor donde se mostrará el resultado
const containerResultado = document.querySelector("#idContainerResultado");

// Accedemos al botón por medio de la API DOM
const btnCalcular = document.querySelector("#idBtnCalcular");

// Agregamos el evento click al botón Calcular;
// se le asigna la función que realizará la operación
btnCalcular.addEventListener("click", calcularTabla);

function calcularTabla() {
  // Capturando el valor del campo
  const inputTabla = document.querySelector("#inputTabla").value;

  // Inicializamos nuestro contador
  let contador = 1;

  // Verifiquemos que el dato colocado sea un número positivo
  if (inputTabla > 0) {
    let tabla = `<h2>Tabla de multiplicar del ${inputTabla}</h2>`;

    // Utilizaremos do...while para generar la tabla de multiplicar
    // que el usuario ha indicado
    do {
      let resultado = contador * inputTabla;
      tabla += `<div class="row text-center">`;
      tabla += `<div class="col-md-1 colum"><h3>${contador}</h3></div>`;
      tabla += `<div class="col-md-1 colum-green"><h3>x</h3></div>`;
      tabla += `<div class="col-md-1 colum"><h3>${inputTabla}</h3></div>`;
      tabla += `<div class="col-md-1 colum-green"><h3>=</h3></div>`;
      tabla += `<div class="col-md-1 colum"><h3>${resultado}</h3></div>`;
      tabla += `</div>`;

      // Incrementamos el contador para que podamos salir del do...while
      contador++;
    } while (contador <= 12);

    document.querySelector("#inputTabla").value = 1;
    document.querySelector("#inputTabla").focus();
    containerResultado.innerHTML = tabla;
  } else {
    alert("No se ha ingresado un número válido");
  }
}