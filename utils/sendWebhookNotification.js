export default async (bot, title, err) => {

    const res = await fetch(bot.notifications_webhook_url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            content: `Failed to trace stats data for **${bot.id}**.`,
            embeds: [{
                title: `Error - ${title}`.slice(0, 256),
                color: 16711680,
                description: "```" + (err.message).slice(0, 4096) + "```",
                timestamp: new Date()
            }]
        }),
    });

    if(res.ok) return;

    console.error(`[${bot.id}] [${title}]\n${err}`);

}