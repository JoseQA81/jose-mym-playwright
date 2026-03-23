// USER STORY: https://upexgalaxy65.atlassian.net/browse/MYM-59
import { test } from '@playwright/test';

test.describe('Mentor Respond Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        // Login as mentor
        await page.goto('https://staging-upexmymentor.vercel.app/dashboard');
        
    })

test('TC1 - Validar visualización de reviews', async ({ page }) => {


    })

});