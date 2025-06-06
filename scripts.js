// Variable
const carrito = document.querySelector('.carrito');
const listaCarrito = document.querySelector('.lista-carrito');
const listaPerro = document.querySelector('.lista-perro');
const contenedorPerro = document.querySelector('.lista-carrito tbody');
const cantidadCarrito = document.querySelector('.cantidad-carrito');
let articuloCarrito = [];
// Variable para la validaciones
const btnEnviar = document.querySelector('#btnEnviar');
const correo = document.querySelector('#correo');
const telefono = document.querySelector('#telefono');
const nombre = document.querySelector('#nombre');
const descripcion = document.querySelector('#descripcion');

// Funciones 
eventListener();
function eventListener(){
    listaPerro.addEventListener('click', agregarPerro);
    carrito.addEventListener('click', eliminarCarrito);
    document.addEventListener('DOMContentLoaded', () => {
        // Obtener el arrray del local storage
        articuloCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
        actualizarTotalCarrito();
    })
}
function eliminarCarrito(e){
    if(e.target.classList.contains('borrar')){
        // Obtener el id del perro seleccionado
        const perroSeleccionado = e.target.getAttribute('data-id');
        // Eliminar el carrito
        articuloCarrito = articuloCarrito.filter(perro => perro.id !== perroSeleccionado);
        carritoHTML(); 
        actualizarTotalCarrito();
    }
}

// Funcion leer los datos seleccionado 
function agregarPerro(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const perroSeleccionado = e.target.parentElement.parentElement;
        leerVenta(perroSeleccionado);
    }
}
function leerVenta(perro){
    // Obtener el perro selecionado
    const infoPerro = {
        nombre: perro.querySelector('h4').textContent,
        imagen: perro.querySelector('img').src,
        precio: perro.querySelector('.precio').textContent,
        cantidad: 1,
        id: perro.querySelector('a').getAttribute('data-id'),
    }
    let cantidad;
    const existe = articuloCarrito.some(perro => perro.id === infoPerro.id);
    if(existe){
        const ventaPerro = articuloCarrito.map(perro => {
            if(perro.id === infoPerro.id){
                perro.cantidad++;
                return  perro; // Retorna el objecto
            }else{
                return perro;// Retorna el objecto
            }
        });
        articuloCarrito = [...ventaPerro]; // Almacenar la informacion 
    }else{
       articuloCarrito = [...articuloCarrito, infoPerro]; // Almacenar la informacion 
    }
    carritoHTML();
    actualizarTotalCarrito();
    // Agregar el carrito al local storage
    sincronizarStorage();
}
function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articuloCarrito));
}
function actualizarTotalCarrito(){
    let totalCantidad = articuloCarrito.reduce((total, item ) => total + item.cantidad, 0);
    cantidadCarrito.textContent = totalCantidad;
}
function carritoHTML(){
    // Limpiar elemento antes de agregar 
    LimpiarHTML();
    // llenar
    articuloCarrito.forEach(perro => {
        const {nombre, imagen, precio, cantidad, id} = perro;
        const row = document.createElement('tr');
        row.innerHTML = `
         <td>
              <img src="${imagen}" class="rounded-3" width=100"></img>
          </td>
          <td>${nombre}</td>
          <td>${precio}</td>
          <td>${cantidad}</td>
          <td style="cursor:pointer;"><span class="text-danger borrar bg-danger text-white" data-id="${id}">X</span></td>
        `
        // Agregar el perro seleccionado al carrito
        contenedorPerro.appendChild(row);
    });
} 

function LimpiarHTML(){
    while(contenedorPerro.firstChild){
        if(contenedorPerro.removeChild(contenedorPerro.firstChild));
    }
}
// Validar que los campos no esten vacio;
function validarCampo(e){
    e.preventDefault();  // Prevenir envío si hay errores
    // Obtener los campos que mostraran los errores
    const errorDescripcion = document.querySelector('.errorDescripcion');
    const errorNombre = document.querySelector('.errorNombre');
    const errorTelefono = document.querySelector('.errorTelefono');
    const errorEmail = document.querySelector('.errorEmail');
    // Limpiar los campos antes de llenar
    document.querySelectorAll('.error').forEach(error => {
        error.textContent = '';
    });
    let primerError;
    let esValido = true;
    if(descripcion.value.trim() === ''){
        if(!primerError) primerError = descripcion;
        errorDescripcion.textContent = 'Por favor, Ingresar una descripción';
        esValido = false;
        return;
    }
    if(nombre.value.trim() === ''){
        if(!primerError) primerError = nombre;
        errorNombre.textContent = 'Por favor, Ingresar un nombre';
        esValido = false;
        return;
    }
    if(isNaN(telefono.value) || telefono.value <= 0){
        if(!primerError) primerError = telefono;
        errorTelefono.textContent = 'Por favor, Ingresar un teléfono válido';
        esValido = false;
        return;
    }
    if(correo.value.trim() === ''){
        if(!primerError) primerError = correo;
        errorEmail.textContent = 'Por favor, Ingresar un correo electrónico';
        esValido = false;
        return;
    }
    if(!esValido && primerError) primerError.focus();
    return esValido;
}
  btnEnviar.addEventListener('click', validarCampo);