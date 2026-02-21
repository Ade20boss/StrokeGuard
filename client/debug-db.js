const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany({
      include: {
        healthProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    process.stdout.write("Latest Users and their Health Profiles:\n");
    process.stdout.write(JSON.stringify(users, null, 2) + "\n");

    const totalProfiles = await prisma.healthProfile.count();
    process.stdout.write(`Total Health Profiles in DB: ${totalProfiles}\n`);

  } catch (e) {
    process.stderr.write(e.message + "\n");
  } finally {
    await prisma.$disconnect();
  }
}

main();
