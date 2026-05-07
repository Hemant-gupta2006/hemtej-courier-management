ALTER TABLE "CourierEntry" ALTER COLUMN "weight" TYPE VARCHAR(255) USING "weight"::TEXT || 'g';
