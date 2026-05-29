# 🎭 jose-mym-playwright

Personal repository for Playwright learning, UI/E2E automation practice, and Quality Engineering experimentation.

This repository started as a Playwright learning sandbox and has evolved into a working automation base for the **UPEX My Mentor** project.

## 🎯 Purpose

This repository is used to:

- Learn Playwright progressively, from locator practice to real E2E automation.
- Practice selectors, locators, assertions, Page Objects, and test structure.
- Build a minimal KATA-style automation architecture.
- Automate real QA scenarios from UPEX My Mentor.
- Preserve learning exercises as documentation.
- Experiment with CI, GitHub Actions, TypeScript hardening, and AI-assisted QA workflows.

## ✅ Current Coverage

### MYM-59 — Mentor Dashboard & Messaging System

Automated with Playwright:

- **MYM-158 / TC1**: Recent Messages widget with active conversations.
- **MYM-159 / TC2**: Recent Messages widget empty state.
- **MYM-160 / TC3**: Quick Reply modal and mentee profile navigation.
- **MYM-161 / TC4**: Quick Reply response sent and displayed in the modal thread.

Manual coverage documented in Jira/Xray:

- **MYM-162 / TC5**: “View All Messages” navigation.
- **MYM-163 / TC6**: Draft preservation / Ghost Effect, with realtime observation related to MYM-96.

✅ MYM-59 is considered completed from the QA/Automation perspective: automated TC passed, manual TC passed, and the User Story is marked as QA APPROVED in Jira/Xray.

### 🧪 API Automation Foundation

Initial API automation has started with Playwright `APIRequestContext`.

Current API coverage:

- ✅ Supabase Auth smoke test using invalid login credentials.
- ✅ Validates API availability and expected authentication rejection.
- ✅ Does not use real user credentials.
- ✅ Does not modify staging data.
- ✅ Runs in GitHub Actions using Supabase environment variables from repository secrets.

Related files:

- `tests/api/auth/auth.api.test.ts`
- `docs/setup/mcp-openapi.md`
- `.context/guidelines/TAE/openapi-integration.md`


## 🧱 Architecture

The current UI automation follows a minimal KATA / Page Object approach:

```txt
config/
pages/
pages/components/
tests/e2e/
docs/exercises/
```
## Main Components

- `LoginPage`
- `DashboardPage`
- `RecentMessagesWidget`
- `QuickReplyModal`

## 🧰 Stack

- 🎭 Playwright
- 🔷 TypeScript
- 🥟 Bun
- 🧪 GitHub Actions
- 🧩 Jira / Xray
- 🤖 AI-assisted QA workflow with Gemini CLI, Warp, and ChatGPT / GPT-5.5 Thinking

## ▶️ Run Checks

Run TypeScript validation:

```bash
bun run type-check
```
**Run all Playwright tests:**
```bash
bun run test
```
## Run the MYM-59 E2E suite:

```bash
bun run test -- tests/e2e/messaging-system/mentorRespondDashboard.test.ts --project=chromium
```

### 📚 Learning Exercises
Previous Playwright locator exercises are preserved as Markdown documentation under: `docs/exercises/playwright-locators/`

They are intentionally stored as documentation and are not part of the executable CI test suite.

### 🔒 Notes
Sensitive files such as `.env`, local AI settings, tokens, and credentials must never be committed. Environment variables are required for the automated tests and are injected through local `.env` or GitHub Actions secrets.

## 🌱 Future Improvements

MYM-59 is considered completed from the QA/Automation perspective. The following items are optional improvements for future learning and repository evolution:

* Evolve the initial API automation foundation with additional Playwright API smoke tests.
* Introduce lightweight API clients only when repeated request logic appears.
* Gradually adapt KATA-style API architecture inspired by `mym-qa-automation-source`, without over-engineering the current repository.
* Explore OpenAPI-based type generation once the API testing structure becomes stable.
* Continue TypeScript, CI, and tooling hardening in small, isolated PRs.
