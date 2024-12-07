-- CreateEnum
CREATE TYPE "SignInType" AS ENUM ('Username');

-- CreateTable
CREATE TABLE "Account" (
    "id" BIGINT NOT NULL,
    "nickname" VARCHAR(20) NOT NULL,
    "signInType" "SignInType" NOT NULL,
    "username" VARCHAR(20),
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_nickname_key" ON "Account"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
