-- CreateTable
CREATE TABLE "votes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bot_id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);
