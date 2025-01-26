-- CreateEnum
CREATE TYPE "CommentPostType" AS ENUM ('recruitmentPost');

-- CreateTable
CREATE TABLE "Comment" (
    "id" BIGINT NOT NULL,
    "authorId" BIGINT NOT NULL,
    "postId" BIGINT NOT NULL,
    "postType" "CommentPostType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentDomainEvent" (
    "id" BIGINT NOT NULL,
    "actorId" BIGINT,
    "aggregateId" BIGINT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventPayload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentDomainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_postType_postId_idx" ON "Comment"("postType", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentDomainEvent_aggregateId_version_key" ON "CommentDomainEvent"("aggregateId", "version");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
