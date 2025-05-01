# Guía de Contribución

Esta guía explica el proceso para contribuir al monorepo basado en Turborepo, pnpm, Next.js y Spring Boot.

## Configuración del entorno de desarrollo

### Requisitos previos

- Node.js v22.14.0
- pnpm v10.7
- Java OpenJDK 17.0.12
- Maven v3.9.9

### Configuración inicial

1. Clona el repositorio:
   ```bash
   git clone https://github.com/darkmoon09032/SGTA.git
   cd SGTA
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

## Estructura del proyecto

```
SGTA
├── apps
│   ├── sgta-frontend   // Next.js frontend (TypeScript)
│   └── sgta-backend   // Spring Boot backend (Java)
└── packages
    └── config // Configuración compartida
```

## Comandos útiles

### Ejecutar en modo desarrollo

- Frontend (Next.js):
  ```bash
  pnpm dev --filter sgta-frontend
  ```

- Backend (Spring Boot):
  ```bash
  pnpm dev --filter sgta-backend
  ```

- Todo el monorepo:
  ```bash
  pnpm dev
  ```

### Construir y ejecutar con Docker

Para construir las imágenes Docker:

```
docker-compose build
```

Para iniciar los servicios:

```
docker-compose up
```

Para ejecutar en segundo plano:

```
docker-compose up -d
```

Para detener los servicios:

```
docker-compose down
```

