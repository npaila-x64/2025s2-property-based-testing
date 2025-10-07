import { User } from '../domain/user.entity';
import { CreateUserData, UpdateUserData, UserRepository } from '../domain/user.repository';
import { PrismaService } from './prisma.service';
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateUserData): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, data: UpdateUserData): Promise<User>;
    delete(id: string): Promise<void>;
    private mapToEntity;
}
