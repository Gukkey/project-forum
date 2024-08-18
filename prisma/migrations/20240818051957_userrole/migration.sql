/*
  Warnings:

  - You are about to drop the column `is_true` on the `invites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invites" DROP COLUMN "is_true",
ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false;
