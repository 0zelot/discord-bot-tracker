import { prisma } from "../../../index.js";

import config from "../../../config.json" assert { type: "json" };

export default async (fastify, options) => {

    fastify.post("/vote/:service", async (req, res) => {

        const { bot_id, service } = req.params;

        if(!bot_id) return res.status(404).send({
            success: false,
            error: "Missing param: bot_id"
        });

        const bot = config.bots.find(bot => bot.id == bot_id);

        if(!service || !bot.vote_webhook_tokens[service]) return res.status(404).send({
            success: false,
            error: "Missing param: service (or invalid service provided)"
        });

        if(!bot) return res.status(404).send({
            success: false,
            error: "This bot is not tracked"
        });

        if(req.headers.authorization !== bot.vote_webhook_tokens[service]) return res.status(401).send({
            success: false,
            error: "Unauthorized"
        });

        const lastEntry = await prisma.votes.findFirst({
            where: { 
                bot_id: bot.id,
                service,
                date: {
                    gte: new Date(Date.now() - 2000),
                },
            },
            orderBy: { date: "desc" }
        });

        if(service == "top_gg") {

            if(req.body.type == "upvote") await prisma.votes.create({
                data: {
                    bot_id: bot.id,
                    service,
                    user_id: req.body.user
                }
            });

        } else if(service == "discordlist_gg") {

            await prisma.votes.create({
                data: {
                    bot_id: bot.id,
                    service
                }
            });

        } else if(service == "discords_com") {

            if(req.body.type == "vote") await prisma.votes.create({
                data: {
                    bot_id: bot.id,
                    service,
                    user_id: req.body.user
                }
            });

        } else if(service == "discordbotlist_com") {

            await prisma.votes.create({
                data: {
                    bot_id: bot.id,
                    service,
                    user_id: req.body.id
                }
            });

        }

        res.send({ success: true });

    });
    
}
