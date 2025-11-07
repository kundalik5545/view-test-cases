-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_eMemberTestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testCaseId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "testCaseName" TEXT NOT NULL,
    "expectedResult" TEXT,
    "actualResult" TEXT,
    "automationStatus" TEXT,
    "testStatus" TEXT,
    "portal" TEXT,
    "emReleaseNo" TEXT,
    "priority" TEXT,
    "comments" TEXT,
    "defectId" TEXT,
    "screenshots" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_eMemberTestCase" ("actualResult", "automationStatus", "comments", "defectId", "expectedResult", "id", "location", "portal", "screenshots", "testCaseId", "testCaseName", "testStatus") SELECT "actualResult", "automationStatus", "comments", "defectId", "expectedResult", "id", "location", "portal", "screenshots", "testCaseId", "testCaseName", "testStatus" FROM "eMemberTestCase";
DROP TABLE "eMemberTestCase";
ALTER TABLE "new_eMemberTestCase" RENAME TO "eMemberTestCase";
CREATE TABLE "new_xpsTestCase" (
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
    "releaseNo" TEXT,
    "priority" TEXT,
    "comments" TEXT,
    "defectId" TEXT,
    "screenshots" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_xpsTestCase" ("actualResult", "automationStatus", "client", "comments", "defectId", "expectedResult", "id", "location", "module", "schemeLevel", "screenshots", "testCaseId", "testCaseName", "testStatus") SELECT "actualResult", "automationStatus", "client", "comments", "defectId", "expectedResult", "id", "location", "module", "schemeLevel", "screenshots", "testCaseId", "testCaseName", "testStatus" FROM "xpsTestCase";
DROP TABLE "xpsTestCase";
ALTER TABLE "new_xpsTestCase" RENAME TO "xpsTestCase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
