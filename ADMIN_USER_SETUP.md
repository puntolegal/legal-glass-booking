# 👑 Configuración del Usuario Administrador

## 📋 Credenciales del Administrador

### **Datos de Acceso:**
- **Email**: `admin@puntolegal.cl`
- **Contraseña**: `helloworld`
- **Rol**: `admin`

## 🔧 Configuración Manual

### **Paso 1: Crear Usuario en Supabase Auth**

1. Ve a tu **Supabase Dashboard**
2. Navega a **Authentication > Users**
3. Haz clic en **"Add User"**
4. Completa los datos:
   - **Email**: `admin@puntolegal.cl`
   - **Password**: `helloworld`
   - **User Metadata**: 
     ```json
     {
       "role": "admin",
       "is_active": true
     }
     ```

### **Paso 2: Crear Perfil en la Base de Datos**

1. Ve a **Table Editor > profiles**
2. Haz clic en **"Insert Row"**
3. Completa los datos:

```sql
INSERT INTO profiles (
  user_id,
  email,
  role,
  is_active,
  tipo_empresa,
  razon_social,
  rut_empresa,
  plan_suscripcion,
  estado_suscripcion,
  fecha_inicio_suscripcion,
  created_at,
  updated_at
) VALUES (
  'USER_ID_FROM_STEP_1',
  'admin@puntolegal.cl',
  'admin',
  true,
  'admin',
  'Punto Legal - Administración',
  'ADMIN-001',
  'admin',
  'activa',
  CURRENT_DATE,
  NOW(),
  NOW()
);
```

### **Paso 3: Verificar Configuración**

1. Ve a **Authentication > Users**
2. Busca el usuario `admin@puntolegal.cl`
3. Verifica que esté activo
4. Ve a **Table Editor > profiles**
5. Verifica que el perfil tenga `role = 'admin'`

## 🚀 Acceso al Sistema

### **Cómo Acceder:**

1. **Ve a**: `http://localhost:8080/servicios/corporativo`
2. **Haz clic** en "Iniciar Sesión Empresa"
3. **Ingresa las credenciales**:
   - Email: `admin@puntolegal.cl`
   - Contraseña: `helloworld`
4. **Accede** al panel administrativo

### **Funcionalidades del Administrador:**

#### **Panel de Administración:**
- 👥 **Gestión de Usuarios** - Administra usuarios corporativos
- 🗄️ **Base de Datos** - Acceso completo a todas las tablas
- 📊 **Logs del Sistema** - Revisa actividad del sistema

#### **Analytics:**
- 📈 **Estadísticas Generales** - Total de empresas, causas activas
- 💰 **Ingresos Mensuales** - Reportes financieros
- 📊 **Actividad Reciente** - Nuevos usuarios, causas resueltas

#### **Navegación Adicional:**
- 👑 **Pestaña "Administración"** - Solo visible para admins
- 📊 **Pestaña "Analytics"** - Solo visible para admins
- ⚙️ **Configuración Avanzada** - Acceso completo al sistema

## 🔒 Seguridad

### **Recomendaciones:**

1. **Cambiar contraseña** después del primer acceso
2. **Usar contraseña fuerte** en producción
3. **Limitar acceso** solo a personal autorizado
4. **Monitorear actividad** del administrador
5. **Backup regular** de la base de datos

### **Políticas de Acceso:**

- ✅ **Solo administradores** pueden ver todas las causas
- ✅ **Acceso completo** a todas las empresas
- ✅ **Gestión de usuarios** corporativos
- ✅ **Configuración del sistema**
- ✅ **Reportes y analytics**

## 🎯 Próximos Pasos

### **Después de la Configuración:**

1. **Probar acceso** con las credenciales
2. **Verificar funcionalidades** del panel administrativo
3. **Configurar notificaciones** para el administrador
4. **Personalizar dashboard** según necesidades
5. **Capacitar equipo** en el uso del sistema

## 📞 Soporte

### **Si tienes problemas:**

1. **Verificar credenciales** en Supabase
2. **Revisar logs** de autenticación
3. **Confirmar rol** en la tabla profiles
4. **Probar login** desde la aplicación
5. **Contactar soporte** si persisten los problemas

---

**¡El usuario administrador está listo para usar! 👑** 