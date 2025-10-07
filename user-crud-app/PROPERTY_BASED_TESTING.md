# Property-Based Testing Documentation

## Overview

This application includes comprehensive **property-based testing** using [fast-check](https://github.com/dubzzz/fast-check), which automatically generates hundreds of test cases to verify that code behaves correctly for all possible inputs.

## What is Property-Based Testing?

Unlike traditional example-based tests that check specific inputs and outputs, property-based tests verify **universal properties** that should hold true for **all valid inputs**.

### Example Comparison

**Traditional Test:**
```typescript
it('should create a user', () => {
  const user = new User('123', 'john@example.com', 'John', 'Doe', 30, new Date(), new Date());
  expect(user.email).toBe('john@example.com');
});
```

**Property-Based Test:**
```typescript
it('should always create a user with the exact properties provided', () => {
  fc.assert(
    fc.property(
      fc.uuid(),           // Generate random UUIDs
      fc.emailAddress(),   // Generate random emails
      fc.string(),         // Generate random strings
      fc.string(),
      fc.integer({ min: 0, max: 150 }),
      (id, email, firstName, lastName, age) => {
        const user = new User(id, email, firstName, lastName, age, new Date(), new Date());
        expect(user.email).toBe(email);  // Property holds for ANY email
      }
    )
  );
});
```

## Property-Based Test Files

### 1. Domain Layer Tests
**File:** `src/users/domain/user.property.spec.ts`

Tests domain entities and value objects:

- ✅ **User Creation Properties** - Verifies users are created with exact properties
- ✅ **Immutability** - Ensures user objects are readonly
- ✅ **Email Handling** - Tests all valid email formats
- ✅ **Age Validation** - Verifies any positive age is accepted
- ✅ **Equality Properties** - Tests reflexive, symmetric, transitive equality
- ✅ **Name Formatting** - Ensures names are preserved as-is
- ✅ **Timestamp Handling** - Validates date range handling
- ✅ **CreateUserData** - Tests user creation data structures
- ✅ **UpdateUserData** - Tests partial update data structures

### 2. Use Case Tests
**File:** `src/users/application/use-cases.property.spec.ts`

Tests business logic invariants:

- ✅ **CreateUserUseCase Properties**
  - Always calls repository with exact data
  - Always checks for existing email
  - Always throws error if email exists
  
- ✅ **GetAllUsersUseCase Properties**
  - Returns exactly what repository returns
  - Handles empty lists correctly
  
- ✅ **GetUserByIdUseCase Properties**
  - Returns user if found
  - Always throws error if not found
  
- ✅ **UpdateUserUseCase Properties**
  - Preserves unchanged fields
  - Checks email uniqueness when updating
  - Throws error if new email is taken
  
- ✅ **DeleteUserUseCase Properties**
  - Always checks existence before deleting
  - Always throws error if user doesn't exist
  
- ✅ **Business Logic Invariants**
  - Create → Get returns same data

### 3. DTO Validation Tests
**File:** `src/users/presentation/user.dto.property.spec.ts`

Tests input validation rules:

- ✅ **CreateUserDto Properties**
  - Accepts valid email, names, and age
  - Rejects invalid email formats
  - Rejects empty names
  - Rejects negative ages
  - Rejects non-integer ages
  - Accepts age zero
  - Rejects missing required fields
  
- ✅ **UpdateUserDto Properties**
  - Accepts partial updates
  - Accepts empty updates
  - Rejects invalid email if provided
  - Rejects negative age if provided
  - Handles all field combinations
  
- ✅ **DTO Transformation Properties**
  - Transforms plain objects correctly
  - Preserves types during transformation
  
- ✅ **Edge Cases**
  - Very long names
  - Very large ages
  - Unicode characters
  
- ✅ **Idempotency**
  - Validation produces same result on multiple calls

## Running Property-Based Tests

### Run All Tests
```bash
npm run test
```

### Run Only Property-Based Tests
```bash
npm run test -- --testNamePattern="Property"
```

### Run Specific Test File
```bash
npm run test user.property.spec.ts
npm run test use-cases.property.spec.ts
npm run test user.dto.property.spec.ts
```

### Run with Coverage
```bash
npm run test:cov
```

## Test Configuration

Property-based tests use the following configuration:

```typescript
fc.assert(
  fc.property(...),
  { numRuns: 100 }  // Number of random test cases to generate
);
```

**Default runs per test:**
- Domain tests: 100 runs
- Use case tests: 30-50 runs (slower due to module creation)
- DTO tests: 50-100 runs

## Generators Used

fast-check provides many built-in generators:

| Generator | Description | Example |
|-----------|-------------|---------|
| `fc.uuid()` | UUID v4 | `"550e8400-e29b-41d4-a716-446655440000"` |
| `fc.emailAddress()` | Valid emails | `"test@example.com"` |
| `fc.string()` | Random strings | `"hello"`, `"a1b2"` |
| `fc.integer()` | Integers | `42`, `-10`, `0` |
| `fc.boolean()` | Booleans | `true`, `false` |
| `fc.date()` | Dates | `new Date("2023-01-01")` |
| `fc.array()` | Arrays | `[1, 2, 3]` |
| `fc.record()` | Objects | `{ name: "test", age: 25 }` |
| `fc.option()` | Optional values | `"value"`, `undefined` |
| `fc.constantFrom()` | Pick from values | `"a"`, `"b"`, or `"c"` |

## Properties Tested

### 1. **Reflexive Properties**
```typescript
// A value equals itself
expect(user.id).toBe(user.id);
```

### 2. **Idempotent Properties**
```typescript
// Multiple calls produce same result
const errors1 = await validate(dto);
const errors2 = await validate(dto);
expect(errors1.length).toBe(errors2.length);
```

### 3. **Commutative Properties**
```typescript
// Order doesn't matter
expect(createThenGet()).toEqual(getThenCreate());
```

### 4. **Invariant Properties**
```typescript
// Always true regardless of input
expect(user.age).toBeGreaterThanOrEqual(0);
```

### 5. **Round-trip Properties**
```typescript
// Encode then decode returns original
const dto = plainToInstance(CreateUserDto, data);
expect(dto).toMatchObject(data);
```

## Benefits

### 1. **Comprehensive Coverage**
- Tests hundreds of scenarios automatically
- Finds edge cases you didn't think of
- Covers boundary conditions

### 2. **Regression Detection**
- Catches breaking changes
- Ensures invariants hold
- Validates assumptions

### 3. **Documentation**
- Properties serve as specification
- Expresses intent clearly
- Shows expected behavior

### 4. **Confidence**
- Proves correctness mathematically
- Reduces bugs in production
- Validates business rules


### Common Issues

**Issue:** Test times out
```typescript
// Solution: Reduce numRuns or use asyncProperty
fc.assert(fc.asyncProperty(...), { numRuns: 10, timeout: 5000 });
```

**Issue:** Too many invalid inputs
```typescript
// Solution: Use fc.pre() or better generators
fc.pre(input.length > 0);  // Skip invalid cases
```

**Issue:** Flaky tests
```typescript
// Solution: Set a fixed seed for reproducibility
fc.assert(prop, { seed: 42 });
```

## Further Reading

- [fast-check Documentation](https://github.com/dubzzz/fast-check)
- [Property-Based Testing Guide](https://hypothesis.works/articles/what-is-property-based-testing/)
- [Scott Wlaschin - Property-Based Testing](https://fsharpforfunandprofit.com/pbt/)
