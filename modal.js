import { showModal } from "discord-modals"; // Now we extract the showModal method
import {
  createMember,
  findAll,
  findOne,
  findOneByName,
  updateUser,
} from "./services/memberService.js";
import axios from "axios";
import { getVoteEmbed } from "./UI/embeds/voteEmbed.js";
import { getPlate } from "./UI/userPlate.js";
import { getSearchModal } from "./UI/searchModal.js";
import { getRegisterModal } from "./UI/registerModal.js";

import { getButton } from "./UI/button.js";
import { MessageButton } from "discord.js";
import { linkAnotherAccountModal } from "./UI/linkAnotherAccountModal.js";

export const getModal = (client) => {
  let interactionType = null;
  let mentionedProfile = null;

  client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "getuser") {
      const username = interaction.options.getString("username");
      console.log(username);
      const member = await findOneByName(username);
      if (!member) {
        return interaction.reply({
          content: "User not found",
          ephemeral: true,
        });
      }
      const attachment = await getPlate(
        member.userNames[0],
        member.discordId,
        member.avatar,
        member.userNames[1] ? member.userNames[1] : undefined
      );
      //TODO: send a error message when user doesnt exist

      // big problem here, if ephemeral is true, we cannot react to the messag
      return await interaction.reply({
        ephemeral: true,
        files: [attachment],
      });
    } else if (interaction.commandName === "getstatus") {
      const mentionedUser = interaction.options.getUser("username");

      const discordUser = await findOne(mentionedUser.id);

      if (!discordUser) {
        return interaction.reply({
          content: "User not found",
          ephemeral: true,
        });
      }

      //TODO : how can I get the user avatar from discord?

      // I could have just passed the whole user object here instead of passing discord id and fetching it again
      // in the plate, but idk why I did that ...
      const attachment = await getPlate(
        discordUser.userNames[0],
        discordUser.discordId,
        discordUser.avatar,
        discordUser.userNames[1] ? discordUser.userNames[1] : undefined
      );
      //TODO: send a error message when user doesnt exist

      // big problem here, if ephemeral is true, we cannot react to the messag
      return await interaction.reply({
        ephemeral: true,
        files: [attachment],
      });
    } else if (interaction.commandName === "vote") {
      const mentionedUser = interaction.options.getUser("username");

      const discordUser = await findOne(mentionedUser.id);
      mentionedProfile = discordUser;

      if (!discordUser) {
        return interaction.reply({
          content: "User not found",
          ephemeral: true,
        });
      }

      if (
        discordUser.discordId.toString() === interaction.member.id.toString()
      ) {
        return interaction.reply({
          content:
            "You cannot vote for yourself, if you wish to see your own profile, use '!myvotes'",
          ephemeral: true,
        });
      }

      //TODO : how can I get the user avatar from discord?

      // I could have just passed the whole user object here instead of passing discord id and fetching it again
      // in the plate, but idk why I did that ...
      const attachment = await getPlate(
        discordUser.userNames[0],
        discordUser.discordId,
        discordUser.avatar,
        discordUser.userNames[1] ? discordUser.userNames[1] : undefined
      );
      //TODO: send a error message when user doesnt exist

      // big problem here, if ephemeral is true, we cannot react to the messag
      await interaction.reply({
        embeds: [getVoteEmbed(discordUser.userNames[0], discordUser.discordId)],
        ephemeral: true,
        files: [attachment],
        components: [
          getButton([
            new MessageButton()
              .setCustomId("skillsId")
              .setDisabled(
                discordUser.skillVoters.includes(
                  interaction.member.id.toString()
                )
              )
              .setLabel("Skills")
              .setStyle("DANGER"),
            new MessageButton()
              .setCustomId("contributionId")
              .setDisabled(
                discordUser.contributionVoters.includes(
                  interaction.member.id.toString()
                )
              )
              .setLabel("contribution")
              .setStyle("SUCCESS"),
            new MessageButton()
              .setCustomId("personalityId")
              .setDisabled(
                discordUser.personalityVoters.includes(
                  interaction.member.id.toString()
                )
              )
              .setLabel("personality")
              .setStyle("PRIMARY"),
          ]),
        ],
      });
    }

    const user = await findOne(interaction.member.id);
    const dbUser = await findOne(mentionedProfile?.discordId);

    // we check so we dont add the bots votes
    if (dbUser) {
      console.log(dbUser);
      // not the bot
      if (interaction.member.username !== "tag") {
        if (interaction.customId === "skillsId") {
          if (dbUser.skillVoters.includes(interaction.member.id))
            return interaction.reply({
              content: "You have already voted for skills",
              ephemeral: true,
            });
          dbUser.skills += 1;
          dbUser.skillVoters.push(interaction.member.id);
        } else if (interaction.customId === "contributionId") {
          if (dbUser.contributionVoters.includes(interaction.member.id))
            return interaction.reply({
              content: "You have already voted for contribution",
              ephemeral: true,
            });
          dbUser.contribution += 1;
          dbUser.contributionVoters.push(interaction.member.id);
        } else if (interaction.customId === "personalityId") {
          if (dbUser.personalityVoters.includes(interaction.member.id))
            return interaction.reply({
              content: "You have already voted for personality",
              ephemeral: true,
            });
          dbUser.personality += 1;
          dbUser.personalityVoters.push(interaction.member.id);
        }
        if (
          ["skillsId", "contributionId", "personalityId"].includes(
            interaction.customId
          )
        ) {
          await dbUser.save();
          return interaction.reply({
            content: "successfully voted!",
            ephemeral: true,
          });
        }
      }
    }
    if (interaction.customId === "registerButton") {
      interactionType = "register";
      if (user) {
        await interaction.reply({
          content: "You are already registered , want to link another account?",
          ephemeral: true,

          components: [
            getButton([
              new MessageButton()
                .setCustomId("wantToRegister")
                .setLabel("Yes")
                .setStyle("SUCCESS"),
              new MessageButton()
                .setCustomId("refuseToRegister")
                .setLabel("No")
                .setStyle("DANGER"),
            ]),
          ],
        });
      } else
        showModal(getRegisterModal(), {
          client: client, // Client to show the Modal through the Discord API.
          interaction: interaction, // Show the modal with interaction data.
        });
    } else if (interaction.customId === "wantToRegister") {
      showModal(linkAnotherAccountModal(), {
        client: client, // Client to show the Modal through the Discord API.
        interaction: interaction, // Show the modal with interaction data.
      });
      interactionType = "linkAnotherAccount";
      // updateUser(user.discordId, )
    } else if (interaction.customId === "refuseToRegister") {
      return interaction.reply("okay");
    }
  });
  client.on("modalSubmit", async (modal) => {
    const gameNameVal = modal.getTextInputValue("gameNameVal");
    const platformVal = modal.getTextInputValue("platformVal");
    const gameVal = modal.getTextInputValue("gameVal");

    //if its for voting we dont want to create a user

    axios
      .get(
        `https://api.gametools.network/${gameVal}/all/?format_values=false&name=${gameNameVal}&lang=en-us&platform=${platformVal}`
      )
      .catch(async (err) => {
        await modal.deferReply({ ephemeral: true });
        return modal.followUp({
          content: "User not found",

          ephemeral: true,
        });
      })
      .then(async (returnedMember) => {
        //check if the user's profile exists
        // we got a problem here, names are case sensitive
        if (returnedMember?.data) {
          // we check if this account is linked by someone else already
          let members = await findAll();
          let originIds = [];
          members.map((member) => originIds.push(...member.originIds));
          if (originIds.includes(returnedMember.data.id)) {
            await modal.deferReply({ ephemeral: true });
            modal.followUp({
              content: "This account is already linked",

              ephemeral: true,
            });
          }
          if (interactionType === "register") {
            //if the user's profile exists , then we create a new member in the db

            createMember(
              modal.user.id,
              returnedMember.data.id,
              platformVal,
              returnedMember.data.platoons
                .map((el) => el.id)
                //this is idf platoon id, hardcoded for now
                .includes("fbc7c5ab-c125-41f9-be8c-f367c03b2551"),

              modal.user.username,
              returnedMember.data.userName,
              returnedMember.data.avatar
            );
            // assign registered role

            // addes a role when user is registered, hardcoded for now

            modal.member.roles.add("968118833187545088");

            await modal.deferReply({ ephemeral: true });
            modal.followUp({
              content: "response collected",

              ephemeral: true,
            });
          } else if (interactionType === "linkAnotherAccount") {
            const user = await findOne(modal.member.id);
            if (user.originIds.includes(returnedMember.data.id)) {
              await modal.deferReply({ ephemeral: true });
              return modal.followUp({
                content: "you have already registered this account",

                ephemeral: true,
              });
            }
            if (!user.userNames.includes(returnedMember.data.userName))
              user.userNames.push(returnedMember.data.userName);
            if (!user.originIds.includes(returnedMember.data.id))
              user.originIds.push(returnedMember.data.id);
            if (!user.platforms.includes(platformVal))
              user.platforms.push(platformVal);
            if (!user.hasTag) {
              user.hasTag = returnedMember.data.platoons
                .map((el) => el.id)
                //this is idf platoon id, hardcoded for now
                .includes("fbc7c5ab-c125-41f9-be8c-f367c03b2551");
            }
            await user.save();
            await modal.deferReply({ ephemeral: true });
            modal.followUp({
              content: "response collected",

              ephemeral: true,
            });
          }
          // show them their plate here
        }
      });
  });
};
