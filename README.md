# Property-Based Testing with NestJS

A complete demonstration of property-based testing in a production-ready NestJS application.

## 📁 Project Structure

```
2025s2-property-based-testing/
├── README.md                           ← You are here
├── PROPERTY_BASED_TESTING.md           ← Complete testing guide
└── user-crud-app/                      ← NestJS application
    └── src/users/
        ├── domain/
        │   └── user.property.spec.ts   ← 13 property tests
        ├── application/
        │   └── use-cases.property.spec.ts ← 18 property tests
        └── presentation/
            └── user.dto.property.spec.ts  ← 11 property tests
```

## 🚀 Quick Start

```bash
# Navigate to the app
cd user-crud-app

# Install dependencies
npm install

# Run all tests (traditional + property-based)
npm test

# Run only property-based tests
npm run test -- --testNamePattern="property" --testTimeout=10000

# Start the application
docker-compose up
```

## 🧪 What is Property-Based Testing?

Instead of writing specific test cases with hard-coded values, property-based testing:

1. **Generates hundreds of random test inputs** automatically
2. **Verifies properties/invariants** hold for ALL inputs
3. **Shrinks failing cases** to minimal counterexamples
4. **Provides mathematical proof** of correctness

## 🛠️ Technology Stack

- **NestJS 11** - Backend framework
- **TypeScript 5.7** - Language
- **PostgreSQL 16** - Database
- **Prisma 6** - ORM
- **Jest 30** - Testing framework
- **fast-check** - Property-based testing library
- **Docker** - Containerization

## 🏗️ Architecture

Hexagonal Architecture (Ports & Adapters):

```
Domain Layer (Entities, Interfaces)
    ↓
Application Layer (Use Cases, Business Logic)
    ↓
Infrastructure Layer (Prisma, Database)
    ↓
Presentation Layer (Controllers, DTOs)
```

## 📖 Learn More

- [fast-check Documentation](https://github.com/dubzzz/fast-check)
- [Property-Based Testing Guide](https://hypothesis.works/articles/what-is-property-based-testing/)
- [NestJS Documentation](https://nestjs.com/)
