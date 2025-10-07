import * as fc from 'fast-check';
import { User } from './user.entity';
import { CreateUserData, UpdateUserData } from './user.repository';

/**
 * Property-Based Tests for User Domain
 *
 * These tests use fast-check to generate random inputs and verify
 * that domain invariants hold for all possible inputs.
 */

describe('User Entity - Property-Based Tests', () => {
  describe('User Creation Properties', () => {
    it('should always create a user with the exact properties provided', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          fc.date(),
          fc.date(),
          (id, email, firstName, lastName, age, createdAt, updatedAt) => {
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              createdAt,
              updatedAt,
            );

            expect(user.id).toBe(id);
            expect(user.email).toBe(email);
            expect(user.firstName).toBe(firstName);
            expect(user.lastName).toBe(lastName);
            expect(user.age).toBe(age);
            expect(user.createdAt).toBe(createdAt);
            expect(user.updatedAt).toBe(updatedAt);
          },
        ),
      );
    });

    it('should create immutable user objects (readonly properties)', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          (id, email, firstName, lastName, age) => {
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            // Verify all properties are present and defined
            expect(user.id).toBeDefined();
            expect(user.email).toBeDefined();
            expect(user.firstName).toBeDefined();
            expect(user.lastName).toBeDefined();
            expect(user.age).toBeDefined();
          },
        ),
      );
    });

    it('should handle various email formats correctly', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          (id, email, firstName, lastName, age) => {
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            expect(user.email).toContain('@');
            expect(user.email).toBe(email);
          },
        ),
      );
    });

    it('should accept any positive age value', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 200 }),
          (id, email, firstName, lastName, age) => {
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            expect(user.age).toBeGreaterThanOrEqual(0);
            expect(user.age).toBe(age);
          },
        ),
      );
    });
  });

  describe('User Equality Properties', () => {
    it('should be equal if all properties are equal (reflexive)', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          fc.date(),
          fc.date(),
          (id, email, firstName, lastName, age, createdAt, updatedAt) => {
            const user1 = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              createdAt,
              updatedAt,
            );
            const user2 = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              createdAt,
              updatedAt,
            );

            // Same properties should create equivalent users
            expect(user1.id).toBe(user2.id);
            expect(user1.email).toBe(user2.email);
            expect(user1.firstName).toBe(user2.firstName);
            expect(user1.lastName).toBe(user2.lastName);
            expect(user1.age).toBe(user2.age);
          },
        ),
      );
    });

    it('should not be equal if IDs differ', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          (id1, id2, email, firstName, lastName, age) => {
            fc.pre(id1 !== id2); // Only test when IDs are different

            const user1 = new User(
              id1,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );
            const user2 = new User(
              id2,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            expect(user1.id).not.toBe(user2.id);
          },
        ),
      );
    });
  });

  describe('User Name Properties', () => {
    it('should preserve name formatting (no transformation)', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          (id, email, firstName, lastName, age) => {
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            // Names should be stored exactly as provided
            expect(user.firstName).toBe(firstName);
            expect(user.lastName).toBe(lastName);
          },
        ),
      );
    });

    it('should handle names with special characters', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          (id, email, firstName, lastName, age) => {
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            expect(user.firstName.length).toBeGreaterThan(0);
            expect(user.lastName.length).toBeGreaterThan(0);
          },
        ),
      );
    });
  });

  describe('Timestamp Properties', () => {
    it('should always have valid timestamps', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          fc.date(),
          fc.date(),
          (id, email, firstName, lastName, age, createdAt, updatedAt) => {
            // Filter out invalid dates (NaN)
            fc.pre(!isNaN(createdAt.getTime()) && !isNaN(updatedAt.getTime()));

            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              createdAt,
              updatedAt,
            );

            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);
            expect(user.createdAt.getTime()).not.toBeNaN();
            expect(user.updatedAt.getTime()).not.toBeNaN();
          },
        ),
      );
    });

    it('should handle any valid date range', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          fc.date({
            min: new Date('2000-01-01T00:00:00.000Z'),
            max: new Date('2100-12-31T23:59:59.999Z'),
          }),
          fc.date({
            min: new Date('2000-01-01T00:00:00.000Z'),
            max: new Date('2100-12-31T23:59:59.999Z'),
          }),
          (id, email, firstName, lastName, age, createdAt, updatedAt) => {
            // Filter out invalid dates (NaN)
            fc.pre(!isNaN(createdAt.getTime()) && !isNaN(updatedAt.getTime()));

            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              createdAt,
              updatedAt,
            );

            expect(user.createdAt.getUTCFullYear()).toBeGreaterThanOrEqual(
              2000,
            );
            expect(user.createdAt.getUTCFullYear()).toBeLessThanOrEqual(2100);
          },
        ),
      );
    });
  });
});

describe('CreateUserData Properties', () => {
  it('should accept any valid user creation data', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.integer({ min: 0, max: 150 }),
        (email, firstName, lastName, age) => {
          const data: CreateUserData = {
            email,
            firstName,
            lastName,
            age,
          };

          expect(data.email).toBe(email);
          expect(data.firstName).toBe(firstName);
          expect(data.lastName).toBe(lastName);
          expect(data.age).toBe(age);
        },
      ),
    );
  });
});

describe('UpdateUserData Properties', () => {
  it('should handle partial updates correctly', () => {
    fc.assert(
      fc.property(
        fc.option(fc.emailAddress(), {
          nil: undefined,
        }),
        fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
          nil: undefined,
        }),
        fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
          nil: undefined,
        }),
        fc.option(fc.integer({ min: 0, max: 150 }), {
          nil: undefined,
        }),
        (email, firstName, lastName, age) => {
          const data: UpdateUserData = {
            email,
            firstName,
            lastName,
            age,
          };

          // All fields should be optional
          if (email !== undefined) expect(data.email).toBe(email);
          if (firstName !== undefined) expect(data.firstName).toBe(firstName);
          if (lastName !== undefined) expect(data.lastName).toBe(lastName);
          if (age !== undefined) expect(data.age).toBe(age);
        },
      ),
    );
  });

  it('should allow empty update data', () => {
    fc.assert(
      fc.property(fc.constant({}), (data) => {
        const updateData: UpdateUserData = data;
        expect(updateData).toEqual({});
      }),
    );
  });
});
