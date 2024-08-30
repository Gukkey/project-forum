/*
  Warnings:

  - Made the column `created_at` on table `replies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `replies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `sections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `topics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `topics` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "replies" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "sections" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "topics" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
