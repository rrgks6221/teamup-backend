/*
  Warnings:

  - You are about to drop the column `position` on the `ProjectMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectMember" DROP COLUMN "position",
ADD COLUMN     "positionName" TEXT;
