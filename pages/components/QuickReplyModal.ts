import { expect, type Page, type Locator } from '@playwright/test';

export class QuickReplyModal {
  private readonly modal: Locator;

  constructor(private page: Page) {
    this.modal = page.getByTestId('quick_reply_modal');
  }

  async expectModalDisplayed() {
    await expect(this.modal).toBeVisible();

    const participantName = this.modal.getByTestId('participant_name');
    await expect(participantName).toBeVisible();
    await expect(participantName).toHaveText(/\S+/);

    const avatarImg = this.modal.locator('img').first();
    await expect(avatarImg).toBeVisible();

    const textarea = this.modal.locator('textarea');
    await expect(textarea).toBeVisible();
  }

  async navigateToMenteeProfile() {
    const profileLink = this.modal.locator('a[title="Ver perfil completo"][href^="/students/"]').first();
    
    await expect(profileLink).toBeVisible();
    // Validar que el href tiene exactamente el patrón esperado (/students/ seguido de un UUID o similar)
    await expect(profileLink).toHaveAttribute('href', /\/students\/[a-f0-9-]+/);
    
    await profileLink.click();

    // Validar que la URL de Playwright cambió exitosamente al destino
    await expect(this.page).toHaveURL(/.*\/students\/[a-f0-9-]+/);
  }
}
