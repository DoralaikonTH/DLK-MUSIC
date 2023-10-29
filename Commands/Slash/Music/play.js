const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "เล่น",
  description: `ใส่ชื่อเพลงหรือลิงค์ที่ต้องการเปิดเพลงได้เลยครับ`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,
  options: [
    {
      name: "เพลง",
      description: `ชื่อเพลง/ลิงค์`,
      type: ApplicationCommandOptionType.String,
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
    let song = interaction.options.getString("เพลง");
    let { channel } = interaction.member.voice;
    client.distube.play(channel, song, {
      member: interaction.member,
      textChannel: interaction.channel,
    });
    interaction
      .followUp({
        content: `กำลังค้นหา.. \`${song}\``,
        ephemeral: true,
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => {});
        }, 3000);
      });
  },
};
