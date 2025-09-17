const fs = require('fs');
const path = require('path');

// Función para leer archivos markdown recursivamente
function readMarkdownFiles(dir, baseDir = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(baseDir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...readMarkdownFiles(fullPath, relativePath));
    } else if (item.endsWith('.md')) {
      files.push({
        path: fullPath,
        relativePath: relativePath,
        content: fs.readFileSync(fullPath, 'utf8')
      });
    }
  }
  
  return files;
}

// Función para extraer metadatos del contenido markdown
function extractMetadata(content, relativePath) {
  const metadata = {
    title: '',
    excerpt: '',
    tags: [],
    links: [],
    category: '',
    difficulty: 'intermedio',
    estimatedTime: '45 min'
  };
  
  // Extraer título del primer H1
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    metadata.title = titleMatch[1].replace(/\[\[|\]\]/g, '').trim();
  }
  
  // Extraer excerpt del primer párrafo después del frontmatter
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  const firstParagraph = contentWithoutFrontmatter.match(/^([^#\n]+)/m);
  if (firstParagraph) {
    metadata.excerpt = firstParagraph[1].trim().substring(0, 200) + '...';
  }
  
  // Extraer tags y links de los enlaces [[...]]
  const linkMatches = content.match(/\[\[([^\]]+)\]\]/g);
  if (linkMatches) {
    metadata.links = linkMatches.map(link => 
      link.replace(/\[\[|\]\]/g, '').toLowerCase()
    );
  }
  
  // Determinar categoría basada en la ruta del archivo
  if (relativePath.includes('Derecho Civil')) {
    metadata.category = 'derecho-civil';
  } else if (relativePath.includes('Derecho Procesal')) {
    metadata.category = 'derecho-procesal';
  } else if (relativePath.includes('derecho-penal')) {
    metadata.category = 'derecho-penal';
  } else if (relativePath.includes('derecho-constitucional')) {
    metadata.category = 'derecho-constitucional';
  } else if (relativePath.includes('derecho-laboral')) {
    metadata.category = 'derecho-laboral';
  } else if (relativePath.includes('derecho-comercial')) {
    metadata.category = 'derecho-comercial';
  }
  
  return metadata;
}

// Función para generar slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Función principal
function connectApuntesContent() {
  console.log('🔗 Conectando tarjetas de apuntes con contenido...');
  
  // Leer archivos markdown
  const contentDir = path.join(__dirname, '../src/pages/apuntes/content');
  const markdownFiles = readMarkdownFiles(contentDir);
  
  console.log(`📁 Encontrados ${markdownFiles.length} archivos markdown`);
  
  // Leer el JSON existente
  const jsonPath = path.join(__dirname, '../src/pages/apuntes/data/apuntes.json');
  const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Crear mapa de archivos existentes
  const existingFilesMap = new Map();
  existingData.apuntes.forEach(apunte => {
    existingFilesMap.set(apunte.filePath, apunte);
  });
  
  // Procesar cada archivo markdown
  const updatedApuntes = [];
  let idCounter = 1;
  
  for (const file of markdownFiles) {
    const metadata = extractMetadata(file.content, file.relativePath);
    
    // Buscar si ya existe en el JSON
    const existingApunte = existingFilesMap.get(file.relativePath);
    
    if (existingApunte) {
      // Actualizar apunte existente
      const updatedApunte = {
        ...existingApunte,
        title: metadata.title || existingApunte.title,
        excerpt: metadata.excerpt || existingApunte.excerpt,
        links: metadata.links.length > 0 ? metadata.links : existingApunte.links,
        content: file.content,
        lastModified: new Date().toISOString().split('T')[0]
      };
      updatedApuntes.push(updatedApunte);
    } else {
      // Crear nuevo apunte
      const newApunte = {
        id: idCounter.toString(),
        title: metadata.title || path.basename(file.relativePath, '.md'),
        slug: generateSlug(metadata.title || path.basename(file.relativePath, '.md')),
        tags: [],
        related: [],
        date: new Date().toISOString().split('T')[0],
        category: metadata.category,
        difficulty: metadata.difficulty,
        estimatedTime: metadata.estimatedTime,
        author: 'Estudiante de Derecho',
        lastModified: new Date().toISOString().split('T')[0],
        excerpt: metadata.excerpt,
        filePath: file.relativePath,
        links: metadata.links,
        content: file.content
      };
      updatedApuntes.push(newApunte);
      idCounter++;
    }
  }
  
  // Ordenar por categoría y título
  updatedApuntes.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
  
  // Actualizar IDs secuencialmente
  updatedApuntes.forEach((apunte, index) => {
    apunte.id = (index + 1).toString();
  });
  
  // Guardar JSON actualizado
  const updatedData = {
    apuntes: updatedApuntes
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2), 'utf8');
  
  console.log(`✅ Actualizados ${updatedApuntes.length} apuntes`);
  console.log(`📊 Estadísticas:`);
  
  // Contar por categoría
  const categoryStats = {};
  updatedApuntes.forEach(apunte => {
    categoryStats[apunte.category] = (categoryStats[apunte.category] || 0) + 1;
  });
  
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} apuntes`);
  });
  
  console.log('\n🎯 Archivo JSON actualizado en:', jsonPath);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  connectApuntesContent();
}

module.exports = { connectApuntesContent }; 