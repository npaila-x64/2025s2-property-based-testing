import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/users/infrastructure/prisma.service';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  describe('POST /users', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('test@example.com');
          expect(res.body.firstName).toBe('Test');
          expect(res.body.lastName).toBe('User');
          expect(res.body.age).toBe(25);
        });
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-email',
          firstName: 'Test',
          lastName: 'User',
          age: -1,
        })
        .expect(400);
    });

    it('should return 400 for duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          firstName: 'Another',
          lastName: 'User',
          age: 30,
        })
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      await prisma.user.createMany({
        data: [
          {
            email: 'user1@example.com',
            firstName: 'User',
            lastName: 'One',
            age: 25,
          },
          {
            email: 'user2@example.com',
            firstName: 'User',
            lastName: 'Two',
            age: 30,
          },
        ],
      });

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(2);
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
        },
      });

      return request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(user.id);
          expect(res.body.email).toBe('test@example.com');
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
        },
      });

      return request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send({
          firstName: 'Updated',
          age: 30,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.firstName).toBe('Updated');
          expect(res.body.age).toBe(30);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .put('/users/non-existent-id')
        .send({
          firstName: 'Updated',
        })
        .expect(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
        },
      });

      return request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/users/non-existent-id')
        .expect(404);
    });
  });
});
