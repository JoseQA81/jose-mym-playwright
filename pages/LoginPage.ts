import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async loginSuccessfully(email: string, password: string) {
    await this.page.getByTestId('login_button').click();
    await this.page.getByPlaceholder('email').fill(email);
    await this.page.getByTestId('password_input').fill(password);
    await this.page.getByTestId('submit_button').click();
    
    await expect(this.page).toHaveURL(/.*\/dashboard/);
    await expect(this.page.getByTestId('user_name')).toBeVisible();
  }

  async loginWithInvalidCredentials(email: string, password: string) {
    await this.page.getByTestId('login_button').click();
    await this.page.getByPlaceholder('email').fill(email);
    await this.page.getByTestId('password_input').fill(password);
    await this.page.getByTestId('submit_button').click();
    
    const serverError = this.page.getByTestId('server_error');
    await expect(serverError).toBeVisible();
    await expect(serverError).toHaveText('Email o contraseña incorrectos. Verifica e intenta de nuevo.');
  }
}
