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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const use_cases_1 = require("../application/use-cases");
const user_dto_1 = require("./user.dto");
let UserController = class UserController {
    createUserUseCase;
    getAllUsersUseCase;
    getUserByIdUseCase;
    updateUserUseCase;
    deleteUserUseCase;
    constructor(createUserUseCase, getAllUsersUseCase, getUserByIdUseCase, updateUserUseCase, deleteUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.getUserByIdUseCase = getUserByIdUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async create(createUserDto) {
        try {
            const user = await this.createUserUseCase.execute(createUserDto);
            return this.mapToResponse(user);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to create user', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        const users = await this.getAllUsersUseCase.execute();
        return users.map((user) => this.mapToResponse(user));
    }
    async findOne(id) {
        try {
            const user = await this.getUserByIdUseCase.execute(id);
            return this.mapToResponse(user);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'User not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.updateUserUseCase.execute(id, updateUserDto);
            return this.mapToResponse(user);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to update user', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.deleteUserUseCase.execute(id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'User not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    mapToResponse(user) {
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
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [use_cases_1.CreateUserUseCase,
        use_cases_1.GetAllUsersUseCase,
        use_cases_1.GetUserByIdUseCase,
        use_cases_1.UpdateUserUseCase,
        use_cases_1.DeleteUserUseCase])
], UserController);
//# sourceMappingURL=user.controller.js.map