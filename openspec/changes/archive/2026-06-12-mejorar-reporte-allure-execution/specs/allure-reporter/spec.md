## ADDED Requirements

### Requirement: Allure Reporter maps execution state accurately
The reporter SHALL map the `execution.status` from the raw JSON report strictly to the corresponding Allure status.

#### Scenario: Step with successful execution
- **WHEN** the `execution.status` is "success"
- **THEN** the Allure step status is marked as "passed"

#### Scenario: Step with failed execution
- **WHEN** the `execution.status` is "failed"
- **THEN** the Allure step status is marked as "failed"

#### Scenario: Step with skipped execution
- **WHEN** the `execution.status` is "skipped"
- **THEN** the Allure step status is marked as "skipped"

### Requirement: Allure Reporter uses real execution duration
The reporter SHALL read `execution.durationMs` and use it to determine the stop time of the step on the Allure timeline.

#### Scenario: Step has durationMs
- **WHEN** a step execution completes and reports `durationMs`
- **THEN** the Allure step uses `startTime + durationMs` as its `stop` time rather than an estimated default.

### Requirement: Allure Reporter attaches execution details and errors directly
The reporter SHALL directly expose the raw `execution.details` and `execution.error` from the JSON to the Allure step, without parsing or cleaning the actions array.

#### Scenario: Successful step with details
- **WHEN** a step has `execution.details` and a success status
- **THEN** the details text is attached as a markdown file to the Allure step.

#### Scenario: Failed step with error
- **WHEN** a step has `execution.error`
- **THEN** the error text is exposed in the `statusDetails.message` property of the Allure step to ensure visibility in the UI.

### Requirement: Allure Reporter includes tool and telemetry parameters
The reporter SHALL include parameters derived from the `execution` block to enrich the step context.

#### Scenario: Execution has actionExecuted and telemetry
- **WHEN** `execution.actionExecuted` and `execution.telemetry` are present
- **THEN** the Allure step includes a parameter for "Tool" using `actionExecuted`
- **THEN** the Allure step includes parameters for "Execution Path", "Retries", "LLM Input Tokens", and "LLM Output Tokens" from the `telemetry` object.
