import {
  checkBf2Profiles,
  registerBf2Account,
} from "../services/memberService.js";
import { addRole } from "../utils/addRole.js";

export const submitRegisterBf2 = async (modal, settings) => {
  const bf2NameVal = await modal.getTextInputValue("bf2NameVal");
  const doesExist = await checkBf2Profiles(bf2NameVal);
  if (doesExist) {
    return await modal.editReply({
      content: "This profile already exists",
    });
  }
  await registerBf2Account(modal.member.id, bf2NameVal, modal.user.username);

  addRole(modal, settings);

  return await modal.editReply({
    content: "successfully registered",
    ephemeral: true,
  });
};
