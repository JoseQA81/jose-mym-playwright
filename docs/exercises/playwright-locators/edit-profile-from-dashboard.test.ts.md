# edit-profile-from-dashboard.test.ts

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

const mentorEmail = process.env.MENTOR_EMAIL;
const mentorPassword = process.env.MENTOR_PASSWORD;

if (!mentorEmail || !mentorPassword) {
  throw new Error('Faltan MENTOR_EMAIL o MENTOR_PASSWORD en el archivo .env');
}

test.describe('mentor can navigate from dashboard to edit profile', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.login(mentorEmail, mentorPassword);
    await expect(page).toHaveURL('/dashboard');
  });

  test('mentor should be able to edit their profile', async ({ page }) => {
    await expect(page.getByText('Los perfiles completos reciben 3x más solicitudes de sesión.')).toBeVisible();

    await page.getByTestId('edit_profile_button').click();
    await expect(page).toHaveURL('/profile/edit');

    await expect(page.getByLabel('Nombre completo')).toBeVisible();
    await expect(page.getByLabel('Sobre ti')).toBeVisible();
    await expect(page.getByText('Especialidades técnicas')).toBeVisible();
    await expect(page.getByLabel('Años de experiencia')).toBeVisible();
    await expect(page.getByLabel('Tarifa por hora (USD)')).toBeVisible();

    const linkedinInput = page.getByLabel('URL de LinkedIn');
    const githubInput = page.getByLabel('URL de GitHub');

    await linkedinInput.fill('https://www.linkedin.com/jose-probando');
    await expect(linkedinInput).toHaveValue('https://www.linkedin.com/jose-probando');
    
    await githubInput.fill('https://github.com/probandoGitHub');
    await expect(githubInput).toHaveValue('https://github.com/probandoGitHub');


    });

    test('mentor should be able to update social media links successfully', async ({ page }) => {
      await page.getByTestId('edit_profile_button').click();
      await expect(page).toHaveURL('/profile/edit');

      const linkedinInput = page.getByLabel('URL de LinkedIn');
      const githubInput = page.getByLabel('URL de GitHub');
      const submitButton = page.getByRole('button', { name: 'Guardar perfil' });

      const uniqueId = Date.now(); // Genera valores únicos para que el formulario detecte cambios reales y permita guardar el perfil.

      const linkedinUrl = `https://www.linkedin.com/in/jose-probando-${uniqueId}`;
      const githubUrl = `https://github.com/probandoGitHub-${uniqueId}`;

      await linkedinInput.fill(linkedinUrl);
      await githubInput.fill(githubUrl);

      await expect(linkedinInput).toHaveValue(linkedinUrl);
      await expect(githubInput).toHaveValue(githubUrl);

      await submitButton.click();

      // Verificar que se muestre un mensaje de éxito después de guardar los cambios
      await expect(page.getByText('¡Perfil actualizado! Ya puedes recibir solicitudes de mentoría.')).toBeVisible();

      await page.reload(); // Recargar la página para verificar que los cambios se hayan guardado correctamente

      await expect(page).toHaveURL('/profile/edit'); // Verificar que se mantenga en la página de edición después de guardar
      await expect(linkedinInput).toHaveValue(linkedinUrl); // Verificar que el campo de LinkedIn mantenga el valor actualizado
      await expect(githubInput).toHaveValue(githubUrl); // Verificar que el campo de GitHub mantenga el valor actualizado

      });

});```
