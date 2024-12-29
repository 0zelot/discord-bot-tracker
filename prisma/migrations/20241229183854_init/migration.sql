-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_votes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "user_id" TEXT,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_votes" ("bot_id", "date", "id", "service", "user_id") SELECT "bot_id", "date", "id", "service", "user_id" FROM "votes";
DROP TABLE "votes";
ALTER TABLE "new_votes" RENAME TO "votes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
