import { Mute } from "../schemas/mute.js";
import { isMod } from "../utils/isMod.js";

export const unmuteUser = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }

  const mentionedUser = await interaction.options.getMember("username");
  console.log(mentionedUser);

  try {
    await mentionedUser.fetch();

    const muteDoc = await Mute.findOne({
      discordId: mentionedUser?.id,
    });
    console.log(muteDoc);

    await mentionedUser.roles.set(muteDoc.prevRoles);

    await Mute.findByIdAndUpdate(muteDoc._id, {
      muted: false,
    });

    await interaction.editReply({
      content: `user ${mentionedUser.nickname} has been unmuted`,
    });
  } catch (error) {
    await interaction.editReply({
      content: error.toString(),
    });
  }
};
