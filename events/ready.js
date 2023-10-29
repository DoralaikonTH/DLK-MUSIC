const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
  console.log(`${client.user.username} ออนไลน์อยู่`);
  client.user.setActivity({
    name: `/ขอความช่วยเหลือ `,
    type: ActivityType.Listening,
  });

  // loading database
  await require("../handlers/Database")(client);

  // loading dashboard
  require("../server");

  client.guilds.cache.forEach(async (guild) => {
    await client.updateembed(client, guild);
  });
});
