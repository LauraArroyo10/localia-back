## 1. Uso de inteligencia artificial



### Herramientas usadas
-ChatGPT
-Claude
-Copilot
-Gemini


### Para qué se usó

- Depuracion de bugs
- Revision de nombres de variables y datos incongruentes
- Resolver dudas
- Entender errores
- Investigacion de funciones y conceptos nuevos
- Revision de código
- Sugerencias de arquitectura y practicas de programacion
- Investigacion de librerias
- Generacion de mockdata
- Sugerencias de detalles esteticos 
---

### Ejemplos de prompts

---
### 1

Estoy desarrollando un proyecto con la siguiente arquitectura:

Frontend:
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Flowbite
- Flowbite React
- Zustand (manejo de estado global)
- TanStack Router
- React Router DOM (presente actualmente en el proyecto)
- React Icons
- Sonner (notificaciones)
- Leaflet
- React Leaflet
- Firebase
- SVGR (importación de SVG como componentes React)

Backend:
- Node.js
- Express.js v5
- TypeScript
- Zod
- Drizzle ORM
- Drizzle Zod
- PostgreSQL Driver (pg)
- Multer (subida de archivos)
- JOSE (autenticación y JWT)
- Bcrypt (hash de contraseñas)
- Helmet (seguridad)
- CORS
- Dotenv
- Morgan (logging)

Base de datos:
- Neon PostgreSQL

---
### 2

Quiero que toda la respuesta esté basada principalmente en la documentación oficial de TanStack, siguiendo las mejores prácticas recomendadas por el equipo de TanStack.

Estos son los archivos actuales de mi proyecto que sirven como referencia para entender mi estructura:

[Pegar archivo(s)]

Mi objetivo es integrar TanStack correctamente dentro de este proyecto.

Necesito que respondas lo siguiente:

1. Analiza la estructura de mi proyecto y determina cuál sería la forma más óptima, moderna y utilizada por la comunidad para integrar TanStack.

2. Explica paso a paso cómo debería realizar la implementación.

3. Indica exactamente qué paquetes debo instalar y por qué son necesarios.

4. Si debo crear nuevos archivos (por ejemplo providers, configuración, hooks, utilidades, etc.), indica:
   - nombre del archivo
   - ubicación
   - responsabilidad
   - cómo se conecta con el resto del proyecto

5. Explica cómo se relacionan todos los archivos entre sí después de la implementación, mostrando el flujo completo desde que inicia la aplicación hasta que un componente utiliza TanStack.

6. Describe la arquitectura recomendada actualmente según la documentación oficial de TanStack y explica por qué es la opción más utilizada.

7. Explica los conceptos importantes involucrados en la implementación.

8. Muestra cómo utilizar TanStack dentro de componentes React.

10. Si existen varias formas de implementar TanStack, compáralas e indica cuál es la más recomendada actualmente según la documentación oficial y las prácticas más utilizadas por la comunidad.

11. Si detectas aspectos de mi arquitectura que podrían mejorarse, indícalos y justifica cada recomendación.

Cuando cites una práctica o recomendación, indica si proviene de la documentación oficial de TanStack o si corresponde a una convención ampliamente adoptada por la comunidad.

---
### 3

Quiero que revises **todo el proyecto** y realices únicamente cambios relacionados con el formato y las reglas de Biome.

Objetivos:

1. Corrige todos los errores, advertencias y problemas reportados por Biome.

2. Aplica automáticamente el formato recomendado por Biome en todos los archivos del proyecto.

3. Respeta el estilo oficial de Biome. No utilices reglas provenientes de ESLint, Prettier u otros formateadores si entran en conflicto con Biome.

4. No modifiques la lógica del programa. Los cambios deben limitarse a:
   - formato
   - indentación
   - espacios
   - comillas
   - punto y coma (si aplica)
   - orden de imports
   - imports innecesarios
   - variables sin usar
   - código muerto cuando Biome lo marque
   - pequeños cambios sintácticos sugeridos por Biome que no alteren el comportamiento.

5. Mantén la funcionalidad exactamente igual.

6. Si un archivo ya cumple con las reglas de Biome, no lo modifiques.

7. Si un cambio puede alterar el comportamiento del programa, no lo apliques.

8. Conserva la arquitectura, nombres de archivos, organización de carpetas y estilo del proyecto.

9. Antes de finalizar cada archivo, verifica que no queden advertencias ni errores de Biome.

10. Trabaja archivo por archivo hasta dejar todo el proyecto completamente compatible con Biome.

La prioridad es que el proyecto quede limpio, consistente y sin errores de formato o lint según Biome, sin introducir cambios funcionales.

---
### 4

Estoy desarrollando una aplicación con React, TanStack Router, Zustand y un backend en Express. Tengo un problema con el flujo de registro de usuarios con rol "seller". Cuando un usuario se registra por primera vez, es redirigido automáticamente al Dashboard. Sin embargo, en ese primer ingreso no aparecen los productos destacados, el botón "View all products" ni la sección de reseñas. Si el usuario cierra sesión e inicia sesión nuevamente con las mismas credenciales, todo aparece correctamente.

En el Dashboard renderizo esas secciones solo si existe "user.business.id", obtenido desde el estado de autenticación (useAuth). Durante ese primer ingreso, "user.role" es "seller", pero "user.business.id" es "undefined". Después de volver a iniciar sesión, "user.business.id" ya tiene un valor y todo funciona correctamente.

¿Cuál podría ser el problema, y como se podría solucionar?

---
### 5

Estoy trabajando en el backend de una aplicación con Express. Las imágenes se suben correctamente y la ruta se guarda en la base de datos. Además, si copio la URL de una imagen y la abro directamente en el navegador, la imagen se muestra sin problemas. Sin embargo, cuando el frontend intenta cargar esa misma imagen, no se ve y en la consola del navegador aparece un error de "CORP (not same-origin)". ¿Qué podría estar mal en la configuración del backend? ¿Qué archivos o configuraciones debería revisar para encontrar y solucionar el problema?

---
### 6

Una compañera me recomendó usar la librería Sonner para mostrar notificaciones en el proyecto de React, pero nunca la he utilizado. ¿Cómo se implementa en un proyecto? ¿Cómo se muestran las notificaciones y qué opciones ofrece la librería? También me gustaría saber cómo se pueden personalizar los mensajes, por ejemplo cambiar colores, bordes, duración, botones o  crear un diseño personalizado. Explícame cómo funciona la librería, cuáles son las formas más comunes de usarla y en qué casos conviene utilizar cada una. Incluye ejemplos sencillos para entender mejor cómo se usa.

---
### 7
