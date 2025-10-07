# Quick Start Guide

Get the User CRUD application running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- OR Node.js 20+ and PostgreSQL

## Option 1: Docker (Recommended) 🐳

The fastest way to get started!

### Step 1: Start the Application

```bash
cd user-crud-app
docker-compose up
```

That's it! The application will:
- ✅ Start PostgreSQL database
- ✅ Run database migrations
- ✅ Seed sample data
- ✅ Start the API server

### Step 2: Test the API

The API is now running at `http://localhost:3000`

#### Get all users (seeded data):
```bash
curl http://localhost:3000/users
```

#### Create a new user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "firstName": "New",
    "lastName": "User",
    "age": 28
  }'
```

### Step 3: View Logs

```bash
docker-compose logs -f app
```

### Step 4: Stop the Application

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

---

## Option 2: Local Development 💻

### Step 1: Install Dependencies

```bash
cd user-crud-app
npm install
```

### Step 2: Set Up Database

#### Using Docker for PostgreSQL:
```bash
docker run -d \
  --name user-crud-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=userdb \
  -p 5432:5432 \
  postgres:16-alpine
```

#### Or install PostgreSQL locally and create a database named `userdb`

### Step 3: Configure Environment

The `.env` file is already configured for local development:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/userdb?schema=public"
```

### Step 4: Run Migrations

```bash
npm run prisma:migrate
```

### Step 5: Seed the Database

```bash
npm run prisma:seed
```

### Step 6: Start the Application

```bash
npm run start:dev
```

The API is now running at `http://localhost:3000`

---

## Verify Installation

### 1. Check if the server is running:
```bash
curl http://localhost:3000/users
```

Expected response: Array of 3 seeded users

### 2. Test creating a user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "age": 25
  }'
```

Expected response: HTTP 201 with created user object

### 3. Test getting a specific user:
```bash
curl http://localhost:3000/users/{user-id}
```

Replace `{user-id}` with an ID from step 1

---

## Seeded Data

The application comes with 3 pre-loaded users:

| Email | Name | Age |
|-------|------|-----|
| john.doe@example.com | John Doe | 30 |
| jane.smith@example.com | Jane Smith | 25 |
| bob.johnson@example.com | Bob Johnson | 35 |

---

## Running Tests

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

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |
| `npm run lint` | Lint code |
| `npm run format` | Format code |

---

## Prisma Commands

| Command | Description |
|---------|-------------|
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma db push` | Push schema changes without migration |

---

## Troubleshooting

### Port 3000 already in use
```bash
# Change port in docker-compose.yml or .env
PORT=3001 npm run start:dev
```

### Database connection error
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check connection string in .env
cat .env
```

### Prisma client not found
```bash
# Regenerate Prisma client
npx prisma generate
```

### Migration errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## Next Steps

1. 📖 Read the [API Documentation](./API_DOCUMENTATION.md)
2. 🏗️ Study the [Architecture Documentation](./ARCHITECTURE.md)
3. 🧪 Explore the test files in `src/` and `test/`
4. 🔧 Customize the User entity in `prisma/schema.prisma`
5. ✨ Add new features following the hexagonal architecture pattern

---

## Quick Reference

### API Endpoints

```
POST   /users      - Create user
GET    /users      - Get all users
GET    /users/:id  - Get user by ID
PUT    /users/:id  - Update user
DELETE /users/:id  - Delete user
```

### Project Structure

```
src/
└── users/
    ├── domain/           # Business entities & interfaces
    ├── application/      # Use cases
    ├── infrastructure/   # Database adapters
    └── presentation/     # API controllers & DTOs
```

---

## Support

- 📚 Full documentation in [README.md](./README.md)
- 🏗️ Architecture details in [ARCHITECTURE.md](./ARCHITECTURE.md)
- 📡 API reference in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

Happy coding! 🚀
