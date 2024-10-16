import { findAll } from "../services/memberService.js";

export const isAccountAlreadyLinked = async (returnedMember, interaction) => {
  // we check if this account is linked by someone else already
  const members = await findAll();
  const originIds = [];
  members.forEach((member) => originIds.push(...member.originIds));
  if (originIds.includes(returnedMember.data?.id?.toString())) {
    return true;
  }

  return false;
};
