-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('Admin', 'User');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "role" "AccountRole" NOT NULL DEFAULT 'User';
