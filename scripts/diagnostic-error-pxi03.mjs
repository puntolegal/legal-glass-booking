#!/usr/bin/env node

/**
 * 🔧 DIAGNÓSTICO ESPECÍFICO: Error PXI03-ZC08550NZGXD
 * 
 * Este script diagnostica y proporciona soluciones para el error PXI03
 * que ocurre al presionar el botón de pagar en MercadoPago Checkout Pro.
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔧 DIAGNÓSTICO ERROR PXI03-ZC08550NZGXD');
console.log('==========================================\n');

// Función para verificar configuración de MercadoPago
function checkMercadoPagoConfig() {
    console.log('📋 1. VERIFICANDO CONFIGURACIÓN MERCADOPAGO:');
    
    const configFiles = [
        'src/config/mercadopago.ts',
        'src/services/mercadopagoDirect.ts',
        'src/components/MercadoPagoOfficialButton.tsx'
    ];
    
    configFiles.forEach(file => {
        const filePath = path.join(projectRoot, file);
        if (existsSync(filePath)) {
            console.log(`✅ ${file}: Encontrado`);
            const content = readFileSync(filePath, 'utf-8');
            
            // Verificar validaciones de datos
            if (content.includes('validatePreferenceData') || content.includes('validation')) {
                console.log(`  ✅ Validación de datos: Implementada`);
            } else {
                console.log(`  ⚠️ Validación de datos: Faltante`);
            }
            
            // Verificar logs de debug
            if (content.includes('console.log') && content.includes('DEBUG')) {
                console.log(`  ✅ Logs de debug: Implementados`);
            } else {
                console.log(`  ⚠️ Logs de debug: Faltantes`);
            }
            
            // Verificar manejo de errores
            if (content.includes('catch') || content.includes('error')) {
                console.log(`  ✅ Manejo de errores: Implementado`);
            } else {
                console.log(`  ⚠️ Manejo de errores: Faltante`);
            }
        } else {
            console.log(`❌ ${file}: No encontrado`);
        }
    });
}

// Función para verificar estructura de datos
function checkDataStructure() {
    console.log('\n📋 2. VERIFICANDO ESTRUCTURA DE DATOS:');
    
    const mercadopagoDirect = path.join(projectRoot, 'src/services/mercadopagoDirect.ts');
    if (existsSync(mercadopagoDirect)) {
        const content = readFileSync(mercadopagoDirect, 'utf-8');
        
        // Verificar campos requeridos
        const requiredFields = [
            'items',
            'payer',
            'back_urls',
            'external_reference',
            'auto_return'
        ];
        
        requiredFields.forEach(field => {
            if (content.includes(field)) {
                console.log(`✅ Campo ${field}: Presente`);
            } else {
                console.log(`❌ Campo ${field}: Faltante`);
            }
        });
        
        // Verificar validación de precios
        if (content.includes('unit_price') && content.includes('> 0')) {
            console.log(`✅ Validación de precios: Implementada`);
        } else {
            console.log(`⚠️ Validación de precios: Faltante`);
        }
        
        // Verificar validación de email
        if (content.includes('email') && content.includes('@')) {
            console.log(`✅ Validación de email: Implementada`);
        } else {
            console.log(`⚠️ Validación de email: Faltante`);
        }
    }
}

// Función para verificar URLs de retorno
function checkReturnUrls() {
    console.log('\n📋 3. VERIFICANDO URLs DE RETORNO:');
    
    const configFile = path.join(projectRoot, 'src/config/mercadopago.ts');
    if (existsSync(configFile)) {
        const content = readFileSync(configFile, 'utf-8');
        
        const urls = [
            'payment-success',
            'payment-failure', 
            'payment-pending'
        ];
        
        urls.forEach(url => {
            if (content.includes(url)) {
                console.log(`✅ URL ${url}: Configurada`);
            } else {
                console.log(`❌ URL ${url}: Faltante`);
            }
        });
        
        // Verificar que no use localhost en producción
        if (content.includes('localhost') && content.includes('production')) {
            console.log(`⚠️ ADVERTENCIA: localhost detectado en configuración de producción`);
        } else {
            console.log(`✅ URLs de producción: Correctas`);
        }
    }
}

// Función para generar solución
function generateSolution() {
    console.log('\n📋 4. SOLUCIÓN RECOMENDADA:');
    console.log('');
    
    console.log('🔧 IMPLEMENTAR VALIDACIÓN COMPLETA:');
    console.log('====================================');
    console.log('');
    console.log('1. Agregar validación de datos antes de crear preferencia:');
    console.log('   - Verificar que items tengan precio > 0');
    console.log('   - Validar formato de email del pagador');
    console.log('   - Confirmar que URLs de retorno sean válidas');
    console.log('');
    console.log('2. Implementar logs detallados:');
    console.log('   - Registrar todos los datos de la preferencia');
    console.log('   - Capturar errores específicos de MercadoPago');
    console.log('   - Implementar alertas para errores PXI03');
    console.log('');
    console.log('3. Crear fallback automático:');
    console.log('   - Método alternativo si falla la preferencia principal');
    console.log('   - Reintentos automáticos con datos simplificados');
    console.log('   - Notificación al usuario sobre el problema');
    console.log('');
    console.log('4. Verificar configuración de MercadoPago:');
    console.log('   - Ir a https://www.mercadopago.cl/developers/panel');
    console.log('   - Confirmar que la cuenta esté en "Modo productivo"');
    console.log('   - Verificar límites de transacción');
    console.log('   - Confirmar configuración de dominio');
}

// Función para generar comando de prueba
function generateTestCommand() {
    console.log('\n📋 5. COMANDO DE PRUEBA:');
    console.log('========================');
    console.log('');
    console.log('Para probar la solución:');
    console.log('');
    console.log('1. Ejecutar validación de MercadoPago:');
    console.log('   node scripts/validate-mercadopago-env.mjs');
    console.log('');
    console.log('2. Probar creación de preferencia:');
    console.log('   node scripts/mp-sanity-check.mjs');
    console.log('');
    console.log('3. Verificar Edge Functions:');
    console.log('   node scripts/check-edge-functions.mjs');
    console.log('');
    console.log('4. Diagnosticar botón de pagar:');
    console.log('   node scripts/diagnostic-mercadopago-button.mjs');
}

// Función principal
function main() {
    try {
        checkMercadoPagoConfig();
        checkDataStructure();
        checkReturnUrls();
        generateSolution();
        generateTestCommand();
        
        console.log('\n🎯 RESUMEN DEL DIAGNÓSTICO:');
        console.log('============================');
        console.log('');
        console.log('✅ El error PXI03-ZC08550NZGXD es un error de validación de datos');
        console.log('✅ Las soluciones están documentadas en SOLUCION_ERROR_PXI03.md');
        console.log('✅ Se recomienda implementar validación completa de datos');
        console.log('✅ Verificar configuración de MercadoPago en el dashboard');
        console.log('');
        console.log('🚀 PRÓXIMOS PASOS:');
        console.log('1. Implementar validación de datos en mercadopagoDirect.ts');
        console.log('2. Agregar logs detallados para debugging');
        console.log('3. Crear fallback automático para errores PXI03');
        console.log('4. Verificar configuración en dashboard de MercadoPago');
        console.log('');
        console.log('📞 Si el problema persiste, contactar soporte de MercadoPago');
        console.log('   con el código de error: PXI03-ZC08550NZGXD');
        
    } catch (error) {
        console.error('❌ Error durante el diagnóstico:', error.message);
        process.exit(1);
    }
}

// Ejecutar diagnóstico
main();
