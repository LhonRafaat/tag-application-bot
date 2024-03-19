import {
  Client,
  GatewayIntentBits,
  Partials,
  ApplicationCommandOptionType,
  Events,
} from "discord.js";
import { getSettings } from "./services/settingService.js";
import {
  getUserProfile,
  isDifferenceGreaterThanMonths,
  matchYoutubeUrl,
} from "./utils/utils.js";
import {
  findAll,
  findOne,
  getMembersRanking,
} from "./services/memberService.js";
import { getRequiredPoints } from "./services/settingService.js";
import { getByGameName } from "./interactions/getByGameName.js";
import { closeTicket } from "./interactions/closeTicket.js";
import { getRegister } from "./interactions/getRegister.js";
import { getStatus } from "./interactions/getStatus.js";
import { vote } from "./interactions/vote.js";
import { submitVote } from "./interactions/submitVote.js";
import { register } from "./interactions/regsiter.js";
import { setPoints } from "./interactions/setPoints.js";
import { submitRegisterBf2 } from "./modal-submit/submitRegisterBf2.js";
import { submitRegister } from "./modal-submit/submitRegister.js";
import { subLinkAlt } from "./modal-submit/SubLinkAlt.js";
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

export const client = async () => {
  const settings = await getSettings();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
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
    let commands;
    if (guild) {
      commands = guild.commands;
    } else {
      commands = client?.application.commands;
    }
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
      name: "mystatus",
      description: "check your status",
    });

    commands?.create({
      name: "updatenicks",
      description:
        "Does a api call to get users latest nickname for each user in the database.",
    });

    commands?.create({
      name: "addme",
      description: "test",
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
    });
  });
  // discordModals(client);

  client.on(Events.MessageCreate, async (msg) => {
    if (settings.length === 0) return;
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
      await hasReachedVotes(user, settings, client);
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
          `Please only react if you going to participate in the dogfight \n - ${user.userNames[0]} \n`
        );
        await botMsg.react(YES_EMOJI);
      }
    }
    //we dont want messages from the bot

    if (msg.author.bot) return;

    // in case you are very bored

    if (msg.content.toLowerCase() === "who is the best pilot in the universe") {
      return msg.reply("LhonXD");
    }
    if (
      msg.content.toLowerCase() ===
      "who lies about who is the worst pilot in the universe"
    ) {
      return msg.reply("MrIcePops");
    }

    if (msg.content.toLowerCase() === "!voteranking") {
      try {
        const members = await getMembersRanking();
        await msg.reply(members);
      } catch (error) {
        console.log(error);
      }
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    // return null if the interaction is from the modal submit

    if (
      !["wantToRegister", "registerButton"].includes(interaction.customId) &&
      !["mystatus", "getregister", "getdogfightroles"].includes(
        interaction.commandName
      )
    )
      await interaction.deferReply({ ephemeral: true });

    if (interaction.commandName === "mystatus") {
      await interaction.deferReply();
      await myStatus(interaction);
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
    } else if (interaction.commandName === "getbygamename") {
      await getByGameName(interaction, settings);
    } else if (interaction.commandName === "strike") {
      await strikeMember(interaction, settings);
    } else if (interaction.commandName === "getmemberstrikes") {
      await getMemberStrikes(interaction, settings);
    } else if (interaction.commandName === "updatenicks") {
      await updateNicks(interaction, settings);
    } else if (interaction.commandName === "closeticket") {
      await closeTicket(interaction, settings);
    } else if (interaction.commandName === "getregister") {
      await interaction.deferReply();
      await getRegister(interaction, settings);
    } else if (interaction.commandName === "requiredpoints") {
      getRequiredPoints(interaction, settings);
    } else if (interaction.commandName === "getstatus") {
      await getStatus(interaction, settings);
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
          let members = await findAll();
          let originIds = [];
          members.map((member) => originIds.push(...member.originIds));
          if (originIds.includes(returnedMember.data?.id)) {
            return await interaction.editReply({
              content: "This account is already linked",

              ephemeral: true,
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

    console.log(reaction.emoji.name);

    // dogfight roles
    if (
      ["bf4", "bfv", "bf1", "bf2042", "dcs"].includes(
        reaction.emoji.name?.trim()?.toLowerCase()
      )
    ) {
      const { guild } = reaction.message;
      const msg = await reaction.message.fetch();
      console.log(msg.author);
      if (msg.author.id !== settings[0].botId) return;
      console.log("hi2");
      const member = guild.members.cache.find(
        (member) => member.id === user.id
      );
      const title = msg.embeds[0].data.title.toLowerCase();
      console.log(title);
      if (title.includes("pc")) {
        if (reaction.emoji.name?.trim().toLowerCase() === "bf4") {
          member.roles.add(settings[0].pcBf4).catch((err) => {
            console.log("Error" + err);
          });
        } else if (reaction.emoji.name?.trim().toLowerCase() === "bfv") {
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

    const dateNow = new Date();
    if (reaction.emoji.name === YES_EMOJI) {
      const msg = await reaction.message.fetch();
      if (msg.author.id !== settings[0].botId) return;
      const msgTime = reaction.message.createdAt;
      if (dateNow.getDay() === msgTime.getDay()) {
        if (dateNow.getHours() - msgTime.getHours() <= 2) {
          const member = await findOne(user.id);
          const askedForDf = msg.content.includes(member?.userNames[0]);
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
                await hasReachedVotes(mainUser, settings, client);
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
            await hasReachedVotes(member, settings, client);
          }
        }
      }
    }
  });
  client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (user.bot) return;
    console.log(reaction.emoji.name.trim().toLowerCase());
    console.log(reaction.emoji.name.trim().toLowerCase() === "bf1");
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
      console.log(member);
      const title = msg.embeds[0].data.title.toLowerCase();
      console.log(title);
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

    if (reaction.emoji.name === YES_EMOJI) {
      const msg = await reaction.message.fetch();
      if (msg.author.id !== settings[0].botId) return;
      const msgTime = reaction.message.createdAt;
      if (dateNow.getDay() === msgTime.getDay()) {
        if (dateNow.getHours() - msgTime.getHours() <= 2) {
          const msg = await reaction.message.fetch();
          const member = await findOne(user.id);
          const askedForDf = msg.content.includes(member?.userNames[0]);
          if (member && !askedForDf) {
            member.dfReactionContribution -= settings[0].dfReactionValue;

            if (member.dfReactionContribution >= 1) {
              member.dfReactionContribution = 0;
              member.skills -= 1;
            }
            if (!msg.content.toString().includes(member.userNames[0])) {
              await msg.edit(
                msg.content.replace(`\n - ${member.userNames[0]} \n`, "")
              );
            }
            await member.save();
            await hasReachedVotes(member, settings, client);
          }
        }
      }
    }
  });
};
