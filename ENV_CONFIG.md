# Configuración de Variables de Entorno

## Archivo .env

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Clave de servicio para operaciones administrativas (solo para scripts)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Configuración de Make.com
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/your-webhook-url

# Configuración de Google
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Configuración de Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@puntolegal.cl
SMTP_PASS=your-app-password

# Configuración de la aplicación
VITE_APP_NAME=Punto Legal
VITE_APP_URL=http://localhost:8080
VITE_ADMIN_EMAIL=sozajimenez@puntolegal.cl

# Configuración de pagos (opcional)
STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key

# Configuración de notificaciones
PUSH_PUBLIC_KEY=your-push-public-key
PUSH_PRIVATE_KEY=your-push-private-key
```

## Pasos para Configurar

### 1. Supabase
1. Ve a tu proyecto en Supabase
2. Copia la URL del proyecto
3. Ve a Settings > API
4. Copia la anon key y service role key

### 2. Make.com
1. Crea el webhook en Make.com
2. Copia la URL del webhook generada
3. Actualiza `MAKE_WEBHOOK_URL` con esa URL

### 3. Google Calendar
1. Ve a Google Cloud Console
2. Crea un proyecto o selecciona uno existente
3. Habilita Google Calendar API
4. Crea credenciales OAuth 2.0
5. Copia el Client ID y Client Secret

### 4. Gmail
1. Habilita la verificación en dos pasos en tu cuenta de Gmail
2. Genera una contraseña de aplicación
3. Usa esa contraseña en `SMTP_PASS`

## Comandos de Configuración

### Configurar Usuario Admin
```bash
node scripts/setup-admin.js
```

### Verificar Configuración
```bash
npm run dev
```

## Notas Importantes

- **Seguridad**: Nunca subas el archivo `.env` al repositorio
- **Backup**: Mantén un respaldo de las credenciales
- **Rotación**: Cambia las contraseñas regularmente
- **Permisos**: Asegúrate de que las APIs tengan los permisos correctos 