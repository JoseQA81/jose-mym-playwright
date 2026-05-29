# OpenAPI Integration Guide

> Configuring OpenAPI integration for type-safe API testing.

---

## Important Notes for QA Automation

- **MCP is for exploration**: The OpenAPI MCP is strictly used for exploring endpoints dynamically via AI agents. It must **not** be used as a dependency for executing Playwright tests.
- **Local Configuration**: Any real MCP configuration containing headers, API keys, or tokens must remain local and be ignored by Git (e.g., in a local `.mcp.json` file or AI CLI config).
- **Test Variables**: Playwright tests must rely on local `.env` variables or GitHub Secrets, never on hardcoded values.
- **Allowed Variables for this phase**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Forbidden Variables**:
  - Do NOT use `SUPABASE_SERVICE_ROLE_KEY` in normal tests.
  - Do NOT use `SUPABASE_JWT_SECRET`.
  - Do NOT use direct database connection strings (`POSTGRES_*`).

---

## Overview

The automation framework uses **OpenAPI/Swagger specifications** to enable:

- **Contract testing** - Validate responses against actual API schemas
- **Endpoint Discovery** - Exploring existing methods and payloads

*Note: Automated Type generation from Swagger (e.g. `bun run api:sync`) is an advanced feature that might be integrated later once the basic API architecture is validated.*

---

## Security Best Practices

1. **Never commit secrets** - Any tokens or keys used to fetch API specifications must remain in `.env` or local MCP configurations.
2. **Environment isolation** - Ensure that the OpenAPI spec downloaded corresponds to the environment under test (e.g., Staging).
3. **Use Anonymous Keys for smoke tests** - For Supabase environments, smoke tests should rely on `<YOUR_SUPABASE_ANON_KEY>` before attempting authenticated operations.
