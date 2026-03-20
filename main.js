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
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  } else {
    carrito = [];
  }
}

// actualiza el contador y el total del carrito
function actualizarCarrito() {
  const contadorSpan = document.getElementById('contadorCarrito');
  const totalSpan = document.getElementById('totalCarrito');
  
  contadorSpan.textContent = carrito.length;
  
  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
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
  carrito.push(producto);
  actualizarCarrito();
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    return;
  }
  
  carrito = [];
  actualizarCarrito();
  actualizarModalCarrito();
  
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
  actualizarModalCarrito();
}

function actualizarModalCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  const totalModal = document.getElementById('totalModal');
  
  
  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <div class="carrito-vacio">
        <i class="fas fa-shopping-cart fa-3x"></i>
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
        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-carrito-imagen">
        <div class="producto-carrito-info">
          <div class="producto-carrito-nombre">${producto.nombre}</div>
          <div class="producto-carrito-precio">$${producto.precio.toFixed(2)}</div>
        </div>
        <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${i})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
  
  listaCarrito.innerHTML = html;
  
  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
  totalModal.textContent = total.toFixed(2);
}

function abrirModal() {
  const modal = document.getElementById('modalCarrito');
  if (!modal) return;
  
  actualizarModalCarrito();
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  const modal = document.getElementById('modalCarrito');
  if (!modal) return;
  
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  cargarProductosDesdeAPI();
  actualizarCarrito();
  

  const iconoLupa = document.getElementById('buscador');
  const inputBusqueda = document.querySelector('.searchbar input');
  
  if (iconoLupa) {
    iconoLupa.addEventListener('click', buscarProductos);
  }
  
  if (inputBusqueda) {
    inputBusqueda.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        buscarProductos();
      }
    });
  }
  

  const verCarritoBtn = document.getElementById('verCarritoBtn');
  if (verCarritoBtn) {
    verCarritoBtn.addEventListener('click', abrirModal);
  }
  
  const cerrarModalBtn = document.getElementById('cerrarModalBtn');
  const cerrarModalX = document.querySelector('.cerrar-modal');
  const modal = document.getElementById('modalCarrito');
  
  if (cerrarModalBtn) {
    cerrarModalBtn.addEventListener('click', cerrarModal);
  }
  
  if (cerrarModalX) {
    cerrarModalX.addEventListener('click', cerrarModal);
  }
  
  const vaciarModalBtn = document.getElementById('vaciarModalBtn');
  if (vaciarModalBtn) {
    vaciarModalBtn.addEventListener('click', () => {
      vaciarCarrito();
      if (carrito.length === 0) {
        actualizarModalCarrito();
      }
    });
  }
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

    // Botón Pagar del carrito
  const pagarBtn = document.getElementById('pagarBtn');
  if(pagarBtn) {
      pagarBtn.addEventListener('click', abrirModalPago);
  }

  // Botón cerrar del modal de pago
  const cerrarPago = document.querySelector('.cerrar-modal-pago');
  if(cerrarPago) {
      cerrarPago.addEventListener('click', cerrarModalPago);
  }

  // Botón pagar ahora
  const btnPagarAhora = document.getElementById('btnPagarAhora');
  if(btnPagarAhora) {
      btnPagarAhora.addEventListener('click', procesarPago);
  }

});


// Abrir modal de pago
function abrirModalPago() {
    document.getElementById('modalPago').style.display = 'block';
    cerrarModal(); // Cierra el modal del carrito
}

// Cerrar modal de pago
function cerrarModalPago() {
    document.getElementById('modalPago').style.display = 'none';
}

// Procesar pago
function procesarPago() {
    const numero = document.getElementById('numeroTarjeta').value;
    const fecha = document.getElementById('fechaExpiracion').value;
    const cvv = document.getElementById('cvv').value;
    const nombre = document.getElementById('nombreTarjeta').value;
    
    if(!numero || !fecha || !cvv || !nombre) {
        Swal.fire({
        icon: "error",
        title: "Datos incompletos",
        text: "Completa todos los campos para procesar el pago",
        confirmButtonText: "Aceptar"
        });
        return;
    }
    
    const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
        Swal.fire({
        title: "Pago realizado",
        icon: "success",
        text: `✅ Pago realizado\nTotal: $${total.toFixed(2)}\nGracias ${nombre}!`,
        confirmButtonText: "Aceptar"
        });
    
    vaciarCarrito();
    cerrarModalPago();
    
    document.getElementById('numeroTarjeta').value = '';
    document.getElementById('fechaExpiracion').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('nombreTarjeta').value = '';
}