import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const data = await prisma.courierEntry.findMany();
  fs.writeFileSync("scratch/db_backup_corrupted.json", JSON.stringify(data, null, 2));
  console.log(`Backup created for ${data.length} records.`);
  
  const suspicious = data.filter(e => e.weightValue < 10 && e.weightUnit === 'g');
  console.log(`Found ${suspicious.length} records with small values in 'g' (likely meant to be 'kg').`);
  
  const gramsWith1000 = data.filter(e => e.weightValue >= 1000 && e.weightUnit === 'g');
  console.log(`Found ${gramsWith1000.length} records with value >= 1000 in 'g' (could be 'kg' or 'gm').`);
}

main();
