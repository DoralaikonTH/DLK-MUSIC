const {
  CommandInteraction,
  EmbedBuilder,
  version,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const os = require("systeminformation");
const { msToDuration, formatBytes } = require("../../../handlers/functions");

module.exports = {
  name: "สเตตัส",
  description: `ดูสถิติของผมได้เลย`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let memory = await os.mem();
    let cpu = await os.cpu();
    let cpuUsage = await (await os.currentLoad()).currentLoad;
    let osInfo = await os.osInfo();
    let TotalRam = formatBytes(memory.total);
    let UsageRam = formatBytes(memory.used);

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle("__**สถานะ:**__")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `> **   สร้างโดย [\` ドラライコン \`](https://www.instagram.com/doralaikon_th) **`
          )
          .addFields([
            {
              name: `⏳ ความจำที่ใช้`,
              value: `\`${UsageRam}\` / \`${TotalRam}\``,
            },
            {
              name: `⌚️ เวลาที่ใช้งาน`,
              // value: `<t:${Math.floor(
              //   Date.now() / 1000 - client.uptime / 1000
              // )}:R>`,
              value: `\`${msToDuration(client.uptime)}\``,
            },
            {
              name: `📁 จำนวนผู้ใช้`,
              value: `\`${client.guilds.cache.size} \``,
              inline: true,
            },
            {
              name: `📁 จำนวนServer`,
              value: `\`${client.guilds.cache.size}\``,
              inline: true,
            },
            {
              name: `📁 ช่อง`,
              value: `\`${client.channels.cache.size}\``,
              inline: true,
            },
            {
              name: `👾 Discord.JS`,
              value: `\`v${version}\``,
              inline: true,
            },
            {
              name: `🤖 Node`,
              value: `\`${process.version}\``,
              inline: true,
            },
            {
              name: `🏓 ปิงของบอท`,
              value: `\`${client.ws.ping}ms\``,
              inline: true,
            },
            {
              name: `🤖 CPUที่ใช้ไป`,
              value: `\`${Math.floor(cpuUsage)}%\``,
              inline: true,
            },
            {
              name: `🤖 Arch`,
              value: `\`${osInfo.arch}\``,
              inline: true,
            },
            {
              name: `💻 แพลตฟอร์ม`,
              value: `\`\`${osInfo.platform}\`\``,
              inline: true,
            },
            {
              name: `🤖 CPU`,
              value: `\`\`\`fix\n${cpu.brand}\`\`\``,
            },
          ])
          .setFooter(client.getFooter(interaction.user)),
      ],
    });
  },
};
