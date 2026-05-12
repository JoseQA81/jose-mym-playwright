# mentor-availability.test.ts

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

test('mentor can open availability settings and see availability options', async ({ page }) => {
    await expect(page.getByTestId('availability_link')).toBeVisible();
    await page.getByTestId('availability_link').click();
    await expect(page).toHaveURL('/dashboard/mentor/availability');

    await expect(page.getByRole('heading', { name: 'Disponibilidad' })).toBeVisible();
    await expect(page.getByText('Configura los horarios en los que estás disponible para sesiones de mentoría')).toBeVisible();
    await expect(page.getByText('Configura tu Disponibilidad')).toBeVisible();
    await expect(page.getByText('Define los horarios en que estás disponible para sesiones de mentoría')).toBeVisible();

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    for (const day of weekDays) {
        await expect(page.getByText(day, { exact: true })).toBeVisible();
    }

    await expect(page.getByText('Los horarios se muestran en tu zona horaria local:')).toBeVisible();
    await expect(page.getByText('Europe/Paris')).toBeVisible();

    const saveButton = page.getByRole('button', { name: 'Guardar' });

    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeDisabled();
    
  });

test('mentor can save availability settings', async ({ page }) => {

    await expect(page.getByTestId('availability_link')).toBeVisible();
    await page.getByTestId('availability_link').click();
    await expect(page).toHaveURL('/dashboard/mentor/availability');

    const tuesdayColumn = page.getByTestId('day_column_2');
    const agregarButton = page.getByTestId('add_slot_2');

    await expect(tuesdayColumn).toBeVisible();
    await expect(agregarButton).toBeVisible();
    await agregarButton.click();

    const saveTimeBlockButton = page.getByTestId('save_time_block');
    await expect(saveTimeBlockButton).toBeVisible();

    const startTimeSelect = page.getByTestId('start_time_select');
    const endTimeSelect = page.getByTestId('end_time_select');

    await expect(startTimeSelect).toBeVisible();
    await startTimeSelect.click();
    await page.getByRole('option', { name: '9:00 AM' }).click()

    await expect(endTimeSelect).toBeVisible();
    await endTimeSelect.click();
    await page.getByRole('option', { name: '9:30 AM' }).click()

    await expect(saveTimeBlockButton).toBeEnabled();
    await saveTimeBlockButton.click();

    const saveButton = page.getByRole('button', { name: 'Guardar' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page.getByText('Se guardaron')).toBeVisible();

    // Validamos que el bloque horario quedó guardado dentro de martes
    await expect(tuesdayColumn).toContainText('9:00 AM');
    await expect(tuesdayColumn).toContainText('9:30 AM');

    // Reabrimos el bloque guardado usando el data-testid dinámico por prefijo
    const savedTimeBlock = tuesdayColumn.locator('[data-testid^="slot_"]').first(); // .first() “Dentro de la columna del martes, busca los elementos cuyo data-testid empieza por slot_ y quédate con el primero.”
    await expect(savedTimeBlock).toBeVisible();
    await savedTimeBlock.click();

    const deleteTimeBlockButton = page.getByTestId('delete_time_block');
    await expect(deleteTimeBlockButton).toBeVisible();
    await deleteTimeBlockButton.click();

    const saveButtonAfterDelete = page.getByTestId('save_availability_button');
    // Después de eliminar el bloque horario, el botón de guardar cambia de data-testid, por eso lo buscamos de nuevo para validar que se habilite al hacer cambios

    await expect(saveButtonAfterDelete).toBeEnabled();
    await saveButtonAfterDelete.click();

    await expect(page.getByText('horarios correctamente')).toBeVisible();
  });


});```
