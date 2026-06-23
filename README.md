# 📦 InvManager — Sistema de Gestión de Inventario

Proyecto desarrollado como parte de las Experiencias Formativas en Situaciones Reales de Trabajo (EFSRT) — CIBERTEC 2026.

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Spring Boot 3.3 · Java 21 · Maven |
| Base de datos | MySQL 8 · Flyway |
| Seguridad | Spring Security · JWT |
| Frontend | React 18 · Vite · TailwindCSS · React Query |
| Reportes | OpenPDF · Apache POI |
| Docs API | SpringDoc OpenAPI (Swagger UI) |

## 📁 Estructura del proyecto

```
inventario-app/
├── backend/          # API REST Spring Boot
│   ├── src/
│   │   ├── main/java/com/efsrt/inventario/
│   │   │   ├── config/         # Configuración de seguridad
│   │   │   ├── controller/     # Endpoints REST
│   │   │   ├── dto/            # Objetos de transferencia
│   │   │   ├── entity/         # Entidades JPA
│   │   │   ├── exception/      # Manejo de errores
│   │   │   ├── repository/     # Acceso a datos
│   │   │   ├── security/       # JWT + filtros
│   │   │   └── service/        # Lógica de negocio
│   │   └── resources/
│   │       └── db/migration/   # Scripts Flyway
│   └── pom.xml
└── frontend/         # SPA React
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```

## 🚀 Arranque local

### Requisitos
- JDK 21+
- Maven 3.9+
- MySQL 8+
- Node.js 20+

### Base de datos

```sql
CREATE DATABASE inventario_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Backend

```bash
cd backend
# Configurar credenciales en src/main/resources/application.properties
mvn spring-boot:run
```

API disponible en: `http://localhost:8080/api`  
Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend en: `http://localhost:5173`

## 🔐 Credenciales iniciales

| Email | Password | Rol |
|-------|----------|-----|
| admin@inventario.com | password | ADMIN |
| supervisor@inventario.com | password | SUPERVISOR |
| operario@inventario.com | password | OPERARIO |

## 📋 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/login | Login → JWT |
| GET | /productos | Listar productos |
| POST | /productos | Crear producto |
| PUT | /productos/{id} | Actualizar producto |
| DELETE | /productos/{id} | Eliminar producto |
| GET | /categorias | Listar categorías |
| POST | /movimientos | Registrar movimiento |
| GET | /dashboard | Métricas |
| GET | /reportes/productos/pdf | Exportar PDF |
| GET | /reportes/productos/excel | Exportar Excel |

## 🌐 Despliegue

| Servicio | Plataforma |
|----------|-----------|
| Base de datos | Aiven (MySQL) |
| Backend | Railway |
| Frontend | Vercel |

## 👥 Equipo

Desarrollado por estudiantes de Computación e Informática — CIBERTEC 2026.
