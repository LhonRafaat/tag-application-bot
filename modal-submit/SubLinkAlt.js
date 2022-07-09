import { findOne } from "../services/memberService";

export const subLinkAlt = async (modal, returnedMember, platformVal) => {
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
  if (!user.platforms.includes(platformVal)) user.platforms.push(platformVal);

  await user.save();
  await modal.deferReply({ ephemeral: true });
  await modal.followUp({
    content: "response collected",

    ephemeral: true,
  });
};
