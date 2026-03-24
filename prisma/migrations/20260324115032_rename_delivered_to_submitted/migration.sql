/*
  Warnings:

  - The values [delivered] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
ALTER TYPE "RequestStatus" RENAME VALUE 'delivered' TO 'submitted';
COMMIT;
