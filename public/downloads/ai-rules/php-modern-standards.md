# Modern PHP Coding Standards - Claude Context v1.0

**Purpose**: Machine-readable PHP coding rules for AI assistants. For human-readable documentation, see the full ruleset.

**Target**: PHP 8.0+  
**Conformance**: PSR-1, PSR-12, Slevomat Coding Standard

---

## Core Directives

### Priority Order
1. **Type safety first** - Use type declarations everywhere possible
2. **Security always** - Never trust user input, always validate/escape
3. **Composition over inheritance** - Inject dependencies, don't extend
4. **Immutability when possible** - Use readonly properties/classes

### Absolute Rules (NEVER violate)

**NEVER:**
- Omit `declare(strict_types=1)` from PHP files
- Use `eval()`, `exec()`, `system()`, `extract()`
- Trust user input without validation
- Output user data without escaping (XSS)
- Use plain SQL without prepared statements (SQL injection)
- Store passwords with md5/sha1 (use `password_hash()`)
- Use Yoda conditions (`null === $var`)
- Return null to indicate errors (use exceptions)
- Catch generic `\Exception` (catch specific types)
- Use magic numbers (define constants/enums)
- Create God Objects (split responsibilities)
- Use boolean parameters (use named arguments or separate methods)
- Mix HTML and PHP without template engine
- Use `$$variable` (variable variables)
- Use closing `?>` tag in pure PHP files

**ALWAYS:**
- Declare strict types: `declare(strict_types=1);`
- Use type hints on properties, parameters, and return values
- Use prepared statements for database queries
- Escape output: `htmlspecialchars($var, ENT_QUOTES, 'UTF-8')`
- Validate and sanitize user input
- Use early returns to reduce nesting
- Declare classes as `final` by default
- Use `readonly` for immutable data
- Sort `use` statements alphabetically
- Remove unused imports and parameters
- Use 4 spaces for indentation (never tabs)
- End files with single LF
- Omit closing `?>` tag

---

## Decision Trees

### Choosing Type Declarations

```
Can type be determined?
├─ YES → Always declare type
└─ NO → Must use mixed as last resort

What type?
├─ Specific class → Use class name (Invoice, User)
├─ Multiple possible types → Union type (int|string)
├─ Must implement multiple interfaces → Intersection (Identifiable&Timestamped)
├─ Anything → mixed (avoid if possible)
└─ No return value → void
```

### Choosing Between Patterns

```
Need immutable data object?
├─ YES → Use readonly class with constructor promotion
└─ NO → Need shared behavior?
    ├─ YES → Can behavior be separate object?
        ├─ YES → Composition (inject dependency)
        └─ NO → Inheritance (extends) - use sparingly
    └─ NO → Standard class
```

### Choosing Control Structures

```
Simple value selection?
├─ YES → Ternary: $x = $condition ? 'yes' : 'no';
└─ NO → Multiple branches with returns?
    ├─ YES → match expression
    └─ NO → if/else or extract to method
```

### Error Handling Strategy

```
Expected outcome?
├─ Item might not exist → Return null
├─ Validation failed → Throw domain exception
├─ Infrastructure error → Let exception bubble
└─ Multiple errors → Collect and throw exception with all errors
```

---

## File Structure (Mandatory)

```php
<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\User\ValueObject\Email;
use App\Domain\User\ValueObject\UserId;
use App\Infrastructure\Persistence\UserRepository;

// Blank line before class

final class User
{
    // Class body
}

// No closing ?> tag
```

**Rules**:
1. UTF-8 without BOM
2. `<?php` on first line
3. `declare(strict_types=1);` on second line
4. `namespace` on third line
5. Blank line
6. `use` statements (alphabetically sorted)
7. Blank line
8. Class declaration
9. End with single LF
10. No closing `?>` tag

---

## Naming Conventions

```php
// Classes, Interfaces, Traits: PascalCase
class UserRepository {}
interface PaymentGateway {}  // NO "Interface" suffix
trait Timestampable {}       // NO "Trait" suffix

// Methods and Properties: camelCase
public function findUserById(int $id): ?User
private string $emailAddress;

// Constants: UPPER_SNAKE_CASE
public const MAX_LOGIN_ATTEMPTS = 5;
private const DEFAULT_TIMEOUT = 30;

// Enums: PascalCase for enum, UPPER for cases if unbacked
enum Status {
    case PENDING;
    case APPROVED;
}

// Or camelCase for backed enums
enum Status: string {
    case Pending = 'pending';
    case Approved = 'approved';
}
```

---

## Type System (Use Everywhere)

### Basic Types

```php
// Scalar types
int, float, string, bool

// Compound types
array, object, callable, iterable

// Special types
void       // No return value
mixed      // Any type (avoid if possible)
never      // Never returns (always throws/exits)
null       // Only in union types

// Class/interface types
User, PaymentGateway, \DateTimeImmutable
```

### Union Types (PHP 8.0+)

```php
function format(int|string $value): string {}

// Nullable is union with null
function find(int $id): User|null {}  // Same as ?User
```

### Intersection Types (PHP 8.1+)

```php
function log(Identifiable&Timestamped $entity): void {}
// Object must implement BOTH interfaces
```

### Type Declaration Template

```php
// Full type coverage
final readonly class CreateOrderCommand
{
    public function __construct(
        public array $items,           // Array type
        public string $customerId,     // Scalar type
        public ?Money $discount = null, // Nullable object
    ) {}
}

class OrderProcessor
{
    public function __construct(
        private OrderRepository $repository,
        private LoggerInterface $logger,
    ) {}
    
    public function process(CreateOrderCommand $command): Order
    {
        // Method implementation
    }
    
    private function validate(Order $order): bool
    {
        // Helper method
    }
}
```

---

## Modern PHP Patterns

### Constructor Promotion (PHP 8.0+)

```php
// Use for simple data objects
final readonly class User
{
    public function __construct(
        public string $email,
        public string $name,
        public ?string $phone = null,
    ) {}
}

// Equivalent to old verbose syntax:
// private string $email;
// public function __construct(string $email) { $this->email = $email; }
```

**When to use**: DTOs, Value Objects, Commands, Events

### Readonly (PHP 8.1+)

```php
// Readonly property
class Order
{
    public function __construct(
        public readonly OrderId $id,
        public readonly Money $total,
    ) {}
}

// Readonly class (PHP 8.2+) - all properties automatically readonly
readonly class Money
{
    public function __construct(
        public int $amount,
        public string $currency,
    ) {}
}
```

### Match Expression (PHP 8.0+)

```php
// Simple mapping
$color = match($status) {
    'pending' => 'yellow',
    'approved' => 'green',
    'rejected' => 'red',
    default => 'gray',
};

// Multiple values, same result
$type = match($code) {
    200, 201, 204 => 'success',
    400, 404 => 'client_error',
    500, 503 => 'server_error',
    default => throw new UnknownStatusCode($code),
};

// Conditional matching
$message = match(true) {
    $age < 13 => 'child',
    $age < 20 => 'teenager',
    $age < 65 => 'adult',
    default => 'senior',
};
```

**Use match for**: Value mapping, simple conditionals with returns  
**Use if/else for**: Complex logic, multiple statements per branch

### Named Arguments (PHP 8.0+)

```php
// Use when: 3+ parameters OR skipping optional params
createUser(
    email: 'user@example.com',
    password: 'secret',
    verified: true,
    role: 'admin',
);

// Skip optional params
sendEmail(
    to: 'user@example.com',
    subject: 'Welcome',
    // Skip template, cc, bcc
    priority: 'high',
);
```

### Short Closures (PHP 7.4+)

```php
// One-line callbacks
$ids = array_map(fn($user) => $user->id, $users);
$adults = array_filter($users, fn($u) => $u->age >= 18);

// Captures outer variables automatically
$multiplier = 10;
$doubled = array_map(fn($n) => $n * $multiplier, $numbers);
```

### Enums (PHP 8.1+)

```php
// Basic enum
enum Status
{
    case Pending;
    case Approved;
    case Rejected;
}

function updateOrder(Order $order, Status $status): void {}

// Backed enum with methods
enum Status: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    
    public function color(): string
    {
        return match($this) {
            self::Pending => 'yellow',
            self::Approved => 'green',
            self::Rejected => 'red',
        };
    }
    
    public function label(): string
    {
        return match($this) {
            self::Pending => 'Awaiting Review',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
        };
    }
}

// Usage
$order->setStatus(Status::Approved);
echo Status::Approved->value;  // 'approved'
echo Status::Approved->color(); // 'green'
```

**Replace with enums**: Class constants, string constants, boolean flags

---

## Security Patterns (Critical)

### Input Validation

```php
// Filter and validate
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if ($email === false || $email === null) {
    throw new InvalidEmailException();
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($id === false || $id === null) {
    throw new InvalidIdException();
}

// Custom validation
if (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
    throw new InvalidUsernameException();
}
```

### SQL Injection Prevention

```php
// ALWAYS use prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND active = ?");
$stmt->execute([$email, true]);

// Named parameters
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);

// NEVER concatenate user input into queries
// WRONG: $query = "SELECT * FROM users WHERE id = " . $_GET['id'];
```

### XSS Prevention

```php
// Escape ALL user output
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// In HTML attributes
echo '<div data-name="' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '">';

// Use template engines with auto-escaping (Blade, Twig)
{{ $userInput }}  <!-- Auto-escaped -->
{!! $trustedHtml !!}  <!-- Unescaped - use carefully -->
```

### Password Handling

```php
// Hash passwords
$hash = password_hash($password, PASSWORD_ARGON2ID);

// Verify
if (password_verify($inputPassword, $storedHash)) {
    // Login successful
}

// Rehash if needed
if (password_needs_rehash($storedHash, PASSWORD_ARGON2ID)) {
    $newHash = password_hash($password, PASSWORD_ARGON2ID);
    // Update database
}
```

### CSRF Protection

```php
// Generate token
$token = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $token;

// Verify token (use hash_equals to prevent timing attacks)
if (!hash_equals($_SESSION['csrf_token'] ?? '', $_POST['csrf_token'] ?? '')) {
    throw new CsrfValidationException();
}
```

---

## Code Structure

### Early Returns

```php
// Reduce nesting
public function processOrder(Order $order): void
{
    if (!$order->isValid()) {
        throw new InvalidOrderException();
    }
    
    if (!$order->hasStock()) {
        throw new InsufficientStockException();
    }
    
    if (!$order->isPaid()) {
        throw new UnpaidOrderException();
    }
    
    // Happy path at top level
    $this->fulfill($order);
}
```

### Composition Over Inheritance

```php
// Prefer this
final class OrderProcessor
{
    public function __construct(
        private OrderValidator $validator,
        private PaymentGateway $gateway,
        private EmailService $mailer,
    ) {}
}

// Over this
class OrderProcessor extends BaseProcessor {}
```

**When inheritance OK**: Extending framework classes, true is-a relationship (max 2 levels)

### Declare Final by Default

```php
// Default
final class UserService {}

// Only if designed for extension
class BaseController {}
abstract class AbstractRepository {}
```

---

## Error Handling

### Use Specific Exceptions

```php
// Define domain exceptions
namespace App\Domain\User\Exception;

final class UserNotFoundException extends \DomainException
{
    public function __construct(public readonly int $userId)
    {
        parent::__construct("User not found: {$userId}");
    }
}

// Throw specific exceptions
throw new UserNotFoundException($id);
throw new InvalidEmailException($email);
throw new InsufficientFundsException($required, $available);
```

### Catch Specific Exceptions

```php
// Good
try {
    $user = $repository->find($id);
} catch (UserNotFoundException $e) {
    return null;
} catch (DatabaseException $e) {
    $logger->error($e->getMessage());
    throw $e;
}

// Bad - catches everything
try {
    $user = $repository->find($id);
} catch (\Exception $e) {
    return null; // Silently catches programming errors!
}
```

### Exception Hierarchy

```php
// Base domain exception
namespace App\Domain;
abstract class DomainException extends \Exception {}

// Specific exceptions
namespace App\Domain\User\Exception;

final class UserNotFoundException extends DomainException {}
final class DuplicateEmailException extends DomainException {}
final class InvalidPasswordException extends DomainException {}
```

---

## Formatting Rules

### Indentation and Spacing

```php
// 4 spaces, never tabs
if ($condition) {
    echo 'yes';
}

// No space after opening, before closing parenthesis
if ($x === 5) {}
function test($a, $b) {}

// One space after comma
function test($a, $b, $c) {}
array_map($fn, $array, $another);

// One space around operators
$sum = $a + $b;
$result = $x === $y;
```

### Class and Method Structure

```php
final class ExampleClass extends BaseClass implements InterfaceA, InterfaceB
{
    // Constants first
    private const MAX_ITEMS = 100;
    
    // Properties
    private string $name;
    
    // Constructor
    public function __construct(
        private UserRepository $repository,
    ) {}
    
    // Public methods
    public function publicMethod(): void
    {
        // implementation
    }
    
    // Protected methods
    protected function protectedMethod(): void
    {
        // implementation
    }
    
    // Private methods
    private function privateMethod(): void
    {
        // implementation
    }
}
```

### Multi-line Arguments

```php
// When method signature exceeds line limit
public function longMethodName(
    string $firstParameter,
    int $secondParameter,
    ?array $thirdParameter = null,
): ReturnType {
    // Method body
}

// Function calls
$result = $object->someMethod(
    $longArgumentName,
    $anotherLongArgument,
    $thirdArgument,
);
```

---

## Common Patterns

### Repository Pattern

```php
interface UserRepository
{
    public function find(int $id): ?User;
    public function save(User $user): void;
    public function delete(User $user): void;
}

final class DoctrineUserRepository implements UserRepository
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {}
    
    public function find(int $id): ?User
    {
        return $this->em->find(User::class, $id);
    }
    
    public function save(User $user): void
    {
        $this->em->persist($user);
        $this->em->flush();
    }
}
```

### Value Objects

```php
final readonly class Email
{
    private function __construct(
        public string $value,
    ) {}
    
    public static function fromString(string $email): self
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidEmailException($email);
        }
        
        return new self($email);
    }
    
    public function __toString(): string
    {
        return $this->value;
    }
}

// Usage
$email = Email::fromString('user@example.com');
```

### Command/Handler Pattern

```php
// Command (DTO)
final readonly class CreateUserCommand
{
    public function __construct(
        public string $email,
        public string $password,
        public ?string $name = null,
    ) {}
}

// Handler
final class CreateUserHandler
{
    public function __construct(
        private UserRepository $repository,
        private PasswordHasher $hasher,
    ) {}
    
    public function handle(CreateUserCommand $command): User
    {
        $user = new User(
            email: $command->email,
            password: $this->hasher->hash($command->password),
            name: $command->name,
        );
        
        $this->repository->save($user);
        
        return $user;
    }
}
```

---

## Testing Guidelines

### Test Structure

```php
final class UserServiceTest extends TestCase
{
    /** @test */
    public function it_creates_user_with_valid_email(): void
    {
        // Arrange
        $repository = $this->createMock(UserRepository::class);
        $service = new UserService($repository);
        
        // Act
        $user = $service->createUser('test@example.com', 'password');
        
        // Assert
        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('test@example.com', $user->email);
    }
    
    /** @test */
    public function it_throws_exception_for_invalid_email(): void
    {
        $service = new UserService($this->createMock(UserRepository::class));
        
        $this->expectException(InvalidEmailException::class);
        
        $service->createUser('invalid', 'password');
    }
}
```

### Test Naming

```php
// Good - describes behavior
public function it_sends_welcome_email_after_registration(): void {}
public function it_prevents_duplicate_emails(): void {}
public function it_calculates_total_with_discount(): void {}

// Bad - vague
public function testCreate(): void {}
public function test1(): void {}
```

### What to Test

**Test**: Business logic, edge cases, error handling, public API  
**Don't test**: Private methods, framework code, getters/setters

---

## Slevomat Rules (Selected)

### Type Hints

```php
// Require native type hints everywhere
public function process(int $id): User {}  // Not just @param

// Nullable type for null default
public function greet(?string $name = null): string {}

// No useless PHPDoc
// Bad
/** @param int $id */  // Redundant with native typehint
public function find(int $id): User {}

// Good - PHPDoc adds value
/** @param int $id The user's database ID */
public function find(int $id): User {}
```

### Code Cleaning

```php
// Remove unused use statements
use App\Service\UserService; // Must be used

// Remove unused parameters
public function process(Order $order): void {
    // If $order not used, remove it
}

// Remove useless parentheses
return $value;        // Not: return ($value);
if ($x === 5) {}     // Not: if (($x === 5)) {}
```

### Formatting

```php
// Alphabetically sorted use statements
use App\Domain\Order;
use App\Domain\User;
use Psr\Log\LoggerInterface;

// Trailing comma in multi-line arrays
$array = [
    'first',
    'second',
    'third', // Comma here
];
```

---

## Anti-Patterns to Avoid

```php
// God Object
class Application {
    public function everything() {} // Split into multiple classes
}

// Magic Numbers
if ($status === 1) {}  // Use: if ($status === Status::Active->value) {}

// Boolean Parameters
$user->update(true);   // Use: $user->update(sendEmail: true);

// Variable Variables
$$variable;            // Never use

// Catching Generic Exception
catch (\Exception $e) {} // Catch specific: catch (UserNotFoundException $e) {}
```

---

## Performance

### Enable Opcache (Production)

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

### Avoid N+1 Queries

```php
// Bad
foreach ($users as $user) {
    echo $user->orders->count(); // Query per user
}

// Good
$users = User::with('orders')->get();
foreach ($users as $user) {
    echo $user->orders->count(); // Already loaded
}
```

---

## Quick Reference

**Need immutable data?** → readonly class with constructor promotion  
**Need type safety?** → Declare types on everything  
**Need branching?** → match expression for simple cases, if/else for complex  
**Need shared behavior?** → Composition (inject dependency)  
**Need validation?** → Throw specific exception  
**Need database query?** → Prepared statements ALWAYS  
**Need to output user data?** → htmlspecialchars() ALWAYS  
**Need password storage?** → password_hash() ALWAYS

---

## When to Push Back

**If asked to**:
- Omit types → Explain type safety benefits
- Use eval/exec → Security risk, suggest alternatives
- Skip input validation → Security requirement, non-negotiable
- Catch generic Exception → Explain specific exception handling
- Use inheritance → Suggest composition
- Create God Object → Suggest splitting responsibilities
- Remove declare(strict_types=1) → Explain type coercion risks

**Provide safer alternatives, don't just refuse.**

---

## Tools

- **PHP_CodeSniffer**: Check PSR-12 compliance
- **PHPStan** (level 8+): Static analysis
- **Psalm**: Type checking
- **PHP-CS-Fixer**: Auto-format code

---

**Version**: 1.0 (2025-09-30)  
**Full documentation**: Modern-PHP-Coding-Standards-v1.0.md  
**Author**: Tim (@yakbrother)
