class Producto {
  constructor(id, nombre, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

const productos = [
  new Producto(1, 'Leche', 1200, 'https://www.trainerclub.es/wp-content/uploads/12.jpg'),
  new Producto(2, 'Pan', 800, 'https://i.blogs.es/512fb8/pan_comun/1200_900.jpg'),
  new Producto(3, 'Huevos', 1800, 'https://content21.sabervivirtv.com/medio/2023/11/03/huevos_fe2ba96b_231103092853_1280x720.jpg'),
  new Producto(4, 'Queso', 3500, 'https://www.lacasadelqueso.com.ar/wp-content/uploads/2017/08/parmigiano-reggiano.jpg'),
  new Producto(5, 'Manzanas', 1500, 'https://www.univision.com/_next/image?url=https%3A%2F%2Fst1.uvnimg.com%2F02%2F2e%2Fd585843e46a79ed947476b55a21c%2Fshutterstock-226100671.jpg&w=1280&q=75'),
  new Producto(6, 'Arroz', 1100, 'https://tiaclara.com/wp-content/uploads/2012/03/white-rice-instant-pot-DSCF0251.jpg'),
  new Producto(7, 'Pollo', 3200, 'https://metroio.vtexassets.com/arquivos/ids/290311/Pollo-Entero-Fresco-Metro-x-kg-2-183284.jpg?v=638179316343400000'),
  new Producto(8, 'Tomates', 1300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVSrU4sEyFp-DMR2ztqNQ7sj4p_d9MUwB-Rw&s'),
  new Producto(9, 'Cebollas', 900, 'https://upload.wikimedia.org/wikipedia/commons/3/34/Two_colors_of_onions.jpg'),
  new Producto(10, 'Yogurt', 1600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeJY1388t2aN3oyTF1kaGGU1DcxuBMzV3mMg&s'),
  new Producto(11, 'Cereal', 2500, 'https://arcorencasa.com/wp-content/uploads/2024/10/20241009-14091.webp'),
  new Producto(12, 'Jabón', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWp6zzW7t10p2sAT9EgTtxuncZ5NLg62DKtQ&s'),
  new Producto(13, 'Papel Higiénico', 2800, 'https://softysar.vtexassets.com/arquivos/ids/158369/label-1.png?v=638937235508970000'),
  new Producto(14, 'Fideos', 900, 'https://www.multifood.com.ar/thumb/000Z-001-002-00734870Z-001-002-007-Matarazzo-Coditos_800x800.jpg'),
  new Producto(15, 'Aceite', 2200, 'https://www.alyser.com.ar/wp-content/uploads/2024/08/140206307.jpg'),
  new Producto(16, 'Azúcar', 1300, 'https://www.casa-segal.com/wp-content/uploads/2019/03/azucar-kilo-ledesma-reposteria-mendoza-casa-segal-1-600x600.jpg'),
  new Producto(17, 'Sal', 500, 'https://carrefourar.vtexassets.com/arquivos/ids/196629/7790072001014.jpg?v=637523688684930000'),
  new Producto(18, 'Café', 4500, 'https://www.dolce-gusto.com.ar/media/catalog/product/cache/a7ed62b12c9d28aa0842b5a9bc7623a5/h/e/hero_aulait_club.png'),
  new Producto(19, 'Té', 1800, 'https://carrefourar.vtexassets.com/arquivos/ids/328109/7790387800142_02.jpg?v=638204500032570000')
];

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
  mostrarProductos();
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
});