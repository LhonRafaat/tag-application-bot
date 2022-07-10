import { Client, Intents, MessageButton } from "discord.js";
import discordModals from "discord-modals";
import { getButton } from "./UI/button";
import { getSettings } from "./services/settingService";
import { getUserProfile } from "./utils/utils";
import { findAll, getMembersRanking } from "./services/memberService";
import { getRequiredPoints } from "./services/settingService";
import { getByGameName } from "./interactions/getByGameName";
import { closeTicket } from "./interactions/closeTicket";
import { getRegister } from "./interactions/getRegister";
import { getStatus } from "./interactions/getStatus";
import { vote } from "./interactions/vote";
import { submitVote } from "./interactions/submitVote";
import { register } from "./interactions/regsiter";
import { setPoints } from "./interactions/setPoints";
import { submitRegisterBf2 } from "./modal-submit/submitRegisterBf2";
import { submitRegister } from "./modal-submit/submitRegister";
import { subLinkAlt } from "./modal-submit/SubLinkAlt";
import { linkAnotherAccount } from "./interactions/linkAnotherAccount";
import { denyLinkAnotherAccount } from "./interactions/denyLinkAnotherAccount";
import { registerBf2 } from "./interactions/registerBf2";
import { myVotes } from "./interactions/myVotes";

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
        console.log(`Received ${messages.size} messages`);
        //Iterate through the messages here with the variable "messages".
        messages.forEach((message) => {
          //TODO: Add the bot id to settings schema
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
    const guild = client.guilds.cache.get(process.env.GUILD_ID + "22");
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
    const settings = await getSettings();
    if (settings.length === 0) return;

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
        msg.reply(members);
      } catch (error) {
        console.log(error);
      }
    }
  });

  client.on("interactionCreate", async (interaction) => {
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
      console.log(interaction.customId);

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
    console.log(modal.customId);
    const gameVal = await modal.getTextInputValue("gameVal");
    const gameNameVal = await modal.getTextInputValue("gameNameVal");
    const platformVal = await modal.getTextInputValue("platformVal");

    // we need to check here if its not the bf2 modal
    if (!modal.customId === "bf2Modal") {
      if (
        !["pc", "xboxone", "ps4", "ps3", "xbox360"].includes(
          platformVal.trim().toLowerCase()
        )
      ) {
        await modal.deferReply({ ephemeral: true });
        return await modal.followUp({
          content: "Please enter a correct platform and try again",

          ephemeral: true,
        });
      } else if (
        !["bf1", "bfv", "bf3", "bf4"].includes(gameVal.trim().toLowerCase())
      ) {
        await modal.deferReply({ ephemeral: true });
        return await modal.followUp({
          content: "Please enter a correct game and try again",

          ephemeral: true,
        });
      }
    }
    //if its for voting we dont want to create a user

    if (modal.customId === "bf2Modal") {
      await submitRegisterBf2(modal, settings);
    }

    getUserProfile(gameVal, gameNameVal, platformVal, modal)
      .then(async (returnedMember) => {
        //check if the user's profile exists
        // we got a problem here, names are case sensitive
        if (returnedMember?.data?.id) {
          console.log(returnedMember.data.id);
          // we check if this account is linked by someone else already
          let members = await findAll();
          let originIds = [];
          members.map((member) => originIds.push(...member.originIds));
          if (originIds.includes(returnedMember.data?.id)) {
            await modal.deferReply({ ephemeral: true });
            await modal.followUp({
              content: "This account is already linked",

              ephemeral: true,
            });
          }
          if (modal.customId === "registerModal") {
            await submitRegister(
              modal,
              settings,
              returnedMember,
              client,
              platformVal
            );
          } else if (modal.customId === "linkAnotherAccount") {
            await subLinkAlt(modal, returnedMember, platformVal);
            // }
            // show them their plate here
          }
        }
      })
      .catch(async (error) => {
        console.log(error);
        await modal.deferReply({ ephemeral: true });
        await modal.followUp({
          content: "profile not found",

          ephemeral: true,
        });
      });
  });
};
