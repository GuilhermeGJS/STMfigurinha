-- Drop FK constraint and make userId nullable
ALTER TABLE IF EXISTS "Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey";
ALTER TABLE IF EXISTS "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- Also drop NOT NULL from other nullable FK columns
ALTER TABLE IF EXISTS "Order" ALTER COLUMN "couponId" DROP NOT NULL;
ALTER TABLE IF EXISTS "Order" ALTER COLUMN "promotionRuleId" DROP NOT NULL;
