# Localía - Backend  
## https://github.com/FranB84/localia-back.git

---

## Curso
Desarrollo de Aplicaciones Interactivas II

## Universidad
Universidad de Costa Rica (UCR)

## Estudiantes
Laura Arroyo  
Franciny Bonilla  
Carlos Sandoval  

## Profesor
Jorge Miranda Loría

## Fecha
06-07-2025

---
## 2. Introducción
Este proyecto corresponde al backend de la aplicación web Localía. Su objetivo es gestionar la lógica de negocio, procesar las solicitudes realizadas por el frontend y administrar la información almacenada en la base de datos. Para ello, expone una API que permite realizar operaciones como el registro y autenticación de usuarios, la gestión de negocios y la consulta de información necesaria para el funcionamiento de la plataforma.
---


## 3. Tecnologías usadas

### Runtime & Lenguaje
- **Node.js** — entorno de ejecución
- **TypeScript 6.0.3** — tipado estático

### Framework & Servidor
- **Express.js 5.2.1** — framework HTTP
- **Morgan 1.10.1** — logging de requests
- **Helmet 8.2.0** — headers de seguridad
- **CORS 2.8.6** — manejo de cross-origin requests

### Base de datos
- **PostgreSQL** — base de datos relacional (hosteada en Neon)
- **Drizzle ORM 0.45.2** — ORM para queries y schema
- **Drizzle Kit 0.31.10** — migraciones y studio
- **Drizzle Zod 0.8.3** — generación de schemas de validación

### Autenticación & Seguridad
- **Jose 6.2.3** — generación y verificación de JWT
- **Bcrypt 6.0.0** — hasheo de contraseñas

### Validación
- **Zod 4.4.3** — validación de datos en rutas

### Herramientas de desarrollo
- **Biome 2.5.0** — linter y formatter
- **Nodemon 3.1.14** — recarga automática en desarrollo
- **ts-node 10.9.2** — ejecución de TypeScript sin compilar
---

