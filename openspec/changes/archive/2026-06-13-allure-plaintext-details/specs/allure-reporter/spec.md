## MODIFIED Requirements

### Requirement: Allure Reporter attaches execution details and errors directly
The reporter SHALL directly expose the raw `execution.details` and `execution.error` from the JSON to the Allure step, without parsing or cleaning the actions array.
The execution details MUST be attached using a `.txt` file extension and `text/plain` MIME type to ensure inline rendering in the Allure report UI.

#### Scenario: Successful step with details
- **WHEN** a step has `execution.details` and a success status
- **THEN** the details text is attached as a plain text file (`.txt` extension, `text/plain` type) to the Allure step.
