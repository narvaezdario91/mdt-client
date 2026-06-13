## Why

Currently, when the Allure reporter attaches `execution.details` to step instructions, it uses the `.md` extension with a `text/markdown` MIME type. In many configurations of the Allure UI, this causes the browser to download the file instead of displaying the log text inline, creating friction when trying to quickly read execution logs without leaving the report.

## What Changes

- Change the file extension of the attached details from `.md` to `.txt`.
- Change the MIME type of the attached details from `text/markdown` to `text/plain`.
- Ensure the attachment is rendered inline in the Allure report view.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `allure-reporter`: Modify the attachment logic so execution details use a `.txt` extension and `text/plain` MIME type to avoid unwanted downloads in the UI.

## Impact

- `src/reporters/allure.ts`: Logic that generates the `attachmentFileName` and pushes to `instAttachments`.
