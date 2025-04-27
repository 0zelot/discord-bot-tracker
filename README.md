# discord-bot-tracker

An application for tracking your Discord bots. It can track:
- Guilds count
- Executed commands
- Vote webhooks:
    - [top.gg](https://top.gg)
    - [discordlist.gg](https://discordlist.gg)
    - [discords.com](https://discords.com)
    - [discordbotlist.com](https://discordbotlist.com)

## Requirements

- NodeJS v22 or newer

## Setup

1. Clone this repository

2. Install dependencies `npm install`

3. Configure the application by editing `config.json`

4. Apply Prisma migrations `npx prisma migrate dev --name init`

5. Generate Prisma client `npx prisma generate`

6. Run `node index.js`

## Configuration

### Adjusting config settings

The main configuration file is **config.json**:

```json
{
    "host": "0.0.0.0",
    "port": 3000,
    "guilds_frequency": 8, // how often save guilds count data (in hours)
    "guilds_frequency_task": 300000, // interval frequency (in ms), no need to change this
    "bots": [
        {
            "id": "XXXXXXXXXXXXXXXXXX", // your bot ID
            "webhook_token": "some-webhook-token", // your secret token for authorizing guilds count and commands requests
            "vote_webhook_tokens": {
                "top_gg": "some-webhook-token-topgg", // your webhook authorization token for top.gg - not the api key, just a random string for authorizing vote webhook
                "discordlist_gg": "some-webhook-token-discordlistgg",
                "discords_com": "some-webhook-token-discordlistgg",
                "discordbotlist_com": "some-webhook-token-discordlistgg"
            },
            "notifications_webhook_url": "https://discord.com/api/webhooks/XXXXXXXXXXXXXXXXXX/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" // your Discord webhook, for some error handling (optional)
        }
        // add more bots as needed
    ]
}
```

### Guilds count tracker

The approximate number of servers is retrieved from the [Application Directory API](https://discord.com/api/v10/application-directory-static/applications/your-bot-id), but it is also possible to implement sending a webhook with this information to store more up-to-date data.

All you have to do is send a POST to `/api/your-bot-id/guilds-count` with `webhook_token` in header authorization and `count` as body data (JSON).

Example:

```js
setInterval(async () => {

    await fetch("https://stats.example.com/api/488809387910234145/guilds-count", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "some-webhook-token"
        },
        body: JSON.stringify({
            count: 1234 // it must be an integer
        })
    });

}, 300000)
```

### Executed commands tracker

To track executed commands it is necessary to send a POST when execute a command. I recommend integrating this in your command handler.

Example:

```js
bot.on(Events.InteractionCreate, async interaction => {

    if(!interaction.isChatInputCommand()) return;

    // ...

    await fetch("https://stats.example.com/api/488809387910234145/commands", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "some-webhook-token"
        },
        body: JSON.stringify({
            command: interaction.commandName, // command name
            user: interaction.user.id, // user id
            guild: interaction.guild?.id // guild id; optional
        })
    })

    // ...

    await command.execute(bot, interaction);

})
```

### Vote webhooks

Each supported bot list service has its own endpoint:
- [top.gg](https://top.gg) - `/api/your-bot-id/vote/top_gg`
- [discordlist.gg](https://discordlist.gg) - `/api/your-bot-id/vote/discordlist_gg`
- [discords.com](https://discords.com) - `/api/your-bot-id/vote/discords_com`
- [discordbotlist.com](https://discordbotlist.com) - `/api/your-bot-id/vote/discordbotlist_com`

#### Example top.gg vote webhook setup:

![](https://i.imgur.com/mw2JHOg.png)

`some-webhook-token-topgg` is a thing you provided in `vote_webhook_tokens` -> `top_gg`. 

For other bot list services, you configure it in the same way.