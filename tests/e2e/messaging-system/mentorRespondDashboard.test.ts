// USER STORY: https://upexgalaxy65.atlassian.net/browse/MYM-59

import { test } from '@playwright/test';
import { config } from '@config/variables';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('MYM-59: Mentor Respond Dashboard', () => {

    test('MYM-158: Validate display of message widget with active conversations', async ({ page }) => {
        // Data precondition: mentor account has more than 5 active conversations in staging.
        
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await loginPage.goto();
        await loginPage.loginSuccessfully(config.mentor.email, config.mentor.password);
        
        await dashboardPage.expectLoaded();
        await dashboardPage.recentMessages.expectActiveConversationsDisplayed();
    });

});
