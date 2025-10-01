# 🚀 Configuración Supabase Edge Functions

## 📋 **ARQUITECTURA SIMPLIFICADA**

### ✅ **Frontend (Vite + React)**
- **Build:** `npm run build`
- **Variables:** Prefijo `VITE_`
- **Hosting:** Cualquier plataforma estática

### ✅ **Backend (Supabase Edge Functions)**
- **Funciones:** `/supabase/functions/`
- **Variables:** Sin prefijo
- **Hosting:** Supabase Cloud

---

## 🔧 **VARIABLES DE ENTORNO**

### **Frontend (.env.production)**
```bash
# URLs del sitio
VITE_APP_NAME=Punto Legal
VITE_APP_BASE_URL=https://puntolegal.online
VITE_APP_URL=https://puntolegal.online

# MercadoPago (clave pública)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-e02e0cc8-f3aa-422e-b0df-87b6ce44f3f8

# Supabase (anon es público)
VITE_SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI
VITE_SUPABASE_PROJECT_REF=qrgelocijmwnxcckxbdg

# Datos visibles (no secretos)
VITE_MAIL_FROM=Punto Legal <team@puntolegal.online>
VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com
```

### **Supabase Edge Functions (Variables de entorno en Supabase Dashboard)**
```bash
# MercadoPago (SECRETO)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947

# URLs
APP_URL=https://puntolegal.online
```

---

## 🚀 **COMANDOS PRINCIPALES**

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Verificar configuración MercadoPago
npm run mp:test

# Verificar variables de entorno
npm run env:check
```

---

## 📁 **ESTRUCTURA SIMPLIFICADA**

```
legal-glass-booking/
├── src/                    # Frontend React + Vite
├── supabase/
│   └── functions/          # Edge Functions
├── public/                 # Assets estáticos
├── vite.config.ts          # Configuración Vite
├── package.json            # Dependencias y scripts
└── .env.production         # Variables frontend
```

---

## ✅ **ESTADO ACTUAL**

- ✅ **Frontend:** Vite + React funcionando
- ✅ **Backend:** Supabase Edge Functions funcionando
- ✅ **MercadoPago:** Configurado en producción
- ✅ **Base de datos:** Supabase funcionando
- ✅ **Campo telefono:** Corregido (VARCHAR(50))

---

## 🎯 **PRÓXIMOS PASOS**

1. **Actualizar public key** en `.env.production`:
   ```bash
   VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-e02e0cc8-f3aa-422e-b0df-87b6ce44f3f8
   ```

2. **Hacer build final**:
   ```bash
   npm run build
   ```

3. **Desplegar frontend** en cualquier plataforma estática

4. **Verificar Edge Functions** en Supabase Dashboard
