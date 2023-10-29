const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "เล่นก่อนหน้า",
  description: `เล่นเพลงก่อนหน้าของคิว`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    if (!queue.previousSongs.length) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} ไม่พบเพลง ก่อนหน้าครับ !!`
      );
    } else {
      await queue.previous().then((m) => {
        client.embed(
          interaction,
          `${client.config.emoji.SUCCESS} เล่นเพลงก่อนหน้า !!`
        );
      });
    }
  },
};
