/*
  Warnings:

  - Made the column `created_at` on table `threads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `threads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
