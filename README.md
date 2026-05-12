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
- 🤖 AI-assisted workflow with Gemini CLI / Warp

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

### 🚧 Next Steps
Upcoming work may include:
- API automation with Playwright.
- Integration testing using `APIRequestContext`.
- Lightweight API clients / fixtures inspired by the MYM QA automation source repository.
- Further KATA evolution without over-engineering the current structure.
