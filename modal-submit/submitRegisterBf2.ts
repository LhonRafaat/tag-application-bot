import {
  checkBf2Profiles,
  registerBf2Account,
} from "../services/memberService.ts";
import { addRole } from "../utils/addRole.ts";

export const submitRegisterBf2 = async (modal, settings) => {
  const bf2NameVal = await modal.getTextInputValue("bf2NameVal");
  const doesExist = await checkBf2Profiles(bf2NameVal);
  if (doesExist) {
    await modal.deferReply({ ephemeral: true });
    return await modal.followUp({
      content: "This profile already exists",
    });
  }
  await registerBf2Account(modal.member.id, bf2NameVal, modal.user.username);

  addRole(modal, settings);

  await modal.deferReply({ ephemeral: true });
  return await modal.followUp({
    content: "successfully registered",
    ephemeral: true,
  });
};
