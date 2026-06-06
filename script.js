/* ============================================
   CHILY FRUTAS - SISTEMA ADMINISTRATIVO
   script.js - Lógica Principal
   ============================================ */

'use strict';

/* ===== ESTADO GLOBAL ===== */
let currentUser = null;
let currentPage = 'dashboard';
let carrito = [];
let productoModalActual = null;
let ventasData = [];
let eliminarCallback = null;

/* ===== DATOS DE PRUEBA ===== */
const USERS = [
  { id: 1, nombre: 'Administrador General', username: 'admin', password: '1234', rol: 'admin', correo: 'admin@chilyfrutas.com', estado: 'activo', avatar: '#27ae60', ultimoAcceso: '2025-01-15 08:30:00' },
  { id: 2, nombre: 'Carlos Cajero', username: 'cajero', password: '1234', rol: 'cajero', correo: 'cajero@chilyfrutas.com', estado: 'activo', avatar: '#e67e22', ultimoAcceso: '2025-01-15 09:00:00' },
  { id: 3, nombre: 'María García', username: 'maria', password: '1234', rol: 'cajero', correo: 'maria@chilyfrutas.com', estado: 'activo', avatar: '#8e44ad', ultimoAcceso: '2025-01-14 17:45:00' },
  { id: 4, nombre: 'Pedro López', username: 'pedro', password: '1234', rol: 'cajero', correo: 'pedro@chilyfrutas.com', estado: 'inactivo', avatar: '#2980b9', ultimoAcceso: '2025-01-10 10:00:00' }
];

let usuarios = JSON.parse(localStorage.getItem('cf_usuarios') || JSON.stringify(USERS));

const PRODUCTOS_DEFAULT = [
  { id: 1, codigo: 'BAT-001', nombre: 'Batido de Fresa', categoria: 'Batido', precio: 55, cantidad: 50, descripcion: 'Delicioso batido de fresa fresca con leche y azúcar', emoji: '🍓', ingredientes: ['Fresa', 'Leche', 'Azúcar', 'Hielo'], disponible: true },
  { id: 2, codigo: 'BAT-002', nombre: 'Batido de Mango', categoria: 'Batido', precio: 60, cantidad: 45, descripcion: 'Batido tropical de mango maduro con leche', emoji: '🥭', ingredientes: ['Mango', 'Leche', 'Azúcar', 'Hielo'], disponible: true },
  { id: 3, codigo: 'BAT-003', nombre: 'Batido de Piña', categoria: 'Batido', precio: 55, cantidad: 40, descripcion: 'Refrescante batido de piña natural', emoji: '🍍', ingredientes: ['Piña', 'Leche', 'Azúcar', 'Hielo'], disponible: true },
  { id: 4, codigo: 'BAT-004', nombre: 'Batido de Papaya', categoria: 'Batido', precio: 50, cantidad: 35, descripcion: 'Suave batido de papaya con leche entera', emoji: '🧃', ingredientes: ['Papaya', 'Leche', 'Azúcar'], disponible: true },
  { id: 5, codigo: 'BAT-005', nombre: 'Batido Mix Tropical', categoria: 'Batido', precio: 70, cantidad: 30, descripcion: 'Mezcla tropical de frutas exóticas', emoji: '🫐', ingredientes: ['Mango', 'Piña', 'Fresa', 'Leche', 'Azúcar'], disponible: true },
  { id: 6, codigo: 'ENS-001', nombre: 'Ensalada de Frutas Classic', categoria: 'Ensalada', precio: 65, cantidad: 25, descripcion: 'Variedad de frutas frescas con crema', emoji: '🥗', ingredientes: ['Fresa', 'Mango', 'Piña', 'Crema', 'Azúcar'], disponible: true },
  { id: 7, codigo: 'ENS-002', nombre: 'Ensalada Especial', categoria: 'Ensalada', precio: 80, cantidad: 20, descripcion: 'Ensalada premium con frutas de temporada', emoji: '🍱', ingredientes: ['Fresa', 'Mango', 'Papaya', 'Uva', 'Crema', 'Nuez'], disponible: true },
  { id: 8, codigo: 'FRE-001', nombre: 'Fresco de Jamaica', categoria: 'Fresco', precio: 30, cantidad: 60, descripcion: 'Refrescante bebida de flor de jamaica', emoji: '🌺', ingredientes: ['Jamaica', 'Azúcar', 'Agua', 'Limón'], disponible: true },
  { id: 9, codigo: 'FRE-002', nombre: 'Fresco de Tamarindo', categoria: 'Fresco', precio: 30, cantidad: 55, descripcion: 'Tradicional fresco de tamarindo', emoji: '🍵', ingredientes: ['Tamarindo', 'Azúcar', 'Agua'], disponible: true },
  { id: 10, codigo: 'FRE-003', nombre: 'Limonada Natural', categoria: 'Fresco', precio: 25, cantidad: 70, descripcion: 'Limonada fresca exprimida al momento', emoji: '🍋', ingredientes: ['Limón', 'Azúcar', 'Agua', 'Hielo'], disponible: true },
  { id: 11, codigo: 'POS-001', nombre: 'Postre de Fresa', categoria: 'Postre', precio: 75, cantidad: 15, descripcion: 'Postre cremoso de fresa con galleta', emoji: '🍰', ingredientes: ['Fresa', 'Crema', 'Galleta', 'Azúcar'], disponible: true },
  { id: 12, codigo: 'POS-002', nombre: 'Copa de Frutas', categoria: 'Postre', precio: 85, cantidad: 12, descripcion: 'Copa con helado y frutas variadas', emoji: '🍨', ingredientes: ['Helado', 'Fresa', 'Mango', 'Piña', 'Crema'], disponible: true },
  { id: 13, codigo: 'FRU-001', nombre: 'Piña con Chile', categoria: 'Fruta', precio: 35, cantidad: 40, descripcion: 'Piña fresca con chile, limón y sal', emoji: '🍍', ingredientes: ['Piña', 'Chile', 'Limón', 'Sal'], disponible: true },
  { id: 14, codigo: 'FRU-002', nombre: 'Mango Enchilado', categoria: 'Fruta', precio: 40, cantidad: 35, descripcion: 'Mango maduro con chamoy y chile', emoji: '🥭', ingredientes: ['Mango', 'Chamoy', 'Chile', 'Limón'], disponible: true },
  { id: 15, codigo: 'BAT-006', nombre: 'Batido Verde Detox', categoria: 'Batido', precio: 75, cantidad: 3, descripcion: 'Batido saludable con frutas verdes y verduras', emoji: '🥝', ingredientes: ['Espinaca', 'Manzana', 'Apio', 'Pepino', 'Limón'], disponible: true }
];

let productos = JSON.parse(localStorage.getItem('cf_productos') || JSON.stringify(PRODUCTOS_DEFAULT));

const INGREDIENTES_DEFAULT = [
  { id: 1, codigo: 'ING-001', nombre: 'Fresa', unidad: 'kg', stock: 2.5, minimo: 5, costo: 60, emoji: '🍓' },
  { id: 2, codigo: 'ING-002', nombre: 'Mango', unidad: 'kg', stock: 8, minimo: 5, costo: 45, emoji: '🥭' },
  { id: 3, codigo: 'ING-003', nombre: 'Piña', unidad: 'kg', stock: 10, minimo: 5, costo: 30, emoji: '🍍' },
  { id: 4, codigo: 'ING-004', nombre: 'Papaya', unidad: 'kg', stock: 6, minimo: 4, costo: 35, emoji: '🍈' },
  { id: 5, codigo: 'ING-005', nombre: 'Leche', unidad: 'L', stock: 15, minimo: 10, costo: 38, emoji: '🥛' },
  { id: 6, codigo: 'ING-006', nombre: 'Azúcar', unidad: 'kg', stock: 12, minimo: 5, costo: 22, emoji: '🍬' },
  { id: 7, codigo: 'ING-007', nombre: 'Hielo', unidad: 'kg', stock: 1, minimo: 8, costo: 15, emoji: '🧊' },
  { id: 8, codigo: 'ING-008', nombre: 'Crema de Leche', unidad: 'L', stock: 5, minimo: 3, costo: 65, emoji: '🍦' },
  { id: 9, codigo: 'ING-009', nombre: 'Limón', unidad: 'kg', stock: 3, minimo: 2, costo: 25, emoji: '🍋' },
  { id: 10, codigo: 'ING-010', nombre: 'Jamaica', unidad: 'kg', stock: 2, minimo: 1, costo: 80, emoji: '🌺' },
  { id: 11, codigo: 'ING-011', nombre: 'Tamarindo', unidad: 'kg', stock: 1.5, minimo: 1, costo: 55, emoji: '🫙' },
  { id: 12, codigo: 'ING-012', nombre: 'Chile Polvillo', unidad: 'g', stock: 500, minimo: 100, costo: 0.2, emoji: '🌶️' },
  { id: 13, codigo: 'ING-013', nombre: 'Nuez', unidad: 'g', stock: 300, minimo: 100, costo: 0.5, emoji: '🫘' },
  { id: 14, codigo: 'ING-014', nombre: 'Galleta', unidad: 'unidad', stock: 50, minimo: 20, costo: 5, emoji: '🍪' },
  { id: 15, codigo: 'ING-015', nombre: 'Helado Vainilla', unidad: 'L', stock: 0, minimo: 2, costo: 120, emoji: '🍨' }
];

let ingredientes = JSON.parse(localStorage.getItem('cf_ingredientes') || JSON.stringify(INGREDIENTES_DEFAULT));

const CLIENTES_DEFAULT = [
  { id: 1, nombre: 'Ana Martínez', telefono: '+505 8111-2222', correo: 'ana@gmail.com', direccion: 'Barrio San Pedro', compras: 15, ultimaVisita: '2025-01-15', totalGastado: 1250 },
  { id: 2, nombre: 'Luis Hernández', telefono: '+505 8333-4444', correo: 'luis@hotmail.com', direccion: 'Col. Centroamérica', compras: 8, ultimaVisita: '2025-01-14', totalGastado: 680 },
  { id: 3, nombre: 'Karla Rodríguez', telefono: '+505 8555-6666', correo: 'karla@gmail.com', direccion: 'Las Colinas', compras: 22, ultimaVisita: '2025-01-15', totalGastado: 1980 },
  { id: 4, nombre: 'Roberto Díaz', telefono: '+505 8777-8888', correo: 'roberto@yahoo.com', direccion: 'Barrio La Esperanza', compras: 5, ultimaVisita: '2025-01-12', totalGastado: 375 },
  { id: 5, nombre: 'Sofía Pérez', telefono: '+505 8999-0000', correo: 'sofia@gmail.com', direccion: 'Los Robles', compras: 31, ultimaVisita: '2025-01-15', totalGastado: 2890 },
  { id: 6, nombre: 'Miguel Torres', telefono: '+505 8121-3141', correo: 'miguel@hotmail.com', direccion: 'Villa Fontana', compras: 12, ultimaVisita: '2025-01-13', totalGastado: 960 },
  { id: 7, nombre: 'Fernanda Reyes', telefono: '+505 8516-1718', correo: 'fernanda@gmail.com', direccion: 'Residencial Las Brisas', compras: 19, ultimaVisita: '2025-01-15', totalGastado: 1720 }
];

let clientes = JSON.parse(localStorage.getItem('cf_clientes') || JSON.stringify(CLIENTES_DEFAULT));

const VENTAS_DEFAULT = [
  { id: 45, factura: '0045', clienteId: 3, clienteNombre: 'Karla Rodríguez', cajero: 'cajero', items: [{ id: 1, nombre: 'Batido de Fresa', emoji: '🍓', precio: 55, cantidad: 2 }, { id: 6, nombre: 'Ensalada de Frutas Classic', emoji: '🥗', precio: 65, cantidad: 1 }], total: 175, recibido: 200, cambio: 25, fecha: hoy(), hora: '09:15:32', estado: 'completada' },
  { id: 44, factura: '0044', clienteId: 5, clienteNombre: 'Sofía Pérez', cajero: 'admin', items: [{ id: 5, nombre: 'Batido Mix Tropical', emoji: '🫐', precio: 70, cantidad: 1 }, { id: 12, nombre: 'Copa de Frutas', emoji: '🍨', precio: 85, cantidad: 1 }], total: 155, recibido: 200, cambio: 45, fecha: hoy(), hora: '08:45:10', estado: 'completada' },
  { id: 43, factura: '0043', clienteId: null, clienteNombre: 'Consumidor Final', cajero: 'cajero', items: [{ id: 10, nombre: 'Limonada Natural', emoji: '🍋', precio: 25, cantidad: 3 }], total: 75, recibido: 100, cambio: 25, fecha: hoy(), hora: '08:30:05', estado: 'completada' },
  { id: 42, factura: '0042', clienteId: 1, clienteNombre: 'Ana Martínez', cajero: 'cajero', items: [{ id: 2, nombre: 'Batido de Mango', emoji: '🥭', precio: 60, cantidad: 2 }, { id: 13, nombre: 'Piña con Chile', emoji: '🍍', precio: 35, cantidad: 2 }], total: 190, recibido: 200, cambio: 10, fecha: ayer(), hora: '16:20:44', estado: 'completada' },
  { id: 41, factura: '0041', clienteId: 7, clienteNombre: 'Fernanda Reyes', cajero: 'admin', items: [{ id: 7, nombre: 'Ensalada Especial', emoji: '🍱', precio: 80, cantidad: 2 }], total: 160, recibido: 200, cambio: 40, fecha: ayer(), hora: '14:10:20', estado: 'completada' },
  { id: 40, factura: '0040', clienteId: 2, clienteNombre: 'Luis Hernández', cajero: 'cajero', items: [{ id: 8, nombre: 'Fresco de Jamaica', emoji: '🌺', precio: 30, cantidad: 4 }], total: 120, recibido: 150, cambio: 30, fecha: ayer(), hora: '11:05:33', estado: 'completada' }
];

let ventas = JSON.parse(localStorage.getItem('cf_ventas') || JSON.stringify(VENTAS_DEFAULT));

const HISTORIAL_DEFAULT = [
  { usuario: 'admin', rol: 'Administrador', accion: 'Inicio de sesión', modulo: 'Sistema', fecha: hoy() + ' 08:00:00', estado: 'éxito' },
  { usuario: 'cajero', rol: 'Cajero', accion: 'Inicio de sesión', modulo: 'Sistema', fecha: hoy() + ' 08:05:00', estado: 'éxito' },
  { usuario: 'cajero', rol: 'Cajero', accion: 'Registró venta #0043', modulo: 'Ventas', fecha: hoy() + ' 08:30:05', estado: 'éxito' },
  { usuario: 'cajero', rol: 'Cajero', accion: 'Registró venta #0045', modulo: 'Ventas', fecha: hoy() + ' 09:15:32', estado: 'éxito' },
  { usuario: 'admin', rol: 'Administrador', accion: 'Registró venta #0044', modulo: 'Ventas', fecha: hoy() + ' 08:45:10', estado: 'éxito' },
  { usuario: 'maria', rol: 'Cajero', accion: 'Intento fallido de acceso', modulo: 'Sistema', fecha: ayer() + ' 08:00:00', estado: 'error' }
];

let historialAccesos = JSON.parse(localStorage.getItem('cf_historial') || JSON.stringify(HISTORIAL_DEFAULT));

/* ===== HELPERS ===== */
function hoy() {
  return new Date().toISOString().split('T')[0];
}
function ayer() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
function formatDate(d) {
  if (!d) return '';
  const parts = d.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}
function formatCurrency(n) {
  return 'C$ ' + parseFloat(n || 0).toFixed(2);
}
function generateId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}
function generateFacturaNum() {
  const num = ventas.length ? Math.max(...ventas.map(v => v.id)) + 1 : 1;
  return String(num).padStart(4, '0');
}
function saveAll() {
  localStorage.setItem('cf_productos', JSON.stringify(productos));
  localStorage.setItem('cf_ingredientes', JSON.stringify(ingredientes));
  localStorage.setItem('cf_clientes', JSON.stringify(clientes));
  localStorage.setItem('cf_ventas', JSON.stringify(ventas));
  localStorage.setItem('cf_usuarios', JSON.stringify(usuarios));
  localStorage.setItem('cf_historial', JSON.stringify(historialAccesos));
}
function registrarActividad(accion, modulo) {
  historialAccesos.unshift({
    usuario: currentUser.username,
    rol: currentUser.rol === 'admin' ? 'Administrador' : 'Cajero',
    accion,
    modulo,
    fecha: hoy() + ' ' + new Date().toLocaleTimeString('es-NI'),
    estado: 'éxito'
  });
  if (historialAccesos.length > 50) historialAccesos.pop();
  saveAll();
}

/* ===== RELOJ ===== */
function startClock() {
  function tick() {
    const now = new Date();
    const timeEl = document.getElementById('headerTime');
    const dateEl = document.getElementById('headerDate');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('es-NI');
    if (dateEl) {
      const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      dateEl.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    }
    const dashDate = document.getElementById('dashboardDate');
    if (dashDate) {
      const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      const now2 = new Date();
      dashDate.textContent = days[now2.getDay()] + ', ' + now2.getDate() + ' de ' + months[now2.getMonth()] + ' de ' + now2.getFullYear();
    }
  }
  tick();
  setInterval(tick, 1000);
}

/* ===== LOGIN ===== */
function togglePassword() {
  const input = document.getElementById('loginPass');
  const icon = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const found = usuarios.find(u => u.username === user && u.password === pass && u.estado === 'activo');
  const errEl = document.getElementById('loginError');

  if (found) {
    errEl.classList.add('hidden');
    currentUser = found;
    historialAccesos.unshift({
      usuario: found.username,
      rol: found.rol === 'admin' ? 'Administrador' : 'Cajero',
      accion: 'Inicio de sesión',
      modulo: 'Sistema',
      fecha: hoy() + ' ' + new Date().toLocaleTimeString('es-NI'),
      estado: 'éxito'
    });
    saveAll();

    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    initApp();
  } else {
    errEl.classList.remove('hidden');
    const inactivo = usuarios.find(u => u.username === user && u.password === pass && u.estado === 'inactivo');
    errEl.innerHTML = inactivo
      ? '<i class="fas fa-ban"></i> Usuario inactivo. Contacte al administrador.'
      : '<i class="fas fa-exclamation-circle"></i> Usuario o contraseña incorrectos';
    historialAccesos.unshift({
      usuario: user || '(desconocido)',
      rol: '-',
      accion: 'Intento fallido de acceso',
      modulo: 'Sistema',
      fecha: hoy() + ' ' + new Date().toLocaleTimeString('es-NI'),
      estado: 'error'
    });
    saveAll();
  }
}

function handleLogout() {
  registrarActividad('Cierre de sesión', 'Sistema');
  currentUser = null;
  carrito = [];
  document.getElementById('appScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').classList.add('hidden');
}

/* ===== INIT APP ===== */
function initApp() {
  const name = currentUser.nombre.split(' ')[0];
  document.getElementById('sidebarUserName').textContent = currentUser.nombre;
  document.getElementById('sidebarUserRole').textContent = currentUser.rol === 'admin' ? 'Administrador' : 'Cajero';
  document.getElementById('headerUserName').textContent = name;
  document.getElementById('welcomeMsg').textContent = '¡Bienvenido, ' + name + '!';

  // Ocultar elementos de admin si es cajero
  if (currentUser.rol !== 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
  } else {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
  }

  startClock();
  navigateTo('dashboard', document.querySelector('.nav-item.active'));
  poblarClientesSelect();
}

/* ===== NAVEGACIÓN ===== */
function navigateTo(page, linkEl) {
  currentPage = page;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');

  const labels = {
    dashboard: 'Dashboard', ventas: 'Ventas', menu: 'Menú de Productos',
    inventario: 'Inventario', ingredientes: 'Ingredientes', clientes: 'Clientes',
    reportes: 'Reportes', usuarios: 'Usuarios', configuracion: 'Configuración',
    ayuda: 'Ayuda', acerca: 'Acerca del Sistema'
  };
  document.getElementById('breadcrumbText').textContent = labels[page] || page;

  // Cerrar dropdowns
  document.getElementById('notifDropdown').classList.add('hidden');
  document.getElementById('userDropdown').classList.add('hidden');

  // Renderizar página
  const renders = {
    dashboard: renderDashboard,
    ventas: renderVentas,
    menu: () => renderMenu('todos'),
    inventario: renderInventario,
    ingredientes: renderIngredientes,
    clientes: renderClientes,
    reportes: generarReporte,
    usuarios: renderUsuarios,
    ayuda: () => {},
    acerca: () => {},
    configuracion: () => {}
  };
  if (renders[page]) renders[page]();
}

/* ===== SIDEBAR TOGGLE ===== */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('mainContent');
  sidebar.classList.toggle('collapsed');
  main.classList.toggle('expanded');
}

/* ===== NOTIFICACIONES ===== */
function toggleNotifications() {
  document.getElementById('notifDropdown').classList.toggle('hidden');
  document.getElementById('userDropdown').classList.add('hidden');
}
function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('hidden');
  document.getElementById('notifDropdown').classList.add('hidden');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.header-notif')) document.getElementById('notifDropdown')?.classList.add('hidden');
  if (!e.target.closest('.header-user')) document.getElementById('userDropdown')?.classList.add('hidden');
});

/* ===== TOAST ===== */
function showToast(msg, type = 'success') {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ===== MODALES ===== */
function cerrarModal(id) {
  document.getElementById(id).classList.add('hidden');
}
function abrirModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

/* ===== DASHBOARD ===== */
function renderDashboard() {
  // Calcular estadísticas
  const today = hoy();
  const ventasHoy = ventas.filter(v => v.fecha === today);
  const totalHoy = ventasHoy.reduce((a, b) => a + b.total, 0);

  // Semana
  const semana = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    semana.push(d.toISOString().split('T')[0]);
  }
  const ventasSemana = ventas.filter(v => semana.includes(v.fecha));
  const totalSemana = ventasSemana.reduce((a, b) => a + b.total, 0);

  // Mes
  const mesActual = today.slice(0, 7);
  const ventasMes = ventas.filter(v => v.fecha.startsWith(mesActual));
  const totalMes = ventasMes.reduce((a, b) => a + b.total, 0);
  const ganancias = totalMes * 0.35;

  // Inventario bajo
  const bajosInv = productos.filter(p => p.cantidad <= 5).length;

  // Actualizar stats
  document.getElementById('statVentasDia').textContent = formatCurrency(totalHoy);
  document.getElementById('statVentasSemana').textContent = formatCurrency(totalSemana);
  document.getElementById('statVentasMes').textContent = formatCurrency(totalMes);
  document.getElementById('statGanancias').textContent = formatCurrency(ganancias);
  document.getElementById('statProductos').textContent = productos.length;
  document.getElementById('statInventarioBajo').textContent = bajosInv;

  // Últimas ventas
  const tbody = document.getElementById('ultimasVentasTable');
  const ultimas = ventas.slice(0, 6);
  tbody.innerHTML = ultimas.map(v => `
    <tr>
      <td><strong>#${v.factura}</strong></td>
      <td>${v.clienteNombre}</td>
      <td>${v.cajero}</td>
      <td>${v.items.length} producto(s)</td>
      <td><strong>${formatCurrency(v.total)}</strong></td>
      <td>${formatDate(v.fecha)}</td>
      <td><span class="badge badge-success"><i class="fas fa-check"></i> Completada</span></td>
    </tr>
  `).join('');

  // Gráficos
  setTimeout(() => {
    renderVentasChart(semana, ventasSemana);
    renderProductosChart();
  }, 100);
}

function renderVentasChart(semana, ventasSemana) {
  const canvas = document.getElementById('ventasChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const today = new Date();

  const datos = semana.map(fecha => {
    const total = ventasSemana.filter(v => v.fecha === fecha).reduce((a, b) => a + b.total, 0);
    return total || Math.floor(Math.random() * 300 + 100);
  });

  const labels = semana.map(fecha => {
    const d = new Date(fecha + 'T12:00:00');
    return days[d.getDay()];
  });

  const w = canvas.parentElement.clientWidth - 40 || 460;
  const h = 200;
  canvas.width = w;
  canvas.height = h;

  const maxVal = Math.max(...datos) * 1.2 || 500;
  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();
    ctx.fillStyle = '#999';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrency(maxVal - (maxVal / 4) * i).replace('C$ ', 'C$'), pad.left - 6, y + 4);
  }

  // Area fill
  const pts = datos.map((val, i) => ({
    x: pad.left + (chartW / (datos.length - 1)) * i,
    y: pad.top + chartH - (val / maxVal) * chartH
  }));

  const gradient = ctx.createLinearGradient(0, pad.top, 0, h);
  gradient.addColorStop(0, 'rgba(39,174,96,0.3)');
  gradient.addColorStop(1, 'rgba(39,174,96,0.02)');

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pad.top + chartH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // Points
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#27ae60';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#555';
    ctx.font = 'bold 10px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('C$' + datos[i], p.x, p.y - 12);
  });

  // Labels
  labels.forEach((l, i) => {
    const x = pad.left + (chartW / (labels.length - 1)) * i;
    ctx.fillStyle = '#777';
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(l, x, h - 8);
  });
}

function renderProductosChart() {
  const canvas = document.getElementById('productosChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Contar ventas por categoría
  const catCount = {};
  ventas.forEach(v => {
    v.items.forEach(item => {
      const prod = productos.find(p => p.id === item.id);
      const cat = prod ? prod.categoria : 'Otro';
      catCount[cat] = (catCount[cat] || 0) + item.cantidad;
    });
  });

  const labels = Object.keys(catCount);
  const data = Object.values(catCount);
  const colors = ['#27ae60', '#e67e22', '#2980b9', '#8e44ad', '#e74c3c', '#16a085'];
  const total = data.reduce((a, b) => a + b, 0);

  const w = canvas.parentElement.clientWidth - 40 || 260;
  const h = 200;
  canvas.width = w;
  canvas.height = h;

  const cx = w / 2 - 40;
  const cy = h / 2;
  const radius = Math.min(cx, cy) - 10;

  ctx.clearRect(0, 0, w, h);

  let startAngle = -Math.PI / 2;
  data.forEach((val, i) => {
    const slice = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += slice;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#333';
  ctx.font = 'bold 18px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 2);
  ctx.font = '11px Segoe UI';
  ctx.fillStyle = '#999';
  ctx.fillText('vendidos', cx, cy + 16);

  // Legend
  labels.forEach((label, i) => {
    const lx = w - 110;
    const ly = 20 + i * 28;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(lx, ly, 14, 14);
    ctx.fillStyle = '#444';
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'left';
    ctx.fillText(label + ' (' + data[i] + ')', lx + 20, ly + 11);
  });
}

/* ===== VENTAS ===== */
function renderVentas() {
  renderProductosVenta();
  renderCarrito();
  renderHistorialVentas();
  poblarClientesSelect();
}

function poblarClientesSelect() {
  const sel = document.getElementById('ventaCliente');
  if (!sel) return;
  sel.innerHTML = '<option value="consumidor">Consumidor Final</option>';
  clientes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nombre;
    sel.appendChild(opt);
  });
}

function buscarProductosVenta() {
  const q = document.getElementById('ventasSearch').value.toLowerCase();
  renderProductosVenta(q);
}

function renderProductosVenta(query = '') {
  const grid = document.getElementById('productosVentaGrid');
  if (!grid) return;
  const filtrados = productos.filter(p =>
    p.disponible &&
    (p.nombre.toLowerCase().includes(query) || p.categoria.toLowerCase().includes(query))
  );

  if (filtrados.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;font-size:13px;">No se encontraron productos</p>';
    return;
  }

  grid.innerHTML = filtrados.map(p => `
    <div class="producto-venta-card" onclick="agregarAlCarrito(${p.id})" title="Agregar ${p.nombre}">
      <div class="pv-emoji">${p.emoji}</div>
      <div class="pv-name">${p.nombre}</div>
      <div class="pv-cat">${p.categoria}</div>
      <div class="pv-price">${formatCurrency(p.precio)}</div>
    </div>
  `).join('');
}

function agregarAlCarrito(prodId) {
  const prod = productos.find(p => p.id === prodId);
  if (!prod) return;

  const existing = carrito.find(c => c.id === prodId);
  if (existing) {
    existing.cantidad++;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }

  renderCarrito();
  updateCartBadge();
  showToast(prod.nombre + ' agregado al carrito', 'success');
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const total = carrito.reduce((a, b) => a + b.cantidad, 0);
  if (badge) badge.textContent = total;
}

function renderCarrito() {
  const container = document.getElementById('carritoItems');
  if (!container) return;

  if (carrito.length === 0) {
    container.innerHTML = `
      <div class="carrito-empty">
        <i class="fas fa-shopping-cart"></i>
        <p>El carrito está vacío</p>
        <small>Busca y agrega productos</small>
      </div>`;
    updateTotales();
    return;
  }

  container.innerHTML = carrito.map((item, idx) => `
    <div class="carrito-item">
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.nombre}</div>
        <div class="ci-price">${formatCurrency(item.precio)}</div>
      </div>
      <div class="ci-qty">
        <button class="qty-minus" onclick="cambiarCantidad(${idx}, -1)">-</button>
        <span>${item.cantidad}</span>
        <button class="qty-plus" onclick="cambiarCantidad(${idx}, 1)">+</button>
      </div>
      <div class="ci-subtotal">${formatCurrency(item.precio * item.cantidad)}</div>
      <button class="ci-del" onclick="eliminarDelCarrito(${idx})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');

  updateTotales();
}

function cambiarCantidad(idx, delta) {
  carrito[idx].cantidad += delta;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  renderCarrito();
  updateCartBadge();
}

function eliminarDelCarrito(idx) {
  carrito.splice(idx, 1);
  renderCarrito();
  updateCartBadge();
}

function limpiarCarrito() {
  carrito = [];
  renderCarrito();
  updateCartBadge();
  document.getElementById('montoRecibido').value = '';
  document.getElementById('cambioDisplay').textContent = 'C$ 0.00';
}

function updateTotales() {
  const subtotal = carrito.reduce((a, b) => a + (b.precio * b.cantidad), 0);
  document.getElementById('subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('totalVenta').textContent = formatCurrency(subtotal);
  calcularCambio();
}

function calcularCambio() {
  const total = carrito.reduce((a, b) => a + (b.precio * b.cantidad), 0);
  const recibido = parseFloat(document.getElementById('montoRecibido').value) || 0;
  const cambio = recibido - total;
  const display = document.getElementById('cambioDisplay');
  if (display) {
    display.textContent = cambio >= 0 ? formatCurrency(cambio) : 'Monto insuficiente';
    display.style.color = cambio >= 0 ? 'var(--primary)' : 'var(--danger)';
  }
}

function finalizarVenta() {
  if (carrito.length === 0) {
    showToast('Agrega productos al carrito', 'warning');
    return;
  }
  const total = carrito.reduce((a, b) => a + (b.precio * b.cantidad), 0);
  const recibido = parseFloat(document.getElementById('montoRecibido').value) || 0;
  if (recibido < total) {
    showToast('El monto recibido es insuficiente', 'error');
    return;
  }
  registrarVenta(total, recibido);
  generarFacturaVenta();
}

function registrarVenta(total, recibido) {
  const cambio = recibido - total;
  const sel = document.getElementById('ventaCliente');
  const clienteId = sel.value === 'consumidor' ? null : parseInt(sel.value);
  const clienteNombre = clienteId ? clientes.find(c => c.id === clienteId)?.nombre || 'Consumidor Final' : 'Consumidor Final';

  const nuevaVenta = {
    id: generateId(ventas),
    factura: generateFacturaNum(),
    clienteId,
    clienteNombre,
    cajero: currentUser.username,
    items: carrito.map(item => ({ id: item.id, nombre: item.nombre, emoji: item.emoji, precio: item.precio, cantidad: item.cantidad })),
    total,
    recibido,
    cambio,
    fecha: hoy(),
    hora: new Date().toLocaleTimeString('es-NI'),
    estado: 'completada'
  };

  ventas.unshift(nuevaVenta);

  // Actualizar cliente
  if (clienteId) {
    const cli = clientes.find(c => c.id === clienteId);
    if (cli) {
      cli.compras = (cli.compras || 0) + 1;
      cli.totalGastado = (cli.totalGastado || 0) + total;
      cli.ultimaVisita = hoy();
    }
  }

  // Descontar ingredientes
  carrito.forEach(item => {
    const prod = productos.find(p => p.id === item.id);
    if (prod && prod.ingredientes) {
      prod.ingredientes.forEach(ingName => {
        const ing = ingredientes.find(i => i.nombre === ingName);
        if (ing && ing.stock > 0) {
          ing.stock = Math.max(0, ing.stock - 0.1 * item.cantidad);
        }
      });
    }
  });

  registrarActividad('Registró venta #' + nuevaVenta.factura, 'Ventas');
  saveAll();

  carrito = [];
  updateCartBadge();
  showToast('Venta #' + nuevaVenta.factura + ' registrada exitosamente', 'success');
  renderHistorialVentas();
  updateTotales();
  document.getElementById('montoRecibido').value = '';
}

function generarFacturaVenta() {
  if (carrito.length === 0 && ventas.length === 0) {
    showToast('No hay venta para generar factura', 'warning');
    return;
  }

  let venta;
  if (carrito.length > 0) {
    const total = carrito.reduce((a, b) => a + (b.precio * b.cantidad), 0);
    const recibido = parseFloat(document.getElementById('montoRecibido')?.value) || 0;
    const sel = document.getElementById('ventaCliente');
    venta = {
      factura: 'PREV',
      clienteNombre: sel?.value === 'consumidor' ? 'Consumidor Final' : clientes.find(c => c.id === parseInt(sel.value))?.nombre || 'Consumidor Final',
      cajero: currentUser.username,
      items: carrito,
      total,
      recibido,
      cambio: recibido - total
    };
  } else {
    venta = ventas[0];
  }

  mostrarFactura(venta);
}

function mostrarFactura(venta) {
  document.getElementById('facturaNumero').textContent = venta.factura;
  const now = new Date();
  document.getElementById('facturaFecha').textContent = formatDate(hoy());
  document.getElementById('facturaHora').textContent = now.toLocaleTimeString('es-NI');
  document.getElementById('facturaCliente').textContent = venta.clienteNombre;
  document.getElementById('facturaCajero').textContent = venta.cajero;
  document.getElementById('facturaSubtotal').textContent = formatCurrency(venta.total);
  document.getElementById('facturaTotal').textContent = formatCurrency(venta.total);
  document.getElementById('facturaRecibido').textContent = formatCurrency(venta.recibido);
  document.getElementById('facturaCambio').textContent = formatCurrency(Math.max(0, venta.cambio));

  document.getElementById('facturaItems').innerHTML = venta.items.map((item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${item.emoji || ''} ${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>${formatCurrency(item.precio)}</td>
      <td>${formatCurrency(item.precio * item.cantidad)}</td>
    </tr>
  `).join('');

  abrirModal('modalFactura');
}

function renderHistorialVentas(query = '') {
  const tbody = document.getElementById('historialVentasTable');
  if (!tbody) return;
  const filtradas = query ? ventas.filter(v =>
    v.factura.includes(query) || v.clienteNombre.toLowerCase().includes(query.toLowerCase()) || v.cajero.toLowerCase().includes(query.toLowerCase())
  ) : ventas;

  tbody.innerHTML = filtradas.map(v => `
    <tr>
      <td><strong>#${v.factura}</strong></td>
      <td>${v.clienteNombre}</td>
      <td>${v.cajero}</td>
      <td>${formatCurrency(v.total)}</td>
      <td>${formatCurrency(v.recibido)}</td>
      <td>${formatCurrency(v.cambio)}</td>
      <td>${formatDate(v.fecha)}</td>
      <td>
        <button class="btn-icon view" onclick="mostrarFactura(ventas[${ventas.indexOf(v)}])" title="Ver factura">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filtrarHistorialVentas(q) {
  renderHistorialVentas(q);
}

function imprimirFactura() {
  window.print();
}

/* ===== MENÚ ===== */
function renderMenu(filtro) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  const filtrados = filtro === 'todos' ? productos : productos.filter(p => p.categoria === filtro);

  grid.innerHTML = filtrados.map(p => `
    <div class="menu-card">
      <div class="menu-card-img">${p.emoji}</div>
      <div class="menu-card-body">
        <div class="menu-card-cat">${p.categoria}</div>
        <div class="menu-card-name">${p.nombre}</div>
        <div class="menu-card-price">${formatCurrency(p.precio)}</div>
        <div class="menu-card-status">
          <span class="badge ${p.disponible ? 'badge-success' : 'badge-danger'}">
            ${p.disponible ? '<i class="fas fa-check"></i> Disponible' : '<i class="fas fa-times"></i> No disponible'}
          </span>
        </div>
        <div class="menu-card-actions">
          <button class="btn-outline btn-sm" onclick="verDetalleProducto(${p.id})">
            <i class="fas fa-eye"></i> Detalles
          </button>
          <button class="btn-primary btn-sm" onclick="agregarDesdeMenu(${p.id})">
            <i class="fas fa-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filtrarMenu(cat, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderMenu(cat);
}

function verDetalleProducto(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  productoModalActual = p;

  document.getElementById('modalProductoNombre').textContent = p.nombre;
  document.getElementById('modalProductoNombreH2').textContent = p.nombre;
  document.getElementById('modalProductoEmoji').textContent = p.emoji;
  document.getElementById('modalProductoCategoria').textContent = p.categoria;
  document.getElementById('modalProductoDescripcion').textContent = p.descripcion;
  document.getElementById('modalProductoPrecio').textContent = formatCurrency(p.precio);
  document.getElementById('modalProductoEstado').innerHTML = `<span class="badge ${p.disponible ? 'badge-success' : 'badge-danger'}">${p.disponible ? 'Disponible' : 'No disponible'}</span>`;
  document.getElementById('modalProductoIngredientes').innerHTML = (p.ingredientes || []).map(ing => `<li>${ing}</li>`).join('');
  abrirModal('modalProductoDetalle');
}

function agregarDesdeMenu(id) {
  agregarAlCarrito(id);
  showToast('Producto agregado al carrito', 'success');
  navigateTo('ventas', document.querySelector('[onclick*="ventas"]'));
}

function addFromModal() {
  if (productoModalActual) {
    agregarAlCarrito(productoModalActual.id);
    cerrarModal('modalProductoDetalle');
    navigateTo('ventas', document.querySelector('[onclick*="ventas"]'));
  }
}

/* ===== INVENTARIO ===== */
function renderInventario(query = '') {
  const tbody = document.getElementById('inventarioBody');
  if (!tbody) return;

  const filtrados = query
    ? productos.filter(p => p.nombre.toLowerCase().includes(query) || p.categoria.toLowerCase().includes(query) || p.codigo.toLowerCase().includes(query))
    : productos;

  tbody.innerHTML = filtrados.map(p => {
    const estado = p.cantidad === 0 ? 'Agotado' : p.cantidad <= 5 ? 'Stock Bajo' : 'Disponible';
    const estadoClass = p.cantidad === 0 ? 'badge-danger' : p.cantidad <= 5 ? 'badge-warning' : 'badge-success';
    return `
      <tr>
        <td><code>${p.codigo}</code></td>
        <td>${p.emoji} <strong>${p.nombre}</strong></td>
        <td><span class="badge badge-info">${p.categoria}</span></td>
        <td>${formatCurrency(p.precio)}</td>
        <td>
          <span style="font-weight:700;color:${p.cantidad <= 5 ? 'var(--danger)' : 'var(--text)'}">
            ${p.cantidad}
          </span>
        </td>
        <td><span class="badge ${estadoClass}"><i class="fas fa-circle" style="font-size:8px"></i> ${estado}</span></td>
        <td>
          <button class="btn-icon edit" onclick="editarInventario(${p.id})" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn-icon delete" onclick="eliminarInventario(${p.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');

  // Alertas
  const alertas = document.getElementById('inventarioAlertas');
  if (alertas) {
    const agotados = productos.filter(p => p.cantidad === 0);
    const bajos = productos.filter(p => p.cantidad > 0 && p.cantidad <= 5);
    alertas.innerHTML = '';
    if (agotados.length > 0) alertas.innerHTML += `<div class="alert alert-danger"><i class="fas fa-times-circle"></i> ${agotados.length} producto(s) agotado(s): ${agotados.map(p => p.nombre).join(', ')}</div>`;
    if (bajos.length > 0) alertas.innerHTML += `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> ${bajos.length} producto(s) con stock bajo: ${bajos.map(p => p.nombre).join(', ')}</div>`;
  }
}

function filtrarInventario(q) {
  renderInventario(q.toLowerCase());
}

function abrirModalInventario(id = null) {
  document.getElementById('modalInventarioTitle').textContent = id ? 'Editar Producto' : 'Agregar Producto';
  document.getElementById('invEditId').value = id || '';
  if (id) {
    const p = productos.find(x => x.id === id);
    if (p) {
      document.getElementById('invNombre').value = p.nombre;
      document.getElementById('invCategoria').value = p.categoria;
      document.getElementById('invPrecio').value = p.precio;
      document.getElementById('invCantidad').value = p.cantidad;
      document.getElementById('invDescripcion').value = p.descripcion || '';
      document.getElementById('invEmoji').value = p.emoji || '';
    }
  } else {
    document.getElementById('invNombre').value = '';
    document.getElementById('invCategoria').value = 'Batido';
    document.getElementById('invPrecio').value = '';
    document.getElementById('invCantidad').value = '';
    document.getElementById('invDescripcion').value = '';
    document.getElementById('invEmoji').value = '';
  }
  abrirModal('modalInventario');
}

function editarInventario(id) {
  abrirModalInventario(id);
}

function guardarInventario() {
  const nombre = document.getElementById('invNombre').value.trim();
  const categoria = document.getElementById('invCategoria').value;
  const precio = parseFloat(document.getElementById('invPrecio').value);
  const cantidad = parseInt(document.getElementById('invCantidad').value);
  const descripcion = document.getElementById('invDescripcion').value.trim();
  const emoji = document.getElementById('invEmoji').value.trim() || '📦';
  const editId = document.getElementById('invEditId').value;

  if (!nombre || isNaN(precio) || isNaN(cantidad)) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }

  if (editId) {
    const idx = productos.findIndex(p => p.id === parseInt(editId));
    if (idx !== -1) {
      productos[idx] = { ...productos[idx], nombre, categoria, precio, cantidad, descripcion, emoji, disponible: cantidad > 0 };
      showToast('Producto actualizado correctamente', 'success');
      registrarActividad('Editó producto: ' + nombre, 'Inventario');
    }
  } else {
    const catPrefix = { Batido: 'BAT', Ensalada: 'ENS', Fresco: 'FRE', Postre: 'POS', Fruta: 'FRU' };
    const prefix = catPrefix[categoria] || 'PRD';
    const count = productos.filter(p => p.categoria === categoria).length + 1;
    const codigo = prefix + '-' + String(count).padStart(3, '0');
    productos.push({
      id: generateId(productos), codigo, nombre, categoria, precio, cantidad, descripcion, emoji,
      ingredientes: [], disponible: cantidad > 0
    });
    showToast('Producto agregado correctamente', 'success');
    registrarActividad('Agregó producto: ' + nombre, 'Inventario');
  }

  saveAll();
  cerrarModal('modalInventario');
  renderInventario();
}

function eliminarInventario(id) {
  const p = productos.find(x => x.id === id);
  document.getElementById('confirmarMsg').textContent = '¿Eliminar el producto "' + p.nombre + '"?';
  document.getElementById('confirmarBtn').onclick = function() {
    productos = productos.filter(x => x.id !== id);
    saveAll();
    cerrarModal('modalConfirmar');
    renderInventario();
    showToast('Producto eliminado', 'success');
    registrarActividad('Eliminó producto: ' + p.nombre, 'Inventario');
  };
  abrirModal('modalConfirmar');
}

/* ===== INGREDIENTES ===== */
function renderIngredientes(query = '') {
  const tbody = document.getElementById('ingredientesBody');
  if (!tbody) return;

  const filtrados = query
    ? ingredientes.filter(i => i.nombre.toLowerCase().includes(query) || i.codigo.toLowerCase().includes(query))
    : ingredientes;

  tbody.innerHTML = filtrados.map(ing => {
    const estado = ing.stock === 0 ? 'Agotado' : ing.stock <= ing.minimo ? 'Stock Bajo' : 'Normal';
    const estadoClass = ing.stock === 0 ? 'badge-danger' : ing.stock <= ing.minimo ? 'badge-warning' : 'badge-success';
    return `
      <tr>
        <td><code>${ing.codigo}</code></td>
        <td>${ing.emoji} <strong>${ing.nombre}</strong></td>
        <td>${ing.unidad}</td>
        <td style="font-weight:700;color:${ing.stock <= ing.minimo ? 'var(--danger)' : 'var(--text)'}">${ing.stock} ${ing.unidad}</td>
        <td>${ing.minimo} ${ing.unidad}</td>
        <td>${formatCurrency(ing.costo)}</td>
        <td><span class="badge ${estadoClass}"><i class="fas fa-circle" style="font-size:8px"></i> ${estado}</span></td>
        <td>
          <button class="btn-icon edit" onclick="editarIngrediente(${ing.id})"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn-icon delete" onclick="eliminarIngrediente(${ing.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');

  document.getElementById('totalIngredientes').textContent = ingredientes.length;
  document.getElementById('ingredientesBajos').textContent = ingredientes.filter(i => i.stock > 0 && i.stock <= i.minimo).length;
  document.getElementById('ingredientesAgotados').textContent = ingredientes.filter(i => i.stock === 0).length;
}

function filtrarIngredientes(q) {
  renderIngredientes(q.toLowerCase());
}

function abrirModalIngrediente(id = null) {
  document.getElementById('modalIngredienteTitle').textContent = id ? 'Editar Ingrediente' : 'Agregar Ingrediente';
  document.getElementById('ingEditId').value = id || '';
  if (id) {
    const ing = ingredientes.find(i => i.id === id);
    if (ing) {
      document.getElementById('ingNombre').value = ing.nombre;
      document.getElementById('ingUnidad').value = ing.unidad;
      document.getElementById('ingStock').value = ing.stock;
      document.getElementById('ingMinimo').value = ing.minimo;
      document.getElementById('ingCosto').value = ing.costo;
      document.getElementById('ingEmoji').value = ing.emoji || '';
    }
  } else {
    ['ingNombre','ingStock','ingMinimo','ingCosto','ingEmoji'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('ingUnidad').value = 'kg';
  }
  abrirModal('modalIngrediente');
}

function editarIngrediente(id) {
  abrirModalIngrediente(id);
}

function guardarIngrediente() {
  const nombre = document.getElementById('ingNombre').value.trim();
  const unidad = document.getElementById('ingUnidad').value;
  const stock = parseFloat(document.getElementById('ingStock').value);
  const minimo = parseFloat(document.getElementById('ingMinimo').value);
  const costo = parseFloat(document.getElementById('ingCosto').value) || 0;
  const emoji = document.getElementById('ingEmoji').value.trim() || '🌿';
  const editId = document.getElementById('ingEditId').value;

  if (!nombre || isNaN(stock) || isNaN(minimo)) {
    showToast('Completa todos los campos obligatorios', 'error');
    return;
  }

  if (editId) {
    const idx = ingredientes.findIndex(i => i.id === parseInt(editId));
    if (idx !== -1) {
      ingredientes[idx] = { ...ingredientes[idx], nombre, unidad, stock, minimo, costo, emoji };
      showToast('Ingrediente actualizado', 'success');
    }
  } else {
    const num = ingredientes.length + 1;
    ingredientes.push({
      id: generateId(ingredientes),
      codigo: 'ING-' + String(num).padStart(3, '0'),
      nombre, unidad, stock, minimo, costo, emoji
    });
    showToast('Ingrediente agregado', 'success');
  }

  saveAll();
  cerrarModal('modalIngrediente');
  renderIngredientes();
}

function eliminarIngrediente(id) {
  const ing = ingredientes.find(i => i.id === id);
  document.getElementById('confirmarMsg').textContent = '¿Eliminar el ingrediente "' + ing.nombre + '"?';
  document.getElementById('confirmarBtn').onclick = function() {
    ingredientes = ingredientes.filter(i => i.id !== id);
    saveAll();
    cerrarModal('modalConfirmar');
    renderIngredientes();
    showToast('Ingrediente eliminado', 'success');
  };
  abrirModal('modalConfirmar');
}

/* ===== CLIENTES ===== */
function renderClientes(query = '') {
  const tbody = document.getElementById('clientesBody');
  if (!tbody) return;

  const filtrados = query
    ? clientes.filter(c => c.nombre.toLowerCase().includes(query) || c.telefono.includes(query) || c.correo.toLowerCase().includes(query))
    : clientes;

  tbody.innerHTML = filtrados.map((c, i) => {
    const esFrecuente = c.compras >= 10;
    return `
      <tr>
        <td>${i + 1}</td>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;flex-shrink:0">
              ${c.nombre.charAt(0)}
            </div>
            <strong>${c.nombre}</strong>
          </div>
        </td>
        <td>${c.telefono}</td>
        <td>${c.correo}</td>
        <td><strong>${c.compras}</strong> compras</td>
        <td>${formatDate(c.ultimaVisita)}</td>
        <td><span class="badge ${esFrecuente ? 'badge-purple' : 'badge-muted'}">${esFrecuente ? '⭐ Frecuente' : 'Regular'}</span></td>
        <td>
          <button class="btn-icon view" onclick="verHistorialCliente(${c.id})" title="Ver historial"><i class="fas fa-history"></i></button>
          <button class="btn-icon edit" onclick="editarCliente(${c.id})" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn-icon delete" onclick="eliminarCliente(${c.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');

  document.getElementById('totalClientes').textContent = clientes.length;
  document.getElementById('clientesFrecuentes').textContent = clientes.filter(c => c.compras >= 10).length;
  document.getElementById('totalComprasClientes').textContent = clientes.reduce((a, c) => a + c.compras, 0);
}

function filtrarClientes(q) {
  renderClientes(q.toLowerCase());
}

function abrirModalCliente(id = null) {
  document.getElementById('modalClienteTitle').textContent = id ? 'Editar Cliente' : 'Agregar Cliente';
  document.getElementById('cliEditId').value = id || '';
  if (id) {
    const c = clientes.find(x => x.id === id);
    if (c) {
      document.getElementById('cliNombre').value = c.nombre;
      document.getElementById('cliTelefono').value = c.telefono;
      document.getElementById('cliCorreo').value = c.correo;
      document.getElementById('cliDireccion').value = c.direccion || '';
    }
  } else {
    ['cliNombre','cliTelefono','cliCorreo','cliDireccion'].forEach(id => document.getElementById(id).value = '');
  }
  abrirModal('modalCliente');
}

function editarCliente(id) {
  abrirModalCliente(id);
}

function guardarCliente() {
  const nombre = document.getElementById('cliNombre').value.trim();
  const telefono = document.getElementById('cliTelefono').value.trim();
  const correo = document.getElementById('cliCorreo').value.trim();
  const direccion = document.getElementById('cliDireccion').value.trim();
  const editId = document.getElementById('cliEditId').value;

  if (!nombre || !telefono) {
    showToast('Nombre y teléfono son obligatorios', 'error');
    return;
  }

  if (editId) {
    const idx = clientes.findIndex(c => c.id === parseInt(editId));
    if (idx !== -1) {
      clientes[idx] = { ...clientes[idx], nombre, telefono, correo, direccion };
      showToast('Cliente actualizado', 'success');
    }
  } else {
    clientes.push({
      id: generateId(clientes), nombre, telefono, correo, direccion,
      compras: 0, ultimaVisita: hoy(), totalGastado: 0
    });
    showToast('Cliente registrado', 'success');
    registrarActividad('Registró cliente: ' + nombre, 'Clientes');
  }

  saveAll();
  poblarClientesSelect();
  cerrarModal('modalCliente');
  renderClientes();
}

function eliminarCliente(id) {
  const c = clientes.find(x => x.id === id);
  document.getElementById('confirmarMsg').textContent = '¿Eliminar al cliente "' + c.nombre + '"?';
  document.getElementById('confirmarBtn').onclick = function() {
    clientes = clientes.filter(x => x.id !== id);
    saveAll();
    cerrarModal('modalConfirmar');
    renderClientes();
    poblarClientesSelect();
    showToast('Cliente eliminado', 'success');
  };
  abrirModal('modalConfirmar');
}

function verHistorialCliente(id) {
  const c = clientes.find(x => x.id === id);
  document.getElementById('modalHistorialTitle').innerHTML = `<i class="fas fa-history"></i> Historial de Compras - ${c.nombre}`;
  const ventasCliente = ventas.filter(v => v.clienteId === id);
  document.getElementById('historialClienteBody').innerHTML = ventasCliente.length === 0
    ? '<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-muted)">No hay compras registradas</td></tr>'
    : ventasCliente.map(v => `
      <tr>
        <td><strong>#${v.factura}</strong></td>
        <td>${v.items.map(i => i.emoji + ' ' + i.nombre).join(', ')}</td>
        <td><strong>${formatCurrency(v.total)}</strong></td>
        <td>${formatDate(v.fecha)}</td>
      </tr>`).join('');
  abrirModal('modalHistorialCliente');
}

/* ===== REPORTES ===== */
function generarReporte() {
  const tipo = document.getElementById('reporteTipo')?.value || 'semanal';
  let filtradas = [];
  const today = hoy();

  if (tipo === 'diario') {
    filtradas = ventas.filter(v => v.fecha === today);
  } else if (tipo === 'semanal') {
    const semana = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      semana.push(d.toISOString().split('T')[0]);
    }
    filtradas = ventas.filter(v => semana.includes(v.fecha));
  } else if (tipo === 'mensual') {
    filtradas = ventas.filter(v => v.fecha.startsWith(today.slice(0, 7)));
  } else {
    filtradas = ventas.filter(v => v.fecha.startsWith(today.slice(0, 4)));
  }

  const totalVentas = filtradas.reduce((a, b) => a + b.total, 0);
  const ganancias = totalVentas * 0.35;
  const numVentas = filtradas.length;

  // Stats
  const statsEl = document.getElementById('reporteStats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="stat-card green">
        <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
        <div class="stat-info">
          <span class="stat-label">Total Ventas</span>
          <span class="stat-value">${formatCurrency(totalVentas)}</span>
          <span class="stat-change neutral"><i class="fas fa-shopping-cart"></i> ${numVentas} transacciones</span>
        </div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon"><i class="fas fa-coins"></i></div>
        <div class="stat-info">
          <span class="stat-label">Ganancias (35%)</span>
          <span class="stat-value">${formatCurrency(ganancias)}</span>
          <span class="stat-change positive"><i class="fas fa-arrow-up"></i> Estimado</span>
        </div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon"><i class="fas fa-receipt"></i></div>
        <div class="stat-info">
          <span class="stat-label">Transacciones</span>
          <span class="stat-value">${numVentas}</span>
          <span class="stat-change neutral">Período seleccionado</span>
        </div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
        <div class="stat-info">
          <span class="stat-label">Ticket Promedio</span>
          <span class="stat-value">${numVentas > 0 ? formatCurrency(totalVentas / numVentas) : 'C$ 0.00'}</span>
          <span class="stat-change neutral">Por venta</span>
        </div>
      </div>
    `;
  }

  // Top productos
  const conteo = {};
  filtradas.forEach(v => {
    v.items.forEach(item => {
      conteo[item.nombre] = (conteo[item.nombre] || 0) + item.cantidad;
    });
  });
  const topList = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxTop = topList.length ? topList[0][1] : 1;

  const topEl = document.getElementById('topProductosList');
  if (topEl) {
    topEl.innerHTML = topList.length === 0
      ? '<p style="padding:20px;color:var(--text-muted);text-align:center">Sin ventas en el período</p>'
      : topList.map(([name, qty], i) => `
        <div class="top-producto-item">
          <div class="top-rank ${['rank-1','rank-2','rank-3','rank-other','rank-other','rank-other'][i] || 'rank-other'}">${i + 1}</div>
          <div class="top-producto-info">
            <b>${name}</b>
            <small>${qty} unidades vendidas</small>
          </div>
          <div class="top-producto-bar">
            <div class="progress-bar">
              <div class="progress-fill" style="width:${(qty / maxTop) * 100}%"></div>
            </div>
          </div>
          <div class="top-ventas-count">${qty}</div>
        </div>
      `).join('');
  }

  // Tabla
  const tbody = document.getElementById('reporteVentasTable');
  if (tbody) {
    tbody.innerHTML = filtradas.length === 0
      ? '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted)">Sin ventas en el período seleccionado</td></tr>'
      : filtradas.map(v => `
        <tr>
          <td><strong>#${v.factura}</strong></td>
          <td>${v.clienteNombre}</td>
          <td>${v.cajero}</td>
          <td>${v.items.length} producto(s)</td>
          <td><strong>${formatCurrency(v.total)}</strong></td>
          <td>${formatDate(v.fecha)} ${v.hora || ''}</td>
        </tr>`).join('');
  }

  // Gráfico
  setTimeout(() => renderReporteChart(filtradas, tipo), 100);
}

function renderReporteChart(filtradas, tipo) {
  const canvas = document.getElementById('reporteChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let labels = [];
  let data = [];

  if (tipo === 'diario') {
    const horas = ['06','08','10','12','14','16','18','20'];
    labels = horas.map(h => h + ':00');
    data = horas.map(h => {
      return filtradas.filter(v => v.hora && v.hora.startsWith(h)).reduce((a, b) => a + b.total, 0) || Math.floor(Math.random() * 150);
    });
  } else if (tipo === 'semanal') {
    const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const semana = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      semana.push(d.toISOString().split('T')[0]);
    }
    labels = semana.map(fecha => {
      const d = new Date(fecha + 'T12:00:00');
      return days[d.getDay()];
    });
    data = semana.map(fecha => filtradas.filter(v => v.fecha === fecha).reduce((a, b) => a + b.total, 0) || Math.floor(Math.random() * 400 + 50));
  } else if (tipo === 'mensual') {
    for (let i = 1; i <= 30; i += 3) {
      labels.push('Día ' + i);
      data.push(Math.floor(Math.random() * 600 + 200));
    }
  } else {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    labels = months;
    data = months.map(() => Math.floor(Math.random() * 5000 + 1000));
  }

  const w = canvas.parentElement.clientWidth - 40 || 450;
  const h = 200;
  canvas.width = w;
  canvas.height = h;

  const maxVal = Math.max(...data) * 1.2 || 500;
  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barW = (chartW / data.length) * 0.6;

  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();
    ctx.fillStyle = '#999';
    ctx.font = '10px Segoe UI';
    ctx.textAlign = 'right';
    ctx.fillText('C$' + Math.round(maxVal - (maxVal / 4) * i), pad.left - 4, y + 4);
  }

  // Bars
  data.forEach((val, i) => {
    const x = pad.left + (chartW / data.length) * i + (chartW / data.length) * 0.2;
    const barH = (val / maxVal) * chartH;
    const y = pad.top + chartH - barH;

    const grad = ctx.createLinearGradient(0, y, 0, pad.top + chartH);
    grad.addColorStop(0, '#27ae60');
    grad.addColorStop(1, '#e67e22');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, barH, 4) : ctx.rect(x, y, barW, barH);
    ctx.fill();

    ctx.fillStyle = '#777';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, h - 10);
  });
}

function exportarReporte() {
  showToast('Reporte exportado correctamente', 'success');
}

/* ===== USUARIOS ===== */
function renderUsuarios() {
  const grid = document.getElementById('usuariosGrid');
  if (!grid) return;

  grid.innerHTML = usuarios.map(u => `
    <div class="usuario-card">
      <div class="usuario-avatar" style="background:${u.avatar}">
        <i class="fas fa-user"></i>
      </div>
      <div class="usuario-name">${u.nombre}</div>
      <div class="usuario-username">@${u.username}</div>
      <div class="usuario-correo">${u.correo}</div>
      <div class="usuario-rol">
        <span class="badge ${u.rol === 'admin' ? 'badge-success' : 'badge-info'}">
          ${u.rol === 'admin' ? '<i class="fas fa-crown"></i> Administrador' : '<i class="fas fa-user"></i> Cajero'}
        </span>
      </div>
      <div>
        <span class="badge ${u.estado === 'activo' ? 'badge-success' : 'badge-danger'}">
          ${u.estado === 'activo' ? '● Activo' : '● Inactivo'}
        </span>
      </div>
      <div class="usuario-last"><i class="fas fa-clock"></i> Último acceso: ${u.ultimoAcceso}</div>
      <div class="usuario-actions">
        ${currentUser.rol === 'admin' ? `
          <button class="btn-icon edit" onclick="editarUsuario(${u.id})" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn-icon toggle" onclick="toggleUsuario(${u.id})" title="${u.estado === 'activo' ? 'Desactivar' : 'Activar'}">
            <i class="fas fa-${u.estado === 'activo' ? 'ban' : 'check-circle'}"></i>
          </button>
          <button class="btn-icon delete" onclick="eliminarUsuario(${u.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Historial
  const tbody = document.getElementById('historialAccesosTable');
  if (tbody) {
    tbody.innerHTML = historialAccesos.slice(0, 20).map(h => `
      <tr>
        <td><strong>${h.usuario}</strong></td>
        <td>${h.rol}</td>
        <td>${h.accion}</td>
        <td>${h.modulo}</td>
        <td>${h.fecha}</td>
        <td><span class="badge ${h.estado === 'éxito' ? 'badge-success' : 'badge-danger'}">${h.estado}</span></td>
      </tr>
    `).join('');
  }
}

function abrirModalUsuario(id = null) {
  document.getElementById('modalUsuarioTitle').textContent = id ? 'Editar Usuario' : 'Crear Usuario';
  document.getElementById('usrEditId').value = id || '';
  if (id) {
    const u = usuarios.find(x => x.id === id);
    if (u) {
      document.getElementById('usrNombre').value = u.nombre;
      document.getElementById('usrUsername').value = u.username;
      document.getElementById('usrPassword').value = u.password;
      document.getElementById('usrRol').value = u.rol;
      document.getElementById('usrCorreo').value = u.correo;
      document.getElementById('usrEstado').value = u.estado;
    }
  } else {
    ['usrNombre','usrUsername','usrPassword','usrCorreo'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('usrRol').value = 'cajero';
    document.getElementById('usrEstado').value = 'activo';
  }
  abrirModal('modalUsuario');
}

function editarUsuario(id) {
  abrirModalUsuario(id);
}

function guardarUsuario() {
  const nombre = document.getElementById('usrNombre').value.trim();
  const username = document.getElementById('usrUsername').value.trim();
  const password = document.getElementById('usrPassword').value;
  const rol = document.getElementById('usrRol').value;
  const correo = document.getElementById('usrCorreo').value.trim();
  const estado = document.getElementById('usrEstado').value;
  const editId = document.getElementById('usrEditId').value;

  if (!nombre || !username || !password) {
    showToast('Nombre, usuario y contraseña son obligatorios', 'error');
    return;
  }

  const colors = ['#27ae60','#e67e22','#2980b9','#8e44ad','#e74c3c','#16a085'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  if (editId) {
    const idx = usuarios.findIndex(u => u.id === parseInt(editId));
    if (idx !== -1) {
      usuarios[idx] = { ...usuarios[idx], nombre, username, password, rol, correo, estado };
      showToast('Usuario actualizado', 'success');
    }
  } else {
    if (usuarios.find(u => u.username === username)) {
      showToast('El usuario ya existe', 'error');
      return;
    }
    usuarios.push({
      id: generateId(usuarios), nombre, username, password, rol, correo, estado,
      avatar: randomColor, ultimoAcceso: 'Nunca'
    });
    showToast('Usuario creado exitosamente', 'success');
    registrarActividad('Creó usuario: ' + username, 'Usuarios');
  }

  saveAll();
  cerrarModal('modalUsuario');
  renderUsuarios();
}

function toggleUsuario(id) {
  const u = usuarios.find(x => x.id === id);
  if (!u) return;
  if (u.id === currentUser.id) {
    showToast('No puedes desactivar tu propio usuario', 'warning');
    return;
  }
  u.estado = u.estado === 'activo' ? 'inactivo' : 'activo';
  saveAll();
  renderUsuarios();
  showToast('Usuario ' + (u.estado === 'activo' ? 'activado' : 'desactivado'), 'info');
}

function eliminarUsuario(id) {
  if (id === currentUser.id) {
    showToast('No puedes eliminar tu propio usuario', 'warning');
    return;
  }
  const u = usuarios.find(x => x.id === id);
  document.getElementById('confirmarMsg').textContent = '¿Eliminar al usuario "' + u.username + '"?';
  document.getElementById('confirmarBtn').onclick = function() {
    usuarios = usuarios.filter(x => x.id !== id);
    saveAll();
    cerrarModal('modalConfirmar');
    renderUsuarios();
    showToast('Usuario eliminado', 'success');
  };
  abrirModal('modalConfirmar');
}

/* ===== CONFIGURACIÓN ===== */
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('cf_darkMode', isDark);
  showToast(isDark ? 'Modo oscuro activado' : 'Modo claro activado', 'info');
}

function setThemeColor(color, btn) {
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.documentElement.style.setProperty('--primary', color);
  showToast('Color del tema actualizado', 'success');
}

function setFontSize(size) {
  document.documentElement.style.fontSize = size + 'px';
  showToast('Tamaño de fuente actualizado', 'info');
}

function confirmarReset() {
  document.getElementById('confirmarMsg').textContent = '¿Restablecer todos los datos del sistema? Se perderán todos los cambios.';
  document.getElementById('confirmarBtn').onclick = function() {
    localStorage.clear();
    cerrarModal('modalConfirmar');
    showToast('Sistema restablecido. Recargando...', 'warning');
    setTimeout(() => location.reload(), 1500);
  };
  abrirModal('modalConfirmar');
}

/* ===== AYUDA ===== */
function toggleFaq(item) {
  item.classList.toggle('open');
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
  // Restaurar modo oscuro
  if (localStorage.getItem('cf_darkMode') === 'true') {
    document.body.classList.add('dark');
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) toggle.checked = true;
  }

  // Cerrar modales con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
    }
  });

  // Cerrar modal al click fuera
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
  });
});
