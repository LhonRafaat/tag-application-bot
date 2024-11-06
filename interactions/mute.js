import { Mute } from "../schemas/mute.js";
import { isMod } from "../utils/isMod.js";

export const muteUser = async (interaction, settings) => {
  const isAuthorized = await isMod(interaction, settings);
  if (!isAuthorized) {
    return await interaction.editReply({
      content: "You are not authorized",
      ephemeral: true,
    });
  }

  try {
    const mentionedUser = await interaction.options.getMember("username");

    await mentionedUser.fetch();

    const userRoles = mentionedUser.roles.cache;

    const roleIds = userRoles.map((role) => role.id);

    const hasMuteDoc = await Mute.findOne({
      discordId: mentionedUser?.id,
    });

    if (!hasMuteDoc) {
      await Mute.create({
        discordId: mentionedUser?.id,
        prevRoles: roleIds,
        muted: true,
      });
    } else {
      await Mute.findOneAndUpdate(
        {
          discordId: mentionedUser?.id,
        },
        {
          prevRoles: roleIds,
          muted: true,
        }
      );
    }

    await mentionedUser.roles.set([]);

    await mentionedUser.roles.add(settings[0].muteRoleId);
    await interaction.editReply({
      content: "User muted successfully",
    });
  } catch (error) {
    await interaction.editReply({
      content: "There was an error muting the user.",
    });
  }
};
