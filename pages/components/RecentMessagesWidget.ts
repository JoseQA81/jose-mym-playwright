import { expect, type Page } from '@playwright/test';

const MAX_RECENT_MESSAGES = 5;

export class RecentMessagesWidget {
  private readonly conversationItems = () => this.page.locator('[data-testid^="widget_conversation_"]');

  constructor(private page: Page) {}

  /**
   * Método de validación del widget (Validación KATA mínima).
   * 
   * Precondiciones:
   * - El mentor usado en la automatización debe tener más de 5 conversaciones activas en BD.
   * - Los 5 mentees visibles deben tener un avatar configurado por URL para validar la etiqueta <img>.
   * 
   * Limitaciones:
   * - No hay data-testid internos para aislar name, preview y time.
   * 
   * TODO: Solicitar a Frontend que añada: data-testid="recent-messages-widget" en el contenedor.
   * TODO: Solicitar a Frontend que añada dentro de cada tarjeta:
   *       data-testid="mentee-avatar", data-testid="mentee-name", 
   *       data-testid="message-preview", data-testid="message-time"
   */
  async expectActiveConversationsDisplayed() {
    // 1. Validar encabezados y footer del widget
    await expect(this.page.getByText(/Mensajes Recientes/)).toBeVisible();
    await expect(this.page.getByText(/Consultas de estudiantes/)).toBeVisible();
    await expect(this.page.getByTestId('view_all_messages_button')).toBeVisible();

    // 2. Validar conversaciones (Aserción de Colección)
    // Validar el hard-limit esperado
    await expect(this.conversationItems()).toHaveCount(MAX_RECENT_MESSAGES);

    // 3. Validaciones detalladas por cada ítem
    for (let i = 0; i < MAX_RECENT_MESSAGES; i++) {
      const item = this.conversationItems().nth(i);
      
      // Debe ser visible
      await expect(item).toBeVisible();
      
      // Debe ser interactivo
      await expect(item).toBeEnabled();

      // Debe tener texto visible no vacío
      await expect(item).toHaveText(/\S+/);

      // Debe contener un avatar renderizado y con alt text
      const avatarImg = item.locator('img').first();
      await expect(avatarImg).toBeVisible();
      await expect(avatarImg).toHaveAttribute('alt', /\S+/);
    }
  }

  /**
   * Método de validación del empty state del widget.
   * 
   * Precondición:
   * - EMPTY_MENTOR_EMAIL debe pertenecer a un mentor verificado sin conversaciones activas.
   * 
   * Limitación:
   * - El texto del empty state no tiene data-testid estable, por lo que dependemos del texto visible.
   */
  async expectEmptyStateDisplayed() {
    // Validar título del widget
    await expect(this.page.getByText(/Mensajes Recientes/)).toBeVisible();
    
    // Validar subtítulo
    await expect(this.page.getByText(/Consultas de estudiantes/)).toBeVisible();
    
    // Validar que no hay conversaciones
    await expect(this.conversationItems()).toHaveCount(0);
    
    // Validar texto del empty state
    await expect(this.page.getByText(/No tienes mensajes aún\. Completa tu perfil/)).toBeVisible();
    
    // Validar botón view_all_messages_button visible
    await expect(this.page.getByTestId('view_all_messages_button')).toBeVisible();
  }
}
