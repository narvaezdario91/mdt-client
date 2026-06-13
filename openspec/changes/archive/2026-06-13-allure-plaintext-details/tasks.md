## 1. Modify Allure Reporter

- [x] 1.1 In `src/reporters/allure.ts`, locate the logic that attaches `inst.execution.details`.
- [x] 1.2 Change `attachmentFileName` to use the `.txt` extension instead of `.md`.
- [x] 1.3 Change the `type` in `instAttachments.push` from `text/markdown` to `text/plain`.

## 2. Verification

- [x] 2.1 Run a test scenario to generate a new allure report.
- [x] 2.2 Verify that the `allure-results` JSON correctly lists the attachment with a `.txt` extension and `text/plain` MIME type.
