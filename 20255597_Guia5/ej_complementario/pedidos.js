const pedidos = [];

let precioMaximoActivo = null;

const formulario = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#producto");
const inputPrecio = document.querySelector("#precio");
const inputCantidad = document.querySelector("#cantidad");
const inputPrecioMaximo = document.querySelector("#precioMaximo");

const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");

const cuerpoTabla = document.querySelector("#cuerpoTabla");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");
const estadoFiltro = document.querySelector("#estadoFiltro");

const campos = {
    producto: { input: inputProducto, error: document.querySelector("#errorProducto") },
    precio: { input: inputPrecio, error: document.querySelector("#errorPrecio") },
    cantidad: { input: inputCantidad, error: document.querySelector("#errorCantidad") },
};
const errorPrecioMaximo = document.querySelector("#errorPrecioMaximo");

const esNumeroPositivo = (valor) => Number.isFinite(valor) && valor > 0;

function validarPedido({ producto, precio, cantidad }) {
    const errores = {};

    if (producto.trim() === "") {
        errores.producto = "Escribe el nombre del producto.";
    }

    if (precio.trim() === "") {
        errores.precio = "Ingresa el precio unitario.";
    } else if (!esNumeroPositivo(Number(precio))) {
        errores.precio = "El precio debe ser mayor que cero.";
    }

    if (cantidad.trim() === "") {
        errores.cantidad = "Ingresa la cantidad solicitada.";
    } else if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
        errores.cantidad = "La cantidad debe ser un número entero positivo.";
    }

    return errores;
}

function validarPrecioMaximo(texto) {
    if (texto.trim() === "") return "Ingresa el precio máximo.";
    if (!esNumeroPositivo(Number(texto))) return "El precio máximo debe ser mayor que cero.";
    return null;
}

const crearPedido = ({ producto, precio, cantidad }) => ({
    producto: producto.trim(),
    precio: Number(precio),
    cantidad: Number(cantidad),
});

const calcularSubtotal = ({ precio, cantidad }) => precio * cantidad;

const filtrarPorPrecioMaximo = (lista, precioMaximo) =>
    lista.filter((pedido) => pedido.precio <= precioMaximo);

function calcularTotales(lista) {
    return {
        unidades: lista.reduce((acumulado, pedido) => acumulado + pedido.cantidad, 0),
        monto: lista.reduce((acumulado, pedido) => acumulado + calcularSubtotal(pedido), 0),
    };
}

const obtenerPedidosVisibles = () =>
    precioMaximoActivo === null ? pedidos : filtrarPorPrecioMaximo(pedidos, precioMaximoActivo);

const formatearMoneda = (valor) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(valor);

const escaparHTML = (texto) =>
    texto.replace(/[&<>"']/g, (caracter) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[caracter]));

const construirFilas = (lista) =>
    lista
        .map(
            (pedido) => `
            <tr>
                <td>${escaparHTML(pedido.producto)}</td>
                <td class="num">${formatearMoneda(pedido.precio)}</td>
                <td class="num">${pedido.cantidad}</td>
                <td class="num">${formatearMoneda(calcularSubtotal(pedido))}</td>
            </tr>`
        )
        .join("");

function renderizarTabla(lista) {
    if (lista.length > 0) {
        cuerpoTabla.innerHTML = construirFilas(lista);
        return;
    }

    const mensaje =
        precioMaximoActivo === null
            ? "Aún no hay pedidos. Agrega el primero con el formulario."
            : `Ningún pedido tiene un precio unitario de ${formatearMoneda(precioMaximoActivo)} o menos.`;

    cuerpoTabla.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">${mensaje}</td></tr>`;
}

function renderizarTotales(lista) {
    const { unidades, monto } = calcularTotales(lista);
    totalUnidades.textContent = unidades;
    montoTotal.textContent = formatearMoneda(monto);
}

function renderizarEstadoFiltro(visibles) {
    estadoFiltro.textContent =
        precioMaximoActivo === null
            ? ""
            : `Filtro activo: precio unitario de ${formatearMoneda(precioMaximoActivo)} o menos ` +
              `(${visibles.length} de ${pedidos.length} pedidos). Los totales corresponden a lo que se muestra.`;
}

function actualizarVista() {
    const visibles = obtenerPedidosVisibles();
    renderizarTabla(visibles);
    renderizarTotales(visibles);
    renderizarEstadoFiltro(visibles);
}

function mostrarErroresFormulario(errores) {
    Object.entries(campos).forEach(([nombre, { input, error }]) => {
        const mensaje = errores[nombre];
        input.classList.toggle("is-invalid", Boolean(mensaje));
        error.textContent = mensaje ?? "";
    });
}

function mostrarErrorPrecioMaximo(mensaje) {
    inputPrecioMaximo.classList.toggle("is-invalid", Boolean(mensaje));
    errorPrecioMaximo.textContent = mensaje ?? "";
}

function manejarAgregarPedido(evento) {
    evento.preventDefault();

    const datos = {
        producto: inputProducto.value,
        precio: inputPrecio.value,
        cantidad: inputCantidad.value,
    };

    const errores = validarPedido(datos);
    mostrarErroresFormulario(errores);

    const camposConError = Object.keys(errores);
    if (camposConError.length > 0) {
        campos[camposConError[0]].input.focus();
        return;
    }

    pedidos.push(crearPedido(datos));
    formulario.reset();
    inputProducto.focus();
    actualizarVista();
}

function manejarFiltrar() {
    const error = validarPrecioMaximo(inputPrecioMaximo.value);
    mostrarErrorPrecioMaximo(error);
    if (error) return;

    precioMaximoActivo = Number(inputPrecioMaximo.value);
    actualizarVista();
}

function manejarMostrarTodos() {
    precioMaximoActivo = null;
    inputPrecioMaximo.value = "";
    mostrarErrorPrecioMaximo(null);
    actualizarVista();
}

function manejarLimpiar() {
    pedidos.length = 0;
    manejarMostrarTodos();
}

formulario.addEventListener("submit", manejarAgregarPedido);
btnFiltrar.addEventListener("click", manejarFiltrar);
btnMostrarTodos.addEventListener("click", manejarMostrarTodos);
btnLimpiar.addEventListener("click", manejarLimpiar);

formulario.addEventListener("input", (evento) => evento.target.classList.remove("is-invalid"));
inputPrecioMaximo.addEventListener("input", () => mostrarErrorPrecioMaximo(null));

actualizarVista();