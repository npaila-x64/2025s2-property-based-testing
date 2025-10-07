import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase, GetAllUsersUseCase, GetUserByIdUseCase, UpdateUserUseCase, DeleteUserUseCase } from './use-cases';
import { USER_REPOSITORY, UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

describe('User Use Cases', () => {
  let createUserUseCase: CreateUserUseCase;
  let getAllUsersUseCase: GetAllUsersUseCase;
  let getUserByIdUseCase: GetUserByIdUseCase;
  let updateUserUseCase: UpdateUserUseCase;
  let deleteUserUseCase: DeleteUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        GetAllUsersUseCase,
        GetUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    getAllUsersUseCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
    getUserByIdUseCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  describe('CreateUserUseCase', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
      };

      const createdUser = new User(
        '1',
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.age,
        new Date(),
        new Date(),
      );

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdUser);

      const result = await createUserUseCase.execute(userData);

      expect(result).toEqual(createdUser);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
      };

      const existingUser = new User(
        '1',
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.age,
        new Date(),
        new Date(),
      );

      mockRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('GetAllUsersUseCase', () => {
    it('should return all users', async () => {
      const users = [
        new User('1', 'user1@example.com', 'User', 'One', 25, new Date(), new Date()),
        new User('2', 'user2@example.com', 'User', 'Two', 30, new Date(), new Date()),
      ];

      mockRepository.findAll.mockResolvedValue(users);

      const result = await getAllUsersUseCase.execute();

      expect(result).toEqual(users);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('GetUserByIdUseCase', () => {
    it('should return a user by id', async () => {
      const user = new User('1', 'test@example.com', 'Test', 'User', 25, new Date(), new Date());

      mockRepository.findById.mockResolvedValue(user);

      const result = await getUserByIdUseCase.execute('1');

      expect(result).toEqual(user);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(getUserByIdUseCase.execute('1')).rejects.toThrow('User not found');
    });
  });

  describe('UpdateUserUseCase', () => {
    it('should update a user', async () => {
      const existingUser = new User('1', 'old@example.com', 'Old', 'User', 25, new Date(), new Date());
      const updateData = { firstName: 'New' };
      const updatedUser = new User('1', 'old@example.com', 'New', 'User', 25, new Date(), new Date());

      mockRepository.findById.mockResolvedValue(existingUser);
      mockRepository.update.mockResolvedValue(updatedUser);

      const result = await updateUserUseCase.execute('1', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should throw error if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(updateUserUseCase.execute('1', { firstName: 'New' })).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('DeleteUserUseCase', () => {
    it('should delete a user', async () => {
      const user = new User('1', 'test@example.com', 'Test', 'User', 25, new Date(), new Date());

      mockRepository.findById.mockResolvedValue(user);
      mockRepository.delete.mockResolvedValue(undefined);

      await deleteUserUseCase.execute('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(deleteUserUseCase.execute('1')).rejects.toThrow('User not found');
    });
  });
});
