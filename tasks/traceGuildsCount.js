import { prisma } from "../index.js";

import getApproximateGuildsCount from "../utils/getApproximateGuildsCount.js";

import config from "../config.json" with { type: "json" };

setInterval(async () => {

    for(const bot of config.bots) {

        const lastEntry = await prisma.guilds_count.findFirst({
            where: { 
                bot_id: bot.id,
                date: {
                    gte: new Date(Date.now() - config.guilds_frequency * 60 * 60 * 1000),
                },
            },
            orderBy: { date: "desc" }
        });

        if(lastEntry) continue;

        const approximateGuildsCount = await getApproximateGuildsCount(bot);

        if(!approximateGuildsCount) continue;

        await prisma.guilds_count.create({
            data: {
                bot_id: bot.id,
                approximate_guilds_count: approximateGuildsCount
            }
        });

    }
    
}, config.guilds_frequency_task);