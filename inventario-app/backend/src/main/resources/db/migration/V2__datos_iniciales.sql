-- Flyway V2: Datos iniciales (seed)
-- Password para todos: password (BCrypt)

INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES
                                                                ('Administrador', 'admin@inventario.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', true),
                                                                ('Supervisor Uno', 'supervisor@inventario.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SUPERVISOR', true),
                                                                ('Operario Uno', 'operario@inventario.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'OPERARIO', true);

INSERT INTO categorias (nombre, descripcion, activo) VALUES
                                                         ('Electrónica', 'Equipos y componentes electrónicos', true),
                                                         ('Herramientas', 'Herramientas manuales y eléctricas', true),
                                                         ('Papelería', 'Artículos de oficina y escritorio', true),
                                                         ('Limpieza', 'Productos de limpieza e higiene', true);

INSERT INTO productos (codigo, nombre, descripcion, ubicacion, imagen_url, stock_actual, stock_minimo, stock_maximo, categoria_id, activo) VALUES
                                                                                                                                               ('ELEC-001', 'Laptop HP 15', 'Laptop HP Core i5 15 pulgadas 8GB RAM', 'Almacén A - Estante 1', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 10, 3, 50, 1, true),
                                                                                                                                               ('ELEC-002', 'Mouse inalámbrico', 'Mouse óptico inalámbrico USB', 'Almacén A - Estante 2', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 25, 5, 100, 1, true),
                                                                                                                                               ('HERR-001', 'Taladro Bosch 500W', 'Taladro percutor 500W con maleta', 'Almacén B - Estante 1', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', 4, 5, 30, 2, true),
                                                                                                                                               ('PAPE-001', 'Resma papel A4', 'Papel bond A4 75gr 500 hojas', 'Almacén C - Estante 3', 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400', 50, 10, 200, 3, true),
                                                                                                                                               ('LIMP-001', 'Desinfectante spray 1L', 'Desinfectante multiusos 1 litro', 'Almacén C - Estante 4', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400', 3, 10, 100, 4, true);