import { CreateUserUseCase, DeleteUserUseCase, GetAllUsersUseCase, GetUserByIdUseCase, UpdateUserUseCase } from '../application/use-cases';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
export declare class UserController {
    private readonly createUserUseCase;
    private readonly getAllUsersUseCase;
    private readonly getUserByIdUseCase;
    private readonly updateUserUseCase;
    private readonly deleteUserUseCase;
    constructor(createUserUseCase: CreateUserUseCase, getAllUsersUseCase: GetAllUsersUseCase, getUserByIdUseCase: GetUserByIdUseCase, updateUserUseCase: UpdateUserUseCase, deleteUserUseCase: DeleteUserUseCase);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<void>;
    private mapToResponse;
}
