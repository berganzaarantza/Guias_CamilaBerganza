// Accedemos a los contenedores donde se mostrarán los arreglos
const containerArreglo = document.querySelector("#idContainerArreglo");
const containerArregloOrdenado = document.querySelector(
  "#idContainerArregloOrdenado"
);

// Accedemos a cada botón por medio de la API DOM
const btnAgregar = document.querySelector("#idBtnAgregar");
const btnOrdenar = document.querySelector("#idBtnOrdenar");

// Agregamos el evento click a los botones y la función que realizará la operación
btnAgregar.addEventListener("click", agregarElemento);
btnOrdenar.addEventListener("click", ordenarElementos);

let arreglo = new Array();

function agregarElemento() {
  const numero = parseInt(document.querySelector("#inputNumero").value);

  // Verificando que sea un número
  if (isNaN(numero)) {
    alert("Debe ingresar un número válido");
  } else {
    // Agregamos un nuevo elemento al arreglo
    arreglo.push(numero);

    // Utilizaremos la API DOM para crear un elemento HTML
    let caja = document.createElement("div"); // Creamos un elemento <div></div>
    caja.className = "col-md-1 colum"; // Agregamos una clase al elemento <div></div>
    let valor = document.createElement("h3"); // Creamos un elemento <h3></h3>
    valor.textContent = numero; // Agregamos texto al elemento <h3></h3>
    caja.appendChild(valor); // Le pasamos como hijo la etiqueta <h3></h3> a nuestro <div></div>

    // Insertamos los nuevos elementos en el contenedor;
    // beforeend inserta el nuevo elemento dentro del contenedor, después de su último hijo
    containerArreglo.insertAdjacentElement("beforeend", caja);
  }
}

function ordenarElementos() {
  // Quitamos las cajas ordenadas anteriores (el <h3> del título se conserva)
  containerArregloOrdenado
    .querySelectorAll(".colum-green")
    .forEach((caja) => caja.remove());

  // [...arreglo] hace una copia, así sort() no altera el arreglo original
  for (let i of [...arreglo].sort((a, b) => a - b)) {
    let caja = document.createElement("div");
    caja.className = "col-md-1 colum-green";
    let valor = document.createElement("h3");
    valor.textContent = i;
    caja.appendChild(valor);
    containerArregloOrdenado.insertAdjacentElement("beforeend", caja);
  }
}