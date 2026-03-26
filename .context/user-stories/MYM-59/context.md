# Contexto de Automatización: MYM-59
## Mentor Respond to Messages from Dashboard

Este documento técnico sirve de guía para la implementación de pruebas E2E en Playwright para la funcionalidad de respuesta rápida.

---

### 1. User Story: MYM-59
*   **Nombre:** Mentor Respond to Messages from Dashboard.
*   **Alcance:** Widget "Recent Messages" en Dashboard + Modal "Quick Reply".
*   **Prioridad:** Alta (Flujo Core de retención de alumnos).
*   **Estado:** Prioridad absoluta para automatización por historial de bugs críticos.

---

### 2. Casos de Prueba (Priorizados por ROI)

| ID | Escenario | Flujo / Paso Clave | Valor para Playwright |
| :--- | :--- | :--- | :--- |
| **TC2** | **Empty State** | Mentor sin mensajes -> Dashboard -> Ver mensaje de "estado vacío". | **Smoke Test.** Valida Page Objects iniciales. |
| **TC1+3** | **UI & Open** | Mentor con mensajes -> Dashboard -> Clic en mensaje -> Validar Modal (Avatar/Nombre). | **Integración.** Valida props de UI y estados de carga. |
| **TC4** | **Critical Send** | Modal abierto -> Escribir -> Send -> Validar **Optimistic UI** + **Toast Éxito**. | **E2E Crítico.** Previene regresiones históricas graves. |

---

### 3. Guía Técnica para Scripts

#### Precondiciones (Data Setup)
*   **Roles:** Requiere cuenta con rol `Mentor`.
*   **Ruta Base:** `/dashboard`.
*   **Inyección de Datos (Recomendado vía API/SQL en `beforeEach`):**
    *   **Estado Limpio (TC2):** 0 conversaciones en BD.
    *   **Estado Activo (TC1, 3, 4):** Al menos 1 conversación con un `Mentee`.

#### Locators y Selectores
*   **Contenedor Principal:** `data-testid="recent-messages-widget"`.
*   **Interacciones:** Preferir locators por `role` o `test-id` para el input del modal y el botón "Send".

#### Manejo de Asincronía
*   **Optimistic UI:** El test debe verificar que la burbuja de chat aparece inmediatamente en el DOM tras el clic, incluso antes de que el Toast de éxito confirme la persistencia.
*   **Success Feedback:** `await page.waitForSelector('text="[Mensaje de éxito]"')`.

---

### 4. Blindaje de Riesgos (Bugs Históricos)
Configurar assertions específicos para asegurar que estos fallos no regresen:

*   **MYM-132 (Resiliencia de Red):** La app crasheaba al enviar sin conexión. (Automatizar en Fase 2/3 simulando `context.setOffline(true)`).
*   **MYM-155 (Espacios en Blanco):** Fallo al renderizar la burbuja propia. **Assert:** `expect(bubble).toBeVisible()` tras el envío.
*   **Zombie Dot:** Badge de "no leído" persistente. **Assert:** Validar que el badge desaparece al abrir la conversación en el modal.

---

### 5. Roadmap de Implementación
1.  **Semana 1:** `tests/e2e/messaging-system/mentor-dashboard-empty.spec.ts` (TC2).
2.  **Semana 2:** `tests/e2e/messaging-system/mentor-quick-reply.spec.ts` (TC4 - Happy Path).

---

### 6. Exclusiones (MVP Inicial)
*   **Realtime Sockets (MYM-96):** No testear actualización automática del widget (requiere F5 actual).
*   **Ghost Effect (TC6):** Mensajes entrantes concurrentes (complejidad alta de inyección).
*   **Inbox Link:** Navegación trivial fuera del alcance prioritario.
