// Script para validar el archivo JSON de Make.com
// Uso: node scripts/validate-json.js

const fs = require('fs');
const path = require('path');

function validateJSON() {
  console.log('🔍 Validando archivo JSON de Make.com...\n');

  const jsonPath = path.join(__dirname, '..', 'make-automation-blueprint.json');

  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ Error: Archivo make-automation-blueprint.json no encontrado');
      console.log('💡 Asegúrate de que el archivo esté en la raíz del proyecto');
      return false;
    }

    // Leer el archivo
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    console.log('✅ Archivo encontrado y leído correctamente');

    // Validar sintaxis JSON
    let parsedJSON;
    try {
      parsedJSON = JSON.parse(jsonContent);
      console.log('✅ Sintaxis JSON válida');
    } catch (parseError) {
      console.error('❌ Error de sintaxis JSON:', parseError.message);
      return false;
    }

    // Validar estructura requerida
    const requiredFields = ['name', 'description', 'version', 'scenario'];
    for (const field of requiredFields) {
      if (!parsedJSON[field]) {
        console.error(`❌ Campo requerido faltante: ${field}`);
        return false;
      }
    }
    console.log('✅ Estructura básica válida');

    // Validar módulos
    if (!parsedJSON.scenario.modules || !Array.isArray(parsedJSON.scenario.modules)) {
      console.error('❌ Campo "modules" faltante o inválido en scenario');
      return false;
    }

    console.log(`✅ ${parsedJSON.scenario.modules.length} módulos encontrados`);

    // Validar cada módulo
    const moduleTypes = ['webhook', 'google-calendar', 'gmail', 'supabase'];
    for (const module of parsedJSON.scenario.modules) {
      if (!module.id || !module.name || !module.type) {
        console.error(`❌ Módulo inválido: faltan campos requeridos`);
        return false;
      }

      if (!moduleTypes.includes(module.type)) {
        console.warn(`⚠️  Tipo de módulo no reconocido: ${module.type}`);
      }

      console.log(`  ✅ Módulo: ${module.name} (${module.type})`);
    }

    // Validar conexiones
    if (parsedJSON.scenario.connections && Array.isArray(parsedJSON.scenario.connections)) {
      console.log(`✅ ${parsedJSON.scenario.connections.length} conexiones definidas`);
      
      for (const connection of parsedJSON.scenario.connections) {
        if (!connection.from || !connection.to) {
          console.error(`❌ Conexión inválida: faltan campos from/to`);
          return false;
        }
        console.log(`  ✅ Conexión: ${connection.from} → ${connection.to}`);
      }
    }

    // Validar variables
    if (parsedJSON.scenario.variables) {
      console.log(`✅ ${Object.keys(parsedJSON.scenario.variables).length} variables definidas`);
    }

    // Validar configuración
    if (parsedJSON.settings) {
      console.log('✅ Configuración de ejecución válida');
    }

    // Validar metadatos
    if (parsedJSON.metadata) {
      console.log('✅ Metadatos válidos');
    }

    console.log('\n🎉 ¡Archivo JSON válido!');
    console.log('\n📋 Resumen:');
    console.log(`   Nombre: ${parsedJSON.name}`);
    console.log(`   Versión: ${parsedJSON.version}`);
    console.log(`   Módulos: ${parsedJSON.scenario.modules.length}`);
    console.log(`   Conexiones: ${parsedJSON.scenario.connections?.length || 0}`);
    console.log(`   Variables: ${Object.keys(parsedJSON.scenario.variables || {}).length}`);

    return true;

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    return false;
  }
}

// Función para mostrar información del archivo
function showFileInfo() {
  console.log('\n📄 Información del Archivo JSON');
  console.log('================================\n');

  const jsonPath = path.join(__dirname, '..', 'make-automation-blueprint.json');

  try {
    const stats = fs.statSync(jsonPath);
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const parsedJSON = JSON.parse(jsonContent);

    console.log(`📁 Ruta: ${jsonPath}`);
    console.log(`📏 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📅 Modificado: ${stats.mtime.toLocaleString()}`);
    console.log(`📝 Líneas: ${jsonContent.split('\n').length}`);

    console.log('\n🏗️  Estructura del Escenario:');
    console.log(`   Nombre: ${parsedJSON.scenario.name}`);
    console.log(`   ID: ${parsedJSON.scenario.id}`);
    console.log(`   Descripción: ${parsedJSON.scenario.description}`);

    console.log('\n🔧 Módulos Incluidos:');
    parsedJSON.scenario.modules.forEach((module, index) => {
      console.log(`   ${index + 1}. ${module.name} (${module.type})`);
    });

    console.log('\n🔗 Conexiones:');
    if (parsedJSON.scenario.connections) {
      parsedJSON.scenario.connections.forEach((conn, index) => {
        console.log(`   ${index + 1}. ${conn.from} → ${conn.to} (${conn.label || 'Sin etiqueta'})`);
      });
    }

    console.log('\n⚙️  Variables Configuradas:');
    if (parsedJSON.scenario.variables) {
      Object.keys(parsedJSON.scenario.variables).forEach(key => {
        console.log(`   • ${key}`);
      });
    }

  } catch (error) {
    console.error('❌ Error mostrando información:', error.message);
  }
}

// Función para generar ejemplo de uso
function generateUsageExample() {
  console.log('\n💡 Ejemplo de Uso del JSON');
  console.log('==========================\n');

  console.log('1. 📋 Usar como referencia para crear el escenario en Make.com:');
  console.log('   - Abre Make.com');
  console.log('   - Crea un nuevo escenario');
  console.log('   - Sigue la estructura del JSON');

  console.log('\n2. 🔧 Configurar módulos según el JSON:');
  console.log('   - Webhook: Configurar URL y método POST');
  console.log('   - Google Calendar: Conectar cuenta y configurar evento');
  console.log('   - Gmail: Conectar cuenta y configurar templates');
  console.log('   - Supabase: Conectar base de datos (opcional)');

  console.log('\n3. 🔗 Conectar módulos según las conexiones del JSON:');
  console.log('   - Webhook → Google Calendar');
  console.log('   - Google Calendar → Gmail Cliente');
  console.log('   - Gmail Cliente → Gmail Abogado');

  console.log('\n4. 🧪 Probar con el script de testing:');
  console.log('   node scripts/test-webhook.js');

  console.log('\n5. ✅ Activar el escenario cuando todo funcione');
}

// Función principal
function main() {
  console.log('🏢 Validador de JSON - Punto Legal');
  console.log('==================================\n');

  const isValid = validateJSON();
  
  if (isValid) {
    showFileInfo();
    generateUsageExample();
  } else {
    console.log('\n❌ El archivo JSON tiene errores que deben corregirse');
    console.log('💡 Revisa los errores anteriores y corrige el archivo');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { validateJSON, showFileInfo, generateUsageExample }; 