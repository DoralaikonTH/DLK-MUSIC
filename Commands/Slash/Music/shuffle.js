const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "สับเปลี่ยน",
  description: `สลับคิวสุ่ม / เลิกสุ่ม`,
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
      name: "โหมด",
      description: `เลือกคิวสุ่ม/ยกเลิกการสุ่ม`,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: `การสุ่ม`,
          value: `ใช่`,
        },
        {
          name: `ยกเลิกการสุ่ม`,
          value: `ไม่`,
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
    let โหมด = interaction.options.get("โหมด")?.value;
    if (โหมด === "ใช่") {
      client.shuffleData.set(`shuffle-${queue.id}`, queue.songs.slice(1));
      queue.shuffle();
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} สุ่ม ${queue.songs.length} เพลง !!`
      );
    } else if (โหมด === "ไม่") {
      if (!client.shuffleData.has(`shuffle-${queue.id}`)) {
        return client.embed(
          interaction,
          `${client.config.emoji.ERROR} ไม่พบคิวสุ่ม !!`
        );
      } else {
        const shuffleData = client.shuffleData.get(`shuffle-${queue.id}`);
        queue.songs = [queue.songs[0], ...shuffleData];
        client.shuffleData.delete(`shuffle-${queue.id}`);
        client.embed(
          interaction,
          `${client.config.emoji.SUCCESS} ไม่สุ่ม ${queue.songs.length} เพลง !!`
        );
      }
    }
  },
};
