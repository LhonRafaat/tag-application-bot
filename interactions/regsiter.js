import { ButtonBuilder, ButtonStyle } from "discord.js";
import { findOne } from "../services/memberService.js";
import { getButton } from "../UI/button.js";
import { getRegisterModal } from "../UI/registerModal.js";

export const register = async (interaction, client) => {
  const user = await findOne(interaction.member.id);

  if (user) {
    await interaction.deferReply({ ephemeral: true });
    return await interaction.editReply({
      content: "You are already registered , want to link another account?",
      ephemeral: true,

      components: [
        getButton([
          new ButtonBuilder()
            .setCustomId("wantToRegister")
            .setLabel("Yes")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("refuseToRegister")
            .setLabel("No")
            .setStyle(ButtonStyle.Danger),
        ]),
      ],
    });
  } else return getRegisterModal();
};
