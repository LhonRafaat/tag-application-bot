import { Client, Intents, MessageButton } from "discord.js";
import discordModals from "discord-modals";
import { getButton } from "./UI/button.js";
import { getSettings } from "./services/settingService.js";
import { getUserProfile } from "./utils/utils.js";
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
import { myVotes } from "./interactions/myVotes.js";
import { YES_EMOJI } from "./emojies/emojies.js";

export const client = async () => {
  const settings = await getSettings();

  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ["USER", "REACTION", "MESSAGE"],
  });

  client
    .login(process.env.DISCORD_TOKEN)
    .then(() => console.log("connected the bot"))
    .catch((err) => console.log(err));

  client.on("ready", async () => {
    if (settings.length === 0) return;
    try {
      const channel = client.channels.cache.get(settings[0].votingChannelId);
      channel.messages.fetch({ limit: 100 }).then((messages) => {
        //Iterate through the messages here with the variable "messages".
        messages.forEach((message) => {
          //TODO: Add the bot id to settings schema //done
          if (message.author.id === settings[0].botId) {
            message.delete();
          }
        });
      });
      // channel.bulkDelete(100);

      //TODO move the button to its own file

      await channel.send({
        components: [
          getButton([
            new MessageButton()
              .setCustomId("registerButton")
              .setLabel("Register")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("registerBf2")
              .setLabel("Register your BF2 account")
              .setStyle("SECONDARY"),
          ]),
        ],
      });
    } catch (error) {
      console.log(error);
      return;
    }

    // message.pin();

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
          type: "USER",
        },
      ],
    });
    commands?.create({
      name: "myvotes",
      description: "check your status",
    });
    commands?.create({
      name: "getstatus",
      description: "get user status plate",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user to get the status",
          type: "USER",
        },
      ],
    });
    commands?.create({
      name: "getregister",
      description: "get register button",
    });
    commands?.create({
      name: "getbygamename",
      description: "get user status plate",
      options: [
        {
          name: "username",
          required: true,
          description: "username of the user to get the status",
          type: "STRING",
        },
        {
          name: "game",
          required: true,
          description: "game name of the user to get the status",
          type: "STRING",
        },
        {
          name: "platform",
          required: true,
          description: "platform of the user to get the status",
          type: "STRING",
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
          type: "NUMBER",
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
  discordModals(client);

  client.on("messageCreate", async (msg) => {
    if (settings.length === 0) return;
    const user = await findOne(msg.author.id);
    if (user) {
      user.msgContribution += settings[0].msgValue;
      if (user.msgContribution >= 1) {
        user.msgContribution = 0;
        user.contribution += 1;
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
          ].includes(msg.mentions.roles.first().id)
        ) {
          user.rolePingContribution += settings[0].rolePingValue;

          if (user.rolePingContribution >= 1) {
            user.rolePingContribution = 0;
            user.contribution += 1;
          }
        }
      }

      if (msg.channelId === settings[0].contentCreatorsId) {
        user.contentContribution += settings[0].contentValue;
        if (user.contentContribution >= 1) {
          user.contentContribution = 0;
          user.contribution += 1;
        }
      }
      await user.save();
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
        ].includes(msg.mentions.roles.first().id)
      ) {
        const botMsg = await msg.reply(
          "Please only react if you going to participate in the dogfight"
        );
        await botMsg.react(YES_EMOJI);
      }
    }
    //we dont want messages from the bot

    if (msg.author.bot) return;

    // in case you are very bored
    if (msg.content.toLowerCase() === "who is the best pilot in the universe") {
      msg.reply("LhonXD");
    }
    if (
      msg.content.toLowerCase() ===
      "who lies about who is the worst pilot in the universe"
    ) {
      msg.reply("MrIcePops");
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

  client.on("interactionCreate", async (interaction) => {
    // return null if the interaction is from the modal submit
    if (
      ["bf2Modal", "registerModal", "linkAnotherAccount"].includes(
        interaction.customId
      )
    ) {
      return;
    }

    if (
      !["registerButton", "wantToRegister", "registerBf2"].includes(
        interaction.customId
      )
    ) {
      if (!["getregister", "myvotes"].includes(interaction.commandName)) {
        await interaction.deferReply({
          ephemeral: true,
        });
      }
    }
    if (interaction.commandName === "myvotes") {
      await interaction.deferReply();
      await myVotes(interaction);
    } else if (interaction.commandName === "getbygamename") {
      await getByGameName(interaction, settings);
    } else if (interaction.commandName === "closeticket") {
      await closeTicket(interaction, settings);
    } else if (interaction.commandName === "getregister") {
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
      submitVote(interaction, settings);
    } else if (interaction.customId === "wantToRegister") {
      await linkAnotherAccount(interaction, client);
    } else if (interaction.customId === "refuseToRegister") {
      await denyLinkAnotherAccount(interaction, settings);
    } else if (interaction.customId === "registerButton") {
      await register(interaction, client);
    } else if (interaction.customId === "registerBf2") {
      await registerBf2(interaction, client);
    }
  });
  client.on("modalSubmit", async (modal) => {
    await modal.deferReply({
      ephemeral: true,
    });
    let gameVal = await modal.getSelectMenuValues("gameVal");
    const gameNameVal = await modal.getTextInputValue("gameNameVal");
    let platformVal = await modal.getSelectMenuValues("platformVal");
    if (platformVal?.length > 0) platformVal = platformVal[0];
    if (gameVal?.length > 0) gameVal = gameVal[0];

    //if its for voting we dont want to create a user

    if (modal.customId === "bf2Modal") {
      await submitRegisterBf2(modal, settings);
    } else if (
      ["registerModal", "linkAnotherAccount"].includes(modal.customId)
    ) {
      try {
        const returnedMember = await getUserProfile(
          gameVal,
          gameNameVal,
          platformVal,
          modal
        );
        if (returnedMember?.data?.id) {
          // we check if this account is linked by someone else already
          let members = await findAll();
          let originIds = [];
          members.map((member) => originIds.push(...member.originIds));
          if (originIds.includes(returnedMember.data?.id)) {
            return await modal.editReply({
              content: "This account is already linked",

              ephemeral: true,
            });
          }
          if (modal.customId === "registerModal") {
            console.log("hi");
            await submitRegister(
              modal,
              settings,
              returnedMember,
              client,
              platformVal
            );
          } else if (modal.customId === "linkAnotherAccount") {
            console.log("submit");
            await subLinkAlt(modal, returnedMember, platformVal);
            // }
            // show them their plate here
          }
        } else {
          return await modal.editReply({
            content: "game profile not found",

            ephemeral: true,
          });
        }
      } catch (error) {
        console.log(error);
        return await modal.editReply({
          content: "profile not found",

          ephemeral: true,
        });
      }
    }
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;
    if (reaction.emoji.name === YES_EMOJI) {
      const member = await findOne(user.id);
      // if(member){

      // }
      const msg = await reaction.message.fetch();
      msg.edit(`${msg.content} \n - ${user.username} \n`);
    }
  });
};
