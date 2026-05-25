import pool from '../config/database.js';

const migrations = [
  {
    name: '001_create_usuarios_table',
    up: `
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
    `
  },
  {
    name: '002_create_categorias_table',
    up: `
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
    `
  },
  {
    name: '003_create_contactos_table',
    up: `
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
    `
  },
  {
    name: '004_create_etiquetas_table',
    up: `
      CREATE TABLE IF NOT EXISTS etiquetas (
        id VARCHAR(36) PRIMARY KEY,
        contacto_id VARCHAR(36) NOT NULL,
        etiqueta VARCHAR(50) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE,
        INDEX idx_contacto (contacto_id),
        UNIQUE KEY unique_etiqueta_contacto (contacto_id, etiqueta)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: '005_create_bitacora_table',
    up: `
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
        INDEX idx_accion (accion),
        INDEX idx_fecha (fecha_accion)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: '006_create_papelera_table',
    up: `
      CREATE TABLE IF NOT EXISTS papelera_contactos (
        id VARCHAR(36) PRIMARY KEY,
        usuario_id VARCHAR(36) NOT NULL,
        contacto_id VARCHAR(36) NOT NULL,
        datos_contacto JSON NOT NULL,
        fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_expiracion TIMESTAMP DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY)),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id),
        INDEX idx_fecha_eliminacion (fecha_eliminacion),
        INDEX idx_expiracion (fecha_expiracion)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: '007_create_respaldo_table',
    up: `
      CREATE TABLE IF NOT EXISTS respaldos (
        id VARCHAR(36) PRIMARY KEY,
        usuario_id VARCHAR(36) NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        datos JSON NOT NULL,
        tipo_archivo VARCHAR(20),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id),
        INDEX idx_fecha (fecha_creacion)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  },
  {
    name: '008_create_intentos_fallidos_table',
    up: `
      CREATE TABLE IF NOT EXISTS intentos_login_fallidos (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        direccion_ip VARCHAR(45),
        user_agent TEXT,
        fecha_intento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_fecha (fecha_intento)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `
  }
];

async function runMigrations() {
  try {
    console.log('🔧 Iniciando migraciones de base de datos...');
    const connection = await pool.getConnection();

    // Crear tabla de migraciones si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migraciones_ejecutadas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) UNIQUE NOT NULL,
        fecha_ejecucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ejecutar migraciones pendientes
    for (const migration of migrations) {
      const [existing] = await connection.execute(
        'SELECT * FROM migraciones_ejecutadas WHERE nombre = ?',
        [migration.name]
      );

      if (existing.length === 0) {
        try {
          console.log(`⏳ Ejecutando migración: ${migration.name}`);
          await connection.execute(migration.up);
          await connection.execute(
            'INSERT INTO migraciones_ejecutadas (nombre) VALUES (?)',
            [migration.name]
          );
          console.log(`✅ Migración completada: ${migration.name}`);
        } catch (error) {
          console.error(`❌ Error en migración ${migration.name}:`, error.message);
          throw error;
        }
      } else {
        console.log(`⏭️  Migración ya ejecutada: ${migration.name}`);
      }
    }

    connection.release();
    console.log('✅ Todas las migraciones completadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en las migraciones:', error);
    process.exit(1);
  }
}

export default runMigrations;
