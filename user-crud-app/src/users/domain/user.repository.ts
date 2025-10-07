import { User } from './user.entity';

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
