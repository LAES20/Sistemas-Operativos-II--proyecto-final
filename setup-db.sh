#!/bin/bash

# Script para crear la base de datos automáticamente sin necesidad de autenticación

echo "🔧 Creando base de datos y tablas..."

# Crear BD (sin contraseña, como socket)
mysql -u root << 'EOF'
CREATE DATABASE IF NOT EXISTS agenda_contactos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agenda_contactos;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol ENUM('Administrador', 'Usuario estándar') DEFAULT 'Usuario estándar',
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  pregunta_secreta VARCHAR(255),
  respuesta_secreta VARCHAR(255),
  intentos_fallidos INT DEFAULT 0,
  bloqueado_hasta DATETIME,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  color VARCHAR(7) DEFAULT '#3498db',
  icono VARCHAR(50) DEFAULT 'folder',
  predefinida BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  UNIQUE KEY unique_categoria_user (usuario_id, nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla contactos
CREATE TABLE IF NOT EXISTS contactos (
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
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
  INDEX idx_usuario (usuario_id),
  INDEX idx_categoria (categoria_id),
  INDEX idx_telefono (telefono),
  INDEX idx_nombre (nombre),
  INDEX idx_favorito (favorito)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla etiquetas
CREATE TABLE IF NOT EXISTS etiquetas (
  id VARCHAR(36) PRIMARY KEY,
  contacto_id VARCHAR(36) NOT NULL,
  etiqueta VARCHAR(50) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
  INDEX idx_contacto (contacto_id),
  UNIQUE KEY unique_etiqueta_contacto (contacto_id, etiqueta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla bitacora_auditoria
CREATE TABLE IF NOT EXISTS bitacora_auditoria (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  accion VARCHAR(100) NOT NULL,
  tabla_afectada VARCHAR(50),
  registro_id VARCHAR(36),
  datos_antiguos JSON,
  datos_nuevos JSON,
  direccion_ip VARCHAR(45),
  user_agent TEXT,
  fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  INDEX idx_fecha (fecha_accion),
  INDEX idx_accion (accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla papelera_contactos
CREATE TABLE IF NOT EXISTS papelera_contactos (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  contacto_id VARCHAR(36) NOT NULL,
  datos_contacto JSON NOT NULL,
  fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion TIMESTAMP GENERATED ALWAYS AS (DATE_ADD(fecha_eliminacion, INTERVAL 30 DAY)) STORED,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  INDEX idx_fecha_eliminacion (fecha_eliminacion),
  INDEX idx_fecha_expiracion (fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla respaldos
CREATE TABLE IF NOT EXISTS respaldos (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  tipo_respaldo ENUM('manual', 'automático') DEFAULT 'manual',
  datos JSON NOT NULL,
  fecha_respaldo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  INDEX idx_fecha (fecha_respaldo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla intentos_login_fallidos
CREATE TABLE IF NOT EXISTS intentos_login_fallidos (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36),
  email VARCHAR(100),
  intento INT DEFAULT 1,
  fecha_primer_intento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_ultimo_intento TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  bloqueado_hasta DATETIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_usuario (usuario_id),
  INDEX idx_bloqueado (bloqueado_hasta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla migraciones_ejecutadas
CREATE TABLE IF NOT EXISTS migraciones_ejecutadas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_migracion VARCHAR(255) UNIQUE NOT NULL,
  fecha_ejecucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar migraciones como ejecutadas
INSERT IGNORE INTO migraciones_ejecutadas (nombre_migracion) VALUES
('001_create_usuarios_table'),
('002_create_categorias_table'),
('003_create_contactos_table'),
('004_create_etiquetas_table'),
('005_create_bitacora_table'),
('006_create_papelera_table'),
('007_create_respaldos_table'),
('008_create_intentos_login_fallidos_table');

EOF

echo "✅ Base de datos creada exitosamente"
