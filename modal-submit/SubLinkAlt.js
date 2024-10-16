import { findOne } from "../services/memberService.js";
import { isAccountAlreadyLinked } from "../utils/isAccountAlreadyLinked.js";

export const subLinkAlt = async (interaction, returnedMember, platformVal) => {
  if (await isAccountAlreadyLinked(returnedMember, interaction)) {
    return await interaction.editReply({
      content: "This account is already linked",
    });
  }
  const user = await findOne(interaction.member.id);
  if (user.originIds.includes(returnedMember.data?.id?.toString())) {
    return await interaction.editReply({
      content: "you have already registered this account",
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
