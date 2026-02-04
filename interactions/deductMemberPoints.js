import { isMod } from "../utils/isMod.js";
import { findOne } from "../services/memberService.js";

export const deductMemberPoints = async (interaction, settings, client) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }

  const user = await interaction.options.getUser("username");
  const points = await interaction.options.getNumber("points");

  const member = await findOne(user.id);
  if (!member) {
    return await interaction.editReply({
      content: "User not found in database",
      ephemeral: true,
    });
  }

  member.skills -= points;
  await member.save();

  // Log to the specified channel
  try {
    const channel = await client.channels.cache.get("548861917431726091");
    if (channel) {
      await channel.send(
        `❌ **Points Deducted** - ${interaction.user.tag} deducted ${points} points from <@${user.id}> at ${new Date().toLocaleString()}`,
      );
    }
  } catch (error) {
    console.log("Error logging to channel:", error);
  }

  return await interaction.editReply({
    content: `Deducted ${points} points from ${user.tag}`,
    ephemeral: true,
  });
};
