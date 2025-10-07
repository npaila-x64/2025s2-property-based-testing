import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '../application/use-cases';
import { User } from '../domain/user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.createUserUseCase.execute(createUserDto);
      return this.mapToResponse(user);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to create user';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();
    return users.map((user) => this.mapToResponse(user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByIdUseCase.execute(id);
      return this.mapToResponse(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'User not found';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.updateUserUseCase.execute(id, updateUserDto);
      return this.mapToResponse(user);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update user';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteUserUseCase.execute(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'User not found';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }

  private mapToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
