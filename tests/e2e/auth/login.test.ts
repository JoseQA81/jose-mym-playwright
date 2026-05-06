// Support flow for MYM-59 automation: mentor authentication using KATA minimal Page Object.

import { test } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { config } from '@config/variables';

const invalidMentorPassword = config.mentor.password + 'wrong';

test.describe('Login Test', () => {

    test('should allow mentor to log in successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await loginPage.goto();
        await loginPage.loginSuccessfully(config.mentor.email, config.mentor.password);
        await dashboardPage.expectLoaded();
    });

    test('should show an error with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.loginWithInvalidCredentials(config.mentor.email, invalidMentorPassword);
    });

});
