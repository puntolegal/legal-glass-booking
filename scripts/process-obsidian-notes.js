#!/usr/bin/env node

/**
 * Script para procesar archivos MD de Obsidian y extraer enlaces internos
 * Uso: node scripts/process-obsidian-notes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para extraer enlaces Obsidian [[concepto]]
function extractObsidianLinks(content) {
  const matches = content.match(/\[\[([^\]]+)\]\]/g);
  if (!matches) return [];
  return matches.map(match => {
    const concept = match.replace(/\[\[|\]\]/g, '');
    return concept.toLowerCase().replace(/\s+/g, '-');
  });
}

// Función para extraer metadatos del frontmatter
function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};
  
  const frontmatter = frontmatterMatch[1];
  const metadata = {};
  
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      metadata[key.trim()] = value.replace(/^["']|["']$/g, ''); // Remove quotes
    }
  });
  
  return metadata;
}

// Función para procesar un archivo MD
function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const metadata = extractFrontmatter(content);
    const links = extractObsidianLinks(content);
    
    // Extraer título del primer H1 o del nombre del archivo
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/\[\[|\]\]/g, '') : path.basename(filePath, '.md');
    
    // Crear slug del título
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    // Extraer excerpt (primer párrafo después del frontmatter)
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    const firstParagraph = contentWithoutFrontmatter.match(/^([^#\n]+)/m);
    const excerpt = firstParagraph ? firstParagraph[1].trim().substring(0, 200) + '...' : '';
    
    return {
      title,
      slug,
      filePath: path.relative(path.join(__dirname, '../src/pages/apuntes/content'), filePath),
      links,
      excerpt,
      metadata,
      content
    };
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error.message);
    return null;
  }
}

// Función para recorrer directorios recursivamente
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Función principal
async function processObsidianNotes() {
  console.log('🔍 Procesando archivos MD de Obsidian...\n');
  
  const contentDir = path.join(__dirname, '../src/pages/apuntes/content');
  const allFiles = walkDir(contentDir);
  
  console.log(`📁 Encontrados ${allFiles.length} archivos MD`);
  
  const processedNotes = [];
  const allLinks = new Set();
  
  // Procesar cada archivo
  allFiles.forEach(filePath => {
    const result = processMarkdownFile(filePath);
    if (result) {
      processedNotes.push(result);
      result.links.forEach(link => allLinks.add(link));
      console.log(`✅ ${result.title} (${result.links.length} enlaces)`);
    }
  });
  
  // Crear metadatos para el sistema
  const apuntesData = {
    apuntes: processedNotes.map((note, index) => ({
      id: (index + 1).toString(),
      title: note.title,
      slug: note.slug,
      tags: note.metadata.tags ? note.metadata.tags.split(',').map(t => t.trim()) : [],
      related: note.links.slice(0, 5), // Primeros 5 enlaces como relacionados
      date: note.metadata.date || '2025-01-15',
      category: note.metadata.category || 'derecho-civil',
      difficulty: note.metadata.difficulty || 'intermedio',
      estimatedTime: note.metadata.estimatedTime || '45 min',
      author: note.metadata.author || 'Estudiante de Derecho',
      lastModified: note.metadata.lastModified || '2025-01-15',
      excerpt: note.excerpt,
      filePath: note.filePath,
      links: note.links
    })),
    categories: [
      {
        id: 'derecho-civil',
        name: 'Derecho Civil',
        description: 'Ramas del derecho civil, contratos, responsabilidad, sucesiones',
        color: 'blue',
        icon: 'Scale'
      },
      {
        id: 'derecho-penal',
        name: 'Derecho Penal',
        description: 'Delitos, penas, procedimiento penal, garantías penales',
        color: 'red',
        icon: 'Shield'
      },
      {
        id: 'derecho-laboral',
        name: 'Derecho Laboral',
        description: 'Contratos de trabajo, derechos laborales, seguridad social',
        color: 'orange',
        icon: 'Users'
      },
      {
        id: 'derecho-comercial',
        name: 'Derecho Comercial',
        description: 'Sociedades, contratos comerciales, quiebras',
        color: 'purple',
        icon: 'Building'
      },
      {
        id: 'derecho-constitucional',
        name: 'Derecho Constitucional',
        description: 'Constitución, derechos fundamentales, garantías',
        color: 'green',
        icon: 'Flag'
      }
    ],
    tags: Array.from(allLinks)
  };
  
  // Guardar metadatos
  const outputPath = path.join(__dirname, '../src/pages/apuntes/data/apuntes.json');
  fs.writeFileSync(outputPath, JSON.stringify(apuntesData, null, 2));
  
  console.log('\n📊 Estadísticas:');
  console.log(`📝 Total de apuntes: ${processedNotes.length}`);
  console.log(`🔗 Total de enlaces únicos: ${allLinks.size}`);
  console.log(`📁 Archivo de metadatos guardado en: ${outputPath}`);
  
  console.log('\n🎯 Enlaces más comunes:');
  const linkCounts = {};
  processedNotes.forEach(note => {
    note.links.forEach(link => {
      linkCounts[link] = (linkCounts[link] || 0) + 1;
    });
  });
  
  Object.entries(linkCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([link, count]) => {
      console.log(`  • ${link}: ${count} referencias`);
    });
  
  console.log('\n✅ ¡Procesamiento completado!');
  console.log('💡 Ahora puedes usar el sistema de apuntes con enlaces Obsidian.');
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  processObsidianNotes().catch(console.error);
}

export { processObsidianNotes }; 