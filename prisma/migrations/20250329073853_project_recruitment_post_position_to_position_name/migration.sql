/*
  Warnings:

  - You are about to drop the column `position` on the `ProjectRecruitmentPost` table. All the data in the column will be lost.
  - Added the required column `positionName` to the `ProjectRecruitmentPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectRecruitmentPost" DROP COLUMN "position",
ADD COLUMN     "positionName" TEXT NOT NULL;
