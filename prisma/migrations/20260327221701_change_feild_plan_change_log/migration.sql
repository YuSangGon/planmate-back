/*
  Warnings:

  - The `lastEditedSection` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `note` on the `PlanChangeLog` table. All the data in the column will be lost.
  - Changed the type of `section` on the `PlanChangeLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "lastEditedSection",
ADD COLUMN     "lastEditedSection" TEXT;

-- AlterTable
ALTER TABLE "PlanChangeLog" DROP COLUMN "note",
DROP COLUMN "section",
ADD COLUMN     "section" TEXT NOT NULL;
