const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "วนซ้ำ",
  description: `สลับลูปเพลง/คิว/ปิดระบบ`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  options: [
    {
      name: "โหมดลูป",
      description: `เลือกโหมดลูป`,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "รายการเพลง",
          value: `1`,
        },
        {
          name: "คิว",
          value: `2`,
        },
        {
          name: "ปิด",
          value: `0`,
        },
      ],
    },
  ],

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let loopmode = Number(interaction.options.getString("โหมดลูป"));
    await queue.setRepeatMode(loopmode);
    if (queue.repeatMode === 0) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} ปิดการวนลูปแล้วครับ!! **`
      );
    } else if (queue.repeatMode === 1) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} เปิดใช้ลูปเพลงแล้วครับ!! **`
      );
    } else if (queue.repeatMode === 2) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} เปิดใช้งานการวนคิวแล้ว!! **`
      );
    }
  },
};
