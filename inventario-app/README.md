# Sistema de Gestión de Inventario — EFSRT CIBERTEC 2026

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Spring Boot 3.3 · Java 21 · Maven |
| Base de datos | MySQL 8 · Flyway (migraciones) |
| Seguridad | Spring Security · JWT (jjwt 0.12) |
| Frontend | React 18 · Vite · TailwindCSS · React Query |
| Reportes | JasperReports · Apache POI |
| Docs API | SpringDoc OpenAPI (Swagger UI) |
| Testing | JUnit 5 · Mockito · MockMvc |

---

## Requisitos previos

- JDK 21+
- Maven 3.9+
- MySQL 8.0+
- Node.js 20+

---

## Arranque del backend

```bash
# 1. Crear base de datos en MySQL
mysql -u root -p
CREATE DATABASE inventario_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 2. Configurar credenciales en:
#    backend/src/main/resources/application.properties

# 3. Compilar y ejecutar
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
```

La API queda disponible en: http://localhost:8080/api  
Swagger UI: http://localhost:8080/api/swagger-ui.html

**Credenciales iniciales (seed V2):**
| Email | Password | Rol |
|-------|----------|-----|
| admin@inventario.com | Admin123! | ADMIN |
| supervisor@inventario.com | Admin123! | SUPERVISOR |
| operario@inventario.com | Admin123! | OPERARIO |

---

## Arranque del frontend

```bash
cd frontend
npm install
cp .env.example .env        # ajusta VITE_API_URL si es necesario
npm run dev
```

El frontend corre en: http://localhost:5173

---

## Estructura del proyecto

```
inventario-app/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/efsrt/inventario/
│       ├── config/           # SecurityConfig, CORS
│       ├── controller/       # REST controllers
│       ├── dto/
│       │   ├── request/      # Validación de entrada
│       │   └── response/     # Respuestas JSON
│       ├── entity/           # @Entity JPA (tablas)
│       ├── exception/        # Excepciones y handler global
│       ├── repository/       # JpaRepository + @Query
│       ├── security/jwt/     # JwtUtil + JwtAuthFilter
│       └── service/
│           └── impl/         # Lógica de negocio
│
├── frontend/
│   └── src/
│       ├── components/       # UI reutilizable
│       ├── context/          # AuthContext
│       ├── hooks/            # Custom hooks
│       ├── pages/            # Vistas por módulo
│       └── services/         # Llamadas a la API
│
└── .github/workflows/        # CI/CD (próximamente)
```

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/login | Iniciar sesión → JWT |
| GET | /productos | Listar con paginación y filtros |
| POST | /productos | Crear producto |
| PUT | /productos/{id} | Actualizar producto |
| DELETE | /productos/{id} | Eliminar (lógico) |
| GET | /productos/stock-bajo | Alertas de stock |
| POST | /movimientos | Registrar entrada/salida |
| GET | /dashboard | Métricas resumen |
| GET | /reportes/productos/pdf | Exportar PDF |
| GET | /reportes/productos/excel | Exportar Excel |

---

## Ejecutar tests

```bash
cd backend
mvn test
```
