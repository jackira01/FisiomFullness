# Control de Visibilidad del Catálogo de Productos

## Descripción

Esta funcionalidad permite controlar la visibilidad del catálogo de productos mediante una variable de entorno. Cuando está deshabilitada, se muestra un mensaje de mantenimiento en lugar de la lista de productos.

## Configuración

### Variable de Entorno

La funcionalidad se controla mediante la variable de entorno `NEXT_PUBLIC_CATALOG_ENABLED` en el archivo `.env.local`:

```env
NEXT_PUBLIC_CATALOG_ENABLED=true
```

**Valores posibles:**
- `true`: Muestra el catálogo de productos normalmente
- `false`: Muestra el mensaje de mantenimiento

### Archivos Involucrados

1. **`.env.local`**: Archivo de configuración de variables de entorno (no se sube a git)
2. **`.env.example`**: Archivo de ejemplo para documentación
3. **`src/app/productos/page.client.jsx`**: Componente principal que implementa la lógica condicional
4. **`src/components/productos/CatalogMaintenanceMessage.jsx`**: Componente del mensaje de mantenimiento

## Uso

### Para Deshabilitar el Catálogo

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Cambia el valor de `NEXT_PUBLIC_CATALOG_ENABLED` a `false`:
   ```env
   NEXT_PUBLIC_CATALOG_ENABLED=false
   ```
3. Reinicia el servidor de desarrollo para que los cambios surtan efecto:
   ```bash
   npm run dev
   ```

### Para Habilitar el Catálogo

1. Abre el archivo `.env.local`
2. Cambia el valor de `NEXT_PUBLIC_CATALOG_ENABLED` a `true`:
   ```env
   NEXT_PUBLIC_CATALOG_ENABLED=true
   ```
3. Reinicia el servidor de desarrollo

## Comportamiento

### Cuando el Catálogo está Habilitado (`true`)
- Se muestra el buscador de productos
- Se muestran las tarjetas de productos
- Se muestra la paginación
- Se realizan peticiones al API para obtener los productos

### Cuando el Catálogo está Deshabilitado (`false`)
- Se muestra un mensaje de mantenimiento atractivo
- No se realizan peticiones al API
- Se informa al usuario que el catálogo está en actualización
- Se muestra una animación de carga para indicar que es temporal

## Diseño del Mensaje de Mantenimiento

El componente `CatalogMaintenanceMessage` incluye:
- Diseño moderno con gradientes y sombras
- Iconos de herramientas y cajas para representar mantenimiento
- Animaciones sutiles para mejorar la experiencia del usuario
- Mensaje claro y profesional
- Diseño responsive para todos los dispositivos

## Notas Importantes

⚠️ **Importante**: Después de cambiar la variable de entorno, siempre debes reiniciar el servidor de desarrollo de Next.js para que los cambios surtan efecto.

💡 **Tip**: El archivo `.env.local` no se sube al repositorio git por seguridad. Asegúrate de documentar cualquier cambio importante en `.env.example`.
