# Architecture Documentation

## Hexagonal Architecture Overview

This application implements the **Hexagonal Architecture** (also known as **Ports and Adapters Pattern**), which provides a clean separation of concerns and makes the codebase maintainable, testable, and adaptable to change.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  UserController (HTTP REST API)                        │ │
│  │  - POST   /users                                       │ │
│  │  - GET    /users                                       │ │
│  │  - GET    /users/:id                                   │ │
│  │  - PUT    /users/:id                                   │ │
│  │  - DELETE /users/:id                                   │ │
│  │                                                        │ │
│  │  DTOs: CreateUserDto, UpdateUserDto, UserResponseDto   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Use Cases (Business Logic)                            │ │
│  │                                                        │ │
│  │  • CreateUserUseCase                                   │ │
│  │  • GetAllUsersUseCase                                  │ │
│  │  • GetUserByIdUseCase                                  │ │
│  │  • UpdateUserUseCase                                   │ │
│  │  • DeleteUserUseCase                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Core Business Entities & Interfaces                   │ │
│  │                                                        │ │
│  │  • User Entity                                         │ │
│  │  • UserRepository Interface (Port)                     │ │
│  │                                                        │ │
│  │  Business Rules:                                       │ │
│  │  - Email must be unique                                │ │
│  │  - Age must be positive                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Adapters (External Services)                          │ │
│  │                                                        │ │
│  │  • PrismaUserRepository (Adapter)                      │ │
│  │  • PrismaService                                       │ │
│  │                                                        │ │
│  │  External Dependencies:                                │ │
│  │  - PostgreSQL Database                                 │ │
│  │  - Prisma ORM                                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Domain Layer (Core)

**Location:** `src/users/domain/`

**Purpose:** Contains the core business logic and rules, independent of any external framework or technology.

**Components:**
- **User Entity** (`user.entity.ts`): Represents the core User domain model
- **UserRepository Interface** (`user.repository.ts`): Defines the contract for data persistence (Port)

**Key Principles:**
- No dependencies on external libraries
- Contains business rules and domain logic
- Framework-agnostic
- Pure TypeScript/JavaScript

### 2. Application Layer (Use Cases)

**Location:** `src/users/application/`

**Purpose:** Orchestrates the flow of data to and from entities, and directs those entities to use their business rules.

**Components:**
- **CreateUserUseCase**: Handles user creation with email uniqueness validation
- **GetAllUsersUseCase**: Retrieves all users
- **GetUserByIdUseCase**: Retrieves a specific user
- **UpdateUserUseCase**: Updates user information with validation
- **DeleteUserUseCase**: Deletes a user

**Key Principles:**
- Contains application-specific business rules
- Coordinates between domain and infrastructure
- Technology-agnostic (no HTTP, no database details)
- Depends only on domain interfaces

### 3. Infrastructure Layer (Adapters)

**Location:** `src/users/infrastructure/`

**Purpose:** Implements the interfaces defined in the domain layer using specific technologies.

**Components:**
- **PrismaService** (`prisma.service.ts`): Database connection management
- **PrismaUserRepository** (`prisma-user.repository.ts`): Concrete implementation of UserRepository using Prisma

**Key Principles:**
- Implements domain interfaces (adapters)
- Contains framework-specific code
- Handles external service integration
- Can be easily swapped with different implementations

### 4. Presentation Layer (Controllers)

**Location:** `src/users/presentation/`

**Purpose:** Handles HTTP requests and responses, exposes the API to external clients.

**Components:**
- **UserController** (`user.controller.ts`): REST API endpoints
- **DTOs** (`user.dto.ts`): Data Transfer Objects for request/response

**Key Principles:**
- Handles HTTP-specific logic
- Validates incoming requests
- Transforms data between HTTP and domain models
- Independent of business logic

## Data Flow

### Creating a User (Example)

```
1. HTTP POST /users
   └─> UserController.create()
       └─> CreateUserDto (validation)
           └─> CreateUserUseCase.execute()
               └─> UserRepository.findByEmail() [check uniqueness]
               └─> UserRepository.create()
                   └─> PrismaUserRepository.create()
                       └─> Prisma Client → PostgreSQL
                           └─> Returns User Entity
                               └─> UserController maps to UserResponseDto
                                   └─> HTTP 201 Response
```

## Dependency Injection

The application uses NestJS's built-in dependency injection:

```typescript
// In UsersModule
@Module({
  providers: [
    {
      provide: USER_REPOSITORY,  // Symbol (Port)
      useClass: PrismaUserRepository,  // Implementation (Adapter)
    },
    CreateUserUseCase,
    // ... other use cases
  ],
})
```

This allows:
- Easy swapping of implementations
- Better testability (mock repositories)
- Loose coupling between layers

## Design Patterns Used

1. **Repository Pattern**: Abstracts data access
2. **Dependency Inversion**: High-level modules don't depend on low-level modules
3. **Single Responsibility**: Each class has one reason to change
4. **Interface Segregation**: Specific interfaces for specific needs
5. **Dependency Injection**: Loose coupling via DI container

## Module Structure

```
src/
└── users/
    ├── domain/              # Core business logic
    │   ├── user.entity.ts
    │   └── user.repository.ts
    │
    ├── application/         # Use cases
    │   ├── use-cases.ts
    │   └── use-cases.spec.ts
    │
    ├── infrastructure/      # External adapters
    │   ├── prisma.service.ts
    │   └── prisma-user.repository.ts
    │
    ├── presentation/        # API layer
    │   ├── user.controller.ts
    │   └── user.dto.ts
    │
    └── users.module.ts      # Module configuration
```
