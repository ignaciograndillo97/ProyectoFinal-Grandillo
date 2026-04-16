class Producto {
  constructor(id, nombre, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

let productos = [];
let carrito = [];


function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
}


function actualizarCarrito() {
  const contadorSpan = document.getElementById('contadorCarrito');
  const totalSpan = document.getElementById('totalCarrito');

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contadorSpan.textContent = totalItems;

  const total = carrito.reduce((suma, p) => suma + (p.precio * p.cantidad), 0);
  totalSpan.textContent = total.toFixed(2);

  guardarCarrito();
}


async function cargarProductosDesdeAPI() {
  const respuesta = await fetch('https://demo5225124.mockable.io/listaProductos');
  const datos = await respuesta.json();

  productos = datos.map(item => new Producto(
    item.id,
    item.nombre,
    item.precio,
    item.imagen
  ));

  mostrarProductos();
}

function mostrarProductos() {
  const contenedor = document.getElementById('productosTotales');
  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const productoDiv = document.createElement('div');
    productoDiv.className = 'producto';

    productoDiv.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
      <div class="producto-info">
        <p class="producto-nombre">${producto.nombre}</p>
        <p class="producto-precio">$${producto.precio.toFixed(2)}</p>
      </div>
      <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
        <i class="fas fa-cart-plus"></i> Agregar
      </button>
    `;

    contenedor.appendChild(productoDiv);
  });
}


function buscarProductos() {
  const inputBusqueda = document.querySelector('.searchbar input');
  const filtro = inputBusqueda.value.toLowerCase();
  const contenedor = document.getElementById('productosTotales');

  contenedor.innerHTML = '';

  if (filtro === '') {
    mostrarProductos();
    return;
  }

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(filtro)
  );

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = '<p class="no-resultados">No se encontraron productos</p>';
    return;
  }

  productosFiltrados.forEach(producto => {
    const productoDiv = document.createElement('div');
    productoDiv.className = 'producto';

    productoDiv.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
      <div class="producto-info">
        <p class="producto-nombre">${producto.nombre}</p>
        <p class="producto-precio">$${producto.precio.toFixed(2)}</p>
      </div>
      <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
        <i class="fas fa-cart-plus"></i> Agregar
      </button>
    `;

    contenedor.appendChild(productoDiv);
  });
}


function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const existente = carrito.find(p => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
}


function aumentarCantidad(index) {
  carrito[index].cantidad++;
  actualizarCarrito();
  actualizarModalCarrito();
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }
  actualizarCarrito();
  actualizarModalCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
  actualizarModalCarrito();
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
  actualizarModalCarrito();
}


function actualizarModalCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  const totalModal = document.getElementById('totalModal');

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <div class="carrito-vacio">
        <p>Tu carrito está vacío</p>
      </div>
    `;
    totalModal.textContent = '0.00';
    return;
  }

  let html = '';

  carrito.forEach((producto, i) => {
    html += `
      <div class="producto-carrito">
        <img src="${producto.imagen}" class="producto-carrito-imagen">
        <div class="producto-carrito-info">
          <div class="producto-carrito-nombre">${producto.nombre}</div>
          <div class="producto-carrito-precio">$${producto.precio.toFixed(2)}</div>

          <div class="cantidad-control">
            <button onclick="disminuirCantidad(${i})">-</button>
            <span>${producto.cantidad}</span>
            <button onclick="aumentarCantidad(${i})">+</button>
          </div>
        </div>

        <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${i})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });

  listaCarrito.innerHTML = html;

  const total = carrito.reduce((suma, p) => suma + (p.precio * p.cantidad), 0);
  totalModal.textContent = total.toFixed(2);
}


function abrirModal() {
  actualizarModalCarrito();
  document.getElementById('modalCarrito').style.display = 'block';
}

function cerrarModal() {
  document.getElementById('modalCarrito').style.display = 'none';
}

function abrirModalPago() {
  document.getElementById('modalPago').style.display = 'block';
  cerrarModal();
}

function cerrarModalPago() {
  document.getElementById('modalPago').style.display = 'none';
}


function procesarPago() {
  const direccion = document.getElementById('direccion').value;
  const ciudad = document.getElementById('ciudad').value;
  const telefono = document.getElementById('telefono').value;

  const numero = document.getElementById('numeroTarjeta').value;
  const fecha = document.getElementById('fechaExpiracion').value;
  const cvv = document.getElementById('cvv').value;
  const nombre = document.getElementById('nombreTarjeta').value;

  if (!direccion || !ciudad || !telefono) {
    Swal.fire("Error", "Completa los datos de envío", "error");
    return;
  }

  const regexTarjeta = /^[0-9]{15,19}$/;
  const regexFecha = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const regexCVV = /^[0-9]{3,4}$/;

  if (!regexTarjeta.test(numero)) {
    Swal.fire("Error", "Tarjeta inválida", "error");
    return;
  }

  if (!regexFecha.test(fecha)) {
    Swal.fire("Error", "Fecha inválida", "error");
    return;
  }

  if (!regexCVV.test(cvv)) {
    Swal.fire("Error", "CVV inválido", "error");
    return;
  }

  if (nombre.trim().length < 3) {
    Swal.fire("Error", "Nombre inválido", "error");
    return;
  }

  const total = carrito.reduce((suma, p) => suma + (p.precio * p.cantidad), 0);

  Swal.fire("Pago realizado", `Total: $${total.toFixed(2)}`, "success");

  vaciarCarrito();
  cerrarModalPago();
}


document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  cargarProductosDesdeAPI();
  actualizarCarrito();

  document.getElementById('buscador')?.addEventListener('click', buscarProductos);

  document.querySelector('.searchbar input')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') buscarProductos();
  });

  document.getElementById('verCarritoBtn')?.addEventListener('click', abrirModal);
  document.getElementById('cerrarModalBtn')?.addEventListener('click', cerrarModal);
  document.querySelector('.cerrar-modal')?.addEventListener('click', cerrarModal);

  document.getElementById('vaciarModalBtn')?.addEventListener('click', vaciarCarrito);

  document.getElementById('pagarBtn')?.addEventListener('click', abrirModalPago);
  document.querySelector('.cerrar-modal-pago')?.addEventListener('click', cerrarModalPago);

  document.getElementById('btnPagarAhora')?.addEventListener('click', procesarPago);


function soloNumeros(input) {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
  });
}

soloNumeros(document.getElementById('telefono'));
soloNumeros(document.getElementById('numeroTarjeta'));
soloNumeros(document.getElementById('fechaExpiracion'));
soloNumeros(document.getElementById('cvv'));
});