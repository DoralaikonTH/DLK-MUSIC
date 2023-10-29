const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "กระโดด",
  description: `ข้ามไปยังเพลงในคิว`,
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
      name: "ดัชนี",
      description: `ดัชนีเพลงในคิว`,
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
    let index = interaction.options.getNumber("ดัชนี");
    let song = queue.songs[index];
    if (ดัชนี > queue.songs.length - 1 || ดัชนี < 0) {
      return client.embed(
        interaction,
        `${
          client.config.emoji.ERROR
        } **The Position must be between \`0\` and \`${
          queue.songs.length - 1
        }\`!**`
      );
    } else {
      queue.jump(ดัชนี).then((q) => {
        client.embed(
          interaction,
          `** ${client.config.emoji.SUCCESS} Jumped to The Song [\`${song.name}\`](${song.url}) **`
        );
      });
    }
  },
};
