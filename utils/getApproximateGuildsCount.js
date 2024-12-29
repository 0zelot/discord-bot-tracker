import sendWebhookNotification from "./sendWebhookNotification.js";

export default async (bot) => {

    try {

        const res = await fetch(`https://discord.com/api/v10/application-directory-static/applications/d${bot.id}`);

        if(res.status !== 200) throw Error(`${res.url}\n\n${JSON.stringify(await res.json())}`);

        const body = await res.json();

        if(!body.id || !body.directory_entry || !body.directory_entry.guild_count) throw Error(`${res.url}\n\nBad request response`);

        return body.directory_entry.guild_count;

    } catch(err) {

        await sendWebhookNotification(bot, "getApproximateGuildsCount.js", err);

    }

}