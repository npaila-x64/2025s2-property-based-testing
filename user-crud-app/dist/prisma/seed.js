"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    await prisma.user.deleteMany();
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
//# sourceMappingURL=seed.js.map