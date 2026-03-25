// USER STORY: https://upexgalaxy65.atlassian.net/browse/MYM-59
import { expect, test } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

const mentorEmail = process.env.MENTOR_EMAIL;
const mentorPassword = process.env.MENTOR_PASSWORD;

// Verifica que las credenciales necesarias se hayan cargado desde el archivo '.env' antes de ejecutar los tests
if (!mentorEmail || !mentorPassword) {
  throw new Error('Faltan MENTOR_EMAIL o MENTOR_PASSWORD en el archivo .env');
}

// Crea una contraseña intencionadamente inválida para el caso negativo de login
const invalidMentorPassword = mentorPassword + 'wrong';

test.describe('Login Test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        
    });

test('TCJose - Mentor can log in successfully', async ({ page }) => {
        await page.getByTestId('login_button').click();
        await page.getByPlaceholder('email').fill(mentorEmail); // Usar variable de entorno para el email
        await page.getByTestId('password_input').fill(mentorPassword); // Usar variable de entorno para la contraseña
        await page.getByTestId('submit_button').click();

        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByTestId('user_name')).toBeVisible();

        

    });

// CASO NEGATIVO

  test('mentor sees an error with invalid credentials', async ({ page }) => {
        await page.getByTestId('login_button').click();
        await page.getByPlaceholder('email').fill(mentorEmail); // Usar variable de entorno para el email
        await page.getByTestId('password_input').fill(invalidMentorPassword); // Usar variable de entorno para la contraseña
        await page.getByTestId('submit_button').click();

        await expect(page.getByTestId('server_error')).toBeVisible();
        await expect(page.getByTestId('server_error')).toHaveText('Email o contraseña incorrectos. Verifica e intenta de nuevo.');

        await expect(page).not.toHaveURL('/dashboard'); // Verificar que no se redirige al dashboard

    });

        


});

