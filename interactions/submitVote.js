import { findOne } from "../services/memberService.js";
import { getRequiredPoints } from "../services/settingService.js";
import { questionsEmbed } from "../UI/embeds/questionsEmbed.js";

export const submitVote = async (interaction, settings, client) => {
  {
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
            dbUser.skills === requiredPoints &&
            (dbUser.contribution === requiredPoints ||
              dbUser.personality === requiredPoints)
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
            dbUser.contribution === requiredPoints &&
            (dbUser.skills === requiredPoints ||
              dbUser.personality === requiredPoints)
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
            dbUser.personality === requiredPoints &&
            (dbUser.skills === requiredPoints ||
              dbUser.contribution === requiredPoints)
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
                dbUser.userNames[0],
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
                      allow: ["ADMINISTRATOR", "VIEW_CHANNEL"],
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
};
