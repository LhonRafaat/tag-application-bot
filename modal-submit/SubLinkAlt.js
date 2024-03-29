import { findOne } from "../services/memberService.js";

export const subLinkAlt = async (interaction, returnedMember, platformVal) => {
  const user = await findOne(interaction.member.id);
  if (user.originIds.includes(returnedMember.data?.id)) {
    return await interaction.editReply({
      content: "you have already registered this account",

      ephemeral: true,
    });
  }
  if (!user.userNames.includes(returnedMember.data?.userName))
    user.userNames.push(returnedMember.data?.userName);
  if (!user.originIds.includes(returnedMember.data?.id))
    user.originIds.push(returnedMember.data?.id);
  if (!user.platforms.includes(platformVal)) user.platforms.push(platformVal);

  await user.save();
  return await interaction.editReply({
    content: "response collected",

    ephemeral: true,
  });
};
