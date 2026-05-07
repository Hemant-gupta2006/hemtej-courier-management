import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.courierEntry.findMany({
    where: { weightValue: { gte: 1000 }, weightUnit: 'g' },
    take: 10
  });
  console.log(JSON.stringify(data, null, 2));
}

main();
