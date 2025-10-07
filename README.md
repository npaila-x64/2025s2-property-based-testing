# 2025s2-property-based-testing

## 🎉 User CRUD NestJS Application

A production-ready user management REST API built with **NestJS**, **TypeScript**, **PostgreSQL**, **Prisma**, and **Hexagonal Architecture**.

---

## 📂 What's Inside

The `user-crud-app/` directory contains a complete, fully-functional NestJS application with:

### ✅ Core Features
- **CRUD Operations**: Create, Read, Update, Delete users
- **Hexagonal Architecture**: Clean separation of concerns (Domain, Application, Infrastructure, Presentation layers)
- **PostgreSQL Database**: Managed with Prisma ORM
- **Docker Support**: Full containerization with Docker Compose
- **Testing**: Unit tests and E2E tests with Jest
- **Validation**: Input validation using class-validator
- **Seed Data**: Pre-populated sample users
- **Comprehensive Documentation**: 6 detailed documentation files

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
cd user-crud-app
docker-compose up
```

That's it! The API will be available at `http://localhost:3000`

### Local Development

```bash
cd user-crud-app
npm install
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

---

## 📚 Documentation

All documentation is in the `user-crud-app/` directory:

| File | Purpose |
|------|---------|
| **PROJECT_SUMMARY.md** | Quick overview of the entire project |
| **README.md** | Main documentation and setup guide |
| **QUICKSTART.md** | 5-minute quick start guide |
| **API_DOCUMENTATION.md** | Complete API reference |
| **ARCHITECTURE.md** | Architecture patterns and design principles |
| **DEVELOPMENT.md** | Development guidelines and best practices |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

---

## 🛠️ Technology Stack

- **NestJS 11** - Backend framework
- **TypeScript** - Programming language
- **PostgreSQL 16** - Database
- **Prisma** - ORM
- **Jest** - Testing framework
- **Docker** - Containerization

---

## 🎯 Architecture

The application follows **Hexagonal Architecture**:

```
src/users/
├── domain/          # Business entities & interfaces (ports)
├── application/     # Use cases (business logic)
├── infrastructure/  # Database adapters (Prisma)
└── presentation/    # REST API controllers & DTOs
```

---

## 🧪 Testing

```bash
cd user-crud-app
npm run test       # Unit tests
npm run test:e2e   # E2E tests
npm run test:cov   # Coverage
```

---

## 📖 Next Steps

1. **Start Here**: Read `user-crud-app/QUICKSTART.md`
2. **Understand the API**: Check `user-crud-app/API_DOCUMENTATION.md`
3. **Learn the Architecture**: Study `user-crud-app/ARCHITECTURE.md`
4. **Start Developing**: Follow `user-crud-app/DEVELOPMENT.md`

---

**Happy Coding! 🚀**

*Built with ❤️ using NestJS, TypeScript, and Hexagonal Architecture*