import { Test, TestingModule } from '@nestjs/testing';
import * as fc from 'fast-check';
import {
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from './use-cases';
import { User } from '../domain/user.entity';
import type {
  UserRepository,
  CreateUserData,
  UpdateUserData,
} from '../domain/user.repository';
import { USER_REPOSITORY } from '../domain/user.repository';

/**
 * Property-Based Tests for Use Cases
 *
 * These tests verify that use case business logic holds for all possible inputs
 */

describe('Use Cases - Property-Based Tests', () => {
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateUserUseCase Properties', () => {
    it('should always call repository.create with the exact data provided', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const module = await Test.createTestingModule({
              providers: [
                CreateUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
            const userData: CreateUserData = {
              email,
              firstName,
              lastName,
              age,
            };

            mockRepository.findByEmail.mockResolvedValue(null);
            mockRepository.create.mockResolvedValue(
              new User(
                'test-id',
                email,
                firstName,
                lastName,
                age,
                new Date(),
                new Date(),
              ),
            );

            await useCase.execute(userData);

            expect(mockRepository.create).toHaveBeenCalledWith(userData);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should always check for existing email before creating', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const module = await Test.createTestingModule({
              providers: [
                CreateUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
            const userData: CreateUserData = {
              email,
              firstName,
              lastName,
              age,
            };

            mockRepository.findByEmail.mockResolvedValue(null);
            mockRepository.create.mockResolvedValue(
              new User(
                'test-id',
                email,
                firstName,
                lastName,
                age,
                new Date(),
                new Date(),
              ),
            );

            await useCase.execute(userData);

            expect(mockRepository.findByEmail).toHaveBeenCalledWith(email);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should always throw error if email exists', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const module = await Test.createTestingModule({
              providers: [
                CreateUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
            const userData: CreateUserData = {
              email,
              firstName,
              lastName,
              age,
            };

            // Email already exists
            mockRepository.findByEmail.mockResolvedValue(
              new User(
                'existing-id',
                email,
                'Existing',
                'User',
                30,
                new Date(),
                new Date(),
              ),
            );

            await expect(useCase.execute(userData)).rejects.toThrow(
              'User with this email already exists',
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe('GetAllUsersUseCase Properties', () => {
    it('should return exactly what the repository returns', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.uuid(),
              email: fc.emailAddress(),
              firstName: fc.string({ minLength: 1, maxLength: 50 }),
              lastName: fc.string({ minLength: 1, maxLength: 50 }),
              age: fc.integer({ min: 0, max: 150 }),
            }),
            { maxLength: 20 },
          ),
          async (userData) => {
            const module = await Test.createTestingModule({
              providers: [
                GetAllUsersUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
            const users = userData.map(
              (u) =>
                new User(
                  u.id,
                  u.email,
                  u.firstName,
                  u.lastName,
                  u.age,
                  new Date(),
                  new Date(),
                ),
            );

            mockRepository.findAll.mockResolvedValue(users);

            const result = await useCase.execute();

            expect(result).toEqual(users);
            expect(result.length).toBe(users.length);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should handle empty user lists', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant([]), async (emptyArray) => {
          const module = await Test.createTestingModule({
            providers: [
              GetAllUsersUseCase,
              { provide: USER_REPOSITORY, useValue: mockRepository },
            ],
          }).compile();

          const useCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
          mockRepository.findAll.mockResolvedValue(emptyArray);

          const result = await useCase.execute();

          expect(result).toEqual([]);
          expect(result.length).toBe(0);
        }),
        { numRuns: 10 },
      );
    });
  });

  describe('GetUserByIdUseCase Properties', () => {
    it('should return the user if found', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (id, email, firstName, lastName, age) => {
            const module = await Test.createTestingModule({
              providers: [
                GetUserByIdUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            mockRepository.findById.mockResolvedValue(user);

            const result = await useCase.execute(id);

            expect(result).toEqual(user);
            expect(mockRepository.findById).toHaveBeenCalledWith(id);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should always throw error if user not found', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (id) => {
          const module = await Test.createTestingModule({
            providers: [
              GetUserByIdUseCase,
              { provide: USER_REPOSITORY, useValue: mockRepository },
            ],
          }).compile();

          const useCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
          mockRepository.findById.mockResolvedValue(null);

          await expect(useCase.execute(id)).rejects.toThrow('User not found');
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('UpdateUserUseCase Properties', () => {
    it('should preserve unchanged fields', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
            nil: undefined,
          }),
          async (id, email, firstName, lastName, age, newFirstName) => {
            const module = await Test.createTestingModule({
              providers: [
                UpdateUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
            const existingUser = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            mockRepository.findById.mockResolvedValue(existingUser);
            mockRepository.update.mockResolvedValue(
              new User(
                id,
                email,
                newFirstName || firstName,
                lastName,
                age,
                new Date(),
                new Date(),
              ),
            );

            const updateData: UpdateUserData = newFirstName
              ? { firstName: newFirstName }
              : {};

            await useCase.execute(id, updateData);

            expect(mockRepository.findById).toHaveBeenCalledWith(id);
            expect(mockRepository.update).toHaveBeenCalledWith(id, updateData);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should check email uniqueness when updating email', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.emailAddress(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (id, oldEmail, newEmail, firstName, lastName, age) => {
            fc.pre(oldEmail !== newEmail);

            const module = await Test.createTestingModule({
              providers: [
                UpdateUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
            const existingUser = new User(
              id,
              oldEmail,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            mockRepository.findById.mockResolvedValue(existingUser);
            mockRepository.findByEmail.mockResolvedValue(null);
            mockRepository.update.mockResolvedValue(
              new User(
                id,
                newEmail,
                firstName,
                lastName,
                age,
                new Date(),
                new Date(),
              ),
            );

            await useCase.execute(id, { email: newEmail });

            expect(mockRepository.findByEmail).toHaveBeenCalledWith(newEmail);
          },
        ),
        { numRuns: 30 },
      );
    });

    it('should throw error if new email is already taken', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.uuid(),
          fc.emailAddress(),
          fc.emailAddress(),
          async (userId, otherUserId, userEmail, newEmail) => {
            fc.pre(userId !== otherUserId && userEmail !== newEmail);

            const module = await Test.createTestingModule({
              providers: [
                UpdateUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);

            mockRepository.findById.mockResolvedValue(
              new User(
                userId,
                userEmail,
                'First',
                'Last',
                30,
                new Date(),
                new Date(),
              ),
            );

            mockRepository.findByEmail.mockResolvedValue(
              new User(
                otherUserId,
                newEmail,
                'Other',
                'User',
                25,
                new Date(),
                new Date(),
              ),
            );

            await expect(
              useCase.execute(userId, { email: newEmail }),
            ).rejects.toThrow('Email already in use');
          },
        ),
        { numRuns: 30 },
      );
    });
  });

  describe('DeleteUserUseCase Properties', () => {
    it('should always check if user exists before deleting', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (id, email, firstName, lastName, age) => {
            const module = await Test.createTestingModule({
              providers: [
                DeleteUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
            const user = new User(
              id,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            mockRepository.findById.mockResolvedValue(user);
            mockRepository.delete.mockResolvedValue(undefined);

            await useCase.execute(id);

            expect(mockRepository.findById).toHaveBeenCalledWith(id);
            expect(mockRepository.delete).toHaveBeenCalledWith(id);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should always throw error if user does not exist', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (id) => {
          const module = await Test.createTestingModule({
            providers: [
              DeleteUserUseCase,
              { provide: USER_REPOSITORY, useValue: mockRepository },
            ],
          }).compile();

          const useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
          mockRepository.findById.mockResolvedValue(null);

          await expect(useCase.execute(id)).rejects.toThrow('User not found');
          expect(mockRepository.delete).not.toHaveBeenCalled();
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('Business Logic Invariants', () => {
    it('create -> get should return the same user data', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 0, max: 150 }),
          async (email, firstName, lastName, age) => {
            const createModule = await Test.createTestingModule({
              providers: [
                CreateUserUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const getModule = await Test.createTestingModule({
              providers: [
                GetUserByIdUseCase,
                { provide: USER_REPOSITORY, useValue: mockRepository },
              ],
            }).compile();

            const createUseCase =
              createModule.get<CreateUserUseCase>(CreateUserUseCase);
            const getUseCase =
              getModule.get<GetUserByIdUseCase>(GetUserByIdUseCase);

            const userId = 'test-id';
            const createdUser = new User(
              userId,
              email,
              firstName,
              lastName,
              age,
              new Date(),
              new Date(),
            );

            mockRepository.findByEmail.mockResolvedValue(null);
            mockRepository.create.mockResolvedValue(createdUser);
            mockRepository.findById.mockResolvedValue(createdUser);

            await createUseCase.execute({ email, firstName, lastName, age });
            const retrievedUser = await getUseCase.execute(userId);

            expect(retrievedUser.email).toBe(email);
            expect(retrievedUser.firstName).toBe(firstName);
            expect(retrievedUser.lastName).toBe(lastName);
            expect(retrievedUser.age).toBe(age);
          },
        ),
        { numRuns: 30 },
      );
    });
  });
});
