# MYM-158 - Minimal KATA Flow

This document explains how the current minimal KATA structure works for the automated test:

`MYM-158: Validate display of message widget with active conversations`

## File interaction map

```txt
mentorRespondDashboard.test.ts
│
├── config/variables.ts
│   └── Provides mentor credentials from .env
│
├── LoginPage.ts
│   └── loginSuccessfully()
│       ├── opens login form
│       ├── fills mentor credentials
│       ├── submits login
│       └── validates dashboard access
│
└── DashboardPage.ts
    ├── expectLoaded()
    │   ├── validates /dashboard URL
    │   └── validates user_name is visible
    │
    └── RecentMessagesWidget.ts
        └── expectActiveConversationsDisplayed()
            ├── validates widget title
            ├── validates widget subtitle
            ├── validates view all messages button
            ├── validates exactly 5 conversation buttons
            ├── validates each item has visible text
            └── validates each item has avatar img with alt text
```

## Current approach

This is a minimal KATA implementation.

The test file acts as the orchestrator.
Page Objects and components contain complete actions or validations.

### What this avoids
- Raw Playwright commands directly inside the E2E test.
- Micro-methods like fillEmail() or clickSubmit() when Playwright already handles those clearly.
- Advanced KATA infrastructure before it is needed.

### What is intentionally not included yet
- Custom fixtures.
- UiBase.
- TestContext.
- @atc decorators.
- Allure.
- Jira/Xray sync.
- storageState.

## Data precondition

The mentor automation account must have more than 5 active conversations in staging.

This allows the test to validate that the Recent Messages widget displays exactly 5 conversation items.

## Current limitation

The widget does not expose stable internal data-testid attributes for:

- avatar
- mentee name
- message preview
- relative time

For now, the test validates the conversation item as a visible button with text content and a visible avatar image.

## Future improvement

Request frontend data-testid attributes:

- recent-messages-widget
- mentee-avatar
- mentee-name
- message-preview
- message-time
