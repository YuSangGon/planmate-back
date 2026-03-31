-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('draft', 'submitted');

-- AlterTable
ALTER TABLE "PlanReview" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'draft';
