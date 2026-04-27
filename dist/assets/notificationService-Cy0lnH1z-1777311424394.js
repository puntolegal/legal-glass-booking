var c=Object.defineProperty;var r=(i,e,o)=>e in i?c(i,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):i[e]=o;var t=(i,e,o)=>r(i,typeof e!="symbol"?e+"":e,o);import{a as d}from"./index-DwRzM1u6-1777311424394.js";import"./supabase-CHF-EKnc-1777311424394.js";import"./vendor-BWCXAlAd-1777311424394.js";import"./router-DcaSEHW6-1777311424394.js";import"./animations-B-Lrs7dE-1777311424394.js";import"./ui-CbsS2MjV-1777311424394.js";import"./utils-C4xBKWBT-1777311424394.js";const l=(i,e)=>(e?new Date(`${i}T${e}`):new Date(i)).toLocaleString("es-CL",{timeZone:"America/Santiago"}),n=class n{constructor(){}static getInstance(){return n.instance||(n.instance=new n),n.instance}async obtenerEstadisticas(){return console.log("📊 Notification statistics disabled due to schema mismatch"),{total:0,enviadas:0,fallidas:0,pendientes:0,ultimaActividad:null}}async crearNotificaciones(e){return console.log("📧 Notification creation disabled due to schema mismatch"),!1}async procesarNotificacionesPendientes(){console.log("🔄 Processing notifications (disabled due to schema limitations)")}async enviarRecordatorios(){try{return console.log("🔔 Iniciando envío de recordatorios..."),console.log("⚠️  Recordatorios deshabilitados - tablas de notificaciones faltantes"),{success:!0}}catch(e){return console.error("❌ Error enviando recordatorios:",e),{success:!1,error:(e==null?void 0:e.message)||"Error desconocido"}}}async enviarNotificacionNuevaReserva(e){try{console.log("📧 Enviando notificación de nueva reserva...");const o={id:e.id,nombre:e.nombre,email:e.email,telefono:e.telefono,servicio:e.servicio,precio:e.precio,fecha:e.fecha,hora:e.hora,created_at:e.created_at},a=await d(o);return a.success?(console.log("✅ Notificación enviada exitosamente"),{success:!0}):(console.error("❌ Error enviando notificación:",a.error),{success:!1,error:a.error})}catch(o){return console.error("❌ Error en notificación de nueva reserva:",o),{success:!1,error:(o==null?void 0:o.message)||"Error desconocido"}}}async obtenerHistorialNotificaciones(e){return console.log("📋 Historial de notificaciones deshabilitado - esquema limitado"),[]}async reintentarNotificacion(e){return console.log("🔄 Reintento de notificaciones deshabilitado - esquema limitado"),{success:!1,error:"Funcionalidad deshabilitada"}}async marcarComoEnviada(e){return console.log("✅ Marcar como enviada deshabilitado - esquema limitado"),!1}async crearNotificacionComprobante(e,o){try{console.log("🧾 Creando notificación de comprobante...");const a=`
Hola ${e.nombre},

¡Gracias por tu pago! Aquí tienes los detalles de tu comprobante:

📄 Comprobante de Pago
• Número de transacción: ${o.id}
• Método de pago: ${o.metodo}
• Monto: $${o.monto} CLP
• Fecha de pago: ${new Date().toLocaleDateString("es-CL")}

📅 Detalles de la reserva:
• Servicio: ${e.servicio}
• Fecha: ${l(e.fecha,e.hora)}

Este email sirve como comprobante de tu transacción.

¡Nos vemos pronto!

Equipo Punto Legal
      `.trim();return console.log("💳 Comprobante generado exitosamente"),{success:!0}}catch(a){return console.error("❌ Error creando comprobante:",a),{success:!1,error:(a==null?void 0:a.message)||"Error desconocido"}}}async programarRecordatoriosDiarios(){return console.log("📅 Recordatorios diarios deshabilitados - esquema limitado"),{success:!1,error:"Funcionalidad deshabilitada"}}async reenviarNotificacionesFallidas(){return console.log("🔄 Reenvío de notificaciones deshabilitado - esquema limitado"),{success:!1,error:"Funcionalidad deshabilitada"}}async probarConexion(){return console.log("🔧 Prueba de conexión deshabilitada - esquema limitado"),{success:!1,error:"Funcionalidad deshabilitada"}}async enviarConfirmacionReserva(e){return this.enviarNotificacionNuevaReserva(e)}async limpiarNotificacionesAntiguas(e=30){return console.log("🧹 Limpieza de notificaciones deshabilitada - esquema limitado"),0}};t(n,"instance");let s=n;const y=s.getInstance();export{s as NotificationService,y as default,y as notificationService};
