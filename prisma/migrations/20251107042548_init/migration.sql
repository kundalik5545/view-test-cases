-- CreateTable
CREATE TABLE "xpsTestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testCaseId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "testCaseName" TEXT NOT NULL,
    "expectedResult" TEXT,
    "actualResult" TEXT,
    "automationStatus" TEXT,
    "testStatus" TEXT,
    "module" TEXT,
    "schemeLevel" TEXT,
    "client" TEXT,
    "comments" TEXT NOT NULL,
    "defectId" TEXT
);

-- CreateTable
CREATE TABLE "eMemberTestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testCaseId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "testCaseName" TEXT NOT NULL,
    "expectedResult" TEXT,
    "actualResult" TEXT,
    "automationStatus" TEXT,
    "testStatus" TEXT,
    "portal" TEXT,
    "comments" TEXT NOT NULL,
    "defectId" TEXT
);
