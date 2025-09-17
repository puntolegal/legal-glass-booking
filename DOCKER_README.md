# 🐳 Docker Setup - Punto Legal Apuntes

## 🚀 Despliegue con Docker

### Construcción y Ejecución Simple

```bash
# Construir la imagen
docker build -t punto-legal-apuntes .

# Ejecutar el contenedor
docker run -p 8080:80 punto-legal-apuntes
```

### Usando Docker Compose (Recomendado)

```bash
# Levantar todos los servicios
docker-compose up -d

# Solo la aplicación principal
docker-compose up punto-legal-apuntes

# Construcción y ejecución en una sola línea
docker-compose up --build
```

## 📋 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NODE_ENV=production
APP_NAME=Punto Legal Apuntes
APP_URL=https://apuntes.puntolegal.online

# Optional: Redis (si usas cache)
REDIS_URL=redis://redis:6379
```

## 🛠️ Configuración de Producción

### Nginx Proxy (Incluido)
El contenedor incluye Nginx configurado para:
- ✅ Compresión GZIP
- ✅ Headers de seguridad
- ✅ Cache de assets estáticos
- ✅ SPA routing (React Router)
- ✅ Health checks

### SSL/HTTPS
Para configurar SSL en producción:

```bash
# Crear directorio para certificados
mkdir -p nginx/ssl

# Copiar certificados
cp your-cert.pem nginx/ssl/
cp your-key.pem nginx/ssl/

# Actualizar nginx/proxy.conf con configuración SSL
```

## 🔧 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f punto-legal-apuntes

# Acceder al contenedor
docker exec -it punto-legal-apuntes-app sh

# Reiniciar solo la aplicación
docker-compose restart punto-legal-apuntes

# Parar todos los servicios
docker-compose down

# Limpiar volúmenes y rebuild completo
docker-compose down -v
docker-compose up --build --force-recreate
```

## 📊 Monitoreo y Health Checks

### Health Check Endpoint
```bash
curl http://localhost:8080/health
# Respuesta: healthy
```

### Verificar Status de Contenedores
```bash
docker-compose ps
```

## 🔄 Actualizaciones

```bash
# Pull de cambios
git pull origin main

# Rebuild y redeploy
docker-compose down
docker-compose up --build -d

# Verificar que todo funciona
curl http://localhost:8080/health
```

## 🌐 URLs de Acceso

Una vez ejecutado el contenedor:

- **Aplicación Principal**: http://localhost:8080
- **Apuntes Home**: http://localhost:8080/apuntes/home
- **Sistema de Apuntes**: http://localhost:8080/apuntes
- **Health Check**: http://localhost:8080/health

## 📦 Arquitectura del Contenedor

```
punto-legal-apuntes/
├── Frontend (React + Vite) → Nginx (Port 80)
├── Redis (Cache) → Port 6379
└── Nginx Proxy → Port 80/443
```

## 🚨 Troubleshooting

### Puerto en uso
```bash
# Verificar qué usa el puerto 8080
lsof -i :8080

# Usar puerto alternativo
docker run -p 8081:80 punto-legal-apuntes
```

### Problemas de memoria
```bash
# Limitar memoria del contenedor
docker run -m 512m -p 8080:80 punto-legal-apuntes
```

### Assets no cargan
```bash
# Verificar build de Vite
npm run build
ls -la dist/

# Rebuild imagen
docker build --no-cache -t punto-legal-apuntes .
```

---

## 🏗️ Desarrollo vs Producción

### Desarrollo
```bash
# Usar docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up

# O simplemente
npm run dev
```

### Producción
```bash
# Usar configuración optimizada
docker-compose up -d
```

---

**🎓 Punto Legal Apuntes** - Estudia Derecho Inteligentemente  
🔗 [Documentación Completa](./README.md) | 📧 apuntes@puntolegal.online 