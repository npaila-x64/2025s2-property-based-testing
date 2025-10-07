import { User } from '../domain/user.entity';
import type { CreateUserData, UpdateUserData, UserRepository } from '../domain/user.repository';
export declare class CreateUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(data: CreateUserData): Promise<User>;
}
export declare class GetAllUsersUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(): Promise<User[]>;
}
export declare class GetUserByIdUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(id: string): Promise<User>;
}
export declare class UpdateUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(id: string, data: UpdateUserData): Promise<User>;
}
export declare class DeleteUserUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(id: string): Promise<void>;
}
