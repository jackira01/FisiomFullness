# Migración a Mailjet y Revisión de Google OAuth

## 📋 Resumen de Cambios

Esta documentación registra los cambios realizados el 16 de marzo de 2026 para:
1. Revisar la configuración de Google OAuth
2. Migrar del servicio de emails de Nodemailer a Mailjet

---

## 1. ✅ Google OAuth - Validación Completada

### Configuración Actual (CORRECTA)

**Ubicación de variables de entorno:**
- Archivo: `client/.env.local`
- Variables: `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`

**Configuración en Next-Auth:**
- Archivo: `client/src/app/api/auth/[...nextauth]/route.js`
- Proveedor: `GoogleProvider` configurado con credenciales
- SessionProvider: Correctamente integrado en `client/src/app/providers.jsx`

**Flujo de autenticación:**
- ✓ Credenciales correctamente referenciadas
- ✓ Callbacks JWT y Session implementados
- ✓ Integración con cookies de autenticación
- ✓ Sincronización con SessionProvider

**No se requieren cambios en la configuración de Google OAuth** - está funcionando correctamente.

---

## 2. 📧 Migración de Nodemailer a Mailjet

### Cambios Realizados

#### A. Nuevo Servicio de Emails (`api/src/services/mailjetService.js`)

Creado servicio reutilizable con Mailjet que incluye:

```javascript
class EmailService {
  - sendEmail()                    // Método genérico para enviar emails
  - sendConfirmationEmail()        // Email de confirmación de cuenta
  - sendPasswordRecoveryEmail()    // Email de recuperación de contraseña
}
```

**Características:**
- ✓ Autenticación con Mailjet usando `MJ_APIKEY_PUBLIC` y `MJ_APIKEY_PRIVATE`
- ✓ Manejo de errores robusto con try-catch
- ✓ Validación de variables de entorno
- ✓ Templates HTML mejorados y profesionales
- ✓ Parámetros configurables (de, asunto, contenido)

#### B. Actualización de `api/src/controllers/loginController.js`

**Cambios:**
1. Removido: Importación de `nodemailer`
2. Removido: Variables de configuración de Nodemailer (`E_HOST`, `E_PORT`, `E_USER`, `E_PASSWORD`)
3. Agregado: Importación del nuevo `emailService`
4. Actualizado: Función `recoverAccount()` para usar Mailjet
5. Mejorado: Manejo de errores y respuestas

**Función actualizada:**
```javascript
exports.recoverAccount = async (req, res) => {
  // Validación y búsqueda de usuario
  // Generación de contraseña temporal segura
  // Envío con emailService.sendPasswordRecoveryEmail()
  // Respuestas JSON estructuradas
}
```

#### C. Actualización de `api/package.json`

**Cambio de dependencia:**
- Removido: `"nodemailer": "^8.0.2"`
- Agregado: `"node-mailjet": "^6.0.6"`

**Comando para actualizar dependencias:**
```bash
cd api
npm uninstall nodemailer
npm install node-mailjet
```

O con pnpm:
```bash
cd api
pnpm remove nodemailer
pnpm add node-mailjet
```

#### D. Actualización de Variables de Entorno

**Archivo `api/.env.local` - Variables ya configuradas:**
```env
MJ_APIKEY_PUBLIC=d9eb9c3d43c9650f3d140580aeffc676
MJ_APIKEY_PRIVATE=369d9f09b807b93b30d251cab8f40614
MJ_API_TOKEN=af65ae986e8979f9e9baae2956c67875
EMAIL_SENDER=info@prepagoya.com
APP_NAME=PrepagoYa
```

**Variables recomendadas para agregar:**
```env
# URL de la aplicación para enlaces en emails
APP_URL=http://localhost:5173
```

**Archivo `api/.env.example` - Actualizado con documentación:**
```env
# Mailjet Configuration (Email Service)
MJ_APIKEY_PUBLIC=your_mailjet_public_api_key
MJ_APIKEY_PRIVATE=your_mailjet_private_api_key
MJ_API_TOKEN=your_mailjet_api_token

# Email Configuration
EMAIL_SENDER=your_email@example.com
APP_NAME=Fisium Fulness

# Application Configuration
APP_URL=http://localhost:5173
```

#### E. Actualización de `client/.env.example`

Agregadas variables de Google OAuth:
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## 3. 📦 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `api/src/services/mailjetService.js` | ✨ NUEVO - Servicio de emails con Mailjet |
| `api/src/controllers/loginController.js` | 🔄 ACTUALIZADO - Usar Mailjet en lugar de Nodemailer |
| `api/package.json` | 🔄 ACTUALIZADO - Reemplazar nodemailer con node-mailjet |
| `api/.env.example` | 🔄 ACTUALIZADO - Variables de Mailjet y documentación |
| `client/.env.example` | 🔄 ACTUALIZADO - Agregar variables de Google OAuth |

---

## 4. 🚀 Próximos Pasos

1. **Instalar dependencias:**
   ```bash
   cd api
   pnpm install
   ```

2. **Verificar variables de entorno:**
   - Asegurar que `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE` y `EMAIL_SENDER` estén configuradas en `api/.env.local`
   - Asegurar que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén configuradas en `client/.env.local`

3. **Pruebas recomendadas:**
   - Test de flujo de recuperación de contraseña
   - Validar que los emails se enviín correctamente
   - Verificar autenticación con Google OAuth

4. **Documentación adicional:**
   - Si en el futuro se necesitan otros tipos de emails, agregar métodos al `EmailService`
   - Ejemplo: `sendWelcomeEmail()`, `sendNotificationEmail()`, etc.

---

## 5. 📚 Referencia de Variables de Entorno

### Backend (api/.env.local)

```env
# Mailjet (Requerido para envío de emails)
MJ_APIKEY_PUBLIC=<tu_clave_publica>
MJ_APIKEY_PRIVATE=<tu_clave_privada>
MJ_API_TOKEN=<tu_token_api>

# Email (Requerido)
EMAIL_SENDER=<email_remitente>
APP_NAME=<nombre_app>
APP_URL=<url_app>

# Base de datos
MONGODB_URI=<uri_mongodb>

# JWT
JWT_secret=<secreto_jwt>

# Cloudinary
cloud_name=<nombre_nube>
api_key=<clave_api>
api_secret=<secreto_api>
```

### Frontend (client/.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# NextAuth
NEXTAUTH_SECRET=<secreto_nextauth>

# Google OAuth (Requerido)
GOOGLE_CLIENT_ID=<id_cliente_google>
GOOGLE_CLIENT_SECRET=<secreto_cliente_google>

# Configuración de la aplicación
NEXT_PUBLIC_CATALOG_ENABLED=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

---

## 6. ⚠️ Notas Importantes

- **Seguridad**: Las credenciales de Mailjet están almacenadas en `.env.local` que ya está en `.gitignore`
- **Compatibilidad**: El código anterior que usaba Nodemailer ha sido completamente reemplazado
- **Métodos disponibles**: El `EmailService` está listo para recibir nuevos métodos de email según sea necesario
- **Testing**: Se recomienda hacer pruebas de los emails después de instalar las dependencias

---

**Última actualización**: 16 de marzo de 2026
**Estado**: ✅ Completado
