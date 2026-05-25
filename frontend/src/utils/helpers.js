export const obtenerIniciales = (nombre) => {
  return nombre
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('') || 'NC';
};

export const generarColorPorNombre = (nombre) => {
  const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colores = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#c0392b'];
  return colores[hash % colores.length];
};

export const contarContactos = (contactos) => {
  return contactos?.length || 0;
};

export const agruparPorCategoria = (contactos) => {
  return contactos.reduce((acc, contacto) => {
    const categoria = contacto.categoria_nombre || 'Sin categoría';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(contacto);
    return acc;
  }, {});
};
