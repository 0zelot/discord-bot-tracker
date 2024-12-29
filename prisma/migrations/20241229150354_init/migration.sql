-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_guilds_count" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "declared_guilds_count" INTEGER,
    "approximate_guilds_count" INTEGER,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_guilds_count" ("approximate_guilds_count", "bot_id", "date", "declared_guilds_count", "id") SELECT "approximate_guilds_count", "bot_id", "date", "declared_guilds_count", "id" FROM "guilds_count";
DROP TABLE "guilds_count";
ALTER TABLE "new_guilds_count" RENAME TO "guilds_count";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
