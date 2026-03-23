-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('draft', 'submitted', 'approved');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "content" JSONB,
ADD COLUMN     "status" "PlanStatus" NOT NULL DEFAULT 'draft',
ALTER COLUMN "visibility" SET DEFAULT 'private';

-- CreateIndex
CREATE INDEX "Plan_status_idx" ON "Plan"("status");
