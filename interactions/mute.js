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

  await interaction.member.fetch();
  const userRoles = interaction.member.roles.cache;

  const roleIds = userRoles.map((role) => role.id);

  const hasMuteDoc = await Mute.findOne({
    discordId: interaction.member?.id,
  });

  if (!hasMuteDoc) {
    await Mute.create({
      discordId: interaction.member?.id,
      prevRoles: roleIds,
      muted: true,
    });
  } else {
    await Mute.findOneAndUpdate(
      {
        discordId: interaction.member?.id,
      },
      {
        prevRoles: roleIds,
        muted: true,
      }
    );
  }

  await interaction.member.roles.set([]);

  await interaction.member.roles.add(settings[0].muteRoleId);
  await interaction.editReply({
    content: "User muted successfully",
  });
};
