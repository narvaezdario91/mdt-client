## Context

The current `allure-reporter` attaches execution details using a `.md` extension and `text/markdown` MIME type. This causes the Allure UI to prompt for file downloads instead of displaying the attachment inline.

## Goals / Non-Goals

**Goals:**
- Render execution details inline within the Allure report UI.

**Non-Goals:**
- Change the contents of the `execution.details` text.
- Change how Allure renders HTML or markdown beyond the MIME type.

## Decisions

- **Decision**: Change the attachment extension to `.txt` and MIME type to `text/plain`.
  - **Rationale**: Allure's UI reliably renders `text/plain` attachments inline without attempting to download them. While we lose markdown styling (e.g. bold text, proper code blocks), the ability to read logs quickly without leaving the UI is a greater priority for developers.

## Risks / Trade-offs

- **Risk**: Loss of markdown formatting might make complex tables or links harder to read.
  - **Mitigation**: The execution details are mostly raw Playwright logs and JSON objects, which are still perfectly readable as plain text.
