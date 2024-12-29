import { prisma } from "../../../index.js";

import config from "../../../config.json" assert { type: "json" };

export default async (fastify, options) => {

    fastify.post("/commands", async (req, res) => {

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

        const { command, user, guild } = req.body;

        if(!command || !user) return res.status(400).send({
            success: false,
            error: "Missing body: command and/or user_id"
        });

        await prisma.commands.create({
            data: {
                bot_id: bot.id,
                command: command.toLowerCase(), 
                user_id: user, 
                guild_id: guild
            }
        });
    
        res.send({ success: true });

    });
    
}
