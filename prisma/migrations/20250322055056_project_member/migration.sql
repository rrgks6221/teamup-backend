-- CreateEnum
CREATE TYPE "ProjectMemberRole" AS ENUM ('owner', 'member');

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" BIGINT NOT NULL,
    "accountId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,
    "position" TEXT,
    "role" "ProjectMemberRole" NOT NULL,
    "name" TEXT NOT NULL,
    "profileImagePath" TEXT,
    "techStackNames" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_accountId_projectId_key" ON "ProjectMember"("accountId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
