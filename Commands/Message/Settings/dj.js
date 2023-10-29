const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ดีเจ",
  aliases: ["การตั้งค่าดีเจ"],
  description: `เปิด/ปิดระบบดีเจ`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    let options = args[0];
    switch (options) {
      case "เปิดใช้งาน":
        {
          let role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);
          if (!role) {
            return client.embed(
              message,
              `${client.config.emoji.ERROR} โปรดระบุรหัสบทบาทหรือการกล่าวถึง`
            );
          } else {
            await client.music.set(`${message.guild.id}.djrole`, role.id);
            client.embed(
              message,
              `${client.config.emoji.SUCCESS} ${role} เพิ่มบทบาทในบทบาทดีเจ`
            );
          }
        }
        break;
      case "ปิดการใช้งาน":
        {
          await client.music.set(`${message.guild.id}.djrole`, null);
          client.embed(
            message,
            `${client.config.emoji.SUCCESS} ระบบดีเจถูกปิดใช้งาน`
          );
        }
        break;
      case "cmds":
        {
          const djcommands = client.mcommands
            .filter((cmd) => cmd?.djOnly)
            .map((cmd) => cmd.name)
            .join(", ");

          client.embed(
            message,
            `**คำสั่งดีเจ** \n \`\`\`js\n${djcommands}\`\`\``
          );
        }
        break;

      default:
        {
          client.embed(
            message,
            `** ${client.config.emoji.ERROR} การใช้งานที่ไม่ถูกต้อง **  \n\n \`${prefix}ดีเจเปิดใช้งาน <@บทบาท>\` \n\n \`${prefix}ดีเจปิดใช้งาน \`  \n\n \`${prefix}ดีเจ cmds\` `
          );
        }
        break;
    }
  },
};
