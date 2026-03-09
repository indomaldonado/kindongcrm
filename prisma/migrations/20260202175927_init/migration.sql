-- CreateTable
CREATE TABLE "Supporter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supporterId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    CONSTRAINT "Donation_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "Supporter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrayerCommitment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supporterId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "dayOfWeek" TEXT,
    "notes" TEXT,
    CONSTRAINT "PrayerCommitment_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "Supporter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
