# Guía de Configuración de OpenAPI MCP

> **Idioma:** Español
> **Nivel:** Intermedio
> **Audiencia:** QA Engineers configurando testing de APIs via MCP

---

Esta guía te ayuda a conectar tu asistente IA a tu API usando el servidor MCP de OpenAPI. Esto permite testing de APIs asistido por AI generando herramientas dinámicamente desde tu especificación OpenAPI/Swagger.

## Notas Importantes para QA Automation

- **MCP es para exploración:** El servidor OpenAPI MCP se usa estrictamente para exploración interactiva de endpoints por parte del agente. **No** es una dependencia para la ejecución de tests en Playwright.
- **Configuración Local:** Cualquier configuración real de MCP con headers, apikeys o tokens debe quedarse en local e ignorada por Git (por ejemplo en tu archivo `.mcp.json` u opciones de configuración de tu AI CLI).
- **Variables de Tests:** Los tests en Playwright deben usar variables de entorno locales (`.env`) o GitHub Secrets, nunca valores hardcodeados.
- **Variables permitidas en esta fase inicial:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Variables prohibidas en tests normales:**
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_JWT_SECRET`
  - `POSTGRES_*` (Cadenas de conexión directa a BD)

---

## Cómo Funciona

El servidor MCP de OpenAPI lee tu especificación de API y crea herramientas dinámicamente para cada endpoint:

```
Spec OpenAPI → Servidor MCP → Herramientas Dinámicas → Asistente IA
     ↓              ↓                   ↓
GET /resource   →   api_get_resource   →   "Consultar recurso de ejemplo"
POST /resource  →   api_post_resource  →   "Crear recurso de ejemplo"
```

---

## Configuración para Supabase REST API

Agrega a la configuración de tu AI CLI (ej. `.mcp.json`):

```json
{
  "mcpServers": {
    "supabase-api": {
      "command": "npx",
      "args": ["-y", "@ivotoby/openapi-mcp-server", "--tools", "dynamic"],
      "env": {
        "API_BASE_URL": "<YOUR_SUPABASE_URL>/rest/v1",
        "OPENAPI_SPEC_PATH": "<YOUR_SUPABASE_URL>/rest/v1/?apikey=<YOUR_SUPABASE_ANON_KEY>",
        "API_HEADERS": "apikey:<YOUR_SUPABASE_ANON_KEY>"
      }
    }
  }
}
```

---

## Opciones de Configuración Básicas

### Variables de Entorno

| Variable            | Requerida | Descripción                   |
| ------------------- | --------- | ----------------------------- |
| `API_BASE_URL`      | Sí        | URL base para requests de API |
| `OPENAPI_SPEC_PATH` | Sí        | Ruta o URL a la spec OpenAPI  |
| `API_HEADERS`       | No        | Headers personalizados        |

---

## Consideraciones de Autenticación

Para testing de usuarios autenticados, considera usar:
- **Postman** para requests autenticados manuales
- **Tests UI/E2E con Playwright** para flujos completos con login automatizado

## Buenas Prácticas

### 1. Empezar con Operaciones de Solo Lectura

Prueba endpoints GET primero antes de intentar POST/PUT/DELETE:

```
"Consultar recurso de ejemplo" ✓ (seguro)
"Eliminar recurso X" ✗ (verifica primero!)
```

### 2. Verificar Antes de Modificar

Pídele al agente que muestre qué va a hacer antes de ejecutar acciones de escritura.

---

## Integración con Framework KATA

Para tests de API automatizados, usa clientes API tipados en lugar del MCP:

| Caso de Uso                  | Herramienta            |
| ---------------------------- | ---------------------- |
| Testing exploratorio         | OpenAPI MCP            |
| Verificación manual          | OpenAPI MCP            |
| Suite de tests automatizados | Playwright API Clients |
| Integración CI/CD            | Playwright             |
