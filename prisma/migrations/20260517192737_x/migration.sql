-- CreateTable
CREATE TABLE "guilds_count" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "declared_guilds_count" INTEGER,
    "approximate_guilds_count" INTEGER,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "votes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "user_id" TEXT,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "commands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "logins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);
