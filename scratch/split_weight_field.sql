-- 1. Add new columns
ALTER TABLE "CourierEntry" ADD COLUMN "weightValue" DOUBLE PRECISION;
ALTER TABLE "CourierEntry" ADD COLUMN "weightUnit" VARCHAR(255) DEFAULT 'g';

-- 2. Populate new columns by parsing existing string weights
-- This regex extracts digits and dots, handles both 'g', 'gm', and 'kg'
UPDATE "CourierEntry"
SET 
  "weightValue" = CASE 
    WHEN "weight" ~ '^[0-9.]+$' THEN CAST("weight" AS DOUBLE PRECISION)
    ELSE CAST(NULLIF(REGEXP_REPLACE(LOWER("weight"), '[^0-9.]', '', 'g'), '') AS DOUBLE PRECISION)
  END,
  "weightUnit" = CASE 
    WHEN LOWER("weight") LIKE '%kg%' THEN 'kg'
    WHEN LOWER("weight") LIKE '%gm%' THEN 'gm'
    ELSE 'g'
  END;

-- Set a default if something failed to parse (shouldn't happen with normalized data)
UPDATE "CourierEntry" SET "weightValue" = 0 WHERE "weightValue" IS NULL;

-- 3. Drop the old column
ALTER TABLE "CourierEntry" DROP COLUMN "weight";

-- 4. Make weightValue non-nullable
ALTER TABLE "CourierEntry" ALTER COLUMN "weightValue" SET NOT NULL;
