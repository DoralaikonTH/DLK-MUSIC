const JUGNU = require("./Client");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  Message,
  CommandInteraction,
} = require("discord.js");
const { Queue } = require("distube");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // code
  /**
   *
   * @param {Queue} queue
   */
  client.buttons = (state) => {
    let raw = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("skip")
        .setLabel("ข้าม")
        .setEmoji(client.config.emoji.skip)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("pauseresume")
        .setLabel("หยุดชั่วคราว")
        .setEmoji(client.config.emoji.pause_resume)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("loop")
        .setLabel("วนซ้ำ")
        .setEmoji(client.config.emoji.loop)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("stop")
        .setLabel("หยุด")
        .setEmoji(client.config.emoji.stop)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("autoplay")
        .setLabel("เล่นอัตโนมัติ")
        .setEmoji(client.config.emoji.autoplay)
        .setDisabled(state),
    ]);
    return raw;
  };

  client.editPlayerMessage = async (channel) => {
    let ID = client.temp.get(channel.guild.id);
    if (!ID) return;
    let playembed = channel.messages.cache.get(ID);
    if (!playembed) {
      playembed = await channel.messages.fetch(ID).catch((e) => {});
    }
    if (!playembed) return;
    if (client.config.options.nowplayingMsg == true) {
      playembed.delete().catch((e) => {});
    } else {
      let embeds = playembed?.embeds ? playembed?.embeds[0] : null;
      if (embeds) {
        playembed
          ?.edit({
            embeds: [
              embeds.setFooter({
                text: `⛔️ เพลง & คิว สิ้นสุดแล้ว!`,
                iconURL: channel.guild.iconURL({ dynamic: true }),
              }),
            ],
            components: [client.buttons(true)],
          })
          .catch((e) => {});
      }
    }
  };

  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.getQueueEmbeds = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    let quelist = [];
    var maxTracks = 100; //tracks / Queue Page
    let tracks = queue.songs;
    for (let i = 0; i < tracks.length; i += maxTracks) {
      let songs = tracks.slice(i, i + maxTracks);
      quelist.push(
        songs
          .map(
            (track, index) =>
              `\` ${i + ++index}. \` ** ${track.name.substring(0, 35)}** - \`${
                track.isLive
                  ? `สตรีมสด`
                  : track.formattedDuration.split(` | `)[0]
              }\` \`${track.user.tag}\``
          )
          .join(`\n`)
      );
    }
    let limit = quelist.length <= 5 ? quelist.length : 5;
    let embeds = [];
    for (let i = 0; i < quelist.length; i++) {
      let desc = String(quelist[i]).substring(0, 2048);
      await embeds.push(
        new EmbedBuilder()
          .setAuthor({
            name: `คิวสำหรับ ${guild.name}  -  [ ${tracks.length} รายการ ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .addFields([
            {
              name: `**\` N. \` *${
                tracks.length > maxTracks
                  ? tracks.length - maxTracks
                  : tracks.length
              } เพลงอื่นๆ ...***`,
              value: `\u200b`,
            },
            {
              name: `**\` 0. \` __เพลงปัจจุบัน__**`,
              value: `**${queue.songs[0].name.substring(0, 35)}** - \`${
                queue.songs[0].isLive
                  ? `สตรีมสด`
                  : queue.songs[0].formattedDuration.split(` | `)[0]
              }\` \`${queue.songs[0].user.tag}\``,
            },
          ])
          .setColor(client.config.embed.color)
          .setDescription(desc)
      );
    }
    return embeds;
  };

  client.status = (queue) =>
    `ระดับเสียง: ${queue.volume}% • สถานะ : ${
      queue.paused ? "Paused" : "Playing"
    } • วนซ้ำ:  ${
      queue.repeatMode === 2 ? `คิว` : queue.repeatMode === 1 ? `เพลง` : `ปิด`
    } •  เล่นอัตโนมัติ: ${queue.autoplay ? `เปิด` : `ปิด`} `;

  // embeds
  /**
   *
   * @param {Guild} guild
   */
  client.queueembed = (guild) => {
    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`DLK | คิวเพลง`);
    // .setDescription(`\n\n ** There are \`0\` Songss in Queue ** \n\n`)
    // .setThumbnail(guild.iconURL({ dynamic: true }))
    // .setFooter({
    //   text: guild.name,
    //   iconURL: guild.iconURL({ dynamic: true }),
    // });
    return embed;
  };

  /**
   *
   * @param {Guild} guild
   */
  client.playembed = (guild) => {
    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      // .setTitle(`Join a Voice Channel and Type Song Link/Name to Play`)
      .setAuthor({
        name: `เข้าร่วมช่องเสียงและพิมพ์ลิงก์เพลง/ชื่อที่จะเล่น`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        ` [เชิญเลย](${client.config.links.inviteURL}) • [เซิร์ฟเวอร์สนับสนุน](${client.config.links.DiscordServer}) • [เว็บไซต์](${client.config.links.Website})`
      )
      .setImage(
        guild.banner
          ? guild.bannerURL({ size: 4096 })
          : `https://media.discordapp.net/attachments/1058718167251288094/1156907853597134888/DLK_MUSIC_BETA_.png?ex=65310be6&is=651e96e6&hm=9560742035bc50366198c151283b212571ec607a4b4a54c7cea9f6eea6f57691&=&width=876&height=657`
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL(),
      });

    return embed;
  };

  /**
   *
   * @param {Client} client
   * @param {Guild} guild
   * @returns
   */
  client.updateembed = async (client, guild) => {
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    // play msg
    let playmsg = musicchannel.messages.cache.get(data.pmsg);
    if (!playmsg) {
      playmsg = await musicchannel.messages.fetch(data.pmsg).catch((e) => {});
    }
    // queue message
    let queuemsg = musicchannel.messages.cache.get(data.qmsg);
    if (!queuemsg) {
      queuemsg = await musicchannel.messages.fetch(data.qmsg).catch((e) => {});
    }
    if (!queuemsg || !playmsg) return;
    await playmsg
      .edit({
        embeds: [client.playembed(guild)],
        components: [client.buttons(true)],
      })
      .then(async (msg) => {
        await queuemsg
          .edit({ embeds: [client.queueembed(guild)] })
          .catch((e) => {});
      })
      .catch((e) => {});
  };

  // update queue
  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.updatequeue = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    if (!guild) return;
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    let queueembed = musicchannel.messages.cache.get(data.qmsg);
    if (!queueembed) {
      queueembed = await musicchannel.messages
        .fetch(data.qmsg)
        .catch((e) => {});
    }
    if (!queueembed) return;
    let currentSong = queue.songs[0];
    let string = queue.songs
      ?.filter((t, i) => i < 10)
      ?.map((track, index) => {
        return `\` ${index + 1}. \` ** ${track.name.substring(0, 35)}** - \`${
          track.isLive ? `สตรีมสด` : track.formattedDuration.split(` | `)[0]
        }\` \`${track.user.tag}\``;
      })
      ?.reverse()
      .join("\n");
    queueembed.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `DLKคิว  -  [ ${queue.songs.length} รายการ ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(string.substring(0, 2048))
          .addFields([
            {
              name: `**\` 0. \`__เพลงที่กำลังเล่นอยู่ตอนนี้__**`,
              value: `**${currentSong.name.substring(0, 35)}** - \`${
                currentSong.isLive
                  ? `สตรีมสด`
                  : currentSong.formattedDuration.split(` | `)[0]
              }\` \`${currentSong.user.tag}\``,
            },
          ])
          .setFooter({
            text: guild.name,
            iconURL: guild.iconURL({ dynamic: true }),
          }),
      ],
    });
  };
  // update player
  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.updateplayer = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    if (!guild) return;
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    let playembed = musicchannel.messages.cache.get(data.pmsg);
    if (!playembed) {
      playembed = await musicchannel.messages.fetch(data.pmsg).catch((e) => {});
    }
    if (!playembed || !playembed.id) return;
    let track = queue.songs[0];
    if (!track.name) queue.stop();
    playembed.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setImage(track.thumbnail)
          .setTitle(track?.name)
          .setURL(track.url)
          .addFields([
            {
              name: `** ผู้ขอเพลง **`,
              value: `\`${track.user.tag}\``,
              inline: true,
            },
            {
              name: `** ศิลปิน **`,
              value: `\`${track.uploader.name || "😏"}\``,
              inline: true,
            },
            {
              name: `** ระยะเวลา **`,
              value: `\`${track.formattedDuration}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(track.user)),
      ],
      components: [client.buttons(false)],
    });
  };

  client.joinVoiceChannel = async (guild) => {
    let db = await client.music?.get(`${guild.id}.vc`);
    if (!db?.enable) return;
    if (!guild.members.me.permissions.has(PermissionFlagsBits.Connect)) return;
    let voiceChannel = guild.channels.cache.get(db.channel);
    setTimeout(() => {
      client.distube.voices.join(voiceChannel);
    }, 2000);
  };
  /**
   *
   * @param {CommandInteraction} interaction
   */
  client.handleHelpSystem = async (interaction) => {
    // code
    const send = interaction?.deferred
      ? interaction.followUp.bind(interaction)
      : interaction.reply.bind(interaction);
    const user = interaction.member.user;
    // for commands
    const commands = interaction?.user ? client.commands : client.mcommands;
    // for categories
    const categories = interaction?.user
      ? client.scategories
      : client.mcategories;

    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allcommands = client.mcommands.size;
    let allguilds = client.guilds.cache.size;
    let botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;
    let buttons = [
      new ButtonBuilder()
        .setCustomId("home")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🏘️"),
      categories
        .map((cat) => {
          return new ButtonBuilder()
            .setCustomId(cat)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emoji[cat]);
        })
        .flat(Infinity),
    ].flat(Infinity);
    let row = new ActionRowBuilder().addComponents(buttons);

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(
        `** ระบบเพลงขั้นสูงพร้อมการกรองเสียง ระบบขอเพลงที่ไม่เหมือนใคร และอีกมากมาย! **`
      )
      .addFields([
        {
          name: `Stats`,
          value: `>>> ** :gear: \`${allcommands}\` คำสั่ง \n :file_folder: \`${allguilds}\` Guilds \n ⌚️ ${botuptime} Uptime \n 🏓 \`${client.ws.ping}\` ปิง \n  สร้างโดย [\` Doralaikon_TH \`](https://discord.gg/7G5cPjwGxW) **`,
        },
      ])
      .setFooter(client.getFooter(user));

    let main_msg = await send({
      embeds: [help_embed],
      components: [row],
      ephemeral: true,
    });

    let filter = async (i) => {
      if (i.user.id === user.id) {
        return true;
      } else {
        await i
          .deferReply()
          .then(() => {
            i.followUp({
              content: `ไม่ใช่ปฏิสัมพันธ์ของคุณ !!`,
              ephemeral: true,
            });
          })
          .catch((e) => {});

        return false;
      }
    };
    let colector = await main_msg.createMessageComponentCollector({
      filter: filter,
    });

    colector.on("collect", async (i) => {
      if (i.isButton()) {
        await i.deferUpdate().catch((e) => {});
        let directory = i.customId;
        console.log("CustomId", directory);
        if (directory == "home") {
          main_msg.edit({ embeds: [help_embed] }).catch((e) => {});
        } else {
          main_msg
            .edit({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.embed.color)
                  .setTitle(
                    `${emoji[directory]} ${directory} คำสั่ง ${emoji[directory]}`
                  )
                  .setDescription(
                    `>>> ${commands
                      .filter((cmd) => cmd.category === directory)
                      .map((cmd) => `\`${cmd.name}\``)
                      .join(",  ")}`
                  )
                  .setThumbnail(client.user.displayAvatarURL())
                  .setFooter(client.getFooter(user)),
              ],
            })
            .catch((e) => null);
        }
      }
    });

    colector.on("end", async (c, i) => {
      row.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [row] }).catch((e) => {});
    });
  };
  /**
   *
   * @param {CommandInteraction} interaction
   */
  client.HelpCommand = async (interaction) => {
    const send = interaction?.deferred
      ? interaction.followUp.bind(interaction)
      : interaction.reply.bind(interaction);
    const user = interaction.member.user;
    // for commands
    const commands = interaction?.user ? client.commands : client.mcommands;
    // for categories
    const categories = interaction?.user
      ? client.scategories
      : client.mcategories;

    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allCommands = categories.map((cat) => {
      let cmds = commands
        .filter((cmd) => cmd.category == cat)
        .map((cmd) => `\`${cmd.name}\``)
        .join(" ' ");

      return {
        name: `${emoji[cat]} ${cat}`,
        value: cmds,
      };
    });

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: `คำสั่งของน้องบอทเองครับ`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(allCommands)
      .setFooter(client.getFooter(user));

    send({
      embeds: [help_embed],
    });
  };
};
