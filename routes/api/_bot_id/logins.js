import { prisma } from "../../../prisma.js";

import config from "../../../config.json" with { type: "json" };

export default async (fastify, options) => {

    fastify.post("/logins", async (req, res) => {

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

        if(req.headers.authorization !== bot.webhook_token) return res.status(401).send({
            success: false,
            error: "Unauthorized"
        });

        const { user_id } = req.body;

        if(!user_id) return res.status(400).send({
            success: false,
            error: "Missing body: user_id"
        });

        await prisma.logins.create({
            data: {
                bot_id: bot.id,
                user_id
            }
        });
    
        res.send({ success: true });

    });
    
}