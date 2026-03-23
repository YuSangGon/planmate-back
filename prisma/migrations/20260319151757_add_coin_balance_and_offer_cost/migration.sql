-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "coinTransferred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offerCost" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coinBalance" INTEGER NOT NULL DEFAULT 0;
