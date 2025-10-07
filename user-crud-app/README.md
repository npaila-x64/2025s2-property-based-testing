# User CRUD NestJS Application<p align="center">

  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

A production-ready user management REST API built with NestJS, implementing hexagonal architecture (ports and adapters pattern) with PostgreSQL and Prisma ORM.</p>



## 🏗️ Architecture[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

This application follows **Hexagonal Architecture** (also known as Ports and Adapters), which separates the application into distinct layers:

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

### Layers    <p align="center">

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

1. **Domain Layer** (`src/users/domain/`)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

   - `user.entity.ts`: Core business entity<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

   - `user.repository.ts`: Repository interface (port)<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

2. **Application Layer** (`src/users/application/`)<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

   - `use-cases.ts`: Business logic and use cases<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

   - Contains: CreateUser, GetAllUsers, GetUserById, UpdateUser, DeleteUser  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

3. **Infrastructure Layer** (`src/users/infrastructure/`)  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

   - `prisma.service.ts`: Database connection service</p>

   - `prisma-user.repository.ts`: Repository implementation (adapter)  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

4. **Presentation Layer** (`src/users/presentation/`)

   - `user.controller.ts`: HTTP REST API endpoints## Description

   - `user.dto.ts`: Data transfer objects and validation

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 🚀 Features

## Project setup

- ✅ Create new users

- ✅ List all users```bash

- ✅ Get user by ID$ npm install

- ✅ Update user information```

- ✅ Delete users

- ✅ Input validation## Compile and run the project

- ✅ Unique email constraint

- ✅ Automated database seeding```bash

- ✅ Comprehensive test coverage# development

- ✅ Docker support$ npm run start



## 📋 Prerequisites# watch mode

$ npm run start:dev

- Node.js 20+

- Docker and Docker Compose# production mode

- npm or yarn$ npm run start:prod

```

## 🛠️ Installation

## Run tests

### Using Docker (Recommended)

```bash

1. Clone the repository# unit tests

2. Run the application with Docker Compose:$ npm run test



```bash# e2e tests

docker-compose up$ npm run test:e2e

```

# test coverage

This will:$ npm run test:cov

- Start PostgreSQL database```

- Run database migrations

- Seed initial data## Deployment

- Start the NestJS application on port 3000

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

### Local Development

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

1. Install dependencies:

```bash

```bash$ npm install -g @nestjs/mau

npm install$ mau deploy

``````



2. Set up environment variables:With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.



```bash## Resources

cp .env.example .env

# Edit .env with your database configurationCheck out a few resources that may come in handy when working with NestJS:

```

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

3. Start PostgreSQL (or use Docker):- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

```bash- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

docker run -d \- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

  --name postgres \- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

  -e POSTGRES_PASSWORD=password \- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

  -e POSTGRES_DB=userdb \- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

  -p 5432:5432 \

  postgres:16-alpine## Support

```

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

4. Run database migrations:

## Stay in touch

```bash

npm run prisma:migrate- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

```- Website - [https://nestjs.com](https://nestjs.com/)

- Twitter - [@nestframework](https://twitter.com/nestframework)

5. Seed the database:

## License

```bash

npm run prisma:seedNest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```

6. Start the application:

```bash
npm run start:dev
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Create User
```http
POST /users
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

#### Get All Users
```http
GET /users
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "createdAt": "2025-10-06T10:00:00.000Z",
    "updatedAt": "2025-10-06T10:00:00.000Z"
  }
]
```

#### Get User by ID
```http
GET /users/:id
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

#### Update User
```http
PUT /users/:id
Content-Type: application/json

{
  "firstName": "Jane",
  "age": 31
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "john.doe@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "age": 31,
  "createdAt": "2025-10-06T10:00:00.000Z",
  "updatedAt": "2025-10-06T10:00:00.000Z"
}
```

#### Delete User
```http
DELETE /users/:id
```

**Response:** `204 No Content`

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 🗄️ Database Schema

### User Table

| Column    | Type      | Constraints           |
|-----------|-----------|----------------------|
| id        | UUID      | Primary Key          |
| email     | String    | Unique, Not Null     |
| firstName | String    | Not Null             |
| lastName  | String    | Not Null             |
| age       | Integer   | Not Null             |
| createdAt | DateTime  | Auto-generated       |
| updatedAt | DateTime  | Auto-updated         |

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with watch |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the application |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run lint` | Lint and fix code |
| `npm run format` | Format code with Prettier |

## 🐳 Docker

### Development
```bash
docker-compose up
```

### Production Build
```bash
docker build -t user-crud-app --target production .
docker run -p 3000:3000 user-crud-app
```

## 🌱 Seed Data

The application includes seed data with three default users:

1. **John Doe** - john.doe@example.com (Age: 30)
2. **Jane Smith** - jane.smith@example.com (Age: 25)
3. **Bob Johnson** - bob.johnson@example.com (Age: 35)

To reseed the database:
```bash
npm run prisma:seed
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/userdb?schema=public` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |

## 🏛️ Design Patterns

- **Hexagonal Architecture**: Clear separation of concerns
- **Repository Pattern**: Abstraction over data access
- **Dependency Injection**: Loose coupling between components
- **DTO Pattern**: Input validation and data transformation
- **Use Case Pattern**: Single responsibility for business logic

## 🔒 Validation

Input validation is implemented using `class-validator`:

- Email must be valid format
- First name and last name are required strings
- Age must be a positive integer
- No additional properties allowed in requests

## 🚦 Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation errors or duplicate email
- `404 Not Found` - User not found

## 📚 Technology Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Validation**: class-validator, class-transformer
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

## 🤝 Contributing

1. Follow the hexagonal architecture pattern
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Follow the existing code style

## 📄 License

UNLICENSED - Private project

## 👨‍💻 Author

Built with ❤️ using NestJS and Hexagonal Architecture
