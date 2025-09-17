# 🧪 PRUEBA DEL FLUJO DE CÓDIGO DE CONVENIO

## 🎯 **PASOS PARA PROBAR:**

### **1. Ir al Agendamiento**
```
http://localhost:8080/agendamiento?plan=general
```

### **2. Completar Formulario**
- **Nombre:** Tu nombre
- **Teléfono:** +56987654321
- **Email:** tu@email.com
- **Empresa:** (opcional)
- **🏷️ Código de Convenio:** `PUNTOLEGAL!` ← **¡IMPORTANTE!**

### **3. Verificar Cambios Visuales**
Cuando ingreses el código correcto deberías ver:
- ✅ Campo se pone **verde**
- ✅ Mensaje: "Código válido - Descuento del 80% aplicado"
- ✅ Precio cambia de **$35.000** a **$7.000**
- ✅ Badge: **"80% OFF - CONVENIO"**

### **4. Continuar con el Proceso**
- Selecciona fecha y hora
- Haz clic en **"Pagar con MercadoPago"**

### **5. Verificar en MercadoPago**
En `http://localhost:8080/mercadopago` deberías ver:
- 🏷️ Badge: "Convenio: PUNTOLEGAL!"
- 💚 Caja verde: "Convenio aplicado - 80% OFF"
- 💸 Precio original tachado: **$35.000**
- ✨ Total: **$7.000**

## 🔍 **DEBUGGING:**

### **En la Consola (F12) del Agendamiento:**
```
💳 Guardando datos de pago con convenio: {objeto completo}
🏷️ Código de convenio: PUNTOLEGAL!
✅ Convenio válido: true
💰 Precio original: 35.000
💸 Precio final: 7.000
📊 Descuento aplicado: 80%
```

### **En la Consola (F12) de MercadoPago:**
```
💳 Datos de pago cargados: {
  price: "7.000",
  originalPrice: "35.000", 
  descuentoConvenio: true,
  codigoConvenio: "PUNTOLEGAL!",
  porcentajeDescuento: "80%"
}
```

## 🚨 **SI NO FUNCIONA:**

### **Verificar localStorage:**
```javascript
// En consola del navegador:
console.log(JSON.parse(localStorage.getItem('paymentData')));
```

### **Campos Críticos:**
- `price`: Debe ser "7.000" (no "35.000")
- `descuentoConvenio`: Debe ser `true`
- `originalPrice`: Debe ser "35.000"
- `codigoConvenio`: Debe ser "PUNTOLEGAL!"

## 🎯 **RESULTADO ESPERADO:**

```
┌─────────────────────────────────────────┐
│ 📋 Resumen de tu consulta               │
│                                         │
│ 🛎️ Servicio: Consulta General           │
│ 🏷️ Convenio: PUNTOLEGAL!               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏷️ Convenio aplicado      80% OFF  │ │ ← Verde
│ │ Precio original:         $35.000   │ │ ← Tachado
│ └─────────────────────────────────────┘ │
│                                         │
│ Total                    $7.000         │ ← Grande
│ Con descuento de convenio               │ ← Texto
└─────────────────────────────────────────┘
```

## 🚀 **¡SISTEMA LISTO!**

Si sigues estos pasos exactamente, el descuento del 80% debería reflejarse perfectamente en toda la experiencia del usuario.
