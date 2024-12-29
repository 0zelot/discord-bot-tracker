/*
  Warnings:

  - Added the required column `approximate_guilds_count` to the `guilds_count` table without a default value. This is not possible if the table is not empty.
  - Added the required column `declared_guilds_count` to the `guilds_count` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_guilds_count" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "declared_guilds_count" INTEGER NOT NULL,
    "approximate_guilds_count" INTEGER NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_guilds_count" ("bot_id", "date", "id") SELECT "bot_id", "date", "id" FROM "guilds_count";
DROP TABLE "guilds_count";
ALTER TABLE "new_guilds_count" RENAME TO "guilds_count";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
