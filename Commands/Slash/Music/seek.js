const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ดูเพลง",
  description: `ค้นหาเพลงปัจจุบันแล้ว`,
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
      name: "จำนวน",
      description: `ให้ค้นหาจำนวนที่เป็นตัวเลขนะครับ`,
      type: ApplicationCommandOptionType.Number,
      required: true,
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
    let seek = interaction.options.getNumber("จำนวน");
    await queue.seek(seek);
    client.embed(
      interaction,
      `${client.config.emoji.SUCCESS} ค้นหา \`${seek}\` วินาที !!`
    );
  },
};
