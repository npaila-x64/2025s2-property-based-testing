"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserUseCase = exports.UpdateUserUseCase = exports.GetUserByIdUseCase = exports.GetAllUsersUseCase = exports.CreateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../domain/user.repository");
let CreateUserUseCase = class CreateUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        return this.userRepository.create(data);
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateUserUseCase);
let GetAllUsersUseCase = class GetAllUsersUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        return this.userRepository.findAll();
    }
};
exports.GetAllUsersUseCase = GetAllUsersUseCase;
exports.GetAllUsersUseCase = GetAllUsersUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetAllUsersUseCase);
let GetUserByIdUseCase = class GetUserByIdUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
};
exports.GetUserByIdUseCase = GetUserByIdUseCase;
exports.GetUserByIdUseCase = GetUserByIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetUserByIdUseCase);
let UpdateUserUseCase = class UpdateUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id, data) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        if (data.email && data.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(data.email);
            if (userWithEmail) {
                throw new Error('Email already in use');
            }
        }
        return this.userRepository.update(id, data);
    }
};
exports.UpdateUserUseCase = UpdateUserUseCase;
exports.UpdateUserUseCase = UpdateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UpdateUserUseCase);
let DeleteUserUseCase = class DeleteUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(id);
    }
};
exports.DeleteUserUseCase = DeleteUserUseCase;
exports.DeleteUserUseCase = DeleteUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], DeleteUserUseCase);
//# sourceMappingURL=use-cases.js.map