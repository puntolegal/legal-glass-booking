# 🚀 Guía de Despliegue - Punto Legal

## 📋 Configuración para Lovable

### 1. **Configuración del Dominio**
El error `DNS_PROBE_FINISHED_NXDOMAIN` indica que el dominio `puntolegal.online` no está configurado correctamente.

**Soluciones:**

#### Opción A: Usar el dominio de Lovable
- Accede a tu dashboard de Lovable
- Usa el dominio proporcionado por Lovable (ej: `tu-proyecto.lovable.app`)
- No configures un dominio personalizado hasta que esté listo

#### Opción B: Configurar dominio personalizado
1. Compra el dominio `puntolegal.online` en un registrador (Namecheap, GoDaddy, etc.)
2. En Lovable, ve a Settings > Domains
3. Agrega tu dominio personalizado
4. Configura los registros DNS según las instrucciones de Lovable

### 2. **Build del Proyecto**

```bash
# Instalar dependencias
npm install

# Build para producción
npm run build:prod

# Verificar el build
npm run preview
```

### 3. **Archivos de Configuración**

El proyecto incluye múltiples archivos de configuración para diferentes plataformas:

- `vercel.json` - Para Vercel
- `netlify.toml` - Para Netlify  
- `public/_redirects` - Para manejo de rutas SPA

### 4. **Variables de Entorno**

Crea un archivo `.env.production` con:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
NODE_ENV=production
```

### 5. **Verificación del Despliegue**

1. **Build local:**
   ```bash
   npm run build:prod
   npm run preview
   ```

2. **Verificar archivos generados:**
   - El directorio `dist/` debe contener todos los archivos
   - `index.html` debe estar en la raíz
   - Los assets deben estar en `dist/assets/`

3. **Probar rutas:**
   - `/` - Página principal
   - `/agendamiento` - Sistema de citas
   - `/tributario` - Servicio tributario
   - `/blog/*` - Posts del blog

### 6. **Solución de Problemas**

#### Error DNS_PROBE_FINISHED_NXDOMAIN
- Verifica que el dominio esté configurado en Lovable
- Usa temporalmente el dominio de Lovable
- Contacta al soporte de Lovable si persiste

#### Rutas no funcionan
- Verifica que `_redirects` esté en `public/`
- Asegúrate de que el build incluya `index.html`
- Revisa la configuración de rutas en Lovable

#### Assets no cargan
- Verifica que `vite.config.ts` tenga `base: "/"`
- Asegúrate de que los assets estén en `dist/assets/`
- Revisa las rutas en el código

### 7. **Optimizaciones**

- ✅ Code splitting configurado
- ✅ Assets optimizados
- ✅ Cache headers configurados
- ✅ SPA routing configurado

### 8. **Contacto**

Si tienes problemas con el despliegue:
1. Revisa los logs de build en Lovable
2. Verifica la configuración del dominio
3. Contacta al soporte de Lovable
4. Usa el dominio temporal de Lovable mientras configuras el personalizado 