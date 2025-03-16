/*
  Warnings:

  - You are about to drop the column `position` on the `ProjectApplication` table. All the data in the column will be lost.
  - Added the required column `positionName` to the `ProjectApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectApplication" DROP COLUMN "position",
ADD COLUMN     "positionName" TEXT NOT NULL;
