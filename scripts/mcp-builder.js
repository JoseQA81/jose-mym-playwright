#!/usr/bin/env bun
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// =========== VARIABLES DE ENTORNO ============
// Bun carga automáticamente el archivo .env del directorio actual
const { MCP_CATALOG_FILE, MCP_FILE, AI_COMMAND_PATH } = process.env;

// Validar variables de entorno críticas (AI_COMMAND_PATH es opcional)
if (!MCP_CATALOG_FILE || !MCP_FILE) {
  console.error('❌ Faltan variables de entorno necesarias en .env: MCP_CATALOG_FILE, MCP_FILE');
  process.exit(1);
}

// ============ CONFIGURACIÓN ============
const mcpCatalogFile = path.join(process.cwd(), MCP_CATALOG_FILE);
const mcpFile = path.join(process.cwd(), MCP_FILE);
const aiCommandPath = AI_COMMAND_PATH;
const codeAgentName = aiCommandPath ? path.basename(aiCommandPath) : null;

// Perfiles mínimos y ajustados para jose-mym-playwright
const PROFILES = {
  docs: ['context7', 'tavily'],
  report: ['atlassian'],
  uitest: ['playwright', 'context7'],
  full: 'ALL', // Marcador especial: carga TODOS los MCPs del catálogo
};

// ============ FUNCIONES ============

function loadCatalog() {
  if (!fs.existsSync(mcpCatalogFile)) {
    console.error(`❌ No encontré ${mcpCatalogFile}`);
    console.error('💡 Crea el archivo con tus MCPs copiando y renombrando la plantilla:');
    console.error('   cp .gemini/settings.catalog.template.json .gemini/settings.catalog.json');
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(mcpCatalogFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error al leer ${mcpCatalogFile}:`, error.message);
    process.exit(1);
  }
}

function parseArgs(catalog) {
  const args = process.argv.slice(2);

  // Caso sin argumentos = generar config vacío
  if (args.length === 0) {
    console.log('⚠️ No se especificaron MCPs. Generando config vacío (0 MCPs).');
    return [];
  }

  const input = args[0];

  // Caso especial: full = todos los MCPs
  if (input === 'full') {
    const allMcps = Object.keys(catalog.mcpServers);
    console.log('\n⚠️ ADVERTENCIA: Usando perfil "full"');
    console.log(`📊 Total de MCPs a cargar: ${allMcps.length}\n`);
    return allMcps;
  }

  // ¿Es un perfil predefinido?
  if (PROFILES[input]) {
    const profile = PROFILES[input];
    if (profile === 'ALL') {
      return Object.keys(catalog.mcpServers);
    }
    return profile;
  }

  // ¿Es lista de MCPs separados por coma?
  const mcps = input.split(',').map(m => m.trim());

  // Validar que TODOS existen
  const invalid = mcps.filter(m => !catalog.mcpServers[m]);
  if (invalid.length > 0) {
    console.error('❌ MCPs inválidos:', invalid.join(', '));
    console.log('\n🔧 MCPs disponibles:', Object.keys(catalog.mcpServers).join(', '));
    process.exit(1);
  }

  return mcps;
}

// Función recursiva para reemplazar ${VAR} por process.env.VAR
function interpolateSecrets(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/\${(\w+)}/g, (_, varName) => {
      const value = process.env[varName];
      if (!value) console.warn(`⚠️ Advertencia: Variable de entorno ${varName} no definida en el archivo .env`);
      return value || `\${${varName}}`;
    });
  }
  if (Array.isArray(obj)) return obj.map(interpolateSecrets);
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = interpolateSecrets(value);
    }
    return result;
  }
  return obj;
}

function generateMcpJson(selectedMcps, catalog) {
  const mcpServers = {};

  // Si no hay MCPs seleccionados, generar vacío
  if (selectedMcps.length === 0) {
    fs.writeFileSync(mcpFile, JSON.stringify({ mcpServers: {} }, null, 2), 'utf8');
    console.log(`✅ ${MCP_FILE} generado (vacío)`);
    return;
  }

  // Construir objeto mcpServers con solo los seleccionados e interpolar variables
  selectedMcps.forEach((name) => {
    // Interpolar las variables en los valores del objeto mcp original antes de guardarlo
    mcpServers[name] = interpolateSecrets(catalog.mcpServers[name]);
  });

  const config = { mcpServers };

  // Escribir nuevo settings.json
  fs.writeFileSync(mcpFile, JSON.stringify(config, null, 2), 'utf8');
  console.log(`✅ ${MCP_FILE} generado y secretos inyectados`);
  console.log(`📊 MCPs activos: ${selectedMcps.join(', ')}`);
  console.log(`📈 Total: ${selectedMcps.length} MCPs`);
}

function startCodeAgentCLI() {
  if (!aiCommandPath) {
    console.log('\n💡 AI_COMMAND_PATH no configurado. Puedes lanzar tu CLI manualmente.');
    return;
  }

  console.log(`\n🚀 Iniciando ${codeAgentName}...\n`);
  console.log('─'.repeat(50));

  const codeAgent = spawn(aiCommandPath, [], {
    stdio: 'inherit',
    shell: true,
  });

  codeAgent.on('error', (err) => {
    console.error(`\n❌ Error al iniciar ${codeAgentName}:`, err.message);
    process.exit(1);
  });
}

// ============ MAIN ============
function main() {
  console.log('🔧 MCP Builder Seguro\n');

  const catalog = loadCatalog();
  const selectedMcps = parseArgs(catalog);

  generateMcpJson(selectedMcps, catalog);
  startCodeAgentCLI();
}

try {
  main();
} catch (error) {
  console.error('❌ Error inesperado:', error.message);
  process.exit(1);
}