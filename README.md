# TestJavierJoya

Este proyecto es una solución fullstack basada en una arquitectura moderna y limpia, usando **.NET 8** para el backend y **React + Vite** para el frontend. Su propósito es servir como prueba técnica implementando buenas prácticas como arquitectura por capas, inyección de dependencias, DTOs, AutoMapper, autenticación con JWT, y pruebas unitarias.

---

## 🧱 Estructura del Proyecto

```
TestJavierJoya/
│
├── Backend/
│   ├── TestJavierJoya.API/           # API REST .NET 8
│   ├── TestJavierJoya.Application/   # Casos de uso y lógica de aplicación
│   ├── TestJavierJoya.Domain/        # Entidades del dominio
│   ├── TestJavierJoya.Infrastructure/# Acceso a datos, repositorios, servicios externos
│   └── TestJavierJoya.Tests/         # Pruebas unitarias con xUnit
│
│── Frontend/
│	├── src/
│	│   ├── api/                      # Configuración central de llamadas a API
│	│   ├── assets/                   # Recursos estáticos como imágenes
│	│   ├── components/               # Componentes reutilizables
│	│   │   ├── common/               # Carrusel de imágenes, paginador de tarjetas
│	│   │   ├── filters/              # Filtros para propietarios y propiedades
│	│   │   ├── owners/               # Componentes relacionados a propietarios
│	│   │   └── properties/           # Componentes de propiedades
│	│   ├── pages/                    # Vistas principales: Login, Owners, Properties
│	│   ├── routes/                   # Rutas públicas y privadas
│	│   ├── services/                 # Servicios para interacción con el backend
│	│   ├── types/                    # Tipos TypeScript (DTOs, modelos, etc.)
│	│   ├── App.tsx                   # Componente principal
│	│   └── main.tsx                  # Punto de entrada
│	├── tailwind.config.js           # Configuración Tailwind
│	├── vite.config.ts               # Configuración de Vite
│	└── package.json                 # Dependencias del frontend
```

---

## ⚙️ Tecnologías Usadas

### Backend (.NET 8)

- ASP.NET Core Web API
- Clean Architecture
- AutoMapper
- JWT Authentication
- xUnit para pruebas unitarias

### Frontend (React)

- React 18
- Vite (bundler)
- Axios (peticiones HTTP)
- React Router
- Tailwind CSS

---

## 🧩 Arquitectura del Backend

El backend implementa una arquitectura por capas inspirada en la **Arquitectura Limpia (Clean Architecture)**:

- **Domain:** Define entidades, interfaces y lógica empresarial pura.
- **Application:** Contiene casos de uso, DTOs, validaciones y servicios de aplicación.
- **Infrastructure:** Implementa acceso a base de datos, servicios externos y repositorios.
- **API:** Exposición de endpoints mediante ASP.NET Core Controllers.
- **Tests:** Pruebas unitarias aisladas para los casos de uso (Application Layer).

---

## 🚀 Cómo Ejecutarlo

### 📌 Requisitos

- .NET 8 SDK
- Node.js (18+)
- MongoDB

### 🖥️ Backend

1. Abre terminal en la carpeta `Backend`.

2. Restaura y compila el proyecto:

   ```bash
   dotnet restore
   dotnet build
   ```

3. Asegúrate de tener configurada tu cadena de conexión en `appsettings.Development.json`.

4. Aplica las migraciones y ejecuta:

   ```bash
      dotnet run --project TestJavierJoya.API
   ```

La API estará en: `https://localhost:5001` (o según configuración).

### 🌐 Frontend

1. Abre terminal en la carpeta `Frontend`.

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Ejecuta la aplicación:

   ```bash
   npm run dev
   ```

App disponible en: `http://localhost:5173`.

---

## ✅ Pruebas Unitarias

Las pruebas están ubicadas en `Backend/TestJavierJoya.Tests`.

### Ejecutar pruebas:

```bash
cd Backend/TestJavierJoya.Tests
dotnet test
```

Estas pruebas verifican la lógica de negocio aislada y algunos servicios en la capa de aplicación. Se utiliza xUnit como framework de pruebas.

---

## 🧪 Autenticación

- La autenticación se maneja mediante JWT.
- Para acceder a endpoints protegidos, se debe autenticar mediante el login y enviar el token en el header `Authorization: Bearer {token}`.

---

## 🎨 Estructura del Frontend

El frontend está implementado en **React** utilizando **Vite** como bundler. Usa TypeScript, TailwindCSS para estilos y una arquitectura modular bien organizada.

### 📁 Estructura de Carpetas

```
Frontend/
├── src/
│   ├── api/                      # Configuración central de llamadas a API
│   ├── assets/                   # Recursos estáticos como imágenes
│   ├── components/               # Componentes reutilizables
│   │   ├── common/               # Carrusel de imágenes, paginador de tarjetas
│   │   ├── filters/              # Filtros para propietarios y propiedades
│   │   ├── owners/               # Componentes relacionados a propietarios
│   │   └── properties/           # Componentes de propiedades
│   ├── pages/                    # Vistas principales: Login, Owners, Properties
│   ├── routes/                   # Rutas públicas y privadas
│   ├── services/                 # Servicios para interacción con el backend
│   ├── types/                    # Tipos TypeScript (DTOs, modelos, etc.)
│   ├── App.tsx                   # Componente principal
│   └── main.tsx                  # Punto de entrada
├── tailwind.config.js           # Configuración Tailwind
├── vite.config.ts               # Configuración de Vite
└── package.json                 # Dependencias del frontend
```

### 🔐 Manejo de Rutas y Autenticación

- Se utiliza `React Router` para manejar rutas.
- Las rutas protegidas usan `PrivateRoute.tsx`, que valida autenticación basada en JWT.
- El componente `Navbar` permite navegar según el estado de sesión.

### 📦 Llamadas a la API

Los servicios `AuthService.ts`, `OwnerService.ts` y `PropertyService.ts` encapsulan las llamadas HTTP usando Axios hacia el backend.


## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---
