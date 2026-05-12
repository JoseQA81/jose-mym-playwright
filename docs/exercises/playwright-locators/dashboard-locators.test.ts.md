# dashboard-locators.test.ts

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

  test('mentor can see basic dashboard elements', async ({ page }) => {
    await expect(page.getByTestId('user_name')).toBeVisible();
    await page.getByTestId('dashboard_link').click();

    await expect(page.getByTestId('user_email')).toBeVisible();
    await expect(page.getByText('Información básica')).toBeVisible();
    await expect(page.getByText('Skills y Especialidades')).toBeVisible();
    await expect(page.getByText('tarifa por Hora')).toBeVisible();

    await page.getByTestId('edit_profile_button').click();
    await expect(page).toHaveURL('/profile/edit');

    await expect(page.getByText('Construye tu perfil profesional')).toBeVisible();


  });

  test('mentor can navigate to chat and see chat elements', async ({ page }) => {
    await expect(page.getByText('Mensajes Recientes')).toBeVisible();
    await expect(page.getByText('Consultas de estudiantes')).toBeVisible();
    await page.getByTestId('widget_conversation_ebbcfa8d-e777-4d4b-b1ff-e9b5c88b77a1').click();

    // Acotamos al modal para evitar ambigüedades con elementos repetidos en la página
    const quickReplyModal = page.getByTestId('quick_reply_modal');
    await expect(quickReplyModal).toBeVisible();
    // Buscamos el nombre dentro del modal para evitar matches duplicados fuera de ese contexto, a esto lo llamamos "acotar el scope o scoping" de la búsqueda, y es una buena práctica para evitar falsos positivos en los tests cuando hay elementos con textos o atributos similares en diferentes partes de la página. Al acotar el scope a un contenedor específico, nos aseguramos de que estamos interactuando con el elemento correcto dentro del contexto esperado.
    const participantName = quickReplyModal.getByTestId('participant_name');
    await expect(participantName).toBeVisible();
    await expect(participantName).toHaveText('Pepe Andrés');

    await expect(page.getByText('Pues nada, haciendo Re testing de MYM-155 que se me había pasado😅')).toBeVisible();
    await expect(quickReplyModal.getByText("Era 'toast', sorry")).toBeVisible();
    // Aquí también acotamos la búsqueda al modal para evitar falsos positivos con otros elementos que puedan tener el mismo texto en la página pero que no estén relacionados con esta conversación específica.
    await expect(page.getByText('éxito')).toBeVisible();
    await expect(page.getByText('Hola profe, hemos arreglado el bug MYM-96??')).toBeVisible();
    

    });

  test('mentor can see Mensajes Recientes button', async ({ page }) => {
    await page.getByTestId('view_all_messages_button').click();

    await expect(page).toHaveURL('/dashboard/messages');
    await expect(page.getByRole('heading', { name: 'Mensajes' })).toBeVisible();
    await expect(page.getByText('Tus conversaciones con estudiantes')).toBeVisible();


    });

});```
