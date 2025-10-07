import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.user.deleteMany();

  // Create seed users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        age: 25,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.johnson@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        age: 35,
      },
    }),
  ]);

  console.log('Seeded users:', users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
