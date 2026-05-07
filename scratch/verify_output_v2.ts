import { PrismaClient } from "@prisma/client";

function formatWeight(value: number | null | undefined, unit: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const u = (unit || "gm").toLowerCase().trim();
  if (u === "gm" || u === "g" || u === "grams") {
    return `${(value / 1000).toFixed(3)} GM`;
  }
  if (u === "kg" || u === "kilograms") {
    return `${Number(value.toFixed(3))} KG`;
  }
  return `${value} ${u.toUpperCase()}`;
}

const prisma = new PrismaClient();

async function main() {
  const entries = await prisma.courierEntry.findMany({ 
    where: {
      OR: [
        { weightUnit: 'kg' },
        { weightUnit: 'gm' }
      ]
    },
    take: 20 
  });
  entries.forEach(e => {
    console.log(`Challan: ${e.challanNo} | Stored: ${e.weightValue} ${e.weightUnit} | Output: ${formatWeight(e.weightValue, e.weightUnit)}`);
  });
}

main();
