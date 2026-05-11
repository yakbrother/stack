# PHP Coding Rules

**Description:** PHP-specific coding standards and best practices.

## Type Safety

- Always use types explicitly in function declarations and return types
- Utilize PHP's strict typing mode when possible (`declare(strict_types=1)`)
- Declare parameter types and return types for all functions and methods
- Use union types and nullable types appropriately

## Code Quality Standards

- Follow all PHPStan standards for static analysis
- Ensure code passes PHPStan at the highest level possible
- Address all PHPStan warnings and errors before committing code
- Always check for duplicate PHP tags (`<?php`)
- Avoid redundant opening/closing PHP tags

## Best Practices

- Use type hints for arrays when possible (e.g., `array<string, int>` in docblocks)
- Implement proper null handling and avoid null-related errors
- Use strict comparisons (`===`, `!==`) instead of loose comparisons
- Leverage PHP's built-in type system features (enums, readonly properties, etc.)
- Follow PSR-12 coding standards for consistency

## Error Handling

- Use typed exceptions where applicable
- Implement proper error handling with try-catch blocks
- Avoid suppressing errors with `@` operator unless absolutely necessary
- Log errors appropriately with proper context
