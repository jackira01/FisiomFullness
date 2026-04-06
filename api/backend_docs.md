# FisiomFullness — Referencia de Endpoints del Backend

> **Base URL:** `http://localhost:3000`
> **Puerto:** `3000`
> **Motor de base de datos:** MongoDB (Mongoose)
> **Almacenamiento de imágenes:** Cloudinary

---

## Convenciones Generales

### Autenticación

Las rutas protegidas requieren enviar un JWT en el header de la petición:

```
Authorization: Bearer <token>
```

El token se obtiene desde `POST /login`. Existen dos niveles de protección:

| Middleware | Descripción |
|---|---|
| `adminAuthMiddleware` | Solo usuarios con `role: "admin"` pueden acceder. |
| `authAll` | Cualquier usuario autenticado puede acceder (cualquier rol). |

### Subida de imágenes (`multipart/form-data`)

Los endpoints que gestionan imágenes **no reciben `application/json`**. Deben enviarse como `multipart/form-data`. El campo de la imagen siempre se llama **`myFile`**.

Los demás campos de texto se envían junto al formulario multipart (no en un body JSON separado).

### Códigos de respuesta estándar

| Código | Significado |
|---|---|
| `200 OK` | Operación exitosa. |
| `400 Bad Request` | Error de validación o error del servidor. |
| `401 Unauthorized` | Token ausente, expirado o sin permisos de admin. |
| `404 Not Found` | Recurso no encontrado. |

### Campos generados automáticamente

Todos los modelos generan los siguientes campos de forma automática. **No deben enviarse en el body.**

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | `String` | ID único (ObjectId en formato string). |
| `createdDate` | `Date` | Fecha de creación del documento. |
| `updatedDate` | `Date` | Fecha de la última actualización. |

---

## Guía de Población desde Cero

Para poblar el sistema completamente partiendo de una base de datos vacía, seguir este orden estricto para respetar las dependencias entre entidades:

```
1. Types        (sin dependencias)
2. Categories   (sin dependencias)
3. Users        (sin dependencias)
4. Login        (depende de: Users)
5. Blogs        (depende de: Types + Token admin)
6. Products     (depende de: Categories + Token admin)
7. Comments     (depende de: Users + Blogs)
```

---

## 1. Types (Tipos de Blog)

Los Types son etiquetas de categorización para los artículos del blog. **No tienen dependencias previas** y deben crearse antes que los blogs.

---

### `POST /types/create`

**Crea un nuevo tipo de blog.**

#### Request Body

```json
{
  "name": "Rehabilitación"
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `name` | `String` | Nombre descriptivo del tipo/categoría del blog (ej. "Nutrición", "Rehabilitación"). Se usa para filtrar y clasificar artículos. | ✅ Sí | — | No |

#### Guía de Población

> ⚡ **Sin prerrequisitos.** Este es el primer recurso que se puede crear en el sistema.

#### Respuesta Exitosa `200 OK`

```json
{
  "type": {
    "_id": "64f1a3c2e4b0a8d2f9c1b456",
    "name": "Rehabilitación",
    "createdDate": "2026-03-13T10:00:00.000Z",
    "updatedDate": "2026-03-13T10:00:00.000Z"
  }
}
```

---

### `GET /types/`

**Retorna todos los tipos. Acepta filtro por nombre como query param.**

#### Query Parameters (opcionales)

| Parámetro | Tipo | Descripción |
|---|---|---|
| `name` | `String` | Filtra los tipos cuyo nombre contenga el valor indicado (búsqueda case-insensitive). |

#### Ejemplo de petición con filtro

```
GET /types/?name=rehab
```

#### Respuesta Exitosa `200 OK`

```json
{
  "types": [
    {
      "_id": "64f1a3c2e4b0a8d2f9c1b456",
      "name": "Rehabilitación",
      "createdDate": "2026-03-13T10:00:00.000Z",
      "updatedDate": "2026-03-13T10:00:00.000Z"
    },
    {
      "_id": "64f1a3c2e4b0a8d2f9c1b789",
      "name": "Nutrición",
      "createdDate": "2026-03-13T10:05:00.000Z",
      "updatedDate": "2026-03-13T10:05:00.000Z"
    }
  ]
}
```

---

### `GET /types/:id`

**Retorna el detalle de un tipo específico por su ID.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del type a consultar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "type": {
    "_id": "64f1a3c2e4b0a8d2f9c1b456",
    "name": "Rehabilitación",
    "createdDate": "2026-03-13T10:00:00.000Z",
    "updatedDate": "2026-03-13T10:00:00.000Z"
  }
}
```

---

### `DELETE /types/delete/:id`

**Elimina permanentemente un tipo por su ID.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del type a eliminar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "the type with id 64f1a3c2e4b0a8d2f9c1b456 has been removed"
}
```

---

## 2. Categories (Categorías de Producto)

Las Categories son etiquetas para clasificar los productos de la tienda. **No tienen dependencias previas** y deben crearse antes que los productos.

---

### `POST /category/create`

**Crea una nueva categoría de producto.**

#### Request Body

```json
{
  "name": "Suplementos"
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `name` | `String` | Nombre descriptivo de la categoría de producto (ej. "Suplementos", "Equipamiento", "Ropa deportiva"). Define el grupo al que pertenece un producto. | ✅ Sí | — | No |

#### Guía de Población

> ⚡ **Sin prerrequisitos.** Puede crearse en cualquier momento sin depender de otros recursos.

#### Respuesta Exitosa `200 OK`

```json
{
  "newCategory": {
    "_id": "64f2b5d3e4b0a8d2f9c2c123",
    "name": "Suplementos",
    "createdDate": "2026-03-13T10:10:00.000Z",
    "updatedDate": "2026-03-13T10:10:00.000Z"
  }
}
```

---

### `GET /category/`

**Retorna todas las categorías. Acepta filtro por nombre.**

#### Query Parameters (opcionales)

| Parámetro | Tipo | Descripción |
|---|---|---|
| `name` | `String` | Filtra las categorías cuyo nombre contenga el valor indicado (búsqueda case-insensitive). |

#### Respuesta Exitosa `200 OK`

```json
{
  "categories": [
    {
      "_id": "64f2b5d3e4b0a8d2f9c2c123",
      "name": "Suplementos",
      "createdDate": "2026-03-13T10:10:00.000Z",
      "updatedDate": "2026-03-13T10:10:00.000Z"
    },
    {
      "_id": "64f2b5d3e4b0a8d2f9c2c456",
      "name": "Equipamiento",
      "createdDate": "2026-03-13T10:15:00.000Z",
      "updatedDate": "2026-03-13T10:15:00.000Z"
    }
  ]
}
```

---

### `GET /category/:id`

**Retorna el detalle de una categoría por su ID.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID de la categoría a consultar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "category": {
    "_id": "64f2b5d3e4b0a8d2f9c2c123",
    "name": "Suplementos",
    "createdDate": "2026-03-13T10:10:00.000Z",
    "updatedDate": "2026-03-13T10:10:00.000Z"
  }
}
```

---

### `DELETE /category/delete/:id`

**Elimina permanentemente una categoría por su ID.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID de la categoría a eliminar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "the category with id 64f2b5d3e4b0a8d2f9c2c123 has been removed"
}
```

---

## 3. Users (Usuarios)

Los usuarios son la entidad central del sistema. Se usan como autores de comentarios y como base para la autenticación.

> ⚠️ **Nota de seguridad:** La contraseña se almacena actualmente en texto plano en la creación de usuario. El sistema de login también compara en texto plano. Solo `POST /login/recover-password` hashea la contraseña con bcrypt al regenerarla.

---

### `POST /users/create`

**Crea un nuevo usuario. Acepta imagen de perfil opcional.**

> **Content-Type:** `multipart/form-data`

#### Campos del formulario

```
POST /users/create
Content-Type: multipart/form-data

email:     "usuario@ejemplo.com"
username:  "juan_fisio"
password:  "miPassword123"
firstname: "Juan"
lastname:  "García"
phone:     "+54911234567"
latitud:   -34.6037
longitud:  -58.3816
role:      "user"
myFile:    <archivo de imagen .jpg/.png>
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `email` | `String` | Correo electrónico del usuario. Sirve como identificador para el login y la recuperación de cuenta. Debe ser único en el sistema. | ✅ Sí | — | No |
| `username` | `String` | Nombre de usuario público. Se muestra en comentarios y perfil. Debe ser único en el sistema. | ✅ Sí | — | No |
| `password` | `String` | Contraseña del usuario. Actualmente se guarda en texto plano. | ✅ Sí | — | No |
| `firstname` | `String` | Nombre de pila del usuario. | No | `" "` | No |
| `lastname` | `String` | Apellido del usuario. | No | `" "` | No |
| `phone` | `String` | Número de teléfono del usuario (formato libre). | No | `""` | No |
| `latitud` | `Number` | Latitud geográfica de la ubicación del usuario, usada para mostrar su localización en el mapa. | No | `0` | No |
| `longitud` | `Number` | Longitud geográfica de la ubicación del usuario. | No | `0` | No |
| `role` | `String` | Rol del usuario en el sistema. Controla el acceso a rutas protegidas. Valores posibles: `"user"`, `"admin"`. | No | `"user"` | No |
| `myFile` | `File` | Imagen de perfil del usuario. Se sube a Cloudinary. Si no se envía, se usa la URL de imagen por defecto configurada en `URL_PROFILE_DEFAULT`. | No | URL de imagen por defecto | No |

#### Guía de Población

> ⚡ **Sin prerrequisitos.** Los usuarios se crean de forma independiente.
>
> 🔑 **Para crear el primer admin:** Crear un usuario con `role: "admin"`. El ID hardcodeado como admin protegido es `64c2d44f61cc7d6cec9d2abb`.

#### Respuesta Exitosa `200 OK`

```json
{
  "user": {
    "_id": "64f3c6e4e4b0a8d2f9c3d789",
    "email": "usuario@ejemplo.com",
    "username": "juan_fisio",
    "firstname": "Juan",
    "lastname": "García",
    "phone": "+54911234567",
    "latitud": -34.6037,
    "longitud": -58.3816,
    "role": "user",
    "status": true,
    "confirm": false,
    "token": "",
    "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/users/foto.jpg",
    "id_image": "FisiumFulness/users/foto",
    "createdDate": "2026-03-13T10:20:00.000Z",
    "updatedDate": "2026-03-13T10:20:00.000Z"
  }
}
```

---

### `GET /users/`

**Retorna todos los usuarios. Acepta filtro por email.**

#### Query Parameters (opcionales)

| Parámetro | Tipo | Descripción |
|---|---|---|
| `email` | `String` | Filtra los usuarios cuyo email contenga el valor indicado (búsqueda case-insensitive). |

#### Respuesta Exitosa `200 OK`

```json
{
  "users": [
    {
      "_id": "64f3c6e4e4b0a8d2f9c3d789",
      "email": "usuario@ejemplo.com",
      "username": "juan_fisio",
      "firstname": "Juan",
      "lastname": "García",
      "role": "user",
      "status": true,
      "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/users/foto.jpg",
      "createdDate": "2026-03-13T10:20:00.000Z",
      "updatedDate": "2026-03-13T10:20:00.000Z"
    }
  ]
}
```

---

### `GET /users/detail/:id`

**Retorna el detalle completo de un usuario por su ID.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del usuario a consultar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "user": {
    "_id": "64f3c6e4e4b0a8d2f9c3d789",
    "email": "usuario@ejemplo.com",
    "username": "juan_fisio",
    "firstname": "Juan",
    "lastname": "García",
    "phone": "+54911234567",
    "latitud": -34.6037,
    "longitud": -58.3816,
    "role": "user",
    "status": true,
    "confirm": false,
    "token": "",
    "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/users/foto.jpg",
    "id_image": "FisiumFulness/users/foto",
    "createdDate": "2026-03-13T10:20:00.000Z",
    "updatedDate": "2026-03-13T10:20:00.000Z"
  }
}
```

---

### `PUT /users/update/:id`

**Actualiza los datos de un usuario. Reemplaza la imagen si se envía una nueva.**

> **Content-Type:** `multipart/form-data`

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del usuario a actualizar. |

#### Campos del formulario

```
PUT /users/update/64f3c6e4e4b0a8d2f9c3d789
Content-Type: multipart/form-data

email:      "nuevo@ejemplo.com"
username:   "juan_fisio_v2"
password:   "nuevaPassword456"
firstname:  "Juan"
lastname:   "García López"
phone:      "+54911999888"
latitud:    -34.6000
longitud:   -58.4000
id_image:   "FisiumFulness/users/foto"
myFile:     <nuevo archivo de imagen (opcional)>
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `email` | `String` | Nuevo correo electrónico del usuario. | No | Sin cambio | No |
| `username` | `String` | Nuevo nombre de usuario. | No | Sin cambio | No |
| `password` | `String` | Nueva contraseña. | No | Sin cambio | No |
| `firstname` | `String` | Actualización del nombre. | No | Sin cambio | No |
| `lastname` | `String` | Actualización del apellido. | No | Sin cambio | No |
| `phone` | `String` | Actualización del teléfono. | No | Sin cambio | No |
| `latitud` | `Number` | Nueva latitud geográfica. | No | Sin cambio | No |
| `longitud` | `Number` | Nueva longitud geográfica. | No | Sin cambio | No |
| `id_image` | `String` | **Requerido si se envía una nueva imagen.** Es el ID de la imagen actual en Cloudinary para poder eliminarla antes de subir la nueva. | Solo si `myFile` presente | — | No |
| `myFile` | `File` | Nueva imagen de perfil. Si se envía, reemplaza la imagen anterior en Cloudinary. | No | Sin cambio | No |

#### Guía de Población

> 👤 **Prerrequisito:** El usuario con el `id` indicado debe existir (creado con `POST /users/create`).

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "User has been updated"
}
```

---

### `PATCH /users/status/:id`

**Activa o desactiva un usuario (soft delete / restauración).**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del usuario a modificar. |

#### Request Body

```json
{
  "status": false
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `status` | `Boolean` | Define si el usuario está activo (`true`) o desactivado (`false`). Un usuario desactivado no puede ser encontrado en las consultas de lista activa. | ✅ Sí | — | No |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "User has been deleted"
}
```

---

### `DELETE /users/delete/:id`

**Elimina permanentemente un usuario, su imagen de Cloudinary y todos sus comentarios.**

> ⚠️ **Operación destructiva e irreversible.** Los comentarios asociados al usuario también se eliminan en cascada.
>
> ⛔ El usuario con ID `64c2d44f61cc7d6cec9d2abb` (admin principal) no puede ser eliminado.

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del usuario a eliminar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "User has been deleted"
}
```

---

## 4. Login / Autenticación

Este módulo gestiona la autenticación de usuarios y la recuperación de contraseña. El token JWT generado aquí es necesario para acceder a las rutas protegidas de Blogs y Products.

---

### `POST /login`

**Autentica un usuario y retorna un JWT válido por 1 hora.**

> ⚠️ **Nota de seguridad:** La autenticación actual busca el usuario por `email` y `password` en texto plano directamente en la base de datos (sin `bcrypt.compare`). Esto significa que la contraseña almacenada en el documento de MongoDB debe coincidir literalmente con la enviada en el body.

#### Request Body

```json
{
  "email": "admin@fisiomfulness.com",
  "password": "miPassword123"
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `email` | `String` | Correo electrónico del usuario registrado. Utilizado como identificador primario de autenticación. | ✅ Sí | — | No |
| `password` | `String` | Contraseña del usuario. Se compara directamente contra el valor almacenado en la base de datos. | ✅ Sí | — | No |

#### Guía de Población

> 👤 **Prerrequisito:** El usuario debe existir previamente (creado con `POST /users/create`). Para acceder a rutas de admin, el usuario debe tener `role: "admin"`.

#### Respuesta Exitosa `200 OK`

```json
{
  "user": {
    "_id": "64f3c6e4e4b0a8d2f9c3d789",
    "email": "admin@fisiomfulness.com",
    "username": "admin",
    "firstname": "Administrador",
    "lastname": "Principal",
    "role": "admin",
    "status": true,
    "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/users/admin.jpg",
    "id_image": "FisiumFulness/users/admin",
    "createdDate": "2026-03-13T09:00:00.000Z",
    "updatedDate": "2026-03-13T09:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGYzYzZlNGU0YjBhOGQyZjljM2Q3ODkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDk3MjAwMDAsImV4cCI6MTcwOTcyMzYwMH0.FIRMA"
}
```

> 🔑 **El campo `token` es el que se debe usar en el header `Authorization: Bearer <token>` para las rutas protegidas.**

---

### `POST /login/recover-password`

**Genera una nueva contraseña aleatoria, la hashea con bcrypt, la guarda en el usuario y la envía por correo electrónico.**

#### Request Body

```json
{
  "email": "usuario@ejemplo.com"
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `email` | `String` | Correo electrónico del usuario que desea recuperar su cuenta. El sistema buscará al usuario por este campo y enviará la nueva contraseña al mismo. | ✅ Sí | — | No |

#### Guía de Población

> 👤 **Prerrequisito:** El usuario con ese email debe existir en el sistema.
>
> 📧 **Requiere configuración de SMTP:** Las variables de entorno `MAILHOST`, `MAILPORT`, `MAILUSER` y `MAILPASSWORD` deben estar disponibles en `.env.local` para que el correo se envíe correctamente.

#### Respuesta Exitosa `200 OK`

```
"Account recovery email sent"
```

---

## 5. Blogs

Los blogs son artículos de contenido del sitio. **Requieren un `type_id` existente** y **token JWT de admin** para operaciones de escritura.

---

### `POST /blogs/create`

**Crea un nuevo artículo de blog con imagen obligatoria.**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`
> **Content-Type:** `multipart/form-data`

#### Campos del formulario

```
POST /blogs/create
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

title:    "5 ejercicios para mejorar la postura"
text:     "<p>El dolor de espalda es uno de los problemas más comunes...</p>"
type_id:  "64f1a3c2e4b0a8d2f9c1b456"
createBy: "Dr. Juan García"
myFile:   <archivo de imagen .jpg/.png>
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `title` | `String` | Título del artículo. Se usa como encabezado principal y en filtros de búsqueda. | ✅ Sí | — | No |
| `text` | `String` | Contenido completo del artículo. Puede contener HTML (generado por el editor TipTap). | ✅ Sí | — | No |
| `type_id` | `String` | ID del Type al que pertenece el blog. Define la categoría del artículo y permite filtrado por tipo. | ✅ Sí | — | **FK → Type._id** |
| `createBy` | `String` | Nombre del autor o redactor del artículo. Campo de texto libre, no es FK a User. | ✅ Sí | — | No |
| `myFile` | `File` | Imagen de portada del artículo. Se sube a Cloudinary en la carpeta `FisiumFulness/blogs`. | ✅ Sí | — | No |

#### Guía de Población

> 📋 **Prerrequisito:** Debe existir al menos un **Type** creado (`POST /types/create`) para usar su `_id` como `type_id`.
>
> 🔑 **Prerrequisito:** Tener un token JWT de un usuario con `role: "admin"` (obtenido de `POST /login`).

#### Respuesta Exitosa `200 OK`

```json
{
  "blog": {
    "_id": "64f4d7f5e4b0a8d2f9c4e012",
    "title": "5 ejercicios para mejorar la postura",
    "text": "<p>El dolor de espalda es uno de los problemas más comunes...</p>",
    "type_id": "64f1a3c2e4b0a8d2f9c1b456",
    "createBy": "Dr. Juan García",
    "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/blogs/postura.jpg",
    "id_image": "FisiumFulness/blogs/postura",
    "status": true,
    "createdDate": "2026-03-13T11:00:00.000Z",
    "updatedDate": "2026-03-13T11:00:00.000Z"
  }
}
```

---

### `GET /blogs/`

**Retorna todos los blogs con `status: true`. Acepta filtro por título. Incluye el objeto `type_id` populado.**

#### Query Parameters (opcionales)

| Parámetro | Tipo | Descripción |
|---|---|---|
| `title` | `String` | Filtra los blogs cuyo título contenga el valor indicado (búsqueda case-insensitive). |

#### Respuesta Exitosa `200 OK`

```json
{
  "blogs": [
    {
      "_id": "64f4d7f5e4b0a8d2f9c4e012",
      "title": "5 ejercicios para mejorar la postura",
      "text": "<p>El dolor de espalda...</p>",
      "type_id": {
        "_id": "64f1a3c2e4b0a8d2f9c1b456",
        "name": "Rehabilitación"
      },
      "createBy": "Dr. Juan García",
      "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/blogs/postura.jpg",
      "status": true,
      "createdDate": "2026-03-13T11:00:00.000Z",
      "updatedDate": "2026-03-13T11:00:00.000Z"
    }
  ]
}
```

---

### `GET /blogs/detail/:id`

**Retorna el detalle de un blog por ID, con el campo `type_id` populado (solo el nombre).**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del blog a consultar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "blog": {
    "_id": "64f4d7f5e4b0a8d2f9c4e012",
    "title": "5 ejercicios para mejorar la postura",
    "text": "<p>El dolor de espalda es uno de los problemas más comunes...</p>",
    "type_id": {
      "_id": "64f1a3c2e4b0a8d2f9c1b456",
      "name": "Rehabilitación"
    },
    "createBy": "Dr. Juan García",
    "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/blogs/postura.jpg",
    "id_image": "FisiumFulness/blogs/postura",
    "status": true,
    "createdDate": "2026-03-13T11:00:00.000Z",
    "updatedDate": "2026-03-13T11:00:00.000Z"
  }
}
```

---

### `PUT /blogs/update/:id`

**Actualiza un blog existente. Si se envía una nueva imagen, reemplaza la anterior en Cloudinary.**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`
> **Content-Type:** `multipart/form-data`

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del blog a actualizar. |

#### Campos del formulario

```
PUT /blogs/update/64f4d7f5e4b0a8d2f9c4e012
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

title:    "10 ejercicios para mejorar la postura (actualizado)"
text:     "<p>Contenido actualizado del artículo...</p>"
type_id:  "64f1a3c2e4b0a8d2f9c1b456"
createBy: "Dr. Juan García"
id_image: "FisiumFulness/blogs/postura"
myFile:   <nueva imagen (opcional)>
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `title` | `String` | Nuevo título del blog. | No | Sin cambio | No |
| `text` | `String` | Nuevo contenido del blog (puede ser HTML). | No | Sin cambio | No |
| `type_id` | `String` | Nuevo tipo asociado al blog. | No | Sin cambio | **FK → Type._id** |
| `createBy` | `String` | Nuevo nombre del autor. | No | Sin cambio | No |
| `id_image` | `String` | **Requerido si se envía `myFile`.** ID de la imagen actual en Cloudinary para eliminarla antes de subir la nueva. | Solo si `myFile` presente | — | No |
| `myFile` | `File` | Nueva imagen de portada. Si se envía, reemplaza la imagen anterior en Cloudinary. | No | Sin cambio | No |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "Blog has been updated"
}
```

---

### `PATCH /blogs/status/:id`

**Activa o desactiva un blog (ocultar/publicar sin eliminar).**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del blog a modificar. |

#### Request Body

```json
{
  "status": false
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `status` | `Boolean` | Define si el blog es visible (`true`) o está oculto (`false`). Los blogs con `status: false` no aparecen en `GET /blogs/` pero sí en `GET /blogs/removed`. | ✅ Sí | — | No |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "the blog with id 64f4d7f5e4b0a8d2f9c4e012 has been removed"
}
```

---

### `DELETE /blogs/delete/:id`

**Elimina permanentemente un blog y su imagen de Cloudinary.**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`
> ⚠️ **Operación destructiva e irreversible.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del blog a eliminar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "blog has been deleted"
}
```

---

### `GET /blogs/removed`

**Retorna todos los blogs con `status: false` (archivados/ocultos). Con `type_id` populado.**

> **Sin autenticación requerida.**

#### Respuesta Exitosa `200 OK`

```json
{
  "blogRemoved": [
    {
      "_id": "64f4d7f5e4b0a8d2f9c4e012",
      "title": "Artículo archivado",
      "text": "<p>Contenido...</p>",
      "type_id": {
        "_id": "64f1a3c2e4b0a8d2f9c1b456",
        "name": "Rehabilitación"
      },
      "createBy": "Dr. Juan García",
      "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/blogs/postura.jpg",
      "status": false,
      "createdDate": "2026-03-13T11:00:00.000Z",
      "updatedDate": "2026-03-13T12:00:00.000Z"
    }
  ]
}
```

---

## 6. Products (Productos)

Los productos son artículos de la tienda del sitio. **Requieren una `category` existente** y **token JWT de admin** para operaciones de escritura.

---

### `POST /products/create`

**Crea un nuevo producto con imagen obligatoria.**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`
> **Content-Type:** `multipart/form-data`

#### Campos del formulario

```
POST /products/create
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

name:        "Proteína Whey Isolate 1kg"
price:       8500
stock:       50
description: "Proteína de suero de leche de alta calidad, ideal para recuperación muscular."
category:    "64f2b5d3e4b0a8d2f9c2c123"
myFile:      <archivo de imagen .jpg/.png>
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `name` | `String` | Nombre del producto tal como aparece en la tienda. | ✅ Sí | — | No |
| `price` | `Number` | Precio del producto en la moneda local (sin símbolo, valor numérico). | ✅ Sí | — | No |
| `stock` | `Number` | Cantidad disponible del producto en inventario. | ✅ Sí | — | No |
| `description` | `String` | Descripción detallada del producto. Se muestra en la página de detalle del producto. | ✅ Sí | — | No |
| `category` | `String` | ID de la categoría a la que pertenece el producto. Permite filtrado y agrupación en la tienda. | No | `null` | **FK → Category._id** |
| `myFile` | `File` | Imagen del producto. Se sube a Cloudinary en la carpeta `FisiumFulness/products`. | ✅ Sí | — | No |

#### Guía de Población

> 📋 **Prerrequisito:** Debe existir al menos una **Category** creada (`POST /category/create`) para usar su `_id` como `category`.
>
> 🔑 **Prerrequisito:** Tener un token JWT de un usuario con `role: "admin"` (obtenido de `POST /login`).

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "Create Product",
  "product": {
    "_id": "64f5e8a6e4b0a8d2f9c5f345",
    "name": "Proteína Whey Isolate 1kg",
    "price": 8500,
    "stock": 50,
    "description": "Proteína de suero de leche de alta calidad, ideal para recuperación muscular.",
    "category": "64f2b5d3e4b0a8d2f9c2c123",
    "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/products/proteina.jpg",
    "id_image": "FisiumFulness/products/proteina",
    "status": true,
    "amount": 1,
    "createdDate": "2026-03-13T11:30:00.000Z",
    "updatedDate": "2026-03-13T11:30:00.000Z"
  }
}
```

---

### `GET /products/`

**Retorna todos los productos con `status: true`. Acepta filtro por nombre. Incluye el objeto `category` populado (solo `name`).**

#### Query Parameters (opcionales)

| Parámetro | Tipo | Descripción |
|---|---|---|
| `title` | `String` | Filtra los productos cuyo nombre contenga el valor indicado. |

#### Respuesta Exitosa `200 OK`

```json
{
  "products": [
    {
      "_id": "64f5e8a6e4b0a8d2f9c5f345",
      "name": "Proteína Whey Isolate 1kg",
      "price": 8500,
      "stock": 50,
      "description": "Proteína de suero de leche de alta calidad...",
      "category": {
        "_id": "64f2b5d3e4b0a8d2f9c2c123",
        "name": "Suplementos"
      },
      "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/products/proteina.jpg",
      "status": true,
      "amount": 1,
      "createdDate": "2026-03-13T11:30:00.000Z",
      "updatedDate": "2026-03-13T11:30:00.000Z"
    }
  ]
}
```

---

### `GET /products/detail/:id`

**Retorna el detalle de un producto por ID, con `category` populado (solo `name`).**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del producto a consultar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "product": {
    "_id": "64f5e8a6e4b0a8d2f9c5f345",
    "name": "Proteína Whey Isolate 1kg",
    "price": 8500,
    "stock": 50,
    "description": "Proteína de suero de leche de alta calidad, ideal para recuperación muscular.",
    "category": {
      "_id": "64f2b5d3e4b0a8d2f9c2c123",
      "name": "Suplementos"
    },
    "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/products/proteina.jpg",
    "id_image": "FisiumFulness/products/proteina",
    "status": true,
    "amount": 1,
    "createdDate": "2026-03-13T11:30:00.000Z",
    "updatedDate": "2026-03-13T11:30:00.000Z"
  }
}
```

---

### `PUT /products/update/:id`

**Actualiza un producto existente. Si se envía una nueva imagen, reemplaza la anterior en Cloudinary.**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`
> **Content-Type:** `multipart/form-data`

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del producto a actualizar. |

#### Campos del formulario

```
PUT /products/update/64f5e8a6e4b0a8d2f9c5f345
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

name:        "Proteína Whey Isolate 2kg (nueva presentación)"
price:       15000
stock:       30
description: "Nueva descripción del producto actualizada."
category:    "64f2b5d3e4b0a8d2f9c2c123"
id_image:    "FisiumFulness/products/proteina"
myFile:      <nueva imagen (opcional)>
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `name` | `String` | Nuevo nombre del producto. | No | Sin cambio | No |
| `price` | `Number` | Nuevo precio. | No | Sin cambio | No |
| `stock` | `Number` | Nuevo stock disponible. | No | Sin cambio | No |
| `description` | `String` | Nueva descripción del producto. | No | Sin cambio | No |
| `category` | `String` | Nueva categoría del producto. | No | Sin cambio | **FK → Category._id** |
| `id_image` | `String` | **Requerido si se envía `myFile`.** ID de la imagen actual en Cloudinary para eliminarla. | Solo si `myFile` presente | — | No |
| `myFile` | `File` | Nueva imagen del producto. Reemplaza la anterior en Cloudinary. | No | Sin cambio | No |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "Product has been updated"
}
```

---

### `PATCH /products/status/:id`

**Activa o desactiva un producto (ocultar/publicar sin eliminar).**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del producto a modificar. |

#### Request Body

```json
{
  "status": false
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `status` | `Boolean` | Define si el producto es visible en la tienda (`true`) o está oculto (`false`). Los productos ocultos no aparecen en `GET /products/` pero sí en `GET /products/removed`. | ✅ Sí | — | No |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "the product with id 64f5e8a6e4b0a8d2f9c5f345 has been removed"
}
```

---

### `DELETE /products/delete/:id`

**Elimina permanentemente un producto y su imagen de Cloudinary.**

> **Autenticación requerida:** `Authorization: Bearer <token_admin>`
> ⚠️ **Operación destructiva e irreversible.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del producto a eliminar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "the product with id 64f5e8a6e4b0a8d2f9c5f345 has been removed"
}
```

---

### `GET /products/removed`

**Retorna todos los productos con `status: false` (archivados/ocultos). Con `category` populado.**

> **Sin autenticación requerida.**

#### Respuesta Exitosa `200 OK`

```json
{
  "productsRemoved": [
    {
      "_id": "64f5e8a6e4b0a8d2f9c5f345",
      "name": "Producto descontinuado",
      "price": 5000,
      "stock": 0,
      "description": "Producto ya no disponible.",
      "category": {
        "_id": "64f2b5d3e4b0a8d2f9c2c123",
        "name": "Suplementos"
      },
      "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/products/descontinuado.jpg",
      "status": false,
      "amount": 1,
      "createdDate": "2026-03-13T11:30:00.000Z",
      "updatedDate": "2026-03-13T14:00:00.000Z"
    }
  ]
}
```

---

## 7. Comments (Comentarios)

Los comentarios pertenecen a un blog específico y son realizados por un usuario. Representa la interacción de la comunidad con los artículos.

---

### `POST /comments/create`

**Crea un nuevo comentario en un blog.**

#### Request Body

```json
{
  "user_id": "64f3c6e4e4b0a8d2f9c3d789",
  "blog_id": "64f4d7f5e4b0a8d2f9c4e012",
  "content": "Excelente artículo, muy útil para mi rehabilitación."
}
```

#### Tabla de Atributos

| Campo | Tipo | Propósito | Obligatorio | Por Defecto | FK |
|---|---|---|---|---|---|
| `user_id` | `String` | ID del usuario que realiza el comentario. Se usa para mostrar la información del autor (nombre, imagen) junto al comentario. | ✅ Sí | — | **FK → User._id** |
| `blog_id` | `String` | ID del blog al que pertenece el comentario. Permite agrupar y mostrar todos los comentarios de un artículo. | ✅ Sí | — | **FK → Blog._id** |
| `content` | `String` | Texto del comentario escrito por el usuario. Contenido visible en el artículo. | ✅ Sí | — | No |

#### Guía de Población

> 👤 **Prerrequisito:** El **User** con el `user_id` indicado debe existir (creado con `POST /users/create`).
>
> 📝 **Prerrequisito:** El **Blog** con el `blog_id` indicado debe existir y tener `status: true` (creado con `POST /blogs/create`).

#### Respuesta Exitosa `200 OK`

```json
{
  "comment": {
    "_id": "64f6f9b7e4b0a8d2f9c6a678",
    "user_id": {
      "_id": "64f3c6e4e4b0a8d2f9c3d789",
      "username": "juan_fisio",
      "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/users/foto.jpg",
      "firstname": "Juan",
      "lastname": "García"
    },
    "blog_id": "64f4d7f5e4b0a8d2f9c4e012",
    "content": "Excelente artículo, muy útil para mi rehabilitación.",
    "status": true,
    "createdDate": "2026-03-13T12:00:00.000Z",
    "updatedDate": "2026-03-13T12:00:00.000Z"
  },
  "message": "comment created successfully"
}
```

---

### `GET /comments/`

**Retorna todos los comentarios. Acepta filtro por `blog_id`. Incluye datos del usuario populados.**

#### Query Parameters (opcionales)

| Parámetro | Tipo | Descripción |
|---|---|---|
| `blog_id` | `String` | Filtra los comentarios que pertenecen a un blog específico. |

#### Respuesta Exitosa `200 OK`

```json
{
  "comments": [
    {
      "_id": "64f6f9b7e4b0a8d2f9c6a678",
      "user_id": {
        "_id": "64f3c6e4e4b0a8d2f9c3d789",
        "username": "juan_fisio",
        "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/users/foto.jpg",
        "firstname": "Juan",
        "lastname": "García"
      },
      "blog_id": "64f4d7f5e4b0a8d2f9c4e012",
      "content": "Excelente artículo, muy útil para mi rehabilitación.",
      "status": true,
      "createdDate": "2026-03-13T12:00:00.000Z",
      "updatedDate": "2026-03-13T12:00:00.000Z"
    }
  ]
}
```

---

### `GET /comments/blog/:id`

**Retorna todos los comentarios de un blog específico, con datos del usuario populados.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del blog cuyos comentarios se quieren obtener. |

#### Respuesta Exitosa `200 OK`

```json
{
  "comments": [
    {
      "_id": "64f6f9b7e4b0a8d2f9c6a678",
      "user_id": {
        "_id": "64f3c6e4e4b0a8d2f9c3d789",
        "username": "juan_fisio",
        "image": "https://res.cloudinary.com/demo/image/upload/FisiumFulness/users/foto.jpg",
        "firstname": "Juan",
        "lastname": "García"
      },
      "blog_id": "64f4d7f5e4b0a8d2f9c4e012",
      "content": "Excelente artículo, muy útil para mi rehabilitación.",
      "status": true,
      "createdDate": "2026-03-13T12:00:00.000Z",
      "updatedDate": "2026-03-13T12:00:00.000Z"
    }
  ]
}
```

---

### `DELETE /comments/delete/:id`

**Elimina permanentemente un comentario por su ID.**

> ⚠️ **Operación destructiva e irreversible.**

#### Path Parameters

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `String` | ID del comentario a eliminar. |

#### Respuesta Exitosa `200 OK`

```json
{
  "message": "Comment 64f6f9b7e4b0a8d2f9c6a678 deleted"
}
```

---

## Resumen de Endpoints

| # | Método | Endpoint | Auth | Content-Type |
|---|---|---|---|---|
| 1 | `POST` | `/types/create` | No | `application/json` |
| 2 | `GET` | `/types/` | No | — |
| 3 | `GET` | `/types/:id` | No | — |
| 4 | `DELETE` | `/types/delete/:id` | No | — |
| 5 | `POST` | `/category/create` | No | `application/json` |
| 6 | `GET` | `/category/` | No | — |
| 7 | `GET` | `/category/:id` | No | — |
| 8 | `DELETE` | `/category/delete/:id` | No | — |
| 9 | `POST` | `/users/create` | No | `multipart/form-data` |
| 10 | `GET` | `/users/` | No | — |
| 11 | `GET` | `/users/detail/:id` | No | — |
| 12 | `PUT` | `/users/update/:id` | No | `multipart/form-data` |
| 13 | `PATCH` | `/users/status/:id` | No | `application/json` |
| 14 | `DELETE` | `/users/delete/:id` | No | — |
| 15 | `POST` | `/login` | No | `application/json` |
| 16 | `POST` | `/login/recover-password` | No | `application/json` |
| 17 | `POST` | `/blogs/create` | 🔑 Admin | `multipart/form-data` |
| 18 | `GET` | `/blogs/` | No | — |
| 19 | `GET` | `/blogs/detail/:id` | No | — |
| 20 | `PUT` | `/blogs/update/:id` | 🔑 Admin | `multipart/form-data` |
| 21 | `PATCH` | `/blogs/status/:id` | 🔑 Admin | `application/json` |
| 22 | `DELETE` | `/blogs/delete/:id` | 🔑 Admin | — |
| 23 | `GET` | `/blogs/removed` | No | — |
| 24 | `POST` | `/products/create` | 🔑 Admin | `multipart/form-data` |
| 25 | `GET` | `/products/` | No | — |
| 26 | `GET` | `/products/detail/:id` | No | — |
| 27 | `PUT` | `/products/update/:id` | 🔑 Admin | `multipart/form-data` |
| 28 | `PATCH` | `/products/status/:id` | 🔑 Admin | `application/json` |
| 29 | `DELETE` | `/products/delete/:id` | 🔑 Admin | — |
| 30 | `GET` | `/products/removed` | No | — |
| 31 | `POST` | `/comments/create` | No | `application/json` |
| 32 | `GET` | `/comments/` | No | — |
| 33 | `GET` | `/comments/blog/:id` | No | — |
| 34 | `DELETE` | `/comments/delete/:id` | No | — |

> 🔑 **Admin** = Requiere header `Authorization: Bearer <token>` donde el token corresponde a un usuario con `role: "admin"`.
