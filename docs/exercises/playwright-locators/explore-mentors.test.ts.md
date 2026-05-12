# explore-mentors.test.ts

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

const mentorEmail = process.env.MENTOR_EMAIL;
const mentorPassword = process.env.MENTOR_PASSWORD;

// Verifica que las credenciales necesarias se hayan cargado desde el archivo '.env' antes de ejecutar los tests
if (!mentorEmail || !mentorPassword) {
  throw new Error('Faltan MENTOR_EMAIL o MENTOR_PASSWORD en el archivo .env');
}

test.describe('mentor can navigate to explore mentors', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login(mentorEmail, mentorPassword);
    await expect(page).toHaveURL('/dashboard');
  });

  test('mentor can navigate to explore mentors and see mentor cards', async ({ page }) => {
    await expect(page.getByTestId('explore_mentors_link')).toBeVisible();

    await page.getByTestId('explore_mentors_link').click();
    await expect(page).toHaveURL('/mentors');

    await expect(page.getByTestId('page_title')).toBeVisible();
    await expect(page.getByTestId('page_description')).toBeVisible();
    await expect(page.getByText('Filtrar por Skills')).toBeVisible();
    await expect(page.getByText('Unreal engine 5')).toBeVisible();

    // Busca todas las mentorCard y quédate con la que contiene dentro un name_text con el texto Jose Super QA Mentor.
    const myCard = page.getByTestId('mentorCard').filter({
        has: page.getByTestId('name_text').filter({ hasText: 'Jose Super QA Mentor' })
    });
    // Acotamos la búsqueda a mi tarjeta de mentor usando el nombre para evitar ambigüedades con otras cards.
     
    await expect(myCard).toBeVisible();
    await expect(myCard.getByTestId('avatar_fallback')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jose Super QA Mentor' })).toBeVisible();

    const myProfileButton = myCard.getByRole('button', { name: 'Ver Perfil' });
    await expect(myProfileButton).toBeVisible();

    });

  test('mentor can open their profile from explore mentors', async ({ page }) => {
    await expect(page.getByTestId('explore_mentors_link')).toBeVisible();

    await page.getByTestId('explore_mentors_link').click();
    await expect(page).toHaveURL('/mentors');

    // Busca todas las mentorCard y quédate con la que contiene dentro un name_text con el texto Jose Super QA Mentor
    const myCard = page.getByTestId('mentorCard').filter({
      has: page.getByTestId('name_text').filter({ hasText: 'Jose Super QA Mentor' })
    });
    // Acotamos la búsqueda a mi tarjeta de mentor usando el nombre para evitar ambigüedades con otras cards

    await expect(myCard).toBeVisible();

    const myProfileButton = myCard.getByRole('button', { name: 'Ver Perfil' });
    await expect(myProfileButton).toBeVisible();

    await myProfileButton.click();

    await expect(page).toHaveURL(/\/mentors\/\d+/); // Verifica que la URL cambie a /mentors/ seguida de un número (id del mentor). \d+ significa “uno o más dígitos”, por eso esta regex valida una ruta tipo /mentors/123
    await expect(page.getByText('✓ Verificado')).toBeVisible();
    await expect(page.getByTestId('hourly_rate')).toBeVisible();
    await expect(page.getByTestId('book_button')).toBeVisible();
    await expect(page.getByText('Playwright')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible();
  });


});```
