import { prisma } from "../../../prisma.js";

import config from "../../../config.json" with { type: "json" };

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

        const { command, type, user, guild } = req.body;

        if(!command || !user) return res.status(400).send({
            success: false,
            error: "Missing body: command and/or user_id"
        });

        const command_type = type ?? 0;

        if(![0, 1, 2].includes(command_type)) return res.status(400).send({
            success: false,
            error: "Invalid body: type must be 0 (chat input), 1 (context) or 2 (button)"
        });

        await prisma.commands.create({
            data: {
                bot_id: bot.id,
                command: command.toLowerCase(),
                type: command_type,
                user_id: user,
                guild_id: guild
            }
        });

        res.send({ success: true });

    });

    fastify.get("/commands", async (req, res) => {

        const { bot_id } = req.params;

        if(!bot_id) return res.status(404).send({
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

        const commands = await prisma.commands.findMany({
            where: { bot_id: bot.id }
        });

        res.send({ success: true, commands });

    });

}
