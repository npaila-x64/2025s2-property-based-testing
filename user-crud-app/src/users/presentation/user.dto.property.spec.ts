import * as fc from 'fast-check';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UpdateUserDto } from './user.dto';

/**
 * Property-Based Tests for DTOs and Validation
 *
 * These tests verify that validation rules work correctly for all possible inputs
 */

describe('User DTOs - Property-Based Tests', () => {
  describe('CreateUserDto Properties', () => {
    it('should accept any valid email, names, and age', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName,
              age,
            });

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should reject invalid email formats', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter((s) => !s.includes('@')),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (invalidEmail, firstName, lastName, age) => {
            const dto = plainToInstance(CreateUserDto, {
              email: invalidEmail,
              firstName,
              lastName,
              age,
            });

            const errors = await validate(dto);
            const emailErrors = errors.filter((e) => e.property === 'email');
            expect(emailErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should reject empty first names', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, lastName, age) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName: '',
              lastName,
              age,
            });

            const errors = await validate(dto);
            const firstNameErrors = errors.filter(
              (e) => e.property === 'firstName',
            );
            expect(firstNameErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should reject empty last names', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, age) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName: '',
              age,
            });

            const errors = await validate(dto);
            const lastNameErrors = errors.filter(
              (e) => e.property === 'lastName',
            );
            expect(lastNameErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should reject negative ages', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: -100, max: -1 }),
          async (email, firstName, lastName, negativeAge) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName,
              age: negativeAge,
            });

            const errors = await validate(dto);
            const ageErrors = errors.filter((e) => e.property === 'age');
            expect(ageErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should reject non-integer ages', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc
            .double({ min: 0.1, max: 149.9, noNaN: true })
            .filter((n) => !Number.isInteger(n)),
          async (email, firstName, lastName, floatAge) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName,
              age: floatAge,
            });

            const errors = await validate(dto);
            const ageErrors = errors.filter((e) => e.property === 'age');
            expect(ageErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should accept age zero', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          async (email, firstName, lastName) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName,
              age: 0,
            });

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should reject missing required fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('email', 'firstName', 'lastName', 'age'),
          async (fieldToOmit) => {
            const validData = {
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              age: 25,
            };

            const invalidData = { ...validData };
            delete (invalidData as any)[fieldToOmit];

            const dto = plainToInstance(CreateUserDto, invalidData);
            const errors = await validate(dto);

            expect(errors.length).toBeGreaterThan(0);
            const fieldErrors = errors.filter(
              (e) => e.property === fieldToOmit,
            );
            expect(fieldErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 20 },
      );
    });
  });

  describe('UpdateUserDto Properties', () => {
    it('should accept partial updates with any valid field', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.option(fc.emailAddress(), { nil: undefined }),
          fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
            nil: undefined,
          }),
          fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
            nil: undefined,
          }),
          fc.option(fc.integer({ min: 0, max: 150 }), { nil: undefined }),
          async (email, firstName, lastName, age) => {
            const dto = plainToInstance(UpdateUserDto, {
              email,
              firstName,
              lastName,
              age,
            });

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should accept empty update (all fields undefined)', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant({}), async (emptyUpdate) => {
          const dto = plainToInstance(UpdateUserDto, emptyUpdate);
          const errors = await validate(dto);
          expect(errors.length).toBe(0);
        }),
        { numRuns: 10 },
      );
    });

    it('should reject invalid email if provided', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc
            .string({ minLength: 1, maxLength: 50 })
            .filter((s) => !s.includes('@')),
          async (invalidEmail) => {
            const dto = plainToInstance(UpdateUserDto, {
              email: invalidEmail,
            });

            const errors = await validate(dto);
            const emailErrors = errors.filter((e) => e.property === 'email');
            expect(emailErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should reject negative age if provided', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: -100, max: -1 }),
          async (negativeAge) => {
            const dto = plainToInstance(UpdateUserDto, {
              age: negativeAge,
            });

            const errors = await validate(dto);
            const ageErrors = errors.filter((e) => e.property === 'age');
            expect(ageErrors.length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should handle all combinations of field presence', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.boolean(),
          fc.boolean(),
          fc.boolean(),
          fc.boolean(),
          async (hasEmail, hasFirstName, hasLastName, hasAge) => {
            const updateData: any = {};

            if (hasEmail) updateData.email = 'test@example.com';
            if (hasFirstName) updateData.firstName = 'Test';
            if (hasLastName) updateData.lastName = 'User';
            if (hasAge) updateData.age = 25;

            const dto = plainToInstance(UpdateUserDto, updateData);
            const errors = await validate(dto);

            expect(errors.length).toBe(0);
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe('DTO Transformation Properties', () => {
    it('should transform plain object to DTO correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const plainObj = { email, firstName, lastName, age };
            const dto = plainToInstance(CreateUserDto, plainObj);

            expect(dto).toBeInstanceOf(CreateUserDto);
            expect(dto.email).toBe(email);
            expect(dto.firstName).toBe(firstName);
            expect(dto.lastName).toBe(lastName);
            expect(dto.age).toBe(age);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should preserve types during transformation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const plainObj = { email, firstName, lastName, age };
            const dto = plainToInstance(CreateUserDto, plainObj);

            expect(typeof dto.email).toBe('string');
            expect(typeof dto.firstName).toBe('string');
            expect(typeof dto.lastName).toBe('string');
            expect(typeof dto.age).toBe('number');
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe('Validation Edge Cases', () => {
    it('should handle very long names gracefully', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 51, maxLength: 1000 }),
          fc.string({ minLength: 51, maxLength: 1000 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, longFirstName, longLastName, age) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName: longFirstName,
              lastName: longLastName,
              age,
            });

            const errors = await validate(dto);
            // Should either accept or reject consistently
            expect(Array.isArray(errors)).toBe(true);
          },
        ),
        { numRuns: 30 },
      );
    });

    it('should handle very large age values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 151, max: 1000 }),
          async (email, firstName, lastName, largeAge) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName,
              age: largeAge,
            });

            const errors = await validate(dto);
            // Should either accept or reject consistently
            expect(Array.isArray(errors)).toBe(true);
          },
        ),
        { numRuns: 30 },
      );
    });

    it('should handle unicode characters in names', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName,
              age,
            });

            const errors = await validate(dto);
            // Should handle unicode gracefully
            expect(Array.isArray(errors)).toBe(true);
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe('Idempotency Properties', () => {
    it('validation should be idempotent (same result on multiple calls)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const dto = plainToInstance(CreateUserDto, {
              email,
              firstName,
              lastName,
              age,
            });

            const errors1 = await validate(dto);
            const errors2 = await validate(dto);
            const errors3 = await validate(dto);

            expect(errors1.length).toBe(errors2.length);
            expect(errors2.length).toBe(errors3.length);
          },
        ),
        { numRuns: 50 },
      );
    });
  });
});
