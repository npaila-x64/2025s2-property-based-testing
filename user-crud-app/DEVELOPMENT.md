# Development Guide

This guide will help you understand how to develop and extend the User CRUD application.

## Table of Contents

- [Development Setup](#development-setup)
- [Adding a New Feature](#adding-a-new-feature)
- [Testing Guidelines](#testing-guidelines)
- [Code Style](#code-style)
- [Common Tasks](#common-tasks)

---

## Development Setup

### 1. Install Development Tools

```bash
# Install dependencies
npm install

# Install recommended VS Code extensions
# - ESLint
# - Prettier
# - Prisma
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Start PostgreSQL with Docker
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=userdb \
  -p 5432:5432 \
  postgres:16-alpine
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npm run prisma:migrate

# Seed data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

---

## Adding a New Feature

Follow the hexagonal architecture pattern when adding features.

### Example: Adding a "Get Users by Age Range" Feature

#### Step 1: Update Domain Layer

**File: `src/users/domain/user.repository.ts`**

```typescript
export interface UserRepository {
  // ... existing methods
  findByAgeRange(minAge: number, maxAge: number): Promise<User[]>;
}
```

#### Step 2: Implement in Infrastructure Layer

**File: `src/users/infrastructure/prisma-user.repository.ts`**

```typescript
async findByAgeRange(minAge: number, maxAge: number): Promise<User[]> {
  const users = await this.prisma.user.findMany({
    where: {
      age: {
        gte: minAge,
        lte: maxAge,
      },
    },
  });

  return users.map(this.mapToEntity);
}
```

#### Step 3: Create Use Case

**File: `src/users/application/use-cases.ts`**

```typescript
@Injectable()
export class GetUsersByAgeRangeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(minAge: number, maxAge: number): Promise<User[]> {
    if (minAge < 0 || maxAge < minAge) {
      throw new Error('Invalid age range');
    }
    return this.userRepository.findByAgeRange(minAge, maxAge);
  }
}
```

#### Step 4: Add DTO

**File: `src/users/presentation/user.dto.ts`**

```typescript
export class AgeRangeQueryDto {
  @IsInt()
  @Min(0)
  minAge: number;

  @IsInt()
  @Min(0)
  maxAge: number;
}
```

#### Step 5: Update Controller

**File: `src/users/presentation/user.controller.ts`**

```typescript
@Get('age-range')
async findByAgeRange(
  @Query() query: AgeRangeQueryDto,
): Promise<UserResponseDto[]> {
  const users = await this.getUsersByAgeRangeUseCase.execute(
    query.minAge,
    query.maxAge,
  );
  return users.map((user) => this.mapToResponse(user));
}
```

#### Step 6: Register Use Case

**File: `src/users/users.module.ts`**

```typescript
@Module({
  providers: [
    // ... existing providers
    GetUsersByAgeRangeUseCase,
  ],
})
```

#### Step 7: Write Tests

**File: `src/users/application/use-cases.spec.ts`**

```typescript
describe('GetUsersByAgeRangeUseCase', () => {
  it('should return users in age range', async () => {
    // ... test implementation
  });
});
```

---

## Testing Guidelines

### Unit Tests

Test each layer in isolation.

#### Testing Use Cases

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      // ... other methods
    };

    useCase = new CreateUserUseCase(mockRepository);
  });

  it('should create a user', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute(userData);

    expect(result).toEqual(mockUser);
    expect(mockRepository.create).toHaveBeenCalledWith(userData);
  });
});
```

#### Testing Repositories

```typescript
describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Use test database
    const module = await Test.createTestingModule({
      providers: [PrismaService, PrismaUserRepository],
    }).compile();

    repository = module.get(PrismaUserRepository);
    prisma = module.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });
});
```

### E2E Tests

Test the complete flow from HTTP request to response.

```typescript
describe('POST /users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create a user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
      })
      .expect(201);
  });
});
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

---

## Code Style

### TypeScript Guidelines

1. **Use explicit types**
   ```typescript
   // Good
   function getUser(id: string): Promise<User> { }

   // Avoid
   function getUser(id) { }
   ```

2. **Use interfaces for contracts**
   ```typescript
   // Good
   export interface UserRepository {
     findById(id: string): Promise<User | null>;
   }
   ```

3. **Use dependency injection**
   ```typescript
   // Good
   constructor(
     @Inject(USER_REPOSITORY)
     private readonly userRepository: UserRepository,
   ) {}
   ```

### NestJS Best Practices

1. **Use DTOs for validation**
   ```typescript
   @Post()
   create(@Body() createUserDto: CreateUserDto) {
     // DTOs validate automatically
   }
   ```

2. **Use proper HTTP decorators**
   ```typescript
   @Post()
   @HttpCode(HttpStatus.CREATED)
   create() { }

   @Delete(':id')
   @HttpCode(HttpStatus.NO_CONTENT)
   remove() { }
   ```

3. **Handle errors properly**
   ```typescript
   try {
     return await this.useCase.execute(data);
   } catch (error) {
     throw new HttpException(
       error.message,
       HttpStatus.BAD_REQUEST,
     );
   }
   ```

### Formatting

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## Common Tasks

### Adding a Database Field

1. **Update Prisma schema**
   ```prisma
   model User {
     // ... existing fields
     phoneNumber String?
   }
   ```

2. **Create migration**
   ```bash
   npx prisma migrate dev --name add_phone_number
   ```

3. **Update entity**
   ```typescript
   export class User {
     constructor(
       // ... existing fields
       public readonly phoneNumber?: string,
     ) {}
   }
   ```

4. **Update DTOs**
   ```typescript
   export class CreateUserDto {
     // ... existing fields
     
     @IsOptional()
     @IsString()
     phoneNumber?: string;
   }
   ```

### Database Operations

```bash
# View database in GUI
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Push schema without migration
npx prisma db push
```

### Docker Operations

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Remove volumes (deletes data)
docker-compose down -v
```

### Debugging

#### Using VS Code Debugger

**File: `.vscode/launch.json`**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

#### Logging

```typescript
// Use NestJS Logger
import { Logger } from '@nestjs/common';

export class UserController {
  private readonly logger = new Logger(UserController.name);

  @Post()
  create(@Body() dto: CreateUserDto) {
    this.logger.log(`Creating user: ${dto.email}`);
    // ...
  }
}
```

---

## Project Structure Best Practices

### Keep Layers Separated

```
✅ Good:
src/users/domain/        # No external dependencies
src/users/application/   # Only depends on domain
src/users/infrastructure/# Implements domain interfaces
src/users/presentation/  # Depends on application

❌ Bad:
- Domain depending on Prisma
- Application depending on HTTP
- Use cases depending on controllers
```

### Module Organization

```typescript
// Each feature should be a module
@Module({
  imports: [/* other modules */],
  controllers: [/* controllers */],
  providers: [/* services, use cases, repositories */],
  exports: [/* what to expose */],
})
export class UsersModule {}
```

---

## Performance Tips

### 1. Use Indexes

```prisma
model User {
  email String @unique
  age   Int    @db.Index // Add index for frequent queries
}
```

### 2. Pagination

```typescript
@Get()
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
  const skip = (page - 1) * limit;
  return this.repository.findMany({ skip, take: limit });
}
```

### 3. Select Only Needed Fields

```typescript
// In repository
async findById(id: string): Promise<User> {
  return this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      age: true,
    },
  });
}
```

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production database
- [ ] Enable CORS if needed
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Add health check endpoint
- [ ] Set up monitoring
- [ ] Configure SSL/TLS
- [ ] Review security headers
- [ ] Optimize Docker image

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Getting Help

1. Check the [README.md](./README.md)
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
4. Search existing issues
5. Ask in team chat

Happy coding! 🚀
