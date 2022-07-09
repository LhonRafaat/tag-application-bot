import { Modal, showModal, TextInputComponent } from "discord-modals"; // Now we extract the showModal method
import {
  checkBf2Profiles,
  createMember,
  findAll,
  findByGameId,
  findOne,
  findOneByName,
  registerBf2Account,
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
import { getUserByGameId, getUserProfile } from "./utils/utils.js";
import { getBf2Modal } from "./UI/bf2Modal.js";

export const getMain = (client) => {
  let interactionType = null;
  let mentionedProfile = null;

  client.on("interactionCreate", async (interaction) => {
    if (
      !["registerButton", "wantToRegister", "registerBf2"].includes(
        interaction.customId
      )
    ) {
      if (interaction.commandName !== "getregister") {
        await interaction.deferReply({
          ephemeral: true,
        });
      }
    }
    interactionType = null;
    mentionedProfile = null;
    const settings = await getSettings();
    if (!settings || settings?.length === 0) {
      return await interaction.editReply({
        content: "An error occured, please contact staff (settings error)",

        ephemeral: true,
      });
    }

    if (interaction.commandName === "getbygamename") {
      // check user if is head admin or founder

      const isAuthorized = await interaction.member.roles.cache.find((role) => {
        return [
          settings[0].founderId,
          settings[0].headAdminId,
          settings[0].modId,
        ].includes(role.id);
      });
      // if (!isAuthorized) {
      //   return interaction.reply({
      //     content: "You are not authorized",
      //     ephemeral: true,
      //   });
      // }
      const username = await interaction.options.getString("username");
      const game = await interaction.options.getString("game");
      const platform = await interaction.options.getString("platform");
      try {
        const gameprofileData = await getUserProfile(game, username, platform);
        if (!gameprofileData?.data) {
          return await interaction.editReply({
            content: "User not found",
            ephemeral: true,
          });
        }
        const member = await findByGameId(gameprofileData.data.id);
        if (!member) {
          return await interaction.editReply({
            content: "User not in idf database",
            ephemeral: true,
          });
        }
        const attachment = await getPlate(
          gameprofileData.data.userName,
          member.discordId,
          gameprofileData.data.avatar,
          member.userNames[1] ? member.userNames[1] : undefined
        );
        //TODO: send a error message when user doesnt exist

        // big problem here, if ephemeral is true, we cannot react to the messag

        if (isAuthorized) {
          return await interaction.editReply({
            content: `<@${member.discordId}>`,
            ephemeral: true,
            files: [attachment],
          });
        } else {
          return await interaction.editReply({
            content: "Searched user is a member of our discord server",
            ephemeral: true,
          });
        }
      } catch (error) {
        console.log(error);
        return await interaction.editReply({
          content: "Could not fetch queried user",
          ephemeral: true,
        });
      }
    } else if (interaction.commandName === "closeticket") {
      const isAuthorized = await interaction.member.roles.cache.find((role) => {
        return [
          settings[0].founderId,
          settings[0].headAdminId,
          settings[0].modId,
        ].includes(role.id);
      });
      if (!isAuthorized) {
        return await interaction.editReply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
      if (interaction.channel.parentId === settings[0].ticketsParentId) {
        await interaction.channel.delete();
      } else {
        return interaction.editReply({
          content: "You can only delete tickets subchannels",
          ephemeral: true,
        });
      }
    } else if (interaction.commandName === "getregister") {
      await interaction.deferReply();
      const isAuthorized = await interaction.member.roles.cache.find((role) => {
        return [
          settings[0].founderId,
          settings[0].headAdminId,
          settings[0].modId,
        ].includes(role.id);
      });
      if (!isAuthorized) {
        return interaction.editReply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
      await interaction.editReply({
        components: [
          getButton([
            new MessageButton()
              .setCustomId("registerButton")
              .setLabel("Register")
              .setStyle("SUCCESS"),
          ]),
        ],
      });
    } else if (interaction.commandName === "requiredpoints") {
      // check user if is head admin or founder
      const isAuthorized = await interaction.member.roles.cache.find((role) => {
        return [settings[0].founderId, settings[0].headAdminId].includes(
          role.id
        );
      });
      if (!isAuthorized) {
        return await interaction.editReply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
      const requiredPoints = await getRequiredPoints();
      if (!requiredPoints)
        return await interaction.editReply("No required points set");
      await interaction.editReply({
        ephemeral: true,
        content: `Required points: ${await getRequiredPoints()}`,
      });
    } else if (interaction.commandName === "getstatus") {
      const isAuthorized = await interaction.member.roles.cache.find((role) => {
        return [
          settings[0].founderId,
          settings[0].headAdminId,
          settings[0].modId,
        ].includes(role.id);
      });
      if (!isAuthorized) {
        return await interaction.editReply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
      const mentionedUser = await interaction.options.getUser("username");

      const discordUser = await findOne(mentionedUser.id);

      if (!discordUser) {
        return await interaction.editReply({
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
      return await interaction.editReply({
        ephemeral: true,
        files: [attachment],
      });
    } else if (interaction.commandName === "vote") {
      const canVote = await interaction.member.roles.cache.find((role) => {
        return [
          settings[0].candidateId,
          settings[0].registeredStaff,
          settings[0].registeredMangment,
          settings[0].registeredMember,
        ].includes(role.id);
      });
      if (!canVote) {
        return await interaction.editReply({
          content: "Please register to be able to vote.",
          ephemeral: true,
        });
      }
      const mentionedUser = await interaction.options.getUser("username");

      const discordUser = await findOne(mentionedUser.id);
      mentionedProfile = discordUser;

      if (!discordUser) {
        return await interaction.editReply({
          content: "User not found",
          ephemeral: true,
        });
      }

      if (
        discordUser.discordId.toString() === interaction.member.id.toString()
      ) {
        return await interaction.editReply({
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
      await await interaction.editReply({
        embeds: [getVoteEmbed(discordUser.userNames[0], discordUser.discordId)],
        ephemeral: true,
        files: [attachment],
        components: [
          getButton([
            new MessageButton()
              .setCustomId(`skillsId-${discordUser.discordId}`)
              .setDisabled(
                discordUser.skillVoters.includes(
                  interaction.member.id.toString()
                )
              )
              .setLabel("Skills")
              .setStyle("DANGER"),
            new MessageButton()
              .setCustomId(`contributionId-${discordUser.discordId}`)
              .setDisabled(
                discordUser.contributionVoters.includes(
                  interaction.member.id.toString()
                )
              )
              .setLabel("Contribution")
              .setStyle("SUCCESS"),
            new MessageButton()
              .setCustomId(`personalityId-${discordUser.discordId}`)
              .setDisabled(
                discordUser.personalityVoters.includes(
                  interaction.member.id.toString()
                )
              )
              .setLabel("Personality")
              .setStyle("PRIMARY"),
          ]),
        ],
      });
    }
    if (
      ["personalityId", "contributionId", "skillsId"].includes(
        interaction.customId?.split("-")[0]
      )
    ) {
      const dbUser = await findOne(interaction.customId.split("-")[1]);

      // we check so we dont add the bots votes
      if (dbUser) {
        // not the bot
        if (interaction.member.username !== "tag") {
          const requiredPoints = await getRequiredPoints();

          const guild = await client.guilds.cache.get(process.env.GUILD_ID);
          if (!guild)
            return await interaction.editReply({
              content: "Error (guild not found)",
              ephemeral: true,
            });
          const role = await guild.roles.cache.find((role) => {
            return role.name === "@everyone";
          });
          const mods = await guild.roles.cache.find((role) => {
            return [
              settings[0].modId,
              settings[0].founderId,
              settings[0].headAdminId,
            ].includes(role.id);
          });

          if (interaction.customId.split("-")[0] === "skillsId") {
            if (dbUser.skillVoters.includes(interaction.member.id))
              return await interaction.editReply({
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
          } else if (interaction.customId.split("-")[0] === "contributionId") {
            if (dbUser.contributionVoters.includes(interaction.member.id))
              return await interaction.editReply({
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
          } else if (interaction.customId.split("-")[0] === "personalityId") {
            if (dbUser.personalityVoters.includes(interaction.member.id))
              return await interaction.editReply({
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
              interaction.customId.split("-")[0]
            )
          ) {
            await dbUser.save();

            if (dbUser.reachedVotes) {
              try {
                const newChannel = await guild.channels.create(
                  "submit a ticket",
                  {
                    parent: settings[0].ticketsParentId,
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
                await newChannel.send({ embeds: [questionsEmbed] });
              } catch (error) {
                console.log(error);
              }
            }

            return await interaction.editReply({
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
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({
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
    } else if (interaction.customId === "registerBf2") {
      //use discord js input component to get name input

      await showModal(getBf2Modal(), {
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
      return await interaction.editReply({ content: "okay", ephemeral: true });
    } else if (interaction.commandName === "setpoints") {
      // check user if is head admin or founder
      const isAuthorized = await interaction.member.roles.cache.find((role) => {
        return [settings[0].founderId, settings[0].headAdminId].includes(
          role.id
        );
      });
      if (!isAuthorized) {
        return await interaction.editReply({
          content: "You are not authorized",
          ephemeral: true,
        });
      }
      // here we should check that only admins could do that
      const points = await interaction.options.getNumber("points");
      setRequiredPoints(points);
      return points
        ? await interaction.editReply({ content: "okay", ephemeral: true })
        : await interaction.editReply({
            content: "bad request",
            ephemeral: true,
          });
    }
  });
  client.on("modalSubmit", async (modal) => {
    const settings = await getSettings();
    if (!settings || settings?.length === 0) {
      await modal.deferReply({ ephemeral: true });
      return await modal.followUp({
        content: "An error occured, please contact staff (settings error)",

        ephemeral: true,
      });
    }
    const gameVal = await modal.getTextInputValue("gameVal");
    const gameNameVal = await modal.getTextInputValue("gameNameVal");
    const platformVal = await modal.getTextInputValue("platformVal");
    const bf2NameVal = await modal.getTextInputValue("bf2NameVal");

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
      const doesExist = await checkBf2Profiles(bf2NameVal);
      if (doesExist) {
        await modal.deferReply({ ephemeral: true });
        return await modal.followUp({
          content: "This profile already exists",
        });
      }
      await registerBf2Account(
        modal.member.id,
        bf2NameVal,
        modal.user.username
      );

      if (
        (await modal.member.roles.cache.some((role) => {
          return [
            settings[0].idfXboxId,
            settings[0].idfPcId,
            settings[0].idfPsId,
          ].includes(role.id);
        })) &&
        !(await modal.member.roles.cache.some((role) => {
          return [
            settings[0].moderatorId,
            settings[0].seniorModeratorId,
            settings[0].trialModeratorId,
            settings[0].designId,
            settings[0].forceCodeId,
            settings[0].adminId,
            settings[0].modId,
            settings[0].founderId,
            settings[0].headAdminId,
          ].includes(role.id);
        }))
      ) {
        // idf registered tag
        await modal.member.roles
          .add(settings[0].registeredMember)
          .catch((err) => {
            console.log("Error" + err);
          });
      } else if (
        //staff
        await modal.member.roles.cache.some((role) => {
          return [
            settings[0].moderatorId,
            settings[0].seniorModeratorId,
            settings[0].trialModeratorId,
            settings[0].designId,
            settings[0].forceCodeId,
            settings[0].adminId,
          ].includes(role.id);
        })
      ) {
        await modal.member.roles
          .add(settings[0].registeredStaff)
          .catch((err) => {
            console.log("Error" + err);
          });
      } else if (
        await modal.member.roles.cache.some((role) => {
          return [
            settings[0].modId,
            settings[0].founderId,
            settings[0].headAdminId,
          ].includes(role.id);
        })
      ) {
        // admins
        await modal.member.roles
          .add(settings[0].registeredMangment)
          .catch((err) => {
            console.log("Error" + err);
          });
      } else {
        await modal.member.roles.add(settings[0].candidateId).catch((err) => {
          console.log("Error" + err);
        });
      }
      await modal.deferReply({ ephemeral: true });
      return await modal.followUp({
        content: "successfully registered",
        ephemeral: true,
      });
    }

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
            await modal.followUp({
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
              await modal.member.roles.cache.some((role) =>
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
              (await modal.member.roles.cache.some((role) => {
                return [
                  settings[0].idfXboxId,
                  settings[0].idfPcId,
                  settings[0].idfPsId,
                ].includes(role.id);
              })) &&
              !(await modal.member.roles.cache.some((role) => {
                return [
                  settings[0].moderatorId,
                  settings[0].seniorModeratorId,
                  settings[0].trialModeratorId,
                  settings[0].designId,
                  settings[0].forceCodeId,
                  settings[0].adminId,
                  settings[0].modId,
                  settings[0].founderId,
                  settings[0].headAdminId,
                ].includes(role.id);
              }))
            ) {
              // idf registered tag
              await modal.member.roles
                .add(settings[0].registeredMember)
                .catch((err) => {
                  console.log("Error" + err);
                });
            } else if (
              //staff
              await modal.member.roles.cache.some((role) => {
                return [
                  settings[0].moderatorId,
                  settings[0].seniorModeratorId,
                  settings[0].trialModeratorId,
                  settings[0].designId,
                  settings[0].forceCodeId,
                  settings[0].adminId,
                ].includes(role.id);
              })
            ) {
              await modal.member.roles
                .add(settings[0].registeredStaff)
                .catch((err) => {
                  console.log("Error" + err);
                });
            } else if (
              await modal.member.roles.cache.some((role) => {
                return [
                  settings[0].modId,
                  settings[0].founderId,
                  settings[0].headAdminId,
                ].includes(role.id);
              })
            ) {
              // admins
              await modal.member.roles
                .add(settings[0].registeredMangment)
                .catch((err) => {
                  console.log("Error" + err);
                });
            } else {
              await modal.member.roles
                .add(settings[0].candidateId)
                .catch((err) => {
                  console.log("Error" + err);
                });
            }
            try {
              const channel = await client.channels.cache.get(
                settings[0].idfBotChannelId
              );
              await channel.send(
                "<@" +
                  modal.user.id +
                  "> just registered as " +
                  returnedMember.data.userName +
                  " !"
              );
            } catch (error) {
              console.log(error);
            }

            await modal.deferReply({ ephemeral: true });
            return await modal.followUp({
              content: "response collected",

              ephemeral: true,
            });
          } else if (interactionType === "linkAnotherAccount") {
            const user = await findOne(modal.member.id);
            if (user.originIds.includes(returnedMember.data.id)) {
              await modal.deferReply({ ephemeral: true });
              return await modal.followUp({
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
            await modal.followUp({
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