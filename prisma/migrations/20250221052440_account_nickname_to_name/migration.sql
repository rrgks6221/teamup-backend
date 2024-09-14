/*
  Warnings:

  - You are about to drop the column `nickname` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_nickname_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "nickname",
ADD COLUMN     "name" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");
