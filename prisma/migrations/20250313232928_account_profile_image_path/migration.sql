/*
  Warnings:

  - A unique constraint covering the columns `[profileImagePath]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "profileImagePath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_profileImagePath_key" ON "Account"("profileImagePath");
