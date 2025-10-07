import { IsEmail, IsInt, IsNotEmpty, IsString, Min, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @Min(0)
  age: number;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;
}

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}
