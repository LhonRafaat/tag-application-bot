import {
  checkBf2Profiles,
  registerBf2Account,
} from "../services/memberService.js";
import { addRole } from "../utils/addRole.js";

export const submitRegisterBf2 = async (interaction, settings) => {
  const bf2NameVal = await interaction.fields.getTextInputValue("bf2NameVal");
  const doesExist = await checkBf2Profiles(bf2NameVal);
  if (doesExist) {
    return await interaction.editReply({
      content: "This profile already exists",
    });
  }
  await registerBf2Account(
    interaction.member.id,
    bf2NameVal,
    interaction.user.username
  );

  addRole(interaction, settings);

  return await interaction.editReply({
    content: "successfully registered",
    ephemeral: true,
  });
};
