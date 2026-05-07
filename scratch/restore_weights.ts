import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting weight restoration...");
  
  const entries = await prisma.courierEntry.findMany({
    where: {
      OR: [
        { weightValue: { gte: 1000 }, weightUnit: 'g' },
        { weightValue: { gte: 1000 }, weightUnit: 'gm' },
        { weightUnit: 'g' }
      ]
    }
  });

  console.log(`Found ${entries.length} potentially affected records.`);
  
  let restoredCount = 0;
  let standardizedCount = 0;

  for (const entry of entries) {
    let newValue = entry.weightValue;
    let newUnit = entry.weightUnit;
    let modified = false;

    // Rule 1: Restore KG
    if (entry.weightValue >= 1000 && (entry.weightUnit === 'g' || entry.weightUnit === 'gm')) {
      newValue = entry.weightValue / 1000;
      newUnit = 'kg';
      modified = true;
      restoredCount++;
    } 
    // Rule 2: Standardize 'g' to 'gm'
    else if (entry.weightUnit === 'g') {
      newUnit = 'gm';
      modified = true;
      standardizedCount++;
    }

    if (modified) {
      await prisma.courierEntry.update({
        where: { id: entry.id },
        data: {
          weightValue: newValue,
          weightUnit: newUnit
        }
      });
      
      if (restoredCount <= 10) {
        console.log(`Restored: ${entry.weightValue}${entry.weightUnit} -> ${newValue}${newUnit} (Challan: ${entry.challanNo})`);
      }
    }
  }

  console.log(`Restoration complete.`);
  console.log(`- Restored to KG: ${restoredCount}`);
  console.log(`- Standardized to GM: ${standardizedCount}`);
}

main().catch(console.error);
