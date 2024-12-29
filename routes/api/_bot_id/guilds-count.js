import { prisma } from "../../../index.js";

import getApproximateGuildsCount from "../../../utils/getApproximateGuildsCount.js";

import config from "../../../config.json" assert { type: "json" };

export default async (fastify, options) => {

    fastify.post("/guilds-count", async (req, res) => {

        const { bot_id } = req.params;

        if(!bot_id) res.status(404).send({
            success: false,
            error: "Missing param: bot_id"
        });

        const bot = config.bots.find(bot => bot.id == bot_id);

        if(!bot) return res.status(404).send({
            success: false,
            error: "This bot is not tracked"
        });

        if(req.headers.authorization !== bot.guilds_webhook_token) return res.status(401).send({
            success: false,
            error: "Unauthorized"
        });

        const { count } = req.body;

        if(!count || !Number.isInteger(count)) return res.status(400).send({
            success: false,
            error: "Missing body: count [number]"
        });

        const lastEntry = await prisma.guilds_count.findFirst({
            where: { 
                bot_id: bot.id,
                date: {
                    gte: new Date(Date.now() - config.guilds_frequency * 60 * 60 * 1000),
                },
            },
            orderBy: { date: "desc" }
        });

        if(lastEntry && lastEntry.declared_guilds_count) return res.send({ success: true }); // we have record with webhook data

        else if(lastEntry && !lastEntry.declared_guilds_count) { // we have record only with approximated data

            const approximateGuildsCount = await getApproximateGuildsCount(bot);

            await prisma.guilds_count.update({
                where: { id: lastEntry.id },
                data: { 
                    declared_guilds_count: count,
                    approximate_guilds_count: approximateGuildsCount
                }
            });

            return res.send({ success: true });

        }

        else if(!lastEntry) { // we don't have any record

            const approximateGuildsCount = await getApproximateGuildsCount(bot);

            await prisma.guilds_count.create({
                data: {
                    bot_id: bot.id,
                    declared_guilds_count: count,
                    approximate_guilds_count: approximateGuildsCount
                }
            });
    
            res.send({ success: true });

        }

    });
    
}
