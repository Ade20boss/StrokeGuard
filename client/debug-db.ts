import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

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

    console.log("Latest Users and their Health Profiles:");
    console.log(JSON.stringify(users, null, 2));

    const totalProfiles = await prisma.healthProfile.count();
    console.log(`Total Health Profiles in DB: ${totalProfiles}`);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
