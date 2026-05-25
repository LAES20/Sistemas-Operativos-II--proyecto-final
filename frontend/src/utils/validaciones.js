export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefono = (telefono) => {
  const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return regex.test(telefono) || telefono.length >= 7;
};

export const validarContrasena = (contrasena) => {
  return contrasena.length >= 8;
};

export const formatoFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES');
};

export const formatoTelefono = (telefono) => {
  if (!telefono) return '';
  const cleaned = telefono.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return telefono;
};

export const truncarTexto = (texto, longitud = 30) => {
  if (!texto) return '';
  return texto.length > longitud ? texto.slice(0, longitud) + '...' : texto;
};

export const generarColorAleatorio = () => {
  const colores = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
  return colores[Math.floor(Math.random() * colores.length)];
};
