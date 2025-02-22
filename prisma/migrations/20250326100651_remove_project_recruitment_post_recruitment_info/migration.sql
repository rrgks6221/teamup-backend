/*
  Warnings:

  - You are about to drop the column `applicantsCount` on the `ProjectRecruitmentPost` table. All the data in the column will be lost.
  - You are about to drop the column `applicantsEndsAt` on the `ProjectRecruitmentPost` table. All the data in the column will be lost.
  - You are about to drop the column `currentRecruitsCount` on the `ProjectRecruitmentPost` table. All the data in the column will be lost.
  - You are about to drop the column `maxRecruitsCount` on the `ProjectRecruitmentPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectRecruitmentPost" DROP COLUMN "applicantsCount",
DROP COLUMN "applicantsEndsAt",
DROP COLUMN "currentRecruitsCount",
DROP COLUMN "maxRecruitsCount";
