-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "ext" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sha256" TEXT,
    "compressionMode" TEXT NOT NULL DEFAULT 'BALANCED',
    "uploadedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaFile_storagePath_key" ON "MediaFile"("storagePath");

-- CreateIndex
CREATE INDEX "MediaFile_createdAt_idx" ON "MediaFile"("createdAt");

-- CreateIndex
CREATE INDEX "MediaFile_uploadedById_idx" ON "MediaFile"("uploadedById");
