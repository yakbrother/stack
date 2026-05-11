# General Coding Rules

**Description:** Applies general coding rules across all file types to maintain code quality, consistency, and prevent common errors.

**Source:** [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)

## Core Principles

- Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.
- Make changes file by file and give me a chance to spot mistakes.
- Never use apologies.
- Always think of accessibility (WCAG 2.2 compliance).
- Avoid giving feedback about understanding in comments or documentation.

## Code Changes & Documentation

- Don't suggest whitespace changes.
- Don't summarize changes made.
- Don't use emojis in code documentation or PRs.
- Don't invent changes other than what's explicitly requested.
- Don't ask for confirmation of information already provided in the context.
- Don't remove unrelated code or functionalities. Pay attention to preserving existing structures.
- Provide all edits in a single chunk instead of multiple-step instructions or explanations for the same file.
- Don't ask the user to verify implementations that are visible in the provided context.
- Don't suggest updates or changes to files when there are no actual modifications needed.
- Always provide links to the real files, not the context generated file.
- Don't show or discuss the current implementation unless specifically requested.
- Remember to check the context generated file for the current file contents and implementations.

## Code Quality

- Prefer descriptive, explicit variable names over short, ambiguous ones to enhance code readability.
- Adhere to the existing coding style in the project for consistency.
- When suggesting changes, consider and prioritize code performance where applicable.
- Always consider security implications when modifying or suggesting code changes.
- Suggest or include appropriate unit tests for new or modified code.
- Implement robust error handling and logging where necessary.
- Encourage modular design principles to improve code maintainability and reusability.
- Ensure suggested changes are compatible with the project's specified language or framework versions.
- Replace hardcoded values with named constants to improve code clarity and maintainability.
- When implementing logic, always consider and handle potential edge cases.
- Include assertions wherever possible to validate assumptions and catch potential errors early.

## Project Management

- NEVER change directories or switch git repositories without explicit user permission.
- Before making any file changes, verify you're in the correct project directory that the user is referring to.
- If a user's request could apply to multiple projects, ask which project they mean before proceeding.
- Always use the current working directory as context unless the user explicitly references a different project by name or path.
- When uncertain about which repository or project a request applies to, ask for clarification rather than making assumptions.
