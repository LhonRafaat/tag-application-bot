import { showModal } from "discord-modals"; // Now we extract the showModal method
import {
  createMember,
  findAll,
  findOne,
  findOneByName,
} from "./services/memberService.js";
import { getVoteEmbed } from "./UI/embeds/voteEmbed.js";
import { getPlate } from "./UI/userPlate.js";
import { getRegisterModal } from "./UI/registerModal.js";

import { getButton } from "./UI/button.js";
import { MessageButton } from "discord.js";
import { linkAnotherAccountModal } from "./UI/linkAnotherAccountModal.js";
import {
  getRequiredPoints,
  getSettings,
  setRequiredPoints,
} from "./services/settingService.js";
import { questionsEmbed } from "./UI/embeds/questionsEmbed.js";
import { getUserProfile } from "./utils/utils.js";

export const getModal = (client) => {
  let interactionType = null;
  let mentionedProfile = null;

  client.on("interactionCreate", async (interaction) => {
    interactionType = null;
    mentionedProfile = null;
    const settings = await getSettings();
    if (!settings || settings?.length === 0) {
      return interaction.reply({
        content: "An error occured, please contact staff (settings error)",

        ephemeral: true,
      });
    }

    if (interaction.commandName === "getbygamename") {
      // check user if is head admin or founder
      const isAuthorized = interaction.member.roles.cache.find((role) => {
        return [
          settings[0].founderId,
          settings[0].headAdminId,
          settings[0].modId,
        ].includes(role.id);
      });
      if (!isAuthorized) {
        return interaction.reply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
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
    } else if (interaction.commandName === "closeticket") {
      if (interaction.channel.parentId === "974645473187098654") {
        interaction.channel.delete();
      } else {
        return interaction.reply({
          content: "You can only delete tickets subchannels",
          ephemeral: true,
        });
      }
    } else if (interaction.commandName === "requiredpoints") {
      // check user if is head admin or founder
      const isAuthorized = interaction.member.roles.cache.find((role) => {
        return [settings[0].founderId, settings[0].headAdminId].includes(
          role.id
        );
      });
      if (!isAuthorized) {
        return interaction.reply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
      const requiredPoints = await getRequiredPoints();
      if (!requiredPoints) return interaction.reply("No required points set");
      interaction.reply({
        ephemeral: true,
        content: `Required points: ${await getRequiredPoints()}`,
      });
    } else if (interaction.commandName === "getstatus") {
      const isAuthorized = interaction.member.roles.cache.find((role) => {
        return [
          settings[0].founderId,
          settings[0].headAdminId,
          settings[0].modId,
        ].includes(role.id);
      });
      if (!isAuthorized) {
        return interaction.reply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
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
      const canVote = interaction.member.roles.cache.find((role) => {
        return [
          settings[0].candidateId,
          settings[0].registeredStaff,
          settings[0].registeredMangment,
          settings[0].registeredMember,
        ].includes(role.id);
      });
      if (!canVote) {
        return interaction.reply({
          content: "Please register to be able to vote.",
          ephemeral: true,
        });
      }
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

      const dbUser = await findOne(mentionedProfile?.discordId);

      // we check so we dont add the bots votes
      if (dbUser) {
        // not the bot
        if (interaction.member.username !== "tag") {
          const requiredPoints = await getRequiredPoints();

          const guild = client.guilds.cache.get(process.env.GUILD_ID);
          const role = guild.roles.cache.find((role) => {
            return role.name === "@everyone";
          });
          const mods = guild.roles.cache.find((role) => {
            return role.name === "mod";
          });

          if (interaction.customId === "skillsId") {
            if (dbUser.skillVoters.includes(interaction.member.id))
              return interaction.reply({
                content: "You have already voted for skills",
                ephemeral: true,
              });
            dbUser.skills += 1;
            dbUser.skillVoters.push(interaction.member.id);
            // here we check if the user has reached the required points at least in two categories
            if (
              dbUser.contribution === requiredPoints ||
              dbUser.personality === requiredPoints
            ) {
              dbUser.reachedVotes = true;
            }
          } else if (interaction.customId === "contributionId") {
            if (dbUser.contributionVoters.includes(interaction.member.id))
              return interaction.reply({
                content: "You have already voted for contribution",
                ephemeral: true,
              });
            dbUser.contribution += 1;
            dbUser.contributionVoters.push(interaction.member.id);

            // here we check if user has reached the required points at least in two categories
            if (
              dbUser.skills === requiredPoints ||
              dbUser.personality === requiredPoints
            ) {
              dbUser.reachedVotes = true;
            }
          } else if (interaction.customId === "personalityId") {
            if (dbUser.personalityVoters.includes(interaction.member.id))
              return interaction.reply({
                content: "You have already voted for personality",
                ephemeral: true,
              });
            dbUser.personality += 1;
            dbUser.personalityVoters.push(interaction.member.id);

            // here we check if user has reached the required points at least in two categories
            if (
              dbUser.skills === requiredPoints ||
              dbUser.contribution === requiredPoints
            ) {
              dbUser.reachedVotes = true;
            }
          }
          if (
            ["skillsId", "contributionId", "personalityId"].includes(
              interaction.customId
            )
          ) {
            await dbUser.save();

            if (dbUser.reachedVotes) {
              const newChannel = await guild.channels.create(
                "submit a ticket",
                {
                  parent: "974645473187098654",
                  permissionOverwrites: [
                    {
                      id: role.id,
                      deny: ["VIEW_CHANNEL"],
                    },
                    {
                      id: dbUser.discordId,
                      allow: ["VIEW_CHANNEL"],
                    },
                    {
                      id: mods.id,
                      allow: ["ADMINISTRATOR"],
                    },
                  ],
                }
              );
              newChannel.send({ embeds: [questionsEmbed] });
            }

            return interaction.reply({
              content: "successfully voted!",
              ephemeral: true,
            });
          }
        }
      }
    }
    if (interaction.customId === "registerButton") {
      const user = await findOne(interaction.member.id);

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
      return interaction.reply({ content: "okay", ephemeral: true });
    } else if (interaction.commandName === "setpoints") {
      // check user if is head admin or founder
      const isAuthorized = interaction.member.roles.cache.find((role) => {
        return [settings[0].founderId, settings[0].headAdminId].includes(
          role.id
        );
      });
      if (!isAuthorized) {
        return interaction.reply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
      console.log(interaction.option);
      // here we should check that only admins could do that
      const points = interaction.options.getNumber("points");
      setRequiredPoints(points);
      return points
        ? interaction.reply({ content: "okay", ephemeral: true })
        : interaction.reply({ content: "bad request", ephemeral: true });
    }
  });
  client.on("modalSubmit", async (modal) => {
    const settings = await getSettings();
    if (!settings || settings?.length === 0) {
      await modal.deferReply({ ephemeral: true });
      return modal.followUp({
        content: "An error occured, please contact staff (settings error)",

        ephemeral: true,
      });
    }
    const gameVal = modal.getTextInputValue("gameVal");
    const gameNameVal = modal.getTextInputValue("gameNameVal");
    const platformVal = modal.getTextInputValue("platformVal");
    if (!["pc", "xboxone", "ps4", "ps3", "xbox360"].includes(platformVal)) {
      await modal.deferReply({ ephemeral: true });
      return modal.followUp({
        content: "Please enter a correct platform and try again",

        ephemeral: true,
      });
    } else if (!["bf1", "bfv", "bf3", "bf4"].includes(gameVal)) {
      await modal.deferReply({ ephemeral: true });
      return modal.followUp({
        content: "Please enter a correct game and try again",

        ephemeral: true,
      });
    }
    //if its for voting we dont want to create a user

    getUserProfile(gameVal, gameNameVal, platformVal, modal).then(
      async (returnedMember) => {
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
              modal.member.roles.cache.some((role) =>
                [
                  settings[0].idfXboxId,
                  settings[0].idfPcId,
                  settings[0].idfPsId,
                ].includes(role.id)
              ),

              modal.user.username,
              returnedMember.data.userName,
              returnedMember.data.avatar
            );
            // assign registered role

            // addes a role when user is registered, hardcoded for now

            if (
              modal.member.roles.cache.some((role) =>
                [
                  settings[0].idfXboxId,
                  settings[0].idfPcId,
                  settings[0].idfPsId,
                ].includes(role.id)
              ) &&
              !modal.member.roles.cache.some((role) =>
                [
                  settings[0].moderatorId,
                  settings[0].seniorModeratorId,
                  settings[0].trialModeratorId,
                  settings[0].designId,
                  settings[0].forceCodeId,
                  settings[0].adminId,
                  settings[0].modId,
                  settings[0].founderId,
                  settings[0].headAdminId,
                ].includes(role.id)
              )
            ) {
              // idf registered tag
              modal.member.roles.add(settings[0].registeredMember);
            } else if (
              //staff
              modal.member.roles.cache.some((role) => {
                [
                  settings[0].moderatorId,
                  settings[0].seniorModeratorId,
                  settings[0].trialModeratorId,
                  settings[0].designId,
                  settings[0].forceCodeId,
                  settings[0].adminId,
                ].includes(role.id);
              })
            ) {
              modal.member.roles.add(settings[0].registeredStaff);

              console.log("mod");
            } else if (
              modal.member.roles.cache.some((role) => {
                [
                  settings[0].modId,
                  settings[0].founderId,
                  settings[0].headAdminId,
                ].includes(role.id);
              })
            ) {
              // admins
              modal.member.roles.add(settings[0].registeredMangment);
            }

            await modal.deferReply({ ephemeral: true });
            return modal.followUp({
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

            await user.save();
            await modal.deferReply({ ephemeral: true });
            modal.followUp({
              content: "response collected",

              ephemeral: true,
            });
          }
          // show them their plate here
        }
      }
    );
  });
};
