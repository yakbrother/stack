---
title: "Modern PHP Coding Standards v1.0"
summary: "My machine-readable PHP 8+ coding rules — strict types everywhere, readonly classes, enums, match, composition over inheritance, security defaults baked in."
tags: [php, php8, code-quality, security, type-safety]
related:
  - "AI Code Correction Ruleset"
  - "AI Agent Guidelines"
  - "General Coding Rules"
draft: false
created: 2026-05-05
updated: 2026-05-05
sourceAuthor: "Tim Eaton"
sourceDate: 2025-09-30
---

A machine-readable PHP coding ruleset I wrote for AI assistants (Claude Code, Cursor, etc.) to follow when generating PHP. Targets PHP 8.0+, conforms to PSR-1, PSR-12, and the Slevomat Coding Standard. The companion short-form rule file (`php-coding-standards.md`) is a subset — start from this v1.0 doc.

## Summary

The ruleset orders priorities explicitly:

1. **Type safety first** — declare types on every property, parameter, and return value. `declare(strict_types=1);` is mandatory at the top of every PHP file.
2. **Security always** — never trust user input, escape all output, prepared statements only.
3. **Composition over inheritance** — inject dependencies. Default classes to `final`. Inheritance is opt-in, max two levels.
4. **Immutability where possible** — `readonly` properties and classes for value objects, DTOs, commands, events.

Pages are structured as decision trees and code snippets so AI assistants can pattern-match without misreading prose nuance.

## Absolute "NEVER" rules

- Omit `declare(strict_types=1)` from PHP files.
- Use `eval()`, `exec()`, `system()`, `extract()`.
- Trust user input without validation.
- Output user data without escaping (XSS).
- Use plain SQL without prepared statements.
- Store passwords with md5/sha1 — `password_hash($pw, PASSWORD_ARGON2ID)` is the only acceptable form.
- Use Yoda conditions (`null === $var`).
- Return null to indicate errors — throw a domain exception instead.
- Catch generic `\Exception` — catch specific types.
- Use magic numbers — define constants or enums.
- Create God Objects.
- Use boolean parameters — use named arguments or separate methods.
- Mix HTML and PHP without a template engine.
- Use `$$variable` (variable variables).
- Use the closing `?>` tag in pure PHP files.

## Absolute "ALWAYS" rules

- `declare(strict_types=1);` at the top of every file.
- Type hints on every property, parameter, and return value.
- Prepared statements for every database query.
- `htmlspecialchars($var, ENT_QUOTES, 'UTF-8')` on every user-data output.
- Validate and sanitize at the boundary; trust internal types.
- Early returns to flatten nesting.
- `final` classes by default; remove `final` only when designed for extension.
- `readonly` properties for immutable data.
- `use` statements sorted alphabetically; remove unused imports.
- 4 spaces for indentation; never tabs.

## Modern patterns the doc prescribes

- **Constructor property promotion** for DTOs, value objects, commands, events.
- **Readonly classes** (PHP 8.2+) for value objects like `Money`, `Email`, `OrderId`.
- **Match expressions** for value mapping and simple multi-branch returns. `if/else` reserved for complex multi-statement branches.
- **Named arguments** when a call has 3+ parameters or when skipping optional ones.
- **Short closures** (`fn(...) => ...`) for one-line callbacks.
- **Backed enums** with methods for type-safe state machines that previously lived as string constants.
- **Repository pattern** with an interface in the domain and Doctrine/Eloquent adapters in infrastructure.
- **Command/Handler pattern** for use cases — a readonly DTO command, a final handler with injected dependencies.
- **Value objects** with private constructors and named static factories (`Email::fromString(...)`).

## Security patterns prescribed

- Input filtering via `filter_input(INPUT_POST, ...)` with explicit `FILTER_VALIDATE_*`.
- SQL injection: prepared statements, named parameters preferred.
- XSS: `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')` always. Template engines with auto-escaping are the better default.
- Password storage: `password_hash` with `PASSWORD_ARGON2ID`, `password_verify`, `password_needs_rehash`.
- CSRF: 32-byte random token in session, `hash_equals` for constant-time comparison.

## Tools the doc names

- **PHP_CodeSniffer** — PSR-12 conformance checks.
- **PHPStan** — static analysis at level 8 minimum.
- **Psalm** — type checking.
- **PHP-CS-Fixer** — auto-format.

## When to push back

The doc explicitly tells AI assistants to refuse, with explanation, when asked to: omit types, use `eval`/`exec`, skip input validation, catch generic `\Exception`, prefer inheritance over composition, create God Objects, or remove `declare(strict_types=1)`. "Provide safer alternatives, don't just refuse."

## Relevance to this wiki

The Security pillar overlaps directly: prepared statements, output escaping, and password hashing are universal defenses, not PHP-specific. The Method (composition + readonly + early returns) generalizes to any typed language. PHP-specific concept and pattern pages would split out from this source in a follow-up ingest — the seed batch focuses on the AI-coding cross-cutting derivatives.

## License

CC BY 4.0. The full ruleset is intended to be copied into `CLAUDE.md` files at the root of PHP projects, or registered as a Cursor / Claude Code skill.
