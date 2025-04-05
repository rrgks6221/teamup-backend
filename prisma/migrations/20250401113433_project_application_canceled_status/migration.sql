-- AlterEnum
ALTER TYPE "ProjectApplicationStatus" ADD VALUE 'canceled';

-- AlterTable
ALTER TABLE "ProjectApplication" ADD COLUMN     "canceledAt" TIMESTAMP(3);
