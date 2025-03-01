-- CreateEnum
CREATE TYPE "ProjectApplicationStatus" AS ENUM ('pending', 'checked', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "ProjectApplication" (
    "id" BIGINT NOT NULL,
    "applicantId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,
    "position" TEXT NOT NULL,
    "status" "ProjectApplicationStatus" NOT NULL,
    "checkedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectApplication" ADD CONSTRAINT "ProjectApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectApplication" ADD CONSTRAINT "ProjectApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
