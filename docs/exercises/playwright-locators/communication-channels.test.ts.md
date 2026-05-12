# communication-channels.test.ts

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

  test('mentor can open communication settings and select a video call channel', async ({ page }) => {
    await expect(page.getByTestId('communication_settings_link')).toBeVisible();

    await page.getByTestId('communication_settings_link').click();
    await expect(page).toHaveURL('/dashboard/settings/communication');

    await expect(page.getByRole('heading', { name: 'Configuración de Canales' })).toBeVisible();
    await expect(page.getByText('Define cómo te comunicarás con tus mentees durante las sesiones de mentoría.')).toBeVisible();

    const googleMeetCheckbox = page.getByRole('checkbox', { name: 'Google Meet' }); // Buscamos Google Meet por rol y nombre accesible

    await expect(googleMeetCheckbox).toHaveAttribute('aria-checked', 'false');
    await googleMeetCheckbox.click();
    await expect(googleMeetCheckbox).toHaveAttribute('aria-checked', 'true');
    
    await expect(page.getByText('Gratuito y ampliamente usado')).toBeVisible();

    });

  test('mentor can open communication settings and select a chat channel', async ({ page }) => {
    const communicationChannelsLink = page.getByTestId('communication_settings_link'); // He guardado en una variable el locator del link de 'canales' de comunicación para reutilizarlo.

    await expect(communicationChannelsLink).toBeVisible();
    await communicationChannelsLink.click();
    await expect(page).toHaveURL('/dashboard/settings/communication');

    await expect(page.getByText('Mensajería', { exact: true })).toBeVisible();
    await expect(page.getByText('Apps de mensajería instantánea')).toBeVisible();

    await expect(page.getByLabel('Slack')).toBeVisible();
    await expect(page.getByLabel('WhatsApp')).toBeVisible();
    await expect(page.getByLabel('Discord')).toBeVisible();
    await expect(page.getByLabel('Telegram')).toBeVisible();

    await expect(page.getByText('Selecciona al menos un canal para que tus mentees puedan reservar sesiones.')).toBeVisible();

    const slackCheckBox = page.getByRole('checkbox', { name: 'Slack' });

    await expect(slackCheckBox).toHaveAttribute('aria-checked', 'false');
    await slackCheckBox.click();
    await expect(slackCheckBox).toHaveAttribute('aria-checked', 'true');

    

    });

    // Ojo: este test solo vale para una primera ejecución, porque al guardar las preferencias deja el canal marcado para la siguiente vez.
    test('mentor can save communication channel preferences', async ({ page }) => {
      const communicationChannelsLink = page.getByTestId('communication_settings_link'); // He guardado en una variable el locator del link de 'canales' de comunicación para reutilizarlo.

      await expect(communicationChannelsLink).toBeVisible();
      await communicationChannelsLink.click();
      await expect(page).toHaveURL('/dashboard/settings/communication');

      const discordCheckBox = page.getByRole('checkbox', { name: 'Discord' });
      const saveButton = page.getByRole('button', { name: 'Guardar Preferencias' }); // Aquí también se podría usar regex si quisiéramos un locator más flexible.
      // “quiero un botón cuyo nombre contenga algo que encaje con guardar, sin importar mayúsculas o minúsculas” { name: /guardar/i }. La i significa ignore case, es decir, que no importa si el texto del botón está en mayúsculas o minúsculas.


      await expect(discordCheckBox).toHaveAttribute('aria-checked', 'false');
      await discordCheckBox.click();
      await expect(discordCheckBox).toHaveAttribute('aria-checked', 'true');

      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await expect(page.getByText('Preferencias guardadas correctamente.')).toBeVisible();
      
      await page.reload();

      const discordCheckBoxAfterReload = page.getByRole('checkbox', { name: 'Discord' });
      await expect(discordCheckBoxAfterReload).toHaveAttribute('aria-checked', 'true');


    });

    test('mentor can save and keep a Slack channel name after reload', async ({ page }) => {
      const communicationChannelsLink = page.getByTestId('communication_settings_link');

      await expect(communicationChannelsLink).toBeVisible();
      await communicationChannelsLink.click();
      await expect(page).toHaveURL('/dashboard/settings/communication');

      await expect(page.getByText('Común en equipos de tecnología')).toBeVisible();

      const slackInput = page.getByLabel('Workspace o canal (opcional)');

      await expect(slackInput).toBeVisible();
      await expect(slackInput).toHaveAttribute('placeholder', 'team.slack.com o #channel');

      const uniqueId = Date.now();
      const slackChannelName = `Canal-Jose-Slack-${uniqueId}`;
      // Generamos un valor único para asegurar un cambio real en cada ejecución
      
      await slackInput.fill(slackChannelName);
      await expect(slackInput).toHaveValue(slackChannelName);

      const saveButton = page.getByRole('button', { name: 'Guardar Preferencias' });
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await expect(page.getByText('Preferencias guardadas correctamente.')).toBeVisible();

      await page.reload();
      
      const slackInputAfterReload = page.getByLabel('Workspace o canal (opcional)');
      await expect(slackInputAfterReload).toHaveValue(slackChannelName);

    });

    test('mentor can save an Email channel name and see it after reload', async ({ page }) => {
      const communicationChannelsLink = page.getByTestId('communication_settings_link');

      await expect(communicationChannelsLink).toBeVisible();
      await communicationChannelsLink.click();
      await expect(page).toHaveURL('/dashboard/settings/communication');

      await expect(page.getByText('Otros')).toBeVisible();
      await expect(page.getByText('Canales adicionales')).toBeVisible();

      const emailCheckBox = page.getByRole('checkbox', { name: 'Email' });
      await expect(emailCheckBox).toHaveAttribute('aria-checked', 'true');
      
      const emailInput = page.getByLabel('Correo electrónico (opcional)');

      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('placeholder', 'Se usa el email del perfil');

      const uniqueId = Date.now();
      const emailChannelName = `jose-qa-saiyan-${uniqueId}`;

      await emailInput.fill(emailChannelName);
      await expect(emailInput).toHaveValue(emailChannelName);

      const saveButton = page.getByRole('button', { name: 'Guardar Preferencias' });
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await expect(page.getByText('Preferencias guardadas correctamente.')).toBeVisible();

      await page.reload();
      
      const emailInputAfterReload = page.getByLabel('Correo electrónico (opcional)');
      await expect(emailInputAfterReload).toHaveValue(emailChannelName);

     }); 

});```
