-- Flyway V1: Creación inicial del esquema de inventario
-- Ejecuta automáticamente al iniciar la app si spring.flyway.enabled=true

CREATE TABLE IF NOT EXISTS categorias (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo      BOOLEAN      DEFAULT TRUE,
    created_at  DATETIME(6),
    updated_at  DATETIME(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    rol        ENUM('ADMIN', 'SUPERVISOR', 'OPERARIO') DEFAULT 'OPERARIO',
    activo     BOOLEAN  DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productos (
                                         id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         codigo        VARCHAR(50)     NOT NULL UNIQUE,
    nombre        VARCHAR(200)    NOT NULL,
    descripcion   VARCHAR(500),
    ubicacion     VARCHAR(300),
    imagen_url    VARCHAR(500),
    stock_actual  INT             NOT NULL DEFAULT 0,
    stock_minimo  INT             NOT NULL DEFAULT 5,
    stock_maximo  INT,
    categoria_id  BIGINT          NOT NULL,
    activo        BOOLEAN         DEFAULT TRUE,
    created_at    DATETIME(6),
    updated_at    DATETIME(6),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id     BIGINT                      NOT NULL,
    tipo            ENUM('ENTRADA', 'SALIDA')   NOT NULL,
    cantidad        INT                         NOT NULL,
    stock_anterior  INT                         NOT NULL,
    stock_posterior INT                         NOT NULL,
    motivo          VARCHAR(300),
    usuario_id      BIGINT                      NOT NULL,
    fecha_movimiento DATETIME                   NOT NULL,
    activo          BOOLEAN                     DEFAULT TRUE,
    created_at      DATETIME(6),
    updated_at      DATETIME(6),
    CONSTRAINT fk_movimiento_producto FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT fk_movimiento_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índices para mejorar rendimiento de consultas frecuentes
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_codigo    ON productos(codigo);
CREATE INDEX idx_movimientos_fecha   ON movimientos_inventario(fecha_movimiento);
CREATE INDEX idx_movimientos_tipo    ON movimientos_inventario(tipo);
