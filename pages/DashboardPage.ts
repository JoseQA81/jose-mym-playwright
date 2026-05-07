import { expect, type Page } from '@playwright/test';
import { RecentMessagesWidget } from './components/RecentMessagesWidget';
import { QuickReplyModal } from './components/QuickReplyModal';

export class DashboardPage {
  readonly recentMessages: RecentMessagesWidget;
  readonly quickReplyModal: QuickReplyModal;

  constructor(private page: Page) {
    this.recentMessages = new RecentMessagesWidget(page);
    this.quickReplyModal = new QuickReplyModal(page);
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  /**
   * Valida que el Dashboard cargó correctamente y el contexto del usuario existe.
   */
  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*\/dashboard/);
    await expect(this.page.getByTestId('user_name')).toBeVisible();
  }
}
