export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    age: number;
}
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
}
