import { PrismaClient } from "@prisma/client";
import { formatWeight } from "./src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const entries = await prisma.courierEntry.findMany({ 
    where: {
      OR: [
        { weightUnit: 'kg' },
        { weightUnit: 'gm' }
      ]
    },
    take: 10 
  });
  entries.forEach(e => {
    console.log(`Challan: ${e.challanNo} | Stored: ${e.weightValue} ${e.weightUnit} | Output: ${formatWeight(e.weightValue, e.weightUnit)}`);
  });
}

main();
