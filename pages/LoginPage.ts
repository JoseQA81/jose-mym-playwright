import { expect, type Page } from '@playwright/test';

export class LoginPage {
  private readonly loginButton = () => this.page.getByTestId('login_button');
  private readonly emailInput = () => this.page.getByPlaceholder('email');
  private readonly passwordInput = () => this.page.getByTestId('password_input');
  private readonly submitButton = () => this.page.getByTestId('submit_button');
  private readonly serverError = () => this.page.getByTestId('server_error');

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async loginSuccessfully(email: string, password: string) {
    await this.loginButton().click();
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  async loginWithInvalidCredentials(email: string, password: string) {
    await this.loginButton().click();
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
    
    await expect(this.serverError()).toBeVisible();
    await expect(this.serverError()).toHaveText('Email o contraseña incorrectos. Verifica e intenta de nuevo.');
  }
}
