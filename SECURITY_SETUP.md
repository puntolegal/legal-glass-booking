# 🔐 Configuración de Seguridad - Punto Legal

Este documento explica cómo configurar y usar el sistema de seguridad para proteger el acceso a los datos de usuarios y reservas.

## 🎯 Sistema de Roles y Permisos

### Roles Disponibles

1. **👑 Administrador (admin)**
   - Acceso completo a todos los datos
   - Puede ver, editar y eliminar cualquier reserva
   - Puede gestionar usuarios (activar/desactivar, cambiar roles)
   - Puede eliminar perfiles de usuario

2. **⚖️ Abogado (abogado)**
   - Puede ver todas las reservas
   - Puede editar cualquier reserva
   - No puede eliminar reservas
   - No puede gestionar usuarios

3. **👤 Cliente (cliente)**
   - Solo puede ver sus propias reservas
   - Solo puede editar sus propias reservas
   - Solo puede eliminar sus propias reservas
   - No puede ver otros usuarios

## 🚀 Configuración Inicial

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 2. Ejecutar Migraciones de Base de Datos

```bash
# Aplicar las migraciones de seguridad
npx supabase db push
```

### 3. Crear el Primer Administrador

```bash
# Ejecutar el script de configuración
node scripts/setup-admin.js setup
```

El script te pedirá:
- Email del administrador
- Contraseña del administrador
- Nombre del administrador

### 4. Verificar la Configuración

```bash
# Listar usuarios existentes
node scripts/setup-admin.js list
```

## 🔒 Protección de Rutas

### Rutas Protegidas

- `/admin` - Solo administradores
- Otras rutas pueden protegerse según necesidad

### Uso del Componente ProtectedRoute

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

// Proteger por rol
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>

// Proteger por permiso específico
<ProtectedRoute requiredPermission="viewAllReservations">
  <ReservationsPage />
</ProtectedRoute>
```

## 📊 Panel de Administración

### Acceso
- URL: `http://localhost:8081/admin`
- Solo usuarios con rol `admin` pueden acceder

### Funcionalidades

#### Gestión de Usuarios
- Ver todos los usuarios registrados
- Activar/desactivar usuarios
- Cambiar roles de usuario
- Ver estadísticas de usuarios

#### Gestión de Reservas
- Ver todas las reservas del sistema
- Eliminar reservas
- Filtrar por fecha
- Ver detalles completos

## 🛡️ Políticas de Seguridad (RLS)

### Tabla `profiles`
- Solo admins pueden ver todos los perfiles
- Usuarios pueden ver solo su propio perfil
- Solo admins pueden editar cualquier perfil
- Solo admins pueden eliminar perfiles

### Tabla `reservas`
- Admins y abogados pueden ver todas las reservas
- Clientes solo ven sus propias reservas
- Admins y abogados pueden editar cualquier reserva
- Solo admins pueden eliminar cualquier reserva

## 🔧 Comandos Útiles

### Scripts de Administración

```bash
# Crear nuevo administrador
node scripts/setup-admin.js setup

# Listar usuarios existentes
node scripts/setup-admin.js list

# Cambiar rol de usuario
node scripts/setup-admin.js change-role
```

### Verificar Permisos

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { isAdmin, isAbogado, canViewAllReservations } = useAuth();

// Verificar roles
if (isAdmin()) {
  // Acceso completo
}

// Verificar permisos específicos
if (canViewAllReservations()) {
  // Puede ver todas las reservas
}
```

## 🚨 Seguridad Adicional

### Recomendaciones

1. **Contraseñas Fuertes**
   - Usar contraseñas de al menos 8 caracteres
   - Incluir mayúsculas, minúsculas, números y símbolos
   - Cambiar contraseñas regularmente

2. **Acceso Limitado**
   - Solo dar acceso de administrador a personas de confianza
   - Usar roles de abogado para personal que necesita ver reservas
   - Mantener usuarios cliente para acceso limitado

3. **Monitoreo**
   - Revisar regularmente los logs de acceso
   - Monitorear actividades sospechosas
   - Mantener backups de la base de datos

4. **Actualizaciones**
   - Mantener Supabase actualizado
   - Revisar regularmente las políticas de seguridad
   - Actualizar dependencias del proyecto

### Variables de Entorno Críticas

```bash
# Nunca compartir estas claves
SUPABASE_SERVICE_ROLE_KEY=sk_...  # Clave de servicio (máximo privilegio)
VITE_SUPABASE_ANON_KEY=eyJ...     # Clave anónima (público)
```

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de acceso denegado**
   - Verificar que el usuario tenga el rol correcto
   - Verificar que el usuario esté activo
   - Revisar las políticas RLS

2. **No se pueden ver reservas**
   - Verificar permisos del usuario
   - Revisar políticas de la tabla `reservas`
   - Verificar que el `user_id` esté correcto

3. **Error al crear administrador**
   - Verificar variables de entorno
   - Verificar conexión a Supabase
   - Revisar logs de error

### Logs de Debug

```tsx
// Agregar logs para debug
console.log('User role:', profile?.role);
console.log('Is admin:', isAdmin());
console.log('Can view all:', canViewAllReservations());
```

## 📞 Soporte

Para problemas de seguridad:
1. Revisar logs de Supabase
2. Verificar políticas RLS
3. Comprobar roles de usuario
4. Contactar al equipo de desarrollo

---

**⚠️ Importante**: Este sistema de seguridad protege los datos a nivel de base de datos y aplicación. Siempre mantén las mejores prácticas de seguridad y revisa regularmente las configuraciones. 