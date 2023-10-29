const {
  CommandInteraction,
  EmbedBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "กำลังเล่น",
  description: `ดูว่าเพลงใดกำลังเล่นเพลงปัจจุบัน`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
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
    let song = queue.songs[0];

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setThumbnail(song.thumbnail)
          .setAuthor({
            name: `กำลังเล่น`,
            iconURL: song.thumbnail,
            url: song.url,
          })
          .setDescription(`** [${song.name}](${song.streamURL}) **`)
          .addFields([
            {
              name: `** ระยะเวลา **`,
              value: ` \`${queue.formattedCurrentTime}/${song.formattedDuration} \``,
              inline: true,
            },
            {
              name: `** การร้องขอจาก **`,
              value: ` \`${song.user.tag} \``,
              inline: true,
            },
            {
              name: `** ผู้เขียน **`,
              value: ` \`${song.uploader.name}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(interaction.user)),
      ],
    });
  },
};
