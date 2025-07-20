import fs from 'fs';
import path from 'path';

function generateMakeInstructions() {
    console.log('🚀 Configuración Manual de Make.com para Punto Legal');
    console.log('==================================================\n');
    
    console.log('📋 PASO 1: Crear un nuevo escenario');
    console.log('1. Ve a https://eu2.make.com');
    console.log('2. Haz clic en "Create a new scenario"');
    console.log('3. Busca y selecciona "Webhook" como primer módulo\n');
    
    console.log('📋 PASO 2: Configurar el Webhook');
    console.log('1. En el módulo Webhook, haz clic en "Add"');
    console.log('2. Selecciona "Custom webhook"');
    console.log('3. Copia la URL del webhook que se genera');
    console.log('4. Guarda la URL para usarla en tu aplicación\n');
    
    console.log('📋 PASO 3: Agregar módulo JSON Parser');
    console.log('1. Haz clic en el "+" después del webhook');
    console.log('2. Busca "JSON" y selecciona "JSON"');
    console.log('3. Configura:');
    console.log('   - Operation: Parse JSON');
    console.log('   - Source: {{webhook.body}}\n');
    
    console.log('📋 PASO 4: Agregar módulo Filter');
    console.log('1. Haz clic en el "+" después del JSON parser');
    console.log('2. Busca "Filter" y selecciona "Filter"');
    console.log('3. Configura las condiciones:');
    console.log('   - {{json.name}} is not empty');
    console.log('   - {{json.email}} is not empty');
    console.log('   - {{json.phone}} is not empty\n');
    
    console.log('📋 PASO 5: Agregar módulo Database (Supabase)');
    console.log('1. Haz clic en el "+" después del filter');
    console.log('2. Busca "Supabase" y selecciona "Supabase"');
    console.log('3. Configura la conexión a tu base de datos');
    console.log('4. Configura:');
    console.log('   - Operation: Insert a record');
    console.log('   - Table: notifications');
    console.log('   - Data:');
    console.log('     user_id: {{json.user_id}}');
    console.log('     type: "consultation_request"');
    console.log('     title: "Nueva solicitud de consulta"');
    console.log('     message: "Cliente {{json.name}} solicitó una consulta"');
    console.log('     data: {{json}}');
    console.log('     status: "pending"');
    console.log('     created_at: {{now}}\n');
    
    console.log('📋 PASO 6: Agregar módulo Email (Gmail/SMTP)');
    console.log('1. Haz clic en el "+" después del database');
    console.log('2. Busca "Gmail" o "SMTP" y selecciona');
    console.log('3. Configura la conexión de email');
    console.log('4. Configura:');
    console.log('   - To: admin@puntolegal.cl');
    console.log('   - Subject: "Nueva solicitud de consulta - {{json.name}}"');
    console.log('   - Body: (ver template abajo)\n');
    
    console.log('📋 PASO 7: Agregar segundo módulo Email');
    console.log('1. Haz clic en el "+" después del primer email');
    console.log('2. Configura email de confirmación al cliente:');
    console.log('   - To: {{json.email}}');
    console.log('   - Subject: "Confirmación de solicitud - Punto Legal"');
    console.log('   - Body: (ver template abajo)\n');
    
    console.log('📋 PASO 8: Actualizar estado de notificación');
    console.log('1. Haz clic en el "+" después del segundo email');
    console.log('2. Busca "Supabase" y selecciona');
    console.log('3. Configura:');
    console.log('   - Operation: Update a record');
    console.log('   - Table: notifications');
    console.log('   - Where: id = {{database.id}}');
    console.log('   - Data:');
    console.log('     status: "processed"');
    console.log('     processed_at: {{now}}\n');
    
    console.log('📋 PASO 9: Activar el escenario');
    console.log('1. Haz clic en "Save"');
    console.log('2. Haz clic en "Run once" para probar');
    console.log('3. Si funciona, haz clic en "Set up a schedule"');
    console.log('4. Selecciona "Manual" para ejecución manual\n');
    
    console.log('📧 TEMPLATES DE EMAIL');
    console.log('====================\n');
    
    console.log('📧 Email al Administrador:');
    console.log('Se ha recibido una nueva solicitud de consulta:');
    console.log('');
    console.log('Nombre: {{json.name}}');
    console.log('Email: {{json.email}}');
    console.log('Teléfono: {{json.phone}}');
    console.log('Servicio: {{json.service}}');
    console.log('Fecha: {{json.date}}');
    console.log('Hora: {{json.time}}');
    console.log('Mensaje: {{json.message}}');
    console.log('');
    console.log('Responder a: {{json.email}}\n');
    
    console.log('📧 Email de Confirmación al Cliente:');
    console.log('Hola {{json.name}},');
    console.log('');
    console.log('Hemos recibido tu solicitud de consulta para {{json.service}}.');
    console.log('');
    console.log('Fecha solicitada: {{json.date}}');
    console.log('Hora: {{json.time}}');
    console.log('');
    console.log('Nos pondremos en contacto contigo pronto para confirmar los detalles.');
    console.log('');
    console.log('Saludos,');
    console.log('Equipo Punto Legal\n');
    
    console.log('🔗 URL DEL WEBHOOK');
    console.log('==================');
    console.log('Una vez configurado, copia la URL del webhook y actualízala en:');
    console.log('- src/config/notifications.ts');
    console.log('- Cualquier otro lugar donde uses el webhook\n');
    
    console.log('✅ ¡Listo! Tu escenario de Make.com estará funcionando.');
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    generateMakeInstructions();
}

export { generateMakeInstructions }; 