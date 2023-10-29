const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ย้ายไป",
  description: `ย้ายเพลงในคิวปัจจุบัน`,
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
      description: `ดัชนีเพลง`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "ดัชนีเป้าหมาย",
      description: `ดัชนีเพลงเป้าหมาย`,
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
    let position = interaction.options.getNumber("ดัชนีติดตาม");
    if (position >= queue.songs.length || position < 0) position = -1;
    if (songIndex > queue.songs.length - 1) {
      return client.embed(
        interaction,
        ` **เพลงสุดท้ายในคิวมีดัชนี: \`${queue.songs.length}\`**`
      );
    } else if (position === 0) {
      return client.embed(
        interaction,
        `**ไม่สามารถย้ายเพลงก่อนที่จะเล่นเพลงครับ!**`
      );
    } else {
      let song = queue.songs[songIndex];
      //remove the song
      queue.songs.splice(songIndex);
      //Add it to a specific Position
      queue.addToQueue(song, position);
      client.embed(
        interaction,
        `📑 ย้าย **${
          song.name
        }** ไปที่ **\`${position}th\`** วางทันทีหลังจากนั้น **_${
          queue.songs[position - 1].name
        }_!**`
      );
    }
  },
};
