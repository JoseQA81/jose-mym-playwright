# payments.test.ts

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

const mentorEmail = process.env.MENTOR_EMAIL;
const mentorPassword = process.env.MENTOR_PASSWORD;

// Verifica que las credenciales necesarias se hayan cargado desde el archivo '.env' antes de ejecutar los tests
if (!mentorEmail || !mentorPassword) {
  throw new Error('Faltan MENTOR_EMAIL o MENTOR_PASSWORD en el archivo .env');
}

test.describe('mentor can configure communication channels', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login(mentorEmail, mentorPassword);
    await expect(page).toHaveURL('/dashboard');

  });

  test('mentor can open payments and see payouts options', async ({ page }) => {
    await expect(page.getByTestId('payouts_link')).toBeVisible();
    await page.getByTestId('payouts_link').click();
    await expect(page).toHaveURL('/dashboard/payouts');

    await expect(page.getByText('Volver al Dashboard')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pagos y Transferencias' })).toBeVisible();
    await expect(page.getByText('Verification Required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Complete Verification on Stripe' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cómo funcionan los pagos' })).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();
    await expect(page.getByText('Las transferencias se procesan en 2-7 días hábiles dependiendo de tu banco.')).toBeVisible();

    });

  test('mentor can open Stripe verification link', async ({ page }) => {
    await expect(page.getByTestId('payouts_link')).toBeVisible();
    await page.getByTestId('payouts_link').click();
    await expect(page).toHaveURL('/dashboard/payouts');

    await expect(page.getByRole('button', { name: 'Complete Verification on Stripe' })).toBeVisible();
    await page.getByRole('button', { name: 'Complete Verification on Stripe' }).click();
    await expect(page).toHaveURL(/connect\.stripe\.com\/setup\/e\//); 
    // Verifica que la URL contenga 'connect.stripe.com/setup/e/' después de hacer clic en el botón

    });

});```
