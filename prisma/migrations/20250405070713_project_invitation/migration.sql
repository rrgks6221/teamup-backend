-- CreateEnum
CREATE TYPE "ProjectInvitationStatus" AS ENUM ('pending', 'checked', 'canceled', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "ProjectInvitation" (
    "id" BIGINT NOT NULL,
    "inviterId" BIGINT NOT NULL,
    "inviteeId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,
    "positionName" TEXT NOT NULL,
    "status" "ProjectInvitationStatus" NOT NULL,
    "checkedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectInvitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectInvitation" ADD CONSTRAINT "ProjectInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvitation" ADD CONSTRAINT "ProjectInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInvitation" ADD CONSTRAINT "ProjectInvitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
