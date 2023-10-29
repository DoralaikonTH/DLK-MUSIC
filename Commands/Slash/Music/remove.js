const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ลบ",
  description: `ลบเพลงออกจากคิวปัจจุบัน`,
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
      name: "ดัชนีติดตาม",
      description: `ขอดัชนีเพลงหน่อยครับ`,
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
    let songIndex = interaction.options.getNumber("ดัชนีติดตาม");
    if (songIndex === 0) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} พี่ ๆ ไม่สามารถลบเพลงปัจจุบันได้ **`
      );
    } else {
      let track = queue.songs[songIndex];
      queue.songs.splice(track, track + 1);
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} ลบออก \`${track.name}\` เพลงจากคิวแล้วครับ !!`
      );
    }
  },
};
