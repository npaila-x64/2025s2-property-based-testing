import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import {
  CreateUserData,
  UpdateUserData,
  UserRepository,
} from '../domain/user.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });

    return this.mapToEntity(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.mapToEntity(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private mapToEntity(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.age,
      user.createdAt,
      user.updatedAt,
    );
  }
}
