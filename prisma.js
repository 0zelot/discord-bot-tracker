import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const adapter = new PrismaBetterSqlite3(
    { url: "file:./database.db" },
    { timestampFormat: "unixepoch-ms" }
);

const prisma = new PrismaClient({ adapter });

export { prisma }
