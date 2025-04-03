import {
  Client,
  GatewayIntentBits,
  Partials,
  ApplicationCommandOptionType,
  Events,
  time,
  TimestampStyles,
} from "discord.js";
import { getSettings } from "./services/settingService.js";
import cron from "node-cron";
import {
  getUserProfile,
  isDifferenceGreaterThanMonths,
  matchYoutubeUrl,
} from "./utils/utils.js";
import { findOne, getMembersRankingData } from "./services/memberService.js";
import { getByGameName } from "./interactions/getByGameName.js";
import { closeTicket } from "./interactions/closeTicket.js";
import { getRegister } from "./interactions/getRegister.js";
import { getStatus } from "./interactions/getStatus.js";
import { vote } from "./interactions/vote.js";
import { submitVote } from "./interactions/submitVote.js";
import { setPoints } from "./interactions/setPoints.js";
import { submitRegisterBf2 } from "./modal-submit/submitRegisterBf2.js";
import { submitRegister } from "./modal-submit/submitRegister.js";
import { linkAnotherAccount } from "./interactions/linkAnotherAccount.js";
import { denyLinkAnotherAccount } from "./interactions/denyLinkAnotherAccount.js";
import { registerBf2 } from "./interactions/registerBf2.js";
import { myStatus } from "./interactions/myStatus.js";
import { YES_EMOJI } from "./emojies/emojies.js";
import { hasReachedVotes } from "./utils/hasReachedVotes.js";
import { updateNicks } from "./interactions/updateNicks.js";
import { strikeMember } from "./interactions/strikeMember.js";
import { getMemberStrikes } from "./interactions/getMemberStrikes.js";
import { getAllActiveStrikes } from "./services/strikeService.js";
import { getDogfightRoles } from "./interactions/getDogfightRoles.js";
import { fetchDogfightServersBF2042 } from "./utils/fetchDogfightServersBF2042.js";
import { getRequiredPoints } from "./interactions/getRequiredPoints.js";
import { generateMemberTable } from "./UI/rankingPlate.js";
import { updateMyGameName } from "./interactions/updateMyGameName.js";
import { fetchBfvServers } from "./utils/fetchBfvServers.js";
import { isAccountAlreadyLinked } from "./utils/isAccountAlreadyLinked.js";
import { register } from "./interactions/register.js";
import { subLinkAlt } from "./modal-submit/subLinkAlt.js";
import { muteUser } from "./interactions/mute.js";
import { unmuteUser } from "./interactions/unmute.js";
import { Invite } from "./schemas/invite.js";
import { openTicket } from "./interactions/openTicket.js";
import { getMessageSnippet } from "./interactions/messageSnippet.js";
import { getApplication } from "./interactions/getApplication.js";
import { TicketsLog } from "./schemas/ticketLog.js";
import { getTicketLogEmbed } from "./UI/embeds/ticketLogEmbed.js";
import dayjs from "dayjs";

export const client = async () => {
  const settings = await getSettings();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildInvites,
    ],
    partials: [Partials.User, Partials.Reaction, Partials.Message],
  });

  client
    .login(process.env.DISCORD_TOKEN)
    .then(() => console.log("connected the bot"))
    .catch((err) => console.log(err));

  client.on(Events.ClientReady, async () => {
    if (settings.length === 0) return;

    console.log(`Logged in as ${client.user.tag}!`);
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    // send a msg to a channel so I know the server started
    try {
      const channel = await guild.channels.fetch("548861917431726091");
      await channel.send("Server started");
    } catch (error) {
      console.log(error);
    }

    let commands;
    if (guild) {
      commands = guild.commands;
    } else {
      commands = client?.application.commands;
    }

    // Fetch invites for the guild and store them in MongoDB
    // try {
    //   const guildInvites = await guild.invites.fetch();

    //   for await (const invite of guildInvites.values()) {
    //     const existingInvite = await Invite.findOne({
    //       inviteCode: invite?.code,
    //     });
    //     if (existingInvite) {
    //       existingInvite.uses = invite?.uses;
    //       await existingInvite?.save();
    //     } else {
    //       await Invite.create({
    //         inviteCode: invite?.code,
    //         uses: invite?.uses,
    //         inviter: invite?.inviter?.id,
    //       });
    //     }
    //   }
    //   console.log("Guild invites have been cached.");
    // } catch (error) {
    //   console.error("Error fetching invites:", error);
    // }

    // try {
    //   const channelId = "548861917431726091";
    //   const channel = guild.channels.cache.get(channelId);
    //   const invites = await Invite.find();
    //   for await (const invite of invites) {
    //     const message = `${invite.uses} uses by invite code ${invite.code}, created by <@${invite.inviter}>`;
    //     await channel.send(message);
    //   }
    // } catch (error) {
    //   console.error("Error fetching invites:", error);
    // }

    commands?.create({
      name: "vote",
      description: "vote for user",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user to vote for",
          type: ApplicationCommandOptionType.User,
        },
      ],
    });

    commands?.create({
      name: "mute",
      description: "temporarly mutes a user",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user to mute",
          type: ApplicationCommandOptionType.User,
        },
      ],
    });

    commands?.create({
      name: "unmute",
      description: "unmute a user",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user to mute",
          type: ApplicationCommandOptionType.User,
        },
      ],
    });
    commands?.create({
      name: "mystatus",
      description: "check your status",
    });

    commands?.create({
      name: "updatenicks",
      description:
        "Does a api call to get users latest nickname for each user in the database.",
    });
    commands?.create({
      name: "updatemygamename",
      description:
        "Checks your latest game name and updates it in the database.",
    });

    commands?.create({
      name: "myvoters",
      description: "shows the people that voted for you.",
    });
    commands?.create({
      name: "addme",
      description: "test",
    });
    commands?.create({
      name: "applicationembed",
      description: "get the application embed",
    });

    commands?.create({
      name: "getstatus",
      description: "get user status plate",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user to get the status",
          type: ApplicationCommandOptionType.User,
        },
      ],
    });

    commands?.create({
      name: "strike",
      description: "Strike a member",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user",
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "degree",
          required: true,
          description: "Degree of the strike",
          type: ApplicationCommandOptionType.Number,
        },
        {
          name: "reason",
          required: true,
          description: "Reason for the strike",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });

    commands?.create({
      name: "tag",
      description: "send a message snippet",
      options: [
        {
          name: "id",
          required: true,
          description: "username of the user",
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: "qa",
              value: "qa",
            },
            {
              name: "nick",
              value: "nick",
            },
            {
              name: "go",
              value: "go",
            },
          ],
        },
      ],
    });

    commands?.create({
      name: "getmemberstrikes",
      description: "Get member strikes",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user",
          type: ApplicationCommandOptionType.User,
        },
      ],
    });
    commands?.create({
      name: "getregister",
      description: "get register button",
    });

    commands?.create({
      name: "getdogfightroles",
      description: "returns the dogfight roles embeds",
    });
    commands?.create({
      name: "getbygamename",
      description: "get user status plate",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user to get the status",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "game",
          required: true,
          description: "game name of the user to get the status",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "platform",
          required: true,
          description: "platform of the user to get the status",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    commands?.create({
      name: "setpoints",
      description: "set required points",
      options: [
        {
          name: "points",
          required: true,
          description: "enter the required points",
          type: ApplicationCommandOptionType.Number,
        },
      ],
    });
    commands?.create({
      name: "requiredpoints",
      description: "preview required points",
    });
    commands?.create({
      name: "closeticket",
      description: "delete current channel",
      options: [
        {
          name: "reason",
          required: true,
          description: "reason for closing the ticket",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });

    commands?.create({
      name: "ranking",
      description: "Lists players ranking",
    });

    // send dogfight data to specific channel
    const bf2042Channel = await guild.channels.fetch(settings[0].bf2042Channel);
    const bfvChannel = await guild.channels.fetch(settings[0].bfvChannel);

    cron.schedule("*/2 * * * *", async () => {
      await fetchDogfightServersBF2042(bf2042Channel);
    });
    cron.schedule("*/1 * * * *", async () => {
      await fetchBfvServers(bfvChannel);
    });
  });
  // discordModals(client);

  client.on(Events.MessageCreate, async (msg) => {
    if (settings.length === 0) return;

    // add msg logs to ticket channel

    if (!msg.author.bot) {
      if (
        msg.channel.parentId === settings[0].ticketsParentId &&
        msg.channel.name !== "transcripts"
      ) {
        const ticket = await TicketsLog.findOne({ ticketId: msg.channel.id });
        if (ticket) {
          ticket.messages.push({
            message: msg.content,
            attachments: msg.attachments.map((el) => el.url),
            sender: msg.author.id,
            sentAt: new Date(),
          });
          await ticket.save();
        }
      }
    }
    const user = await findOne(msg.author.id);
    if (!user) return;

    //Checking the strikes

    const strikes = await getAllActiveStrikes();

    if (strikes && strikes.length > 0) {
      const todaysDate = new Date();
      strikes.forEach(async (strike) => {
        if (strike.status === "active") {
          if (strike.degree === 1) {
            if (
              isDifferenceGreaterThanMonths(
                todaysDate,
                new Date(strike.createdAt),
                3
              )
            ) {
              strike.status = "resolved";
              await strike.save();
              await msg.member.roles
                .remove(settings[0].strikeOne)
                .catch((err) => {
                  console.log("Error" + err);
                });
            }
          } else if (strike.degree === 2) {
            if (
              isDifferenceGreaterThanMonths(
                todaysDate,
                new Date(strike.createdAt),
                6
              )
            ) {
              strike.status = "resolved";
              await strike.save();
              await msg.member.roles
                .remove(settings[0].strikeTwo)
                .catch((err) => {
                  console.log("Error" + err);
                });
            }
          }
        }
      });
    }

    if (user) {
      user.msgContribution += settings[0].msgValue;
      if (user.msgContribution >= 1) {
        user.msgContribution = 0;
        user.contribution += 1;
      }

      if (
        msg.channelId === settings[0].contentCreatorsId &&
        matchYoutubeUrl(msg.content)
      ) {
        user.contentContribution += settings[0].contentValue;
        if (user.contentContribution >= 1) {
          user.contentContribution = 0;
          user.contribution += 1;
        }
      }
      await user.save();
      await hasReachedVotes(user, settings, client, msg.member);
    }

    if (msg.mentions?.roles?.first()) {
      if (
        [
          settings[0].pcBfv,
          settings[0].pcBf1,
          settings[0].pcBf4,
          settings[0].ps4Bfv,
          settings[0].ps4Bf1,
          settings[0].ps4Bf4,
          settings[0].xboxBfv,
          settings[0].xboxBf1,
          settings[0].xboxBf4,
          settings[0].allBf2042,
        ].includes(msg.mentions.roles.first().id) &&
        msg.channelId?.toString() === settings[0].dogfightChannelId?.toString()
      ) {
        // update usernames
        // const user = await findOne(msg.author.id);
        // const gameProfile = await getUserProfile(user.userNames[0], user.platforms[0], );
        // console.log(user);

        const botMsg = await msg.reply(
          `Please only react if you going to participate in the dogfight, after 2 hours from this ping, you cannot react. \n - ${user.userNames[0]} \n`
        );
        await botMsg.react(YES_EMOJI);
      }
    }
    //we dont want messages from the bot

    if (msg.author.bot) return;

    // in case you are very bored

    if (msg.content.toLowerCase() === "who is the best pilot in the universe") {
      return msg.reply("wyter0se");
    }
    if (
      msg.content.toLowerCase() ===
      "who lies about who is the worst pilot in the universe"
    ) {
      return msg.reply("MrIcePops");
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    // return null if the interaction is from the modal submit
    // this should be removed
    // send a msg to a channel so I know the server started
    if (!["mystatus", "ranking"].includes(interaction.commandName)) {
      try {
        const channel = await interaction.guild.channels.fetch(
          "548861917431726091"
        );
        await channel.send(
          `Interaction: ${interaction.commandName} by ${
            interaction.user.tag
          } used at ${time(Date.now(), TimestampStyles.LongDateTime)} `
        );
      } catch (error) {
        console.log(error);
      }
    }
    if (
      !["wantToRegister", "registerButton"].includes(interaction.customId) &&
      ![
        "mystatus",
        "getregister",
        "getdogfightroles",
        "ranking",
        "tag",
        "applicationembed",
      ].includes(interaction.commandName)
    )
      await interaction.deferReply({ ephemeral: true });

    if (interaction.commandName === "mystatus") {
      await interaction.deferReply();
      await myStatus(interaction, settings);
    } else if (interaction.commandName === "addme") {
      try {
        const guild = await client.guilds?.cache.get(process.env.GUILD_ID);
        const role = await guild.roles.cache.find((role) => {
          return role.name === "@everyone";
        });
        const mod = await guild.roles.cache.find((role) => {
          return role.id === "548861871013494784";
        });
        await guild.channels.create("test", {
          parent: settings[0].ticketsParentId,
          permissionOverwrites: [
            {
              id: role?.id,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: interaction.user.id,
              allow: ["VIEW_CHANNEL"],
            },
            {
              id: mod?.id,
              allow: ["VIEW_CHANNEL"],
            },
          ],
        });
        return await interaction.editReply("ok");
      } catch (error) {
        console.log(error);
      }
    } else if (interaction.commandName === "getdogfightroles") {
      await getDogfightRoles(interaction, settings, client);
    } else if (interaction.commandName === "mute") {
      await muteUser(interaction, settings);
    } else if (interaction.commandName === "unmute") {
      await unmuteUser(interaction, settings);
    } else if (interaction.commandName === "getbygamename") {
      await getByGameName(interaction, settings);
    } else if (interaction.commandName === "strike") {
      await strikeMember(interaction, settings);
    } else if (interaction.commandName === "getmemberstrikes") {
      await getMemberStrikes(interaction, settings);
    } else if (interaction.commandName === "updatenicks") {
      await updateNicks(interaction, settings);
    } else if (interaction.commandName === "updatemygamename") {
      await updateMyGameName(interaction);
    } else if (interaction.commandName === "closeticket") {
      await closeTicket(interaction, settings);
    } else if (interaction.commandName === "tag") {
      await interaction.deferReply();
      await getMessageSnippet(interaction, settings);
    } else if (interaction.commandName === "applicationembed") {
      await interaction.deferReply();
      await getApplication(interaction, settings);
    } else if (interaction.commandName === "getregister") {
      await interaction.deferReply();
      await getRegister(interaction, settings);
    } else if (interaction.commandName === "ranking") {
      await interaction.deferReply();
      try {
        const membersData = await getMembersRankingData();

        const attachment = await generateMemberTable(
          membersData.map((el) => {
            return {
              name: el._id,
              avatar: el.avatar,
              username: el.userNames[0],
              totalPoints: el.totalVotes,
            };
          })
        );

        await interaction.editReply({
          files: [attachment],
        });
      } catch (error) {
        await interaction.editReply(error.toString());
      }
    } else if (interaction.commandName === "requiredpoints") {
      getRequiredPoints(interaction, settings);
    } else if (interaction.commandName === "getstatus") {
      await getStatus(interaction, settings);
    } else if (interaction.commandName === "myvoters") {
      return await interaction.editReply({
        content: "I lied, not gonna tell you.",
        ephemeral: true,
      });
    } else if (interaction.commandName === "vote") {
      await vote(interaction, settings);
    } else if (interaction.commandName === "setpoints") {
      await setPoints(interaction, settings);
    } else if (
      ["personalityId", "contributionId", "skillsId"].includes(
        interaction.customId?.split("-")[0]
      )
    ) {
      await submitVote(interaction, settings, client);
    } else if (interaction.customId === "wantToRegister") {
      await linkAnotherAccount(interaction, client);
    } else if (interaction.customId === "refuseToRegister") {
      await denyLinkAnotherAccount(interaction, settings);
    } else if (interaction.customId === "registerButton") {
      await register(interaction, client);
    } else if (interaction.customId === "registerBf2") {
      await registerBf2(interaction, client);
    } else if (interaction.customId === "open-ticket") {
      await openTicket(interaction, settings, client);
    }

    // ------------ Modal Submit ------------------------------

    // this is for the dropdowns we will use it when mobile app is updated
    // let gameVal = await modal.getSelectMenuValues("gameVal");
    // const gameNameVal = await modal.getTextInputValue("gameNameVal");
    // let platformVal = await modal.getSelectMenuValues("platformVal");
    // if (platformVal?.length > 0) platformVal = platformVal[0];
    // if (gameVal?.length > 0) gameVal = gameVal[0];

    if (!interaction.isModalSubmit()) return;

    const gameVal = interaction.fields.getTextInputValue("gameVal");
    const gameNameVal = interaction.fields.getTextInputValue("gameNameVal");
    const platformVal = interaction.fields.getTextInputValue("platformVal");

    if (interaction.customId === "bf2Modal") {
      await submitRegisterBf2(interaction, settings);
    } else if (
      ["registerModal", "linkAnotherAccount"].includes(interaction.customId)
    ) {
      console.log("here");
      if (
        !["bfv", "bf1", "bf4", "bf3", "bf2042"].includes(
          gameVal?.toLowerCase()?.trim()
        )
      )
        return await interaction.editReply({
          content: "Please try again and enter correct game",

          ephemeral: true,
        });

      if (
        !["pc", "ps4", "ps3", "xbox360", "xboxone"].includes(
          platformVal?.toLowerCase()?.trim()
        )
      )
        return await interaction.editReply({
          content: "Please try again and enter correct platform",

          ephemeral: true,
        });
      try {
        const returnedMember = await getUserProfile(
          gameVal,
          gameNameVal,
          platformVal
        );
        if (returnedMember?.data?.id) {
          // we check if this account is linked by someone else already
          if (await isAccountAlreadyLinked(returnedMember, interaction)) {
            return await interaction.editReply({
              content: "This account is already linked",
            });
          }
          if (interaction.customId === "registerModal") {
            await submitRegister(
              interaction,
              settings,
              returnedMember,
              client,
              platformVal,
              gameVal
            );
          } else if (interaction.customId === "linkAnotherAccount") {
            await subLinkAlt(interaction, returnedMember, platformVal);
            // }
            // show them their plate here
          }
        } else {
          return await interaction.editReply({
            content: "game profile not found",

            ephemeral: true,
          });
        }
      } catch (error) {
        return await interaction.editReply({
          content: "profile not found",

          ephemeral: true,
        });
      }
    }
  });
  // client.on("modalSubmit", async (modal) => {});

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;
    const { guild } = reaction.message;
    const discordUser = guild.members.cache.find(
      (member) => member.id === user.id
    );

    // dogfight roles
    if (
      ["bf4", "bfv", "bf1", "bf2042", "dcs"].includes(
        reaction.emoji.name?.trim()?.toLowerCase()
      )
    ) {
      const { guild } = reaction.message;
      const msg = await reaction.message.fetch();
      if (msg.author.id !== settings[0].botId) return;
      const member = guild.members.cache.find(
        (member) => member.id === user.id
      );
      const title = msg.embeds[0].data.title.toLowerCase();
      // dogfight roles

      if (msg.channelId === settings[0].dogfightRolesChannelId) {
        if (title.includes("pc")) {
          if (reaction.emoji.name?.trim().toLowerCase() === "bf4") {
            member.roles.add(settings[0].pcBf4).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bfv") {
            console.log("here");
            member.roles.add(settings[0].pcBfv).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf1") {
            member.roles.add(settings[0].pcBf1).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf2042") {
            member.roles.add(settings[0].allBf2042).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "dcs") {
            member.roles.add(settings[0].dcsPc).catch((err) => {
              console.log("Error" + err);
            });
          }
        } else if (title.includes("xbox")) {
          if (reaction.emoji.name?.trim().toLowerCase() === "bf4") {
            member.roles.add(settings[0].xboxBf4).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bfv") {
            member.roles.add(settings[0].xboxBfv).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf1") {
            member.roles.add(settings[0].xboxBf1).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf2042") {
            member.roles.add(settings[0].allBf2042).catch((err) => {
              console.log("Error" + err);
            });
          }
        } else if (title.includes("playstation")) {
          if (reaction.emoji.name?.trim().toLowerCase() === "bf4") {
            member.roles.add(settings[0].ps4Bf4).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bfv") {
            member.roles.add(settings[0].ps4Bfv).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf1") {
            member.roles.add(settings[0].ps4Bf1).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf2042") {
            member.roles.add(settings[0].allBf2042).catch((err) => {
              console.log("Error" + err);
            });
          }
        }
      }
    }

    const msg = await reaction.message.fetch();

    const dateNow = new Date();
    const isDogfightChannel =
      settings[0].dogfightChannelId?.toString() ===
      reaction.message.channelId?.toString();
    const msgIncludesDfPing = msg.content?.includes(
      "Please only react if you going to participate in the dogfight, after 2 hours from this ping, you cannot react."
    );

    if (
      reaction.emoji.name === YES_EMOJI &&
      isDogfightChannel &&
      msgIncludesDfPing
    ) {
      if (msg.author.id !== settings[0].botId) return;
      const msgTime = reaction.message.createdAt;
      if (dateNow.getDay() === msgTime.getDay()) {
        if (dateNow.getHours() - msgTime.getHours() <= 2) {
          const member = await findOne(user.id);

          const askedForDf = msg.content.includes(member.userNames[0]);
          const gotPoints = msg.content.includes("**");
          if (member && !askedForDf) {
            const mainUser = await findOne(
              reaction.message.mentions?.repliedUser?.id
            );
            if (!gotPoints) {
              mainUser.rolePingContribution += settings[0].rolePingValue;
              await msg.edit(`${msg.content} **`);
              mainUser.rolePingContribution += settings[0].rolePingValue;
              await mainUser.save();
              if (mainUser.rolePingContribution >= 1) {
                mainUser.rolePingContribution = 0;
                mainUser.skills += 1;
                await mainUser.save();
                // await hasReachedVotes(mainUser, settings, client, discordUser);
              }
            }
            member.dfReactionContribution += settings[0].dfReactionValue;

            if (member.dfReactionContribution >= 1) {
              member.dfReactionContribution = 0;
              member.skills += 1;
            }
            if (!msg.content.toString().includes(member.userNames[0])) {
              await msg.edit(`${msg.content} \n - ${member.userNames[0]} \n`);
            }
            await member.save();
            // await hasReachedVotes(member, settings, client, discordUser);
          }
        }
      }
    }
  });
  client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (user.bot) return;
    const dateNow = new Date();
    if (
      ["bf4", "bfv", "bf1", "bf2042", "dcs"].includes(
        reaction.emoji.name?.trim()?.toLowerCase()
      )
    ) {
      const { guild } = reaction.message;
      const msg = await reaction.message.fetch();
      if (msg.author.id !== settings[0].botId) return;

      const member = guild.members.cache.find(
        (member) => member.id === user.id
      );
      const title = msg.embeds[0].data.title.toLowerCase();
      // dogfight roles
      if (msg.channelId === settings[0].dogfightRolesChannelId) {
        if (title.includes("pc")) {
          if (reaction.emoji.name?.trim().toLowerCase() === "bf4") {
            member.roles.remove(settings[0].pcBf4).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bfv") {
            member.roles.remove(settings[0].pcBfv).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf1") {
            member.roles.remove(settings[0].pcBf1).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf2042") {
            member.roles.remove(settings[0].allBf2042).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "dcs") {
            member.roles.remove(settings[0].dcsPc).catch((err) => {
              console.log("Error" + err);
            });
          }
        } else if (title.includes("xbox")) {
          if (reaction.emoji.name?.trim().toLowerCase() === "bf4") {
            member.roles.remove(settings[0].xboxBf4).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bfv") {
            member.roles.remove(settings[0].xboxBfv).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf1") {
            member.roles.remove(settings[0].xboxBf1).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf2042") {
            member.roles.remove(settings[0].allBf2042).catch((err) => {
              console.log("Error" + err);
            });
          }
        } else if (title.includes("playstation")) {
          if (reaction.emoji.name?.trim().toLowerCase() === "bf4") {
            member.roles.remove(settings[0].ps4Bf4).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bfv") {
            member.roles.remove(settings[0].ps4Bfv).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf1") {
            member.roles.remove(settings[0].ps4Bf1).catch((err) => {
              console.log("Error" + err);
            });
          } else if (reaction.emoji.name?.trim().toLowerCase() === "bf2042") {
            member.roles.remove(settings[0].allBf2042).catch((err) => {
              console.log("Error" + err);
            });
          }
        }
      }
    }

    const msg = await reaction.message.fetch();

    const isDogfightChannel =
      settings[0].dogfightChannelId?.toString() ===
      reaction.message.channelId?.toString();
    const msgIncludesDfPing = msg.content?.includes(
      "Please only react if you going to participate in the dogfight, after 2 hours from this ping, you cannot react."
    );

    if (
      reaction.emoji.name === YES_EMOJI &&
      isDogfightChannel &&
      msgIncludesDfPing
    ) {
      if (msg.author.id !== settings[0].botId) return;
      const msgTime = reaction.message.createdAt;
      if (dateNow.getDay() === msgTime.getDay()) {
        if (dateNow.getHours() - msgTime.getHours() <= 2) {
          const msg = await reaction.message.fetch();
          const member = await findOne(user.id);

          const askedForDf = msg.content?.includes(member.userNames[0]);
          if (member && !askedForDf) {
            member.dfReactionContribution -= settings[0].dfReactionValue;
            if (member.dfReactionContribution <= 0.2) {
              member.dfReactionContribution = 0;
              member.skills -= 1;
            }
            if (msg.content.toString()?.includes(member.userNames[0])) {
              await msg.edit(
                msg.content.replace(` - ${member.userNames[0]}`, "")
              );
            }
            await member.save();
          }
        }
      }
    }
  });

  // client.on(Events.GuildMemberAdd, async (member) => {
  //   try {
  //     const channelId = "548861917431726091";
  //     const channel = member.guild.channels.cache.get(channelId);
  //     const newInvites = await member.guild.invites.fetch();

  //     for await (const invite of newInvites.values()) {
  //       const storedInvite = await Invite.findOne({
  //         inviteCode: invite.code,
  //       });
  //       if (storedInvite && invite.uses > storedInvite.uses) {
  //         const message = `${member.user.tag} joined using invite code ${invite.code}, created by <@${storedInvite.inviter}>`;

  //         await channel.send(message);

  //         storedInvite.uses = invite.uses;
  //         await storedInvite.save();
  //         break;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error tracking invite usage:", error);
  //   }
  // });

  client.on(Events.ChannelDelete, async (channel) => {
    const guild = channel.guild;

    const transcriptsChannel = await guild.channels.fetch(
      settings[0].transcriptsChannel
    );

    if (!settings[0].transcriptsChannel) return;

    const ticket = await TicketsLog.findOne({
      ticketId: channel.id,
    });

    if (!transcriptsChannel) return;
    const transcriptData = ticket?.messages
      .map((msg) => {
        const sender = guild.members.cache?.get(msg?.sender)?.user?.tag;
        return `[${
          msg.sentAt
            ? dayjs(msg?.sentAt).format("DD/MM/YYYY HH:mm:ss")
            : "Unknown Date"
        }] ${sender}: ${msg?.message}${
          msg?.attachments?.length
            ? ` (Attachments: ${msg?.attachments?.join(", ")})`
            : ""
        }`;
      })
      .join("\n");

    // Create a buffer from the text data
    const transcriptBuffer = Buffer.from(transcriptData, "utf-8");

    await transcriptsChannel.send({
      content: `--------------------------------------------\n**Transcript for ${channel?.name}**`,
      embeds: [
        getTicketLogEmbed(
          channel?.name,
          ticket?.openedBy,
          dayjs(ticket?.openedAt).format("DD/MM/YYYY HH:mm:ss"),
          ticket?.closedBy,
          dayjs(ticket?.closedAt).format("DD/MM/YYYY HH:mm:ss"),
          ticket?.closedReason
        ),
      ],
      files: [
        {
          attachment: transcriptBuffer,
          name: `${channel.name}-transcript.txt`,
        },
      ],
    });
  });
};
