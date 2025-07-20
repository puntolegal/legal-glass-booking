import fs from 'fs';
import path from 'path';

const MAKE_API_URL = 'https://eu2.make.com/api/v2';
const MAKE_API_TOKEN = process.env.MAKE_API_TOKEN;

if (!MAKE_API_TOKEN) {
    console.error('❌ Error: MAKE_API_TOKEN no está configurado');
    console.log('💡 Configura la variable de entorno MAKE_API_TOKEN');
    process.exit(1);
}

async function importMakeScenario() {
    try {
        console.log('🚀 Importando escenario a Make.com...');
        
        // Leer el archivo de configuración
        const blueprintPath = path.join(process.cwd(), 'make-automation-blueprint.json');
        const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
        
        console.log('📋 Escenario a importar:', blueprint.name);
        
        // Crear el escenario en Make.com
        const response = await fetch(`${MAKE_API_URL}/scenarios`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${MAKE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: blueprint.name,
                flow: blueprint.flow,
                metadata: blueprint.metadata
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error al crear escenario: ${response.status} - ${error}`);
        }
        
        const result = await response.json();
        
        console.log('✅ Escenario creado exitosamente!');
        console.log('📊 ID del escenario:', result.id);
        console.log('🔗 URL del escenario:', `https://eu2.make.com/scenario/${result.id}`);
        
        // Obtener la URL del webhook
        const webhookModule = blueprint.flow.find(module => module.id === 'webhook_trigger');
        if (webhookModule) {
            console.log('🔗 URL del webhook:', webhookModule.metadata.webhook.url);
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Error al importar escenario:', error.message);
        throw error;
    }
}

// Función para activar el escenario
async function activateScenario(scenarioId) {
    try {
        console.log('🔄 Activando escenario...');
        
        const response = await fetch(`${MAKE_API_URL}/scenarios/${scenarioId}/activate`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${MAKE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error al activar escenario: ${response.status} - ${error}`);
        }
        
        console.log('✅ Escenario activado exitosamente!');
        
    } catch (error) {
        console.error('❌ Error al activar escenario:', error.message);
        throw error;
    }
}

// Función principal
async function main() {
    try {
        const scenario = await importMakeScenario();
        await activateScenario(scenario.id);
        
        console.log('\n🎉 ¡Configuración completada!');
        console.log('📝 Próximos pasos:');
        console.log('1. Actualiza la URL del webhook en tu aplicación');
        console.log('2. Configura las credenciales de email en Make.com');
        console.log('3. Configura la conexión a la base de datos');
        console.log('4. Prueba el flujo enviando una solicitud de consulta');
        
    } catch (error) {
        console.error('💥 Error en la configuración:', error.message);
        process.exit(1);
    }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { importMakeScenario, activateScenario }; 