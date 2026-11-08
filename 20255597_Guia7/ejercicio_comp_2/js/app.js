// ============================================================
// Ejercicio complementario 2: consumo de la API Tasty (RapidAPI)
// Endpoint 1 (listado): GET /recipes/list
// Endpoint 2 (detalle): GET /recipes/get-more-info
// ============================================================


const API_KEY = "TU_API_KEY";
const API_HOST = "tasty.p.rapidapi.com";
const BASE_URL = `https://${API_HOST}`;
const TAMANO_PAGINA = 12;

const listaEl = document.getElementById("lista");
const estadoEl = document.getElementById("estado");
const btnMas = document.getElementById("btnMas");
const dialogo = document.getElementById("detalle");
const contenidoEl = document.getElementById("detalleContenido");
const btnCerrar = document.getElementById("btnCerrar");

let desde = 0;
const cacheDetalle = {};

// ---------- Utilidades ----------
const crearElemento = function (etiqueta, texto, clase) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined && texto !== null) nodo.textContent = texto;
  return nodo;
};

const limpiar = function (nodo) {
  while (nodo.firstChild) nodo.removeChild(nodo.firstChild);
};

const mostrarEstado = function (texto, esError) {
  estadoEl.textContent = texto;
  estadoEl.className = esError ? "estado error" : "estado";
};

const sinHtml = (texto) => (texto || "").replace(/<[^>]*>/g, "").trim();

// ---------- Llamada a la API (async/await + manejo de errores) ----------
const pedir = async function (ruta, parametros) {
  if (API_KEY === "TU_API_KEY") {
    throw new Error("Falta tu API key: pégala en la constante API_KEY de js/app.js.");
  }

  let respuesta;
  try {
    const url = `${BASE_URL}${ruta}?${new URLSearchParams(parametros)}`;
    respuesta = await fetch(url, {
      method: "GET",
      headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST },
    });
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión a internet.");
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401 || respuesta.status === 403) {
      throw new Error("La API key no es válida o no estás suscrito al plan (error " + respuesta.status + ").");
    }
    if (respuesta.status === 429) {
      throw new Error("Se alcanzó el límite de solicitudes (error 429). Intenta más tarde.");
    }
    throw new Error("El servidor respondió con un error (" + respuesta.status + ").");
  }
  return respuesta.json();
};

// ---------- Listado ----------
const crearTarjeta = function (receta) {
  const tarjeta = crearElemento("article", null, "tarjeta");

  if (receta.thumbnail_url) {
    const img = document.createElement("img");
    img.src = receta.thumbnail_url;
    img.alt = receta.name;
    img.loading = "lazy";
    tarjeta.appendChild(img);
  }

  const cuerpo = crearElemento("div", null, "cuerpo");
  cuerpo.appendChild(crearElemento("h3", receta.name));

  const partes = [];
  if (receta.total_time_minutes) partes.push(receta.total_time_minutes + " min");
  if (receta.num_servings) partes.push(receta.num_servings + " porciones");
  if (receta.user_ratings && receta.user_ratings.score) {
    partes.push(Math.round(receta.user_ratings.score * 100) + "% de aprobación");
  }
  cuerpo.appendChild(crearElemento("p", partes.join(", "), "meta"));

  const boton = crearElemento("button", "Ver receta", "btn");
  boton.type = "button";
  boton.addEventListener("click", () => verDetalle(receta.id));
  cuerpo.appendChild(boton);

  tarjeta.appendChild(cuerpo);
  return tarjeta;
};

const cargarLista = async function () {
  btnMas.disabled = true;
  mostrarEstado("Cargando recetas...");
  try {
    const datos = await pedir("/recipes/list", { from: desde, size: TAMANO_PAGINA });
    const recetas = (datos.results || []).filter((r) => r.id && r.name);

    if (recetas.length === 0 && listaEl.children.length === 0) {
      mostrarEstado("No se encontraron recetas.");
      return;
    }
    recetas.forEach((r) => listaEl.appendChild(crearTarjeta(r)));
    desde += TAMANO_PAGINA;

    const total = datos.count || listaEl.children.length;
    mostrarEstado(`Mostrando ${listaEl.children.length} de ${total} recetas.`);
    btnMas.hidden = listaEl.children.length >= total;
  } catch (error) {
    mostrarEstado(error.message, true);
  } finally {
    btnMas.disabled = false;
  }
};

// ---------- Detalle ----------
const pintarDetalle = function (receta) {
  limpiar(contenidoEl);

  const titulo = crearElemento("h2", receta.name);
  titulo.id = "detalleTitulo";
  contenidoEl.appendChild(titulo);

  if (receta.thumbnail_url) {
    const img = document.createElement("img");
    img.src = receta.thumbnail_url;
    img.alt = receta.name;
    contenidoEl.appendChild(img);
  }

  const datos = crearElemento("div", null, "datos");
  const agregarDato = (etiqueta, valor) => {
    if (!valor) return;
    const dato = crearElemento("span", etiqueta + ": ");
    dato.appendChild(crearElemento("strong", valor));
    datos.appendChild(dato);
  };
  agregarDato("Tiempo total", receta.total_time_minutes ? receta.total_time_minutes + " min" : "");
  agregarDato("Porciones", receta.num_servings);
  agregarDato("Calorías", receta.nutrition ? receta.nutrition.calories + " kcal" : "");
  agregarDato("Proteína", receta.nutrition ? receta.nutrition.protein + " g" : "");
  contenidoEl.appendChild(datos);

  const descripcion = sinHtml(receta.description);
  if (descripcion) contenidoEl.appendChild(crearElemento("p", descripcion));

  // Ingredientes (agrupados por sección)
  contenidoEl.appendChild(crearElemento("h3", "Ingredientes"));
  (receta.sections || []).forEach((seccion) => {
    if (seccion.name) contenidoEl.appendChild(crearElemento("h4", seccion.name));
    const ul = document.createElement("ul");
    (seccion.components || []).forEach((c) => {
      let texto = c.raw_text;
      if (!texto || texto === "n/a") {
        texto = (c.ingredient ? c.ingredient.name : "") + (c.extra_comment ? ", " + c.extra_comment : "");
      }
      ul.appendChild(crearElemento("li", texto));
    });
    contenidoEl.appendChild(ul);
  });

  // Preparación
  contenidoEl.appendChild(crearElemento("h3", "Preparación"));
  const ol = document.createElement("ol");
  (receta.instructions || [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .forEach((paso) => ol.appendChild(crearElemento("li", paso.display_text)));
  contenidoEl.appendChild(ol);
};

const verDetalle = async function (id) {
  limpiar(contenidoEl);
  contenidoEl.appendChild(crearElemento("p", "Cargando receta..."));
  if (!dialogo.open) dialogo.showModal();

  try {
    if (!cacheDetalle[id]) {
      cacheDetalle[id] = await pedir("/recipes/get-more-info", { id: id });
    }
    pintarDetalle(cacheDetalle[id]);
  } catch (error) {
    limpiar(contenidoEl);
    contenidoEl.appendChild(crearElemento("p", error.message, "estado error"));
  }
};

// ---------- Eventos ----------
btnMas.addEventListener("click", cargarLista);
btnCerrar.addEventListener("click", () => dialogo.close());
dialogo.addEventListener("click", (evento) => {
  if (evento.target === dialogo) dialogo.close();
});

cargarLista();