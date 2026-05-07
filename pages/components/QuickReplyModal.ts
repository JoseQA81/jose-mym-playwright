import { expect, type Page } from '@playwright/test';

export class QuickReplyModal {
  private readonly modal = () => this.page.getByTestId('quick_reply_modal');
  private readonly participantName = () => this.modal().getByTestId('participant_name');
  private readonly avatarImg = () => this.modal().getByRole('img').first();
  private readonly replyTextarea = () => this.modal().getByTestId('reply_textarea');
  private readonly profileLink = () => this.modal().getByRole('link', { name: /Ver perfil completo/i });

  constructor(private page: Page) {}

  async expectModalDisplayed() {
    await expect(this.modal()).toBeVisible();

    await expect(this.participantName()).toBeVisible();
    await expect(this.participantName()).toHaveText(/\S+/);

    await expect(this.avatarImg()).toBeVisible();

    await expect(this.replyTextarea()).toBeVisible();
  }

  async navigateToMenteeProfile() {
    await expect(this.profileLink()).toBeVisible();
    // Validar que el href tiene exactamente el patrón esperado (/students/ seguido de un UUID o similar)
    await expect(this.profileLink()).toHaveAttribute('href', /\/students\/[a-f0-9-]+/);
    
    await this.profileLink().click();

    // Validar que la URL de Playwright cambió exitosamente al destino
    await expect(this.page).toHaveURL(/.*\/students\/[a-f0-9-]+/);
  }
}
