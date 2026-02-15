-- CreateTable
CREATE TABLE "RoomMessage" (
    "id" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "runId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'GM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomMessage_roomId_runId_idx" ON "RoomMessage"("roomId", "runId");

-- CreateIndex
CREATE INDEX "RoomMessage_runId_idx" ON "RoomMessage"("runId");

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;
