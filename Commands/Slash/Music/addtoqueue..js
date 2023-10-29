const {
  ContextMenuInteraction,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "เพิ่มคิว",
  type: ApplicationCommandType.Message,

  /**
   *
   * @param {JUGNU} client
   * @param {ContextMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    // Code
    let msg = await interaction.channel.messages.fetch(interaction.targetId);
    let song =
      msg.cleanContent || msg.embeds[0].description || msg.embeds[0].title;
    let voiceChannel = interaction.member.voice.channel;
    let botChannel = interaction.guild.members.me.voice.channel;
    if (!msg || !song) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} ไม่พบเพลงครับ`
      );
    } else if (!voiceChannel) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} พี่ๆต้องเข้าร่วมช่องเสียงก่อนครับ`
      );
    } else if (botChannel && !botChannel?.equals(voiceChannel)) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} พี่ๆต้องเข้าร่วมช่องเสียงก่อนครับ ${botChannel} ช่องเสียง`
      );
    } else {
      client.distube.play(voiceChannel, song, {
        member: interaction.member,
        textChannel: interaction.channel,
      });
      return client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} กำลังค้นหา \`${song}\` ในจักรวาลนี้อยู่ครับกรุณารอสักครู่...`
      );
    }
  },
};
