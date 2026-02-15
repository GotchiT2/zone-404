-- CreateEnum
CREATE TYPE "TimerState" AS ENUM ('IDLE', 'RUNNING', 'PAUSED', 'ENDED');

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trialCount" INTEGER NOT NULL,
    "defaultTimerDurationMs" INTEGER NOT NULL DEFAULT 3600000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trial" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunTrialStatus" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "trialId" INTEGER NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "validatedAt" TIMESTAMP(3),

    CONSTRAINT "RunTrialStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunTimer" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "state" "TimerState" NOT NULL DEFAULT 'IDLE',
    "startedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "accumulatedPausedMs" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunTimer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");

-- CreateIndex
CREATE INDEX "Trial_roomId_idx" ON "Trial"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Trial_roomId_index_key" ON "Trial"("roomId", "index");

-- CreateIndex
CREATE INDEX "Run_roomId_endedAt_idx" ON "Run"("roomId", "endedAt");

-- CreateIndex
CREATE INDEX "RunTrialStatus_runId_idx" ON "RunTrialStatus"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "RunTrialStatus_runId_trialId_key" ON "RunTrialStatus"("runId", "trialId");

-- CreateIndex
CREATE UNIQUE INDEX "RunTimer_runId_key" ON "RunTimer"("runId");

-- CreateIndex
CREATE INDEX "RunTimer_runId_idx" ON "RunTimer"("runId");

-- AddForeignKey
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunTrialStatus" ADD CONSTRAINT "RunTrialStatus_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunTrialStatus" ADD CONSTRAINT "RunTrialStatus_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunTimer" ADD CONSTRAINT "RunTimer_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;
