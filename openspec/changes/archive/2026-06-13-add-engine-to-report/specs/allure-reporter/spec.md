## ADDED Requirements

### Requirement: Allure Reporter labels the scenario with the used Engine
The reporter SHALL parse the `mcp_config` from the execution API response (e.g., extracting the engine from `args` like `@playwright/mcp`) and add an "engine" label to the Allure scenario.

#### Scenario: Execution returns MCP config with playwright
- **WHEN** the raw execution data includes `mcp_config` with arguments indicating `@playwright/mcp`
- **THEN** the reporter adds a label `{ name: 'engine', value: 'playwright' }` to the scenario

#### Scenario: Execution returns MCP config with selenium
- **WHEN** the raw execution data includes `mcp_config` with arguments indicating `@selenium/mcp`
- **THEN** the reporter adds a label `{ name: 'engine', value: 'selenium' }` to the scenario

#### Scenario: Execution has unknown or missing MCP config
- **WHEN** the `mcp_config` is missing or its arguments cannot be parsed for an engine
- **THEN** the reporter does not add an "engine" label or adds it as "unknown"
