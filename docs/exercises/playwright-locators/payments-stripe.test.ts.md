# payments-stripe.test.ts

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

test('mentor can open Stripe verification link', async ({ page }) => {
    await expect(page.getByTestId('payouts_link')).toBeVisible();
    await page.getByTestId('payouts_link').click();
    await expect(page).toHaveURL('/dashboard/payouts');

    const stripeButton = page.getByRole('button', { name: 'Complete Verification on Stripe' });

    await expect(stripeButton).toBeVisible();
    // Esperamos la redirección a Stripe al mismo tiempo que hacemos click para evitar fallos de sincronización
    await Promise.all([ // lanza las dos cosas a la vez y espera a que ambas se completen
    page.waitForURL(/connect\.stripe\.com\/setup\/e\//),
    stripeButton.click(),
  ]);

    await expect(page).toHaveURL(/connect\.stripe\.com\/setup\/e\//);
    // Verifica que la URL contenga 'connect.stripe.com/setup/e/' después de hacer clic en el botón

    });

test('mentor can navigate to Stripe verification flow', async ({ page }) => {
    await expect(page.getByTestId('payouts_link')).toBeVisible();
    await page.getByTestId('payouts_link').click();
    await expect(page).toHaveURL('/dashboard/payouts');

    const stripeButton = page.getByRole('button', { name: 'Complete Verification on Stripe' });

    await expect(stripeButton).toBeVisible();

    // Esperamos la redirección a Stripe al mismo tiempo que hacemos click para evitar fallos de sincronización
  await Promise.all([
    page.waitForURL(/connect\.stripe\.com\/setup\/e\//),
    stripeButton.click(),
  ]);

    await expect(page).toHaveURL(/connect\.stripe\.com\/setup\/e\//);

    await expect(page.getByText('New business sandbox', { exact: true })).toBeVisible();

    const returnToPlatformLink = page.locator('[data-test-id="return-to-platform-link"]');

    await expect(returnToPlatformLink).toBeVisible();
    await returnToPlatformLink.click();


    await expect(page).toHaveURL(/\/dashboard\/payouts/);
    // Usamos una regex para validar la parte estable de la URL sin depender de query params

    await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible();
    await expect(page.getByText('Your account has been successfully connected for payouts.')).toBeVisible();


    });

});```
