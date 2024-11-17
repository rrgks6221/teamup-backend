-- CreateTable
CREATE TABLE "AccountDomainEvent" (
    "id" BIGINT NOT NULL,
    "actorId" BIGINT NOT NULL,
    "aggregateId" BIGINT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventPayload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountDomainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountDomainEvent_aggregateId_version_key" ON "AccountDomainEvent"("aggregateId", "version");
