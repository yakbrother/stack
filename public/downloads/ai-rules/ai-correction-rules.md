---
description: Comprehensive ruleset for reviewing and correcting common AI coding mistakes. Run this as a secondary pass to catch frequent errors.
purpose: Quality assurance for AI-generated code
usage: Apply this ruleset in a new context window or with a different agent to review code changes
research_sources: Based on industry studies showing AI code contains exploitable flaws in 27-40% of cases
---

# AI Code Correction Ruleset

## Critical Logic & Safety Issues

- **Check for off-by-one errors** in loops, array indexing, and boundary conditions
- **Verify async/await consistency** - ensure all async functions are properly awaited and errors are caught
- **Validate resource cleanup** - confirm files, connections, streams are closed in finally blocks or using proper disposal patterns
- **Check for race conditions** in concurrent code - look for unprotected shared state
- **Verify null/undefined checks** before accessing properties or calling methods
- **Ensure proper error propagation** - errors should not be silently swallowed without logging
- **Check for infinite loops** or missing break/return statements in recursive functions
- **Validate array/collection bounds** - ensure code handles empty arrays and doesn't assume elements exist
- **Check for stale closures** capturing old values in callbacks/event handlers

## Security Vulnerabilities (CRITICAL PRIORITY)

### Input Validation & Injection
- **Check for SQL injection** - verify parameterized queries/prepared statements are used, never string concatenation
- **Validate XSS prevention** - ensure user input is properly sanitized/escaped before rendering
- **Check for command injection** - validate any system calls or shell commands
- **Verify path traversal protection** - ensure file paths can't escape intended directories
- **Validate all input sources** - query parameters, POST bodies, headers, cookies, file uploads
- **Note:** Missing input sanitization is the #1 security flaw in AI-generated code across all models

### Secrets & Credentials Management
- **Check for hardcoded secrets** - API keys, passwords, tokens, database credentials should NEVER be in source code
- **Verify environment variables** are used for all sensitive configuration
- **Validate secrets manager integration** (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault)
- **Check git history** - ensure secrets weren't committed in previous versions
- **Verify .env files** are in .gitignore and not tracked
- **AI hallucination alert:** AI training data contains many hardcoded secrets; AI doesn't understand security implications

### Authentication & Authorization
- **Ensure proper authentication checks** before accessing protected resources
- **Verify CSRF protection** for state-changing operations
- **Check for missing authentication headers** or tokens in API calls
- **Validate session management** - proper timeout, secure cookies, token refresh
- **Ensure role-based access control** is implemented where needed
- **Check for broken authentication** - weak password requirements, missing MFA support
- **Verify authorization at every layer** - don't rely on client-side checks alone

### Dependency & Supply Chain Security
- **Verify all imported modules actually exist** - AI frequently invents plausible-sounding packages ("hallucinated dependencies")
- **Check for outdated libraries** with known CVEs - verify versions are current and patched
- **Validate dependency sources** - ensure packages are from official registries (npm, PyPI)
- **Check for typosquatting** - verify package names are spelled correctly
- **Scan for malicious packages** - especially AI-suggested packages you haven't heard of
- **Monitor for vulnerable dependencies** - use tools like npm audit, Snyk, or Dependabot
- **AI training data issue:** Models may suggest libraries with known CVEs patched after their training cutoff

### Additional Security Checks
- **Check for insecure randomness** - crypto operations should use secure random generators (crypto.randomBytes, secrets module)
- **Validate file upload restrictions** - check file type validation, size limits, scan for malware
- **Check for information disclosure** in error messages (don't expose stack traces, internal paths, system info to users)
- **Verify secure communication** - HTTPS for all external calls, TLS for database connections
- **Check for insecure defaults** - ensure security is enabled by default, not opt-in
- **Validate cryptographic functions** - use established libraries, don't roll your own crypto

## Common Implementation Mistakes

- **Verify variable scope** - check if variables are declared in the correct scope and not shadowing outer variables
- **Check for unused imports/variables** that were added but never used
- **Validate type conversions** - ensure string-to-number, date parsing, etc. are handled correctly with proper error handling
- **Check comparison operators** - verify `===` vs `==`, proper boolean checks, and NaN comparisons
- **Ensure immutability** where expected - check for accidental mutations of objects/arrays that should be immutable
- **Verify default parameter values** are appropriate and won't cause unexpected behavior
- **Check for proper deep copy vs shallow copy** when cloning objects/arrays
- **Validate regex patterns** for edge cases and potential ReDoS vulnerabilities
- **Check for incorrect function signatures** - AI may misremember parameter order or types
- **Verify outdated syntax** - check for deprecated methods or old language version patterns (Python 2 vs 3, old JavaScript)

## Error Handling & Edge Cases

### Exception Handling
- **Verify comprehensive error handling** - don't just handle the happy path
- **Check for missing try-catch blocks** around risky operations (I/O, parsing, external calls)
- **Ensure specific exception types** are caught, not just generic Exception/Error
- **Validate error messages are helpful** - provide context about what went wrong and how to fix it
- **Check for proper error logging** - log enough detail for debugging but not sensitive data
- **Verify error recovery** - ensure application can recover gracefully from failures
- **Validate logging levels** - use appropriate levels (debug, info, warn, error)
- **AI weakness:** Models excel at happy-path coding but consistently overlook error states

### Edge Case Coverage
- **Verify empty input handling** - check behavior with empty strings, arrays, objects, null, undefined
- **Check boundary value testing** - min/max values, overflow conditions, negative numbers, zero
- **Validate special character handling** in strings (quotes, newlines, unicode, emoji, escape sequences)
- **Ensure timezone handling** in date/time operations - use UTC internally, convert for display
- **Check for floating-point precision issues** in financial calculations or comparisons
- **Verify case sensitivity** in string comparisons, file paths, database queries
- **Validate internationalization** - check for hardcoded strings that should be localized
- **Check for platform-specific code** - ensure cross-platform compatibility (file paths, line endings, process management)
- **Test with extremely large inputs** - strings, arrays, files that might cause memory/performance issues
- **Verify handling of malformed data** - invalid JSON, corrupted files, unexpected formats

## Code Completeness Issues

### Incomplete Generation
- **Check for unfinished functions** - ensure all code blocks are complete
- **Verify loops are complete** - no missing closing braces or incomplete iterations
- **Validate conditional blocks** - ensure all if/else branches are implemented
- **Check for missing return statements** - functions should return values where expected
- **Verify callback completion** - async operations should have success and error handlers
- **AI issue:** Code generation sometimes gets cut off mid-function, leaving incomplete implementations

### Missing Dependencies & Imports
- **Check for missing imports** - verify all used modules are imported
- **Validate import paths** are correct - check for typos in module names
- **Ensure package.json/requirements.txt is updated** with all dependencies
- **Verify correct module names** - AI may use plausible but incorrect package names
- **Check for missing peer dependencies** - some packages require additional installations
- **Validate version compatibility** - ensure dependencies work together

## API & Integration Issues

- **Verify API endpoint paths** match the actual API specification (check for typos, version numbers, /api prefix)
- **Check HTTP method usage** - ensure GET/POST/PUT/PATCH/DELETE are used correctly for each operation
- **Validate request/response payload structures** match API contracts and documentation
- **Ensure proper HTTP status code handling** - don't just check for 200, handle 201, 204, 4xx, 5xx appropriately
- **Check for missing authentication headers** or tokens in API calls (Authorization, API-Key, etc.)
- **Verify timeout and retry logic** for external service calls - don't wait forever
- **Validate URL encoding** of query parameters and path segments
- **Check for proper API pagination handling** - don't assume all results fit in one page
- **Ensure proper content-type headers** - application/json, multipart/form-data as appropriate
- **Verify error response parsing** - check that API error responses are handled correctly
- **Check for missing error handling** on network failures, timeouts, or API errors
- **Validate rate limiting** is implemented if calling third-party APIs

## State Management & Data Flow

- **Verify state updates are immutable** in frameworks that require it (React, Redux, etc.)
- **Validate dependency arrays** in React hooks (useEffect, useCallback, useMemo) - ensure all dependencies are listed
- **Ensure proper cleanup** in effect hooks or component unmount - remove listeners, cancel timers
- **Check for memory leaks** - verify event listeners, timers, subscriptions, observers are cleaned up
- **Validate prop drilling** - ensure data flows correctly through component hierarchy
- **Check for missing reactive declarations** in frameworks like Vue or Svelte
- **Verify proper event handler binding** - this context is correct
- **Check for excessive re-renders** - ensure optimizations like memoization are used appropriately

## Performance Issues

- **Check for N+1 query problems** in database operations - use eager loading or batch queries
- **Verify unnecessary re-renders** in UI frameworks - use React.memo, useMemo, useCallback appropriately
- **Check for inefficient loops** - look for nested loops that could be optimized with maps/sets
- **Validate algorithm complexity** - ensure O(n²) solutions aren't used where O(n log n) or O(n) is possible
- **Check for premature optimization** - don't sacrifice readability without measuring first
- **Verify lazy loading** is implemented where appropriate (images, components, data, routes)
- **Check for redundant API calls** - ensure proper caching, deduplication, or request batching
- **Validate bundle size** - check for unnecessarily large dependencies that could be replaced
- **Check for synchronous operations** blocking the main thread - use workers or async where appropriate
- **Verify database indexes** exist on frequently queried columns
- **AI issue:** May suggest inefficient algorithms or add unnecessary performance-impacting code

## Testing & Validation

### Test Coverage
- **Verify unit tests** exist for normal cases
- **Check for edge case tests** - null, empty, boundary values
- **Validate integration tests** for API interactions and component integration
- **Ensure error case tests** - verify error handling actually works
- **Check for regression tests** - tests that prevent previously fixed bugs from returning
- **Verify test isolation** - tests don't depend on each other or external state

### Test Quality
- **Check test assertions** are meaningful - not just "doesn't throw"
- **Verify mock data** is realistic and covers edge cases
- **Validate test descriptions** clearly explain what's being tested
- **Ensure tests are deterministic** - no random data or race conditions
- **Check for flaky tests** - tests that sometimes pass and sometimes fail

## Documentation & Maintainability

- **Verify complex logic has explanatory comments** - but avoid commenting obvious code
- **Check for misleading variable/function names** that don't match their actual behavior
- **Ensure API documentation** is complete and accurate (JSDoc, OpenAPI, etc.)
- **Check for magic numbers** - ensure constants are named and explained
- **Verify TODO comments** are tracked properly (JIRA tickets) and not left indefinitely
- **Ensure deprecated code paths** are marked with @deprecated and have migration paths documented
- **Check for code duplication** - look for repeated logic that should be extracted
- **Verify naming conventions** follow project standards (camelCase, snake_case, etc.)

## Framework-Specific Checks

### React
- **Check key props** in lists are stable and unique (not array index)
- **Verify controlled vs uncontrolled components** are used consistently
- **Validate refs** are used appropriately and not overused (prefer state)
- **Check for synthetic event pooling issues** (older React versions)
- **Ensure hooks rules** - only call at top level, not in conditionals
- **Verify proper form handling** - onSubmit on form, not onClick on button

### TypeScript/Type Systems
- **Verify type assertions** are necessary and safe (avoid `as any`, `@ts-ignore`)
- **Check for missing generic constraints** that could cause type errors
- **Validate discriminated unions** are properly narrowed with type guards
- **Ensure optional chaining** is used where properties might not exist
- **Check for proper null handling** - use strict null checks
- **Verify enum usage** is appropriate or if const objects are better

### Database
- **Check for missing indexes** on frequently queried columns (WHERE, JOIN, ORDER BY)
- **Verify transaction boundaries** include all related operations (ACID properties)
- **Validate migration scripts** are reversible with down migrations
- **Check for proper connection pooling** configuration
- **Ensure prepared statements** are used for all queries with user input
- **Verify database constraints** (foreign keys, unique, not null) match application logic

### Node.js/Backend
- **Check for proper middleware ordering** in Express/similar frameworks
- **Verify environment variable validation** at startup
- **Ensure graceful shutdown** handling (SIGTERM, SIGINT)
- **Check for process error handlers** (uncaughtException, unhandledRejection)
- **Validate rate limiting** on public endpoints
- **Verify CORS configuration** is appropriate and secure

## AI-Specific Hallucinations & Issues

### Invented Code Elements
- **Verify all functions/methods exist** in the libraries being used - AI invents plausible names
- **Check object properties/attributes** actually exist - don't assume AI got it right
- **Validate configuration options** are real for the specific library version
- **Ensure suggested patterns** follow current best practices, not outdated ones
- **Check for mixing incompatible patterns** - e.g., React class components with hooks syntax
- **Verify library APIs** match current documentation - AI may use old or incorrect signatures

### Context & Architecture Issues
- **Verify code fits existing architecture** - doesn't break established patterns
- **Check for context misinterpretation** - ensure code works with rest of codebase, not just in isolation
- **Validate assumptions** about data structures, APIs, or system behavior
- **Ensure compatibility** with existing code, don't create integration issues
- **Check for unrequested features** - AI sometimes adds functionality beyond the request
- **Verify file paths referenced** actually exist in the project structure

### Training Data Artifacts
- **Watch for outdated libraries** - AI may suggest packages no longer maintained
- **Check for insecure patterns** replicated from training data (AI learns from public code, including bad code)
- **Verify best practices** - AI may suggest patterns that were common but are now anti-patterns
- **Check for license issues** - AI may reproduce copyrighted code patterns
- **Validate against recent CVEs** - AI doesn't know about vulnerabilities discovered after training

## Review Process & Workflow

### Pre-Implementation Review
1. **Read the original request** carefully - understand what was actually asked for
2. **Check requirements coverage** - verify all requirements were addressed
3. **Review for scope creep** - ensure no unrequested changes were made
4. **Validate approach** - is this the right solution for the problem?

### Code Review Steps
5. **Scan for security issues** - use checklist above, run security scanners
6. **Check error handling** for the specific use case
7. **Test edge cases** mentally or with actual test cases
8. **Verify backwards compatibility** if modifying existing code
9. **Check for unintended side effects** in modified code
10. **Ensure consistency** with existing project patterns and conventions
11. **Run linters and formatters** - ESLint, Prettier, Pylint, Black, etc.
12. **Execute test suite** - run all tests, check coverage

### Validation & Testing
13. **Run static analysis** - SonarQube, CodeQL, Semgrep
14. **Execute security scans** - Gitleaks, Snyk, npm audit
15. **Test manually** - run the code and verify behavior
16. **Check bundle/build** - ensure code compiles/builds without warnings
17. **Review git diff** - check what actually changed, look for accidental changes

### Documentation & Handoff
18. **Update documentation** - README, API docs, comments as needed
19. **Check commit message** - clear description of changes and why
20. **Verify PR description** - includes context, testing done, screenshots if UI

## Automated Tools Integration

### Pre-commit Hooks
```bash
# Install Gitleaks for secret scanning
gitleaks detect --source .

# Run linters
npm run lint  # or eslint, prettier
pylint **/*.py  # or flake8, black

# Run type checker
npm run type-check  # or tsc --noEmit
mypy .
```

### CI/CD Pipeline Checks
- Static Application Security Testing (SAST)
- Software Composition Analysis (SCA) for dependencies
- Unit and integration test execution
- Code coverage reports (maintain or improve coverage)
- Bundle size monitoring
- Accessibility checks for UI code

### Recommended Tools
- **Security:** Gitleaks, Semgrep, Snyk, CodeQL, Aikido Security
- **Code Quality:** SonarQube, CodeClimate, ESLint, Pylint
- **Dependencies:** Dependabot, Renovate, npm audit
- **Testing:** Jest, Pytest, Cypress, Playwright
- **Performance:** Lighthouse, WebPageTest, profilers

## Common False Sense of Security

- **AI-generated code looks professional** - but may contain subtle flaws
- **Code that compiles/runs** - doesn't mean it's correct or secure
- **Passing tests** - only tests what was explicitly tested
- **"It works on my machine"** - may fail in production with different data
- **Clean code review** - doesn't catch logic errors or misunderstood requirements
- **No linter errors** - linters don't catch all issues

## Red Flags That Warrant Extra Scrutiny

- 🚩 Code handling user input or external data
- 🚩 Authentication or authorization logic
- 🚩 Database queries or data persistence
- 🚩 File system operations
- 🚩 External API calls or network operations
- 🚩 Cryptographic operations
- 🚩 Financial calculations or money handling
- 🚩 Code that uses eval() or similar dynamic execution
- 🚩 Complex async/promise chains
- 🚩 Regular expressions (check for ReDoS)
- 🚩 Generated code longer than 100 lines
- 🚩 AI suggested a library you've never heard of
- 🚩 Code that "just works" without any modifications needed

## AI-Generated File Management

### Documentation & Summary Files
- **Store summary .md files** created by Claude/Warp in `/documentation/ai_generated/`
  - Conversation summaries
  - Code analysis reports
  - Architecture documentation
  - Decision logs
- **Commit these files** - they're useful project documentation

### Temporary AI Configuration Files (.gitignore)
- **Add to .gitignore:**
  - `CLAUDE.md` - Claude's temporary context file
  - `.claude/` - Claude desktop app directory
  - `.warp/` - Warp terminal AI cache
  - `.cursor/` - Cursor IDE AI settings
  - `.aider/` - Aider chat history
  - Any other AI tool-specific temporary directories

### Rationale
- **Project documentation** (summaries, analyses) should be version controlled and shared with team
- **Tool-specific temp files** are machine-specific and should not be committed
- Keeps repository clean while preserving valuable AI-generated insights

```gitignore
# AI Tool Temporary Files
CLAUDE.md
.claude/
.warp/
.cursor/
.aider/
*.aider.chat.history.md

# Keep AI-generated documentation
!documentation/ai_generated/**/*.md
```

## Key Statistics & Context

- **40% of AI-generated code** contains security vulnerabilities (IEEE study)
- **27.25% of GitHub Copilot suggestions** included vulnerabilities in testing
- **80% of AI-assisted tasks** produced less secure code than human-written (Stanford)
- **Developers were 3.5x more likely** to think AI code was secure when it wasn't
- **24 million secrets** exposed on GitHub in one year, 40% higher in repos using AI tools
- **Training data lag:** AI models may be trained on data 1-5+ years old
- **Pattern replication:** AI reproduces both good AND bad patterns from training data

## Philosophy & Approach

**Remember:** AI is a productivity tool, not a replacement for engineering judgment. The goal is not to distrust all AI-generated code, but to apply appropriate scrutiny and validation. Treat AI code like code from an eager junior developer - it might work, but needs review.

**Defense in depth:** Multiple layers of validation (linting, testing, security scanning, code review) catch different types of issues.

**Shift left:** Catch issues early in development - it's cheaper and easier than fixing in production.

**Continuous improvement:** Track common AI errors in your project and adjust prompts or add automated checks.

**Human oversight:** Code reviews should focus on things automation can't catch - business logic, architecture decisions, user experience.

---

*Last updated: Based on research from November 2025 covering studies from IEEE, Stanford, GitHub, and security firms analyzing AI code generation tools.*
