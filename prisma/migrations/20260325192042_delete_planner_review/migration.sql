/*
  Warnings:

  - You are about to drop the `PlannerReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlannerReview" DROP CONSTRAINT "PlannerReview_plannerId_fkey";

-- DropForeignKey
ALTER TABLE "PlannerReview" DROP CONSTRAINT "PlannerReview_travellerId_fkey";

-- DropTable
DROP TABLE "PlannerReview";
