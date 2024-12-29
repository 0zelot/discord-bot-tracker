import Fastify from "fastify";
import cors from "@fastify/cors";
import autoload from "@fastify/autoload";
import { PrismaClient } from "@prisma/client";

import { join } from "node:path";

import config from "./config.json" assert { type: "json" };

import "./tasks/traceGuildsCount.js";

const fastify = Fastify({
    trustProxy: true,
    ignoreTrailingSlash: true
});

fastify.register(cors);
fastify.register(autoload, {
    dir: join(process.cwd(), "routes"),
    routeParams: true
});

const prisma = new PrismaClient();

(async () => {
    try {
        const { port, host } = config;
        await fastify.listen({ port, host });
        console.log(`Fastify server is running on ${host}:${port}.`);
    } catch(err) {
        console.error(err.stack);
        process.exit(1);
    }
})();

export { prisma }