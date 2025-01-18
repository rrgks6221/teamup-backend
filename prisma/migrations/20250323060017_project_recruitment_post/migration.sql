-- CreateEnum
CREATE TYPE "ProjectRecruitmentPostStatus" AS ENUM ('open', 'close');

-- CreateTable
CREATE TABLE "ProjectRecruitmentPost" (
    "id" BIGINT NOT NULL,
    "authorId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "techStackNames" JSONB NOT NULL DEFAULT '[]',
    "recruitmentStatus" "ProjectRecruitmentPostStatus" NOT NULL,
    "maxRecruitsCount" INTEGER,
    "currentRecruitsCount" INTEGER NOT NULL,
    "applicantsEndsAt" TIMESTAMP(3),
    "applicantsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectRecruitmentPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectRecruitmentPost" ADD CONSTRAINT "ProjectRecruitmentPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRecruitmentPost" ADD CONSTRAINT "ProjectRecruitmentPost_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
