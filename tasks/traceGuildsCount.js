import { prisma } from "../index.js";

import getApproximateGuildsCount from "../utils/getApproximateGuildsCount.js";

import config from "../config.json" assert { type: "json" };

setInterval(async () => {

    for(const bot of config.bots) {

        const lastEntry = await prisma.guilds_count.findFirst({
            where: { 
                bot_id: bot.id ,
                date: {
                    gte: new Date(Date.now() - 8 * 60 * 60 * 1000), // date >= (now - 8 hours)
                },
            },
            orderBy: { date: "desc" }
        });

        if(lastEntry) continue;

        const approximateGuildsCount = await getApproximateGuildsCount(bot);

        if(!approximateGuildsCount) continue;

        console.log(approximateGuildsCount);

    }



    // const res = await fetch();

    // let lte = new Date() - config.purgeInactiveUsers.maxInactiveAccountAge;
    // lte = new Date(lte).toISOString();

    // await prisma.users.deleteMany({
    //     where: {
    //         AND: [
    //             {
    //                 status: 0
    //             },
    //             {
    //                 createdAt: { lte }
    //             }
    //         ]
    //     }
    // });
    
}, 3000);