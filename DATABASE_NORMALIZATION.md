# 📊 Documentación de Base de Datos - Normalización 3FN

## Introducción

La base de datos del sistema de Agenda de Contactos está normalizada hasta la **Tercera Forma Normal (3FN)**, asegurando integridad, eficiencia y eliminación de redundancias.

## Principios de Normalización

### Primera Forma Normal (1FN)
**Todos los atributos deben ser atómicos (indivisibles)**

### Segunda Forma Normal (2FN)
**Todos los atributos no clave deben depender completamente de la clave primaria**

### Tercera Forma Normal (3FN)
**No debe haber dependencias transitivas entre atributos no clave**

## 📋 Diseño de Tablas

### 1. Tabla `usuarios`

```sql
CREATE TABLE usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol ENUM('Administrador', 'Usuario estándar'),
  estado ENUM('activo', 'inactivo'),
  pregunta_secreta VARCHAR(255),
  respuesta_secreta VARCHAR(255),
  intentos_fallidos INT DEFAULT 0,
  bloqueado_hasta DATETIME,
  fecha_creacion TIMESTAMP,
  fecha_actualizacion TIMESTAMP
);
```

**Análisis 3FN:**
- ✅ **1FN**: Todos los atributos son atómicos
- ✅ **2FN**: Todos los atributos dependen completamente del id del usuario
- ✅ **3FN**: No hay dependencias transitivas

**Justificación:**
- `email` es único para permitir identificación única
- `rol` define permisos del usuario
- `pregunta_secreta` y `respuesta_secreta` para recuperación de contraseña
- `bloqueado_hasta` para seguridad contra ataques de fuerza bruta

---

### 2. Tabla `categorias`

```sql
CREATE TABLE categorias (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  color VARCHAR(7) DEFAULT '#3498db',
  icono VARCHAR(50) DEFAULT 'folder',
  predefinida BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP,
  fecha_actualizacion TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

**Análisis 3FN:**
- ✅ **1FN**: Todos los atributos son indivisibles
- ✅ **2FN**: Todo depende de (usuario_id, nombre)
- ✅ **3FN**: No existen dependencias transitivas
  - `color` depende de la categoría en sí, no de otra característica
  - `icono` depende de la categoría

**Justificación:**
- Separada de `usuarios` porque un usuario puede tener múltiples categorías
- `usuario_id` como FK asegura que cada categoría pertenece a un usuario
- `predefinida` identifica categorías del sistema vs personalizadas

---

### 3. Tabla `contactos`

```sql
CREATE TABLE contactos (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  direccion TEXT,
  ciudad VARCHAR(50),
  pais VARCHAR(50),
  fecha_nacimiento DATE,
  notas TEXT,
  imagen_url VARCHAR(255),
  favorito BOOLEAN DEFAULT FALSE,
  categoria_id VARCHAR(36),
  fecha_creacion TIMESTAMP,
  fecha_actualizacion TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
```

**Análisis 3FN:**
- ✅ **1FN**: Todos los atributos son atómicos
  - `direccion` es completa y no se divide
  - `notas` es un campo de texto único
- ✅ **2FN**: Todo depende completamente de `id`
  - No hay dependencia parcial con `usuario_id`
- ✅ **3FN**: Sin dependencias transitivas
  - `ciudad` y `pais` dependen del contacto, no de otro atributo
  - `favorito` depende solo del contacto

**Justificación:**
- Separada de `usuarios` (relación 1:N)
- `categoria_id` es opcional (ON DELETE SET NULL)
- Campos de ubicación (ciudad, pais) son independientes

---

### 4. Tabla `etiquetas`

```sql
CREATE TABLE etiquetas (
  id VARCHAR(36) PRIMARY KEY,
  contacto_id VARCHAR(36) NOT NULL,
  etiqueta VARCHAR(50) NOT NULL,
  fecha_creacion TIMESTAMP,
  FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);
```

**Análisis 3FN:**
- ✅ **1FN**: Etiqueta es un valor atómico
- ✅ **2FN**: Depende completamente de contacto_id
- ✅ **3FN**: No hay transitivas
  - `etiqueta` es una simple cadena

**Justificación:**
- Tabla separada para permitir múltiples etiquetas por contacto
- Relación N:N normalizada correctamente

---

### 5. Tabla `bitacora_auditoria`

```sql
CREATE TABLE bitacora_auditoria (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  accion VARCHAR(100) NOT NULL,
  tabla_afectada VARCHAR(50),
  registro_id VARCHAR(36),
  datos_antiguos JSON,
  datos_nuevos JSON,
  direccion_ip VARCHAR(45),
  user_agent TEXT,
  fecha_accion TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

**Análisis 3FN:**
- ✅ **1FN**: JSON es un tipo válido de datos atómicos en MySQL
- ✅ **2FN**: Depende completamente del id de auditoría
- ✅ **3FN**: Sin dependencias transitivas

**Justificación:**
- Tabla independiente para auditoría
- Registra todas las acciones del usuario
- JSON permite almacenar datos complejos de cambios

---

### 6. Tabla `papelera_contactos`

```sql
CREATE TABLE papelera_contactos (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  contacto_id VARCHAR(36) NOT NULL,
  datos_contacto JSON NOT NULL,
  fecha_eliminacion TIMESTAMP,
  fecha_expiracion TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

**Análisis 3FN:**
- ✅ **1FN**: datos_contacto es un JSON completo
- ✅ **2FN**: Depende completamente de su id
- ✅ **3FN**: Sin dependencias transitivas

**Justificación:**
- Tabla separada para implementar "soft delete"
- Permite recuperación de contactos eliminados
- Expiración automática después de 30 días

---

### 7. Tabla `respaldos`

```sql
CREATE TABLE respaldos (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  datos JSON NOT NULL,
  tipo_archivo VARCHAR(20),
  fecha_creacion TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

**Análisis 3FN:**
- ✅ **1FN**: JSON es atómico en contexto de MySQL
- ✅ **2FN**: Depende completamente del id
- ✅ **3FN**: Sin transitivas

---

### 8. Tabla `intentos_login_fallidos`

```sql
CREATE TABLE intentos_login_fallidos (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  direccion_ip VARCHAR(45),
  user_agent TEXT,
  fecha_intento TIMESTAMP
);
```

**Análisis 3FN:**
- ✅ **1FN**: email es atómico
- ✅ **2FN**: Depende del id del intento
- ✅ **3FN**: Sin dependencias transitivas

**Justificación:**
- Registro de intentos fallidos para seguridad
- No usa FK a usuarios (puede no estar registrado)

---

## 📊 Diagrama de Relaciones

```
usuarios (1) ─── (N) contactos
        │
        ├───(1) ─── (N) categorias
        │
        ├───(1) ─── (N) bitacora_auditoria
        │
        ├───(1) ─── (N) papelera_contactos
        │
        └───(1) ─── (N) respaldos

contactos (1) ─── (N) etiquetas
   │
   └──> categorias
```

---

## 🔐 Integridad Referencial

### Claves Foráneas Implementadas:

1. **contactos.usuario_id** → usuarios.id (ON DELETE CASCADE)
   - Si se elimina un usuario, se eliminan sus contactos

2. **contactos.categoria_id** → categorias.id (ON DELETE SET NULL)
   - Si se elimina una categoría, los contactos pierden la categoría

3. **categorias.usuario_id** → usuarios.id (ON DELETE CASCADE)
   - Las categorías se eliminan con el usuario

4. **etiquetas.contacto_id** → contactos.id (ON DELETE CASCADE)
   - Las etiquetas se eliminan con el contacto

5. **bitacora_auditoria.usuario_id** → usuarios.id (ON DELETE CASCADE)
   - El historial se elimina con el usuario

---

## 🎯 Beneficios de esta Normalización

| Beneficio | Detalle |
|-----------|---------|
| **Integridad** | Evita redundancias y inconsistencias |
| **Eficiencia** | Búsquedas rápidas con índices apropiados |
| **Mantenibilidad** | Cambios fáciles sin afectar otras tablas |
| **Escalabilidad** | Estructura preparada para crecimiento |
| **Seguridad** | FK aseguran relaciones válidas |

---

## 📈 Índices Implementados

```sql
-- Búsquedas rápidas
INDEX idx_email (email)
INDEX idx_usuario (usuario_id)
INDEX idx_telefono (telefono)
INDEX idx_nombre (nombre)
INDEX idx_favorito (favorito)

-- Ordenamiento eficiente
INDEX idx_fecha (fecha_creacion)
INDEX idx_fecha_accion (fecha_accion)
```

---

## ✅ Verificación de 3FN

Para cada tabla, verificamos:

1. ✅ Cada atributo contiene un solo valor (1FN)
2. ✅ Cada atributo no clave depende completamente de toda la clave primaria (2FN)
3. ✅ No hay dependencias entre atributos no clave (3FN)

La base de datos cumple con estos requisitos en todas sus tablas.

---

**Documentación generada: 2026-05-21**
**Normalización: Tercera Forma Normal (3FN)**
