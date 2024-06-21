import { findOne } from "../services/memberService.js";
import { hasReachedVotes } from "../utils/hasReachedVotes.js";

export const submitVote = async (interaction, settings, client) => {
  const dbUser = await findOne(interaction.customId.split("-")[1]);

  // we check so we dont add the bots votes
  if (dbUser) {
    // not the bot
    if (interaction.member.username !== "tag") {
      const guild = await client.guilds?.cache.get(process.env.GUILD_ID);
      if (!guild)
        return await interaction.editReply({
          content: "Error (guild not found)",
          ephemeral: true,
        });

      if (interaction.customId.split("-")[0] === "skillsId") {
        if (dbUser.skillVoters.includes(interaction.member.id))
          return await interaction.editReply({
            content: "You have already voted for skills",
            ephemeral: true,
          });
        dbUser.skills += 1;
        dbUser.skillVoters.push(interaction.member.id);
      } else if (interaction.customId.split("-")[0] === "contributionId") {
        if (dbUser.contributionVoters.includes(interaction.member.id))
          return await interaction.editReply({
            content: "You have already voted for contribution",
            ephemeral: true,
          });
        dbUser.contribution += 1;
        dbUser.contributionVoters.push(interaction.member.id);
      } else if (interaction.customId.split("-")[0] === "personalityId") {
        if (dbUser.personalityVoters.includes(interaction.member.id))
          return await interaction.editReply({
            content: "You have already voted for personality",
            ephemeral: true,
          });
        dbUser.personality += 1;
        dbUser.personalityVoters.push(interaction.member.id);
      }
      if (
        ["skillsId", "contributionId", "personalityId"].includes(
          interaction.customId.split("-")[0]
        )
      ) {
        await dbUser.save();
        await hasReachedVotes(dbUser, settings, client, interaction.member);

        return await interaction.editReply({
          content: "successfully voted!",
          ephemeral: true,
        });
      }
    }
  }
};
