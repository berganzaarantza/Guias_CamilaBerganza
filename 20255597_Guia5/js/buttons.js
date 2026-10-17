function aviso(){
    alert("Bienvenido al mundo JavaScript");
}

function confirmacion(){
    let confirmation = confirm("¿Desea salir de la sesión?");
    alert(`Valor seleccionado ${confirmacion}`); 
}

function capturarDatos(){
    let nombre = prompt("¿Cuál es su nombre?");
    let edad = prompt("¿Cuál es su edad?", 0);

    alert(`Su nombre es ${nombre} y su edad es ${edad}`);
}

function dibujarParrafo(){
    let parrafo = prompt(
        "Escriba la información que desea visualizar en el párrafo"
    );

    const p = document.querySelector("#idParrafo");
    p.innerHTML = parrafo;
}