import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Corrigindo coluna userId...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey"`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL`);
    console.log("✅ userId agora aceita NULL");
  } catch (e: any) {
    console.log("ℹ️ userId já está nullable ou erro:", e.message?.slice(0, 100));
  }
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ALTER COLUMN "couponId" DROP NOT NULL`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ALTER COLUMN "promotionRuleId" DROP NOT NULL`);
  } catch {}
  await prisma.$disconnect();
}

main();
