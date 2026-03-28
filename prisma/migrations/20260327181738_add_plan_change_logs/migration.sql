-- CreateEnum
CREATE TYPE "PlanChangeSection" AS ENUM ('basic_info', 'overview', 'preparation', 'hotels', 'daily_timetable', 'extras');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "lastEditNote" TEXT,
ADD COLUMN     "lastEditedAt" TIMESTAMP(3),
ADD COLUMN     "lastEditedSection" "PlanChangeSection",
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PlanChangeLog" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "section" "PlanChangeSection" NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanChangeLog_planId_createdAt_idx" ON "PlanChangeLog"("planId", "createdAt");

-- AddForeignKey
ALTER TABLE "PlanChangeLog" ADD CONSTRAINT "PlanChangeLog_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
