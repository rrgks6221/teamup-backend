-- CreateTable
CREATE TABLE "TechStackDomainEvent" (
    "id" BIGINT NOT NULL,
    "actorId" BIGINT,
    "aggregateId" BIGINT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventPayload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechStackDomainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechStackDomainEvent_aggregateId_version_key" ON "TechStackDomainEvent"("aggregateId", "version");
